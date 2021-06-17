# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] - 2021-06-17
### Added
- Started using CHANGELOG.md
### Changed
- `axios` is a proper dependency, and no longer just a dev-dependency.

## [0.1.1] - 2021-06-17
### Changed
- `AxiosApiClient` would be the default api client for the project

### Fixed
- Reverted changes in last release 0.1.0 due to unstability reason

### Removed
- `FetchApiClient`, `NodeFetchApiClient` removed
- Removed optional dependency on `node-fetch` and `what-fetch`
## [0.1.0] - 2021-06-17
### Added
- `FetchApiClient`, `NodeFetchApiClient` added
- Introduced optional dependency on `node-fetch` and `what-fetch`
### Changed
- `NodeFetchApiClient` would be the default api client for the project