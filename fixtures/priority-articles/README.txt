CODEWITHLOGS PRIORITY ARTICLE FIXTURE — LOCAL ONLY

This app is separate from CodeWithLogs. It does not use the blog database or
replace the website's NextAuth/CMS. It must not be deployed as a production app.

From the repository root in PowerShell:
  Push-Location fixtures/priority-articles
  try { npm.cmd ci } finally { Pop-Location }
  node scripts/test-priority-articles.mjs

The full runner intentionally changes only three fixture files (page, Status,
tsconfig) to reproduce failures, restores them in finally, builds clean code and
starts a loopback-only server on port 3107. Do not run it during a manual fixture
edit or while another fixture server/build is using the directory. Git casing is
tested in a new ignored .next subdirectory with no remote/commit. Logs/results
are written to reports/priority-article-tests; synthetic labels/keys only.

For a narrower confirmation after a change:
  node scripts/test-priority-articles.mjs --confirm

This rebuilds the corrected app and repeats application-boundary/HTTP checks,
without rerunning the intentional compiler/lint failures or casing index case.
It writes confirmation-results.json separately. It is not a browser test.

Versions: Next 16.2.6, React/React DOM 19.2.4, TypeScript 5.9.3,
@supabase/ssr 0.12.7, @supabase/supabase-js 2.118.0; full lockfile included.
Actual environment: Windows 10 Pro, release 10.0.19045 x64, Node v22.18.0.
No Windows 11 or Linux runtime result is claimed.

The runner overrides Supabase URL/key with synthetic loopback configuration.
Real SDK anonymous requests therefore test no-session handling without contacting
a real project. Some action/data tests mock identity/transports. .single() and
.maybeSingle() checks use real SDK code with simulated HTTP responses, not a DB.

To test actual sign-in/RLS/refresh, first obtain an approved disposable Supabase
project/test accounts and set its public URL/key in an ignored .env.local. Apply
schema.sql ONLY there after review. Then run dev from this directory and carry
out the manual cases in the authentication revision. Those cases have NOT been
performed. Do not substitute production credentials or run schema.sql on the blog.

The /failure route intentionally throws; an error response there is expected.
The /api/runtime-env response exposes only a synthetic test label. No real secret
should ever be added to that response. Do not treat a passing fixture as proof
that the entire associated article or external hosting setup is verified.
