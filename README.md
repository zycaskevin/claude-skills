# Claude Skills Collection

這是一個為 Claude Code 量身打造的技能與 Hooks 精選集，旨在增強您的 AI 程式設計助理的能力。靈感來自 [obra/superpowers](https://github.com/obra/superpowers)。

## 🚀 功能特色

### 核心 Hooks (`hooks/`)

- **安全檢查** (`pre-tool-use.js`)：攔截危險指令，防止意外執行，提供黑名單/白名單機制。
- **會話管理** (`session-start.js`)：初始化會話上下文，顯示 Git 狀態與待辦事項。
- **技能注入** (`skill-forced-eval.js`)：評估用戶意圖並動態注入相關技能。
- **自動清理** (`stop.js`)：處理會話結束後的任務，如文檔歸檔與 README 更新。

### 技能庫 (`skills/`)

一套 Claude 可讀取並採用的 Markdown 定義技能集：

- **MCP Builder**：建立 Model Context Protocol 伺服器的完整指南。
- **Frontend Design**：打造獨特、高品質 UI 的設計原則，避免通用 AI 風格。
- **Web Artifacts**：React/Vite 專案生成的標準工作流。
- **開發工作流**：涵蓋 CRUD 開發、測試策略、Git 工作流等。
- **腦力激盪與規劃**：用於深度設計思考與實作計畫撰寫的工具。

## 📦 安裝指南

要在您自己的 Claude Code 環境中使用這些技能：

1. 將 `hooks/` 目錄下的內容複製到您專案的 `.claude/hooks/` 目錄。
2. 將 `skills/` 目錄下的內容複製到您專案的 `.claude/skills/` 目錄。
3. 確保您的 `.claude/settings.json` 已配置為載入這些 Hooks（如適用）。

## 📄 文件

請參閱 [docs/ANTHROPIC_SKILLS_EVALUATION.md](docs/ANTHROPIC_SKILLS_EVALUATION.md) 以獲取包含技能的詳細評估報告。

## 許可證 (License)

MIT
