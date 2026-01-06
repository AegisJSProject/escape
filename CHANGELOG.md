<!-- markdownlint-disable -->
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v1.0.4] - 2026-01-05

### Fixed
- Fix handling escaping arrays in trusted html

## [v1.0.3] - 2026-01-05

### Fixed
- Fix bad logic in the `trustedTypes` / tagged template / `trusted-html.js` implementation

## [v1.0.2] - 2026-01-05

### Added
- Add `createPolicy()` to create a `TrustedTypePolicy` with a `createHTML()` that escapes untrusted input

## [v1.0.1] - 2026-01-05

### Added
- Add tests for `escapeCSS()`
- This release will add Package Provenance

## [v1.0.0] - 2026-01-05

Initial Release
