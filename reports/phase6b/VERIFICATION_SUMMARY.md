# Phase 6B — technical verification

Tested 2026-10-21, Asia/Karachi. Branch: `redesign/adsense-readiness`.
**All five articles remain NEEDS VERIFICATION. None is approved for publication.**
No unexpected test failure occurred. Missing database, browser and hosted evidence
still prevents technical sign-off for the complete claims in these articles.

## Results by article

| Article | Passed checks | Missing checks / owner action | Final status |
| --- | --- | --- | --- |
| Inventory Management with Next.js and Supabase | Draft SQL/helper match existing fixtures after comment/format normalization. Existing input/auth-denial/RPC serialization/error/replay tests pass again. | Use a disposable **local** Supabase database to execute SQL and test anonymous/A/B permissions, direct-write denial, last-unit concurrency, same-key replay, cross-product conflicts and rollback. Independently inspect grants/function ownership and stock/ledger invariants. Mocks do not prove these. | NEEDS VERIFICATION |
| Common Vercel Deployment Errors | Isolated corrected build, TypeScript, alias rendering and synthetic build-time/public vs request-time/server environment checks pass. Earlier intentional import/type/alias/lint failures and Windows Git case correction have historical evidence. | Actual platform error/remedy checks, output/routing configuration, timeout/OOM diagnosis and case-sensitive Linux build remain missing. Owner must arrange an authorized environment; no hosted preview was created. | NEEDS VERIFICATION |
| Supabase Row Level Security Examples | SQL matches existing fixture; exact revised insert snippet passes success/provider-error/null-data handling with real SDK and constructed HTTP responses. | Execute anonymous/A/B CRUD, zero-row update/delete plus owner reread, column-privilege/constraint and policy-composition tests on disposable local Supabase. The snippet test does **not** exercise RLS or grant enforcement. | NEEDS VERIFICATION |
| Supabase Production Errors | Draft cardinality functions match fixture. All six single/maybeSingle SDK response cases pass again: zero/one/two rows using constructed HTTP responses. | Verify actual visible/hidden database rows, user sessions/refresh, recursion, unique constraints, connection modes, schema corrections and SMTP/recovery flow. Owner needs authorized isolated services for any provider-specific checks. | NEEDS VERIFICATION |
| Debug Production Errors in Next.js | Exact revised retry component production-builds and typechecks in the existing isolated app; ESLint reports 0 errors/0 warnings. Real local production HTTP hides the synthetic server marker while retaining it in server logs. | Browser fallback, keyboard/pending-state behavior, persistent and recoverable retry, hydration mismatch/fix and actual hosted log correlation remain untested. An always-throwing route does not demonstrate recovery. | NEEDS VERIFICATION |

Windows 11/Linux results are not claimed. Test those environments before adding
such claims; they are separate from the missing database/browser evidence above.

## Fresh evidence and reproducibility

- [15 existing confirmation checks](priority-fixture-tests/confirmation-results.json)
  and [build log](priority-fixture-tests/06-fixed-production-build.log),
  [typecheck log](priority-fixture-tests/07-fixed-typecheck.log),
  [server log](priority-fixture-tests/14-server.log). Reused
  `scripts/test-priority-articles.mjs --confirm --evidence-dir reports/phase6b/priority-fixture-tests`.
  For this run only, the original fixture boundary was temporarily replaced with
  the exact Phase 6A retry block. It was restored in `finally`. This is an isolated
  fixture production build, **not the CodeWithLogs production application build**.
- [12 existing Supabase helper/SDK checks](fixture-tests.json): reused
  `scripts/test-phase5-fixtures.mjs` without changing it. An in-memory filesystem
  write redirect saved new results here instead of overwriting Phase 5 evidence.
  Identity/RPC unit outcomes are mocks; SDK fetch responses are constructed.
- [8 draft checks](draft-checks.json): four fixture-parity comparisons, syntax of
  five JS/TSX blocks as one group, and three response-handling cases for the exact
  revised RLS insert block. No SQL execution is implied by source parity.
- [Retry ESLint result](retry-lint.json): linted the exact draft component in memory
  with the existing project config; no new lint rule or dependency was added.
