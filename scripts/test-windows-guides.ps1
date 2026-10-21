$ErrorActionPreference = 'Continue'
$PSNativeCommandUseErrorActionPreference = $false
$repo = Split-Path -Parent $PSScriptRoot
$evidence = Join-Path $repo 'reports/phase3/tests/windows'
$runRoot = Join-Path $repo ('fixtures/windows-guides/runs/' + [guid]::NewGuid())
New-Item -ItemType Directory -Force -Path $evidence, $runRoot | Out-Null
$pwshPath = (Get-Command pwsh.exe).Source
$nodePath = (Get-Command node.exe).Source
$npmPath = (Get-Command npm.cmd).Source
$gitPath = (Get-Command git.exe).Source
$osInfo = (& $nodePath -e 'console.log(JSON.stringify({name:require("os").version(),release:require("os").release()}))' | ConvertFrom-Json)
$records = [System.Collections.Generic.List[object]]::new()
function Invoke-Recorded($Id, $Executable, $Arguments) {
  $output = (& $Executable @Arguments 2>&1 | Out-String) -replace "`0", ''
  $code = $LASTEXITCODE
  [IO.File]::WriteAllText((Join-Path $evidence ($Id + '.log')), $output)
  return @{ output = $output; exitCode = $code }
}
function Record-Case($Id, $Initial, $Steps, $Result, $Passed, $Scope) {
  $records.Add(@{ id = $Id; verifiedAtUtc = [DateTime]::UtcNow.ToString('o');
    os = $osInfo.name; release = $osInfo.release;
    shell = $PSVersionTable.PSVersion.ToString(); initialError = $Initial;
    steps = $Steps; actualResult = $Result; passed = $Passed; scope = $Scope })
  Write-Output "$Id : $Passed"
}
$originalPath = $env:Path
try {
  $policy = Invoke-Recorded '01-policy-scope' $pwshPath @('-NoProfile', '-Command', 'Get-ExecutionPolicy -List | Format-Table | Out-String')
  $blocked = Invoke-Recorded '02-npm-ps1-before' $pwshPath @('-NoProfile', '-ExecutionPolicy', 'Restricted', '-Command', 'npm --version; if (-not $?) { exit 1 }')
  $launcher = Invoke-Recorded '03-npm-cmd-after' $pwshPath @('-NoProfile', '-ExecutionPolicy', 'Restricted', '-Command', 'npm.cmd --version; exit $LASTEXITCODE')
  Record-Case 'npm-ps1-launcher' $blocked.output @('Start isolated PowerShell child with Restricted process policy', 'Run npm --version', 'In same process-policy configuration run npm.cmd --version') $launcher ($blocked.exitCode -ne 0 -and $blocked.output -match 'npm.ps1' -and $launcher.exitCode -eq 0) 'Actual npm launchers; process-scoped policy only. No persistent policy changed. Not Windows 11 or Group Policy validation.'

  foreach ($tool in @(@{ name = 'node'; executable = $nodePath; args = @('--version') }, @{ name = 'git'; executable = $gitPath; args = @('--version') })) {
    $directories = @((Get-Command ($tool.name + '.exe') -All).Source | ForEach-Object { (Split-Path -Parent $_).TrimEnd('\') })
    $env:Path = ($originalPath -split ';' | Where-Object { $_.TrimEnd('\') -notin $directories }) -join ';'
    $missing = Invoke-Recorded ($tool.name + '-path-before') $pwshPath @('-NoProfile', '-Command', ($tool.name + ' --version; if (-not $?) { exit 1 }'))
    $direct = Invoke-Recorded ($tool.name + '-absolute-path') $tool.executable $tool.args
    $env:Path = $originalPath
    $restored = Invoke-Recorded ($tool.name + '-path-after') $pwshPath @('-NoProfile', '-Command', ($tool.name + ' --version; exit $LASTEXITCODE'))
    Record-Case ($tool.name + '-path') $missing.output @('Remove confirmed executable directories from this process PATH only', 'Start child shell and run version command', 'Test actual executable directly', 'Restore original process PATH and repeat in fresh child') @{ direct = $direct; restored = $restored } ($missing.exitCode -ne 0 -and $missing.output -match 'not recognized' -and $direct.exitCode -eq 0 -and $restored.exitCode -eq 0) 'Actual installed executable and real command-not-found error. Does not verify a Windows 11 installer repair, persistent User PATH edit or Windows Terminal UI.'
  }

  $shell = Invoke-Recorded '04-external-shell' $pwshPath @('-NoProfile', '-Command', 'Write-Output "external-shell-started"; $PSVersionTable.PSVersion.ToString()')
  $codeVersion = Invoke-Recorded '05-vscode-version' (Get-Command code.cmd).Source @('--version')
  $linux = Invoke-Recorded '06-wsl-availability' (Get-Command wsl.exe).Source @('--list', '--quiet')
  Record-Case 'external-shell-control' 'No VS Code integrated-terminal failure reproduced' @('Run pwsh -NoProfile outside VS Code', 'Read code --version; no editor settings changed') @{ shell = $shell; vscode = $codeVersion } ($shell.exitCode -eq 0) 'External shell control only; integrated terminal launch remains UNTESTED. No screenshot captured.'
  $metadata = @{ node = (& $nodePath --version); npm = (& $npmPath --version); git = (& $gitPath --version);
    powershell = $PSVersionTable.PSVersion.ToString(); vscode = $codeVersion.output.Trim();
    windows11Available = ($osInfo.name -like 'Windows 11*'); linuxProbeExitCode = $linux.exitCode; linuxAvailable = $false;
    verificationDate = [DateTimeOffset]::UtcNow.ToOffset([TimeSpan]::FromHours(5)).ToString('yyyy-MM-dd'); displayTimezone = 'Asia/Karachi'; fixtureDirectory = $runRoot }
} finally { $env:Path = $originalPath }
@{ environment = $metadata; records = $records; productionChanges = $false;
  limitations = 'No VM, Windows 11, Linux, persistent install/PATH change, integrated VS Code terminal failure or screenshot evidence. Process-only controls are real tests, not simulated outputs.' } |
  ConvertTo-Json -Depth 12 | Set-Content -LiteralPath (Join-Path $evidence 'results.json') -Encoding utf8
if (@($records | Where-Object { -not $_.passed }).Count) { exit 1 }
