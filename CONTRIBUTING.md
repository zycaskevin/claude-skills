# Contributing to Claude Skills Export

[English](#english) | [繁體中文](#繁體中文)

---

## English

Thank you for your interest in contributing to Claude Skills Export! This document provides guidelines for contributing to this project.

### How to Contribute

#### 1. Reporting Issues

- Use GitHub Issues to report bugs or suggest features
- Provide clear descriptions and reproduction steps
- Include your environment details (OS, Claude Code version)

#### 2. Contributing Skills

**Step 1: Create Skill File**

```bash
# Create skill in skills/ directory
skills/your-skill-name.md
```

**Step 2: Follow the Template**

Every skill MUST include:

```markdown
# Skill Name

> **Skill ID**: `your-skill-id`
> **Version**: 1.0.0
> **Purpose**: Brief description

---

## Trigger Conditions

When to activate this skill:
- Keyword list
- Use cases

## Core Standards

- Architecture guidelines
- Coding conventions
- Best practices

## Prohibited Actions

- Common mistakes to avoid
- Anti-patterns

## Reference Examples

Complete code examples

## Self-Check List

- [ ] Checklist item 1
- [ ] Checklist item 2
```

**Step 3: Update Indexes**

1. Add to `skills/README.md`
2. Add to `hooks/skill-forced-eval.js`

**Step 4: Submit Pull Request**

```bash
git checkout -b feature/add-your-skill
git add .
git commit -m "feat(skills): add your-skill-name skill"
git push origin feature/add-your-skill
```

#### 3. Contributing Hooks

Hooks should follow security best practices:

- Block dangerous operations
- Warn on sensitive operations
- Allow safe operations

See `hooks/pre-tool-use.js` for reference implementation.

### Quality Standards

#### Skill Requirements

| Requirement | Description |
|-------------|-------------|
| Trigger Conditions | Clear activation keywords |
| Core Standards | Complete specifications |
| Code Examples | Working, production-ready |
| Prohibited Actions | Anti-patterns listed |
| Self-Check List | Verification checklist |
| Language | Traditional Chinese (primary) |

#### Token Budget

- **Metadata**: ~25 tokens
- **SKILL.md**: ~1,250 tokens (max 5,000 words)
- **Total**: Keep under 1,500 tokens per skill

### Commit Convention

Use [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- refactor: Code refactoring
- test: Tests
- chore: Maintenance
```

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the issue, not the person
- Welcome newcomers

---

## 繁體中文

感謝您對 Claude Skills Export 的貢獻興趣！本文件提供貢獻指南。

### 如何貢獻

#### 1. 回報問題

- 使用 GitHub Issues 回報 Bug 或建議功能
- 提供清楚的描述和重現步驟
- 包含您的環境資訊（作業系統、Claude Code 版本）

#### 2. 貢獻技能

**步驟 1: 創建技能文件**

```bash
# 在 skills/ 目錄創建技能
skills/your-skill-name.md
```

**步驟 2: 遵循模板**

每個技能必須包含：

```markdown
# 技能名稱

> **技能 ID**: `your-skill-id`
> **版本**: 1.0.0
> **用途**: 簡短描述

---

## 觸發條件

何時激活此技能：
- 關鍵字列表
- 使用場景

## 核心規範

- 架構指南
- 編碼規範
- 最佳實踐

## 禁止事項

- 應避免的常見錯誤
- 反模式

## 參考範例

完整程式碼範例

## 自我檢查清單

- [ ] 檢查項 1
- [ ] 檢查項 2
```

**步驟 3: 更新索引**

1. 添加到 `skills/README.md`
2. 添加到 `hooks/skill-forced-eval.js`

**步驟 4: 提交 Pull Request**

```bash
git checkout -b feature/add-your-skill
git add .
git commit -m "feat(skills): add your-skill-name skill"
git push origin feature/add-your-skill
```

#### 3. 貢獻 Hooks

Hooks 應遵循安全最佳實踐：

- 阻擋危險操作
- 警告敏感操作
- 允許安全操作

參考 `hooks/pre-tool-use.js` 的實作。

### 品質標準

#### 技能要求

| 要求 | 說明 |
|------|------|
| 觸發條件 | 明確的激活關鍵字 |
| 核心規範 | 完整的規格說明 |
| 程式碼範例 | 可運作的生產級代碼 |
| 禁止事項 | 列出反模式 |
| 自我檢查清單 | 驗證檢查表 |
| 語言 | 繁體中文（主要） |

#### Token 預算

- **元數據**: ~25 tokens
- **SKILL.md**: ~1,250 tokens（最多 5,000 字）
- **總計**: 每個技能控制在 1,500 tokens 以內

### Commit 規範

使用 [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

類型：
- feat: 新功能
- fix: Bug 修復
- docs: 文檔
- refactor: 重構
- test: 測試
- chore: 維護
```

### 行為準則

- 尊重和包容
- 提供建設性反饋
- 專注於問題，而非個人
- 歡迎新手

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Open an issue or contact the maintainers.

---

**Maintainer**: Claude Code + zycaskevin
**Last Updated**: 2025-12-27
