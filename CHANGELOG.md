# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GitHub Issue templates (bug report, feature request, new skill)
- Pull Request template with checklist
- CONTRIBUTING.md with bilingual guidelines
- SECURITY.md for vulnerability reporting
- .gitignore with comprehensive patterns

### Changed
- Optimized skill files structure (core + references)
- Improved README with bilingual content

---

## [1.0.0] - 2025-12-27

### Added

#### Core Hooks
- `pre-tool-use.js` - Security guardrails with blacklist/whitelist
- `session-start.js` - Session initialization with Git status display
- `skill-forced-eval.js` - Dynamic skill injection (24 skills)
- `stop.js` - Post-session cleanup and documentation archiving

#### Skills Library (24 skills)
- **Backend**: `crud-development`, `spring-boot-crud`, `rest-api-design`, `database-ops`
- **Frontend**: `frontend-design`, `web-artifacts-builder`
- **Mobile**: `ios-development`, `android-development`, `flutter-development`, `react-native-development`
- **Integration**: `mcp-builder`, `letta-agent`
- **DevOps**: `git-workflow`, `cicd-pipeline`
- **Quality**: `testing`, `systematic-debugging`, `verification-before-completion`
- **Planning**: `writing-plans`, `executing-plans`, `brainstorming`
- **Code Review**: `requesting-code-review`, `code-review-standards`
- **Advanced**: `skill-creator`, `dispatching-parallel-agents`

#### Documentation
- Bilingual README (English + Traditional Chinese)
- ANTHROPIC_SKILLS_EVALUATION.md - Official evaluation report
- RED_TEAM_AUDIT.md - Security audit results
- Skills README with comprehensive index

### Security
- Dangerous command blocking (`rm -rf /`, `DROP DATABASE`, etc.)
- Fork bomb detection
- System directory write protection
- API key exposure prevention in examples

---

## [0.1.0] - 2025-12-25

### Added
- Initial project structure
- Basic hooks implementation
- Core skill templates

---

[Unreleased]: https://github.com/zycaskevin/claude-skills/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/zycaskevin/claude-skills/releases/tag/v1.0.0
[0.1.0]: https://github.com/zycaskevin/claude-skills/releases/tag/v0.1.0
