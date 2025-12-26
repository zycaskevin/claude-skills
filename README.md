# Claude Skills Collection

[English](#english) | [繁體中文](#traditional-chinese)

---

<a name="english"></a>

## 🇬🇧 English

This is a curated collection of skills and hooks tailored for **Claude Code** (and similar LLM agents). It aims to supercharge your AI programming assistant with standardized capabilities, security guardrails, and best practice memories. Inspired by [obra/superpowers](https://github.com/obra/superpowers).

### 🚀 Features

#### Core Hooks (`hooks/`)

* **Security Guardrails** (`pre-tool-use.js`): Intercepts dangerous commands (`rm -rf`, `DROP DB`) and prevents accidental execution with a blacklist/whitelist mechanism.
* **Session Management** (`session-start.js`): Initializes session context, displaying Git status and critical TODOs on startup.
* **Skill Injection** (`skill-forced-eval.js`): Evaluates user intent and dynamically injects relevant skills (Prompt Engineering without the fatigue).
* **Auto-Cleanup** (`stop.js`): Handles post-session tasks like documentation archiving and updating the README index.

#### Skills Library (`skills/`)

A set of Markdown-defined skills that Claude can read and adopt:

* **Mobile Development**: iOS (SwiftUI), Android (Kotlin/Compose), Flutter, React Native - all with security best practices.
* **MCP Builder**: Complete guide to building Model Context Protocol servers (Python/FastMCP & Node.js).
* **Frontend Design**: Principles for creating unique, high-quality UIs, avoiding generic "AI" styles.
* **Security Standards**: Hardened guides for API design (RBAC, HTTPS) and Database operations (No SQLi).

### 📦 Installation

To use these skills in your own Claude Code environment:

1. Copy the contents of `hooks/` to your project's `.claude/hooks/` directory.
2. Copy the contents of `skills/` to your project's `.claude/skills/` directory.
   *(Or clone this repo and symlink for easier updates)*
3. Ensure your `.claude/settings.json` is configured to load these hooks (if applicable).

### 🤝 Contributing

We welcome contributions! Whether it's a new skill, a security fix, or a translation update. Please start a discussion or submit a PR.

---

<a name="traditional-chinese"></a>

## 🇹🇼 繁體中文 (Traditional Chinese)

這是一個為 **Claude Code** 量身打造的技能與 Hooks 精選集，旨在增強您的 AI 程式設計助理的能力。它提供了標準化的開發能力、安全防護網以及最佳實踐記憶庫。靈感來自 [obra/superpowers](https://github.com/obra/superpowers)。

### 🚀 功能特色

#### 核心 Hooks (`hooks/`)

* **安全檢查** (`pre-tool-use.js`)：攔截危險指令（如 `rm -rf`），防止意外執行，提供黑名單/白名單機制。
* **會話管理** (`session-start.js`)：初始化會話上下文，顯示 Git 狀態與待辦事項。
* **技能注入** (`skill-forced-eval.js`)：評估用戶意圖並動態注入相關技能（無需重複提示工程）。
* **自動清理** (`stop.js`)：處理會話結束後的任務，如文檔歸檔與 README 索引更新。

#### 技能庫 (`skills/`)

一套 Claude 可讀取並採用的 Markdown 定義技能集：

* **行動端開發**：iOS (SwiftUI)、Android (Kotlin/Compose)、Flutter、React Native — 皆包含安全最佳實踐。
* **MCP Builder**：建立 Model Context Protocol 伺服器的完整指南 (Python/FastMCP & Node.js)。
* **前端設計**：打造獨特、高品質 UI 的設計原則，避免通用 AI 風格。
* **安全標準**：強化的 API 設計 (RBAC, HTTPS) 與資料庫操作指南 (防範 SQL 注入)。

### 📦 安裝指南

要在您自己的 Claude Code 環境中使用這些技能：

1. 將 `hooks/` 目錄下的內容複製到您專案的 `.claude/hooks/` 目錄。
2. 將 `skills/` 目錄下的內容複製到您專案的 `.claude/skills/` 目錄。
    *(或者 Clone 此倉庫並建立符號連結，以便於更新)*
3. 確保您的 `.claude/settings.json` 已配置為載入這些 Hooks（如適用）。

### 📄 文件

請參閱 [docs/ANTHROPIC_SKILLS_EVALUATION.md](docs/ANTHROPIC_SKILLS_EVALUATION.md) 以獲取包含技能的詳細評估報告。

### 🤝 貢獻

我們歡迎任何形式的貢獻！無論是新技能、安全修復還是翻譯更新。請隨時發起討論或提交 PR。

## 許可證 (License)

[MIT](LICENSE)
