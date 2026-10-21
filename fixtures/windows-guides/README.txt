WINDOWS GUIDE FIXTURES — LOCAL ONLY

Run from the repository root in PowerShell:
  & ./scripts/test-windows-guides.ps1
  node scripts/test-eresolve.mjs

The PowerShell runner uses child processes and temporarily changes only its own
PATH, restoring it in finally blocks. Its execution-policy reproduction uses a
child process with Restricted policy; no persistent policy is changed. It does
not install software, edit machine PATH, or reset a repository.

The npm runner creates real local package tarballs and an incompatible peer
dependency, records the actual failed install, aligns the direct dependency,
then checks install, npm ls and npm ci. It uses offline/ignore-scripts flags.
It tests npm dependency resolution, not compatibility of arbitrary applications.

Generated package workspaces are ignored under runs/. Records and raw output
are saved in reports/phase3/tests/windows and reports/phase3/tests/eresolve.
These are observed process-level tests on the recorded host, not Windows 11,
Linux or VS Code integrated-terminal certification. No screenshots were captured.
Do not run commands from an unreviewed source or weaken organizational policy
to run this runner. Review its source and use an appropriate local test machine.
