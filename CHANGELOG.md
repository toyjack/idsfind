# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

Versions and dates below match what is [published on npm][npm]; entries were
reconstructed from git history, since most releases predate git tags. Version
`2.3.2` was built but never published to npm and is omitted here.

## [Unreleased]

## [3.1.1] - 2026-04-27

### Fixed
- Corrected `main`/`module` entry point paths in `package.json`.

## [3.1.0] - 2026-04-27

### Changed
- Migrated to a pnpm workspace (added `pnpm-workspace.yaml`).
- Refreshed all generated data tables (`Strokes.json`, `gw_ids.json`, `gw_all.json`,
  `inverted_ids_all.json`, `inverted_ids_first_level.json`, `inverted_ids_remaining.json`)
  via `npm run generate`.
- Updated dependencies (`pnpm-lock.yaml`) and `tsconfig.json`.
- Updated README and the `scripts/test.cjs` smoke test.

## [3.0.1] - 2023-06-28

### Fixed
- Packaging follow-up patch after the 3.0.0 tooling migration.

## [3.0.0] - 2023-06-28

### Changed
- Switched the build to `tsup`, producing dual CJS (`dist/index.js`) and ESM
  (`dist/index.mjs`) output plus `dist/index.d.ts`.
- Switched package manager from Yarn to pnpm.
- Rewrote the data-generation script in TypeScript and moved it to `scripts/update.ts`.
- Split the manual smoke test into `scripts/test.cjs` and `scripts/test.mjs`.
- General TypeScript style cleanup and dependency housekeeping.

## [2.4.0] - 2022-09-26

### Changed
- Switched the build pipeline to Rollup + esbuild.
- General package cleanup and TypeScript style pass.

## [2.3.5] - 2022-04-21

### Fixed
- Fixed the generated TypeScript declaration file.

### Changed
- Updated README formatting.

## [2.3.4] - 2022-04-21

### Fixed
- Fixed type generation from the Rollup build.

## [2.3.3] - 2022-04-21

### Added
- Added Git LFS support for `data/gw_all.json`.
- Added a smoke test runnable via `npm run test`.

### Removed
- Removed an unnecessary module dependency.

## [2.3.1] - 2022-03-21

### Fixed
- Fixed an issue with the `lodash` dependency.

## [2.3.0] - 2022-03-16

### Added
- Added searching IDS glyphs sourced from the GlyphWiki dump.

### Fixed
- Removed `lodash` plugins to simplify dependencies.
- Fixed `.gitignore` for the generated GlyphWiki IDS index file.

## [2.2.0] - 2022-03-15

### Added
- Added searching IDS decompositions sourced from CJKVI-IDS data.

### Fixed
- Fixed a typo.

## [2.1.0] - 2022-01-11

### Added
- Added recursive ("deep") search through nested IDS decompositions.
- Added a LICENSE file.

## [2.0.4] - 2021-11-15

### Fixed
- Bug fix in the search index.

## [2.0.3] - 2021-11-15

### Added
- Added the `getTotalStrokes` function.

## [2.0.2] - 2021-11-15

### Changed
- Split the recursive inverted IDS index into first-level, remaining, and
  all-depths data files.

## [2.0.1] - 2021-11-03

### Fixed
- Immediate follow-up patch after the 2.0.0 rewrite.

## [2.0.0] - 2021-11-03

### Changed
- Rewrote the library after the initial prototype phase.
- Updated README.

## [1.1.3] - 2019-02-04

### Fixed
- Maintenance release.

## [1.1.2] - 2018-12-05

### Fixed
- Additional bug fixes.

## [1.1.1] - 2018-12-01

### Changed
- Updated README notes.

## [1.1.0] - 2018-11-28

### Fixed
- Major fixes to the core search logic.

## [1.0.3] - 2018-11-28

### Added
- Added a Unihan stroke-count downloader.

### Fixed
- Various fixes to the search logic.

## [1.0.2] - 2018-10-25

### Added
- Added README.
- Added automatic CHISE IDS data downloader.

### Changed
- Moved the library into a `lib` folder.

## [1.0.1] - 2018-10-25

### Fixed
- Patch release.

## [1.0.0] - 2018-10-25

### Added
- Initial prototype release: search CJK characters by IDS component and
  remaining stroke count.

[npm]: https://www.npmjs.com/package/idsfind?activeTab=versions
