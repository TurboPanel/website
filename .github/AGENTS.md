# CI and Releases (`.github/`) — AGENTS.md

Repo context: `../AGENTS.md`.

## Releases and promotion

`.github/workflows/release.yml` publishes a notes-only GitHub Release on a `v[0-9]*` tag push (or a dry-run dispatch). **Automatic promotion (two PRs, the normal path):** website is notes-only, so an rc is a tag on a trunk commit, not a rebuilt artifact. `promote-prs.yml` keeps a trunk → staging PR "Release Candidate x.y.z-rc.N" open after every green `Verify` on trunk (opened with the Release App token so `ci-ok` runs). Merging it (merge commit) fires `publish-rc.yml` on the push to `staging`: it takes the merged PR's head commit and the version worked out from the tags and publishes `vx.y.z-rc.N` as a notes-only release (no approval gate), then opens/refreshes the staging → live PR "Release x.y.z". Merging that fires `publish-release.yml`: newest rc.N → `vx.y.z` (`releases/latest`) behind the `release` environment approval (allowed branches: `trunk` and `live`). **The tags work out the version; the committed files must agree.** The base is the newest release tag's next patch, unless an unreleased rc or a `start/vX.Y.0` marker names a higher version; canaries (in the other repos) are `<base>-canary.<N>` with N restarting at 1 per base. TurboPanel/dev's Version From Tags action (`scripts/promote/version.sh`) works them out. The committed version lives in `package.json` `version` and `sonar.projectVersion`; `node scripts/set-version.mjs X.Y.Z` rewrites both and `--check X.Y.Z` names each one that disagrees (`scripts/set-version.test.ts`). Website has no canary build, so `publish-rc.yml` runs `--check` on the merged trunk commit with the version from the tags, and **no rc is published until the committed version is that version**. Who bumps it: right after each release the TurboPanel Release App opens a PR "chore: start X.Y.Z" (the next patch, a commit GitHub signs) from `publish-release.yml`'s last job (`start-version-pr`, TurboPanel/dev's Start Version PR action with `auto-merge: "true"`), and it merges itself once its checks pass; until then no rc is published. A minor or major is started with turbopaneld's **Start Next Version** workflow (`bump: minor|major`), which pushes the `start/` marker in all four repos and opens the same "chore: start X.Y.0" PR in each. **Repos release independently — website is never gated on another repo's release.** PRs into staging/live skip Sonar. `release.yml` ignores tag pushes by `[bot]` actors so an App-created tag does not race the promotion with a from-source rebuild.

**Promotion, break-glass (`.github/workflows/promote.yml`):** the same three jobs as a manual form, for when the automatic path cannot run: `to=rc` tags a commit-ish (`source`, usually `trunk`; notes-only — no assets, the number is `package.json`'s) as the next `v<base>-rc.<N>` and fast-forwards `staging`; `to=release` turns the newest `v<base>-rc.<N>` into `v<base>` (`releases/latest`; the rolling `rc` pointer is re-pointed at it) and fast-forwards `live`. The tag is created at the source commit (an existing tag elsewhere = burned version, fails). The three jobs are `TurboPanel/dev`'s `gh-promote.yml` → `gh-release.yml` → `gh-promote-finalize.yml` pinned to ONE dev sha, passed again as `dev-ref`. Approval = the `release` environment (prepare, then finalize). `to=release` needs the TurboPanel Release App secrets (`RELEASE_APP_ID` / `RELEASE_APP_PRIVATE_KEY`) and refuses to start without them. Full contract: `../dev/AGENTS.md` → Release promotion.

## CI Analysis

### SonarQube (CI-based analysis)

- Analysis runs in GitHub Actions (`.github/workflows/verify.yml`) with
  `SONAR_TOKEN` and `sonar-project.properties`
  (`sonar.projectKey=turbopanel_website`, `sonar.organization=turbopanel`). The job
  runs lint + checks + typecheck + **`pnpm test:coverage`** (Vitest v8 LCOV at
  `coverage/lcov.info`), then scans with
  `sonar.javascript.lcov.reportPaths=coverage/lcov.info`. The scan waits on the
  quality gate (`sonar.qualitygate.wait=true`); if the gate fails, the workflow
  stops.
- Vitest coverage `include` is `src/lib/**/*.ts` (`vitest.config.ts`).
  `sonar.coverage.exclusions` must keep Next routes (`src/app/**`), marketing/docs
  chrome (`src/components/**`), `**/*.tsx`, and the Fumadocs loader wiring
  (`src/lib/source.ts`) out of the coverage denominator so untested pages do
  not fail Sonar-way **Coverage on New Code ≥ 80%**. Font options
  (`wordmark-font.ts`) and the client-mount snapshot hook
  (`use-client-mounted.ts`) are unit-tested.
- **`sonar.sources` / `sonar.tests` / `sonar.test.inclusions`** must stay set in
  `sonar-project.properties` (and mirrored in vestigial
  `.sonarcloud.properties`). Tests are co-located (`**/*.test.ts` under `src`).
- **Automatic Analysis must stay off** for `turbopanel_website` (SonarCloud →
  project **Administration → Analysis Method**). CI and Automatic Analysis
  cannot run together — Automatic Analysis enabled makes the CI scanner fail.
- Sonar-way **Coverage on New Code ≥ 80%** needs LCOV on CI. After switching
  from Automatic Analysis, reset **New Code** (Administration → New Code) so the
  baseline is not months of uncovered history, or the gate will fail even with
  fresh coverage reports.
