# Claude Skills Collection

A curated collection of skills and hooks for Claude Code, designed to enhance your AI coding assistant with powerful capabilities. Inspired by [obra/superpowers](https://github.com/obra/superpowers).

## 🚀 Features

### Core Hooks (`hooks/`)

- **Safety Checks** (`pre-tool-use.js`): Intercepts dangerous commands and prevents accidental execution.
- **Session Management** (`session-start.js`): Initializes session context and displays TODOs.
- **Skill Injection** (`skill-forced-eval.js`): Evaluates user intent and injects relevant skills.
- **Auto-Cleanup** (`stop.js`): Handles post-session tasks like documentation archiving and README updates.

### Skills Library (`skills/`)

A comprehensive set of markdown-defined skills that Claude can read and adopt:

- **MCP Builder**: Guide to building Model Context Protocol servers.
- **Frontend Design**: Principles for creating unique, high-quality UIs.
- **Web Artifacts**: Workflows for React/Vite project generation.
- **Development Workflows**: CRUD development, testing, Git workflows, and more.
- **Brainstorming & Planning**: Tools for thoughtful design and implementation planning.

## 📦 Installation

To use these skills in your own Claude Code environment:

1. Copy the contents of `hooks/` to your project's `.claude/hooks/` directory.
2. Copy the contents of `skills/` to your project's `.claude/skills/` directory.
3. Ensure your `.claude/settings.json` is configured to load these hooks (if applicable).

## 📄 Documentation

See [docs/ANTHROPIC_SKILLS_EVALUATION.md](docs/ANTHROPIC_SKILLS_EVALUATION.md) for a detailed evaluation of the skills included.

## License

MIT