- [Source integrity](source-integrity.json): SHA-256 inventory for all six Phase 6A
  files, exact retry-block hash, unchanged-draft check and original-boundary restore.

The test groups overlap in SDK/HTTP coverage; their counts are not independent
real-world scenarios. Expected error responses in negative tests are passing
assertions, not unexpected failures. Earlier negative/casing tests were inspected,
not rerun unnecessarily: [Phase 3 review](../phase3/FINAL_TECHNICAL_ACCURACY.txt),
[Phase 5 report](../phase5/TECHNICAL_VERIFICATION.txt),
[earlier results](../priority-article-tests/results.json).

Actual environment: Windows 10 Pro 10.0.19045 x64; Node 22.18.0; npm 10.9.3;
Next 16.2.6; React 19.2.4; TypeScript 5.9.3; Supabase SSR 0.12.7;
supabase-js 2.118.0. Restored existing locked fixture dependencies using
`npm.cmd ci --offline --ignore-scripts --no-audit --no-fund` with the existing
local npm cache. No dependency/lockfile or application configuration changed.

## Security, command and documentation review

Read all five final drafts, their Phase 6A summary, relevant historical evidence
and the existing SQL/API plan. Rechecked the installed Next 16.2.6 error-file
documentation and error-boundary implementation: both expose unstable_retry;
the draft distinguishes its refetch behavior from reset. The new component's
build result applies to compilation/HTTP transport, not its browser interaction.

Rechecked official [PostgreSQL REVOKE](https://www.postgresql.org/docs/current/sql-revoke.html)
and [CREATE POLICY](https://www.postgresql.org/docs/current/sql-createpolicy.html):
the draft correctly distinguishes column grants, USING/WITH CHECK fallback and
policy-filtered visibility. This documentation review does not validate the SQL
against a running server.

[Supabase maybeSingle](https://supabase.com/docs/reference/javascript/maybesingle)
documents zero-or-one-row intent. The constructed-response SDK cases confirm its
client contract without establishing live PostgREST/RLS outcomes.
[Vercel's missing-deployment documentation](https://vercel.com/docs/errors/deployment_not_found)
supports distinguishing a platform deployment lookup from an application route
404; no actual hosted repair is claimed.

PowerShell npm.cmd/npx.cmd commands are appropriate on this host. The build/start
scripts exist in the isolated fixture; the root project also has the documented
lint script. No global installation, production migration, public secret prefix,
disabled authorization or unsafe service-role browser workaround was executed.

## Unavailable verification

No psql/postgres/pg_ctl/Docker executable was found on PATH; the standard
`C:\Program Files\PostgreSQL` directory is absent. No disposable local database
was established. No SQL, test-role operation, cloud project, real token test,
email or database mutation was attempted. An SQL owner session or mocked identity
would not satisfy the required A/B API tests.

No browser test ran this phase; the previously recorded local-browser URL-policy
limitation was not bypassed. No Vercel deployment, Windows 11/Linux test or live
production route/indexing check ran. Follow the existing
[SQL/API matrix](../../fixtures/phase5-supabase/TEST_PLAN.txt) once the required
local database is available; provider/browser tests need their stated resources.

## Git status and exact Phase 6A inventory

The six existing Phase 6A files are unchanged and remain untracked:

1. `reports/phase6a/REVIEW_SUMMARY.md`
2. `reports/phase6a/inventory-management-system-nextjs-supabase.txt`
3. `reports/phase6a/common-vercel-deployment-errors-solutions.txt`
4. `reports/phase6a/supabase-row-level-security-real-examples.txt`
5. `reports/phase6a/supabase-errors-production-fixes.txt`
6. `reports/phase6a/debug-production-errors-nextjs.txt`

`git diff --exit-code` passes: no tracked file changes. The only untracked groups
are existing `reports/phase6a/` and new `reports/phase6b/`. Phase 6B adds this one
summary and eight raw evidence files; fixture dependencies/build caches are
ignored. Original reports and fixture source are preserved, and the loopback
test server is stopped. No new article drafts, tools or application source were
created. No commit, push, publication or deployment was performed.

Owner must complete the missing test gates, confirm author/metadata accuracy and
approve the exact revisions before any publication. Neither passing local tests
nor this review implies Google AdSense approval.
