# Git 工作流技能（Git Workflow）

> **技能 ID**: `git-workflow`
> **版本**: 1.0.0
> **用途**: 分支管理、Commit 規範、PR 流程、分支完成流程
> **參考**: [obra/superpowers](https://github.com/obra/superpowers)

---

## 觸發條件

當使用者需求包含以下關鍵字時，應激活此技能：

- 「Git」、「分支」、「Branch」
- 「Commit」、「提交」
- 「PR」、「Pull Request」
- 「合併」、「Merge」
- 「版本控制」

---

## 一、分支策略

### 1.1 分支類型

```
main (或 master)
  │
  ├── develop          # 開發主分支
  │     │
  │     ├── feature/*  # 功能分支
  │     ├── bugfix/*   # 修復分支
  │     └── refactor/* # 重構分支
  │
  ├── release/*        # 發布分支
  └── hotfix/*         # 緊急修復分支
```

### 1.2 分支命名規範

```bash
# 功能分支
feature/user-authentication
feature/payment-integration
feature/123-add-login  # 可包含 issue 編號

# 修復分支
bugfix/fix-login-error
bugfix/456-null-pointer

# 重構分支
refactor/cleanup-auth-service
refactor/migrate-to-typescript

# 發布分支
release/v1.2.0
release/2025-01

# 緊急修復
hotfix/critical-security-fix
hotfix/v1.2.1
```

---

## 二、Commit 規範

### 2.1 Conventional Commits 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2.2 Type 類型

| Type | 說明 | 範例 |
|------|------|------|
| `feat` | 新功能 | feat: add user login |
| `fix` | Bug 修復 | fix: resolve null pointer |
| `docs` | 文檔變更 | docs: update README |
| `style` | 格式調整（不影響邏輯） | style: format code |
| `refactor` | 重構（不改功能） | refactor: extract helper |
| `test` | 測試相關 | test: add login tests |
| `chore` | 構建/工具變更 | chore: update deps |
| `perf` | 效能優化 | perf: optimize query |

### 2.3 TDD Commit 規範

```bash
# 🔴 Red Phase
git commit -m "test(TDD-Red): add failing test for user validation"

# 🟢 Green Phase
git commit -m "feat(TDD-Green): implement user validation"

# 🔵 Refactor Phase
git commit -m "refactor(TDD-Refactor): extract validation logic"
```

### 2.4 Commit 訊息範例

```bash
# 簡單格式
git commit -m "feat(auth): add password reset functionality"

# 帶 body
git commit -m "fix(api): handle null response from server

The API was returning null in certain edge cases,
causing the frontend to crash. Added null checks
and fallback values.

Fixes #123"

# 破壞性變更
git commit -m "feat(api)!: change response format

BREAKING CHANGE: The API response now uses camelCase
instead of snake_case for all fields."
```

---

## 三、完成分支流程

### 3.1 四步流程

```
┌─────────────────────────────────────────────────────────┐
│                完成分支流程                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Step 1: 驗證測試                                       │
│          └─ npm test（必須全部通過）                     │
│                                                         │
│  Step 2: 確定基底分支                                   │
│          └─ main 或 develop                             │
│                                                         │
│  Step 3: 選擇操作                                       │
│          ├─ 合併到基底分支                              │
│          ├─ 推送並創建 PR                               │
│          ├─ 保留分支                                    │
│          └─ 放棄變更                                    │
│                                                         │
│  Step 4: 執行選擇                                       │
│          └─ 清理 worktree（如適用）                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.2 操作詳解

#### 選項 1: 合併到基底分支

```bash
# 1. 切換到基底分支
git checkout main

# 2. 拉取最新代碼
git pull origin main

# 3. 合併功能分支
git merge feature/user-login

# 4. 驗證測試
npm test

# 5. 推送
git push origin main

# 6. 刪除功能分支
git branch -d feature/user-login
git push origin --delete feature/user-login
```

#### 選項 2: 創建 Pull Request

```bash
# 1. 推送分支
git push -u origin feature/user-login

# 2. 創建 PR
gh pr create \
  --title "feat: add user login functionality" \
  --body "## Summary
- Implemented email/password login
- Added session management
- Added tests

## Test Plan
- [x] Unit tests pass
- [x] E2E tests pass

Closes #123"
```

#### 選項 3: 保留分支

```bash
# 不做任何操作，保留現狀
echo "分支保留為: feature/user-login"
echo "稍後可繼續工作或合併"
```

#### 選項 4: 放棄變更

```bash
# ⚠️ 需要明確確認
echo "確認放棄所有變更？輸入 'discard' 確認"
read confirmation
if [ "$confirmation" = "discard" ]; then
  git checkout main
  git branch -D feature/user-login
  echo "已刪除分支和所有變更"
fi
```

---

## 四、Pull Request 規範

### 4.1 PR 標題格式

```
<type>(<scope>): <subject>

範例:
feat(auth): add user login functionality
fix(api): resolve timeout issue
docs(readme): update installation guide
```

### 4.2 PR 描述模板

```markdown
## Summary
<!-- 簡要描述這個 PR 做了什麼 -->

## Changes
- [ ] 變更 1
- [ ] 變更 2
- [ ] 變更 3

## Test Plan
<!-- 如何驗證這些變更 -->
- [ ] 單元測試通過
- [ ] E2E 測試通過
- [ ] 手動測試完成

## Screenshots
<!-- 如果有 UI 變更，附上截圖 -->

## Related Issues
Closes #123
Related to #456
```

### 4.3 PR 審查清單

```markdown
## Reviewer Checklist
- [ ] 代碼符合專案規範
- [ ] 測試覆蓋充分
- [ ] 無安全問題
- [ ] 文檔已更新
- [ ] Commit 訊息清晰
```

---

## 五、常用命令速查

### 5.1 分支操作

```bash
# 創建並切換分支
git checkout -b feature/new-feature

# 查看所有分支
git branch -a

# 刪除本地分支
git branch -d feature/old-feature

# 刪除遠端分支
git push origin --delete feature/old-feature

# 重命名分支
git branch -m old-name new-name
```

### 5.2 同步操作

```bash
# 拉取並 rebase
git pull --rebase origin main

# 同步 fork
git fetch upstream
git rebase upstream/main

# 推送（強制，謹慎使用）
git push --force-with-lease
```

### 5.3 歷史操作

```bash
# 查看提交歷史
git log --oneline -20

# 修改最後一次 commit
git commit --amend

# 交互式 rebase（整理 commits）
git rebase -i HEAD~3

# 撤銷最後一次 commit（保留變更）
git reset --soft HEAD~1
```

### 5.4 暫存操作

```bash
# 暫存當前變更
git stash

# 恢復暫存
git stash pop

# 查看暫存列表
git stash list
```

---

## 六、Git Worktree（進階）

### 6.1 創建 Worktree

```bash
# 創建新的 worktree
git worktree add ../project-feature feature/new-feature

# 列出所有 worktree
git worktree list

# 刪除 worktree
git worktree remove ../project-feature
```

### 6.2 Worktree 工作流

```bash
# 1. 在主目錄創建功能分支 worktree
cd ~/projects/my-app
git worktree add ../my-app-feature feature/login

# 2. 在 worktree 中工作
cd ../my-app-feature
npm install
npm run dev

# 3. 完成後清理
cd ~/projects/my-app
git worktree remove ../my-app-feature
git branch -d feature/login
```

---

## 七、禁止行為

```markdown
❌ 絕對禁止：
1. 測試失敗時繼續操作
2. 未驗證就合併
3. 未確認就刪除工作
4. 未經請求就 force push
5. 直接在 main 分支開發
6. Commit 訊息不清晰
7. 一個 commit 包含不相關變更
8. 忽略合併衝突
```

---

## 八、自檢清單

### 創建分支時

```markdown
□ 分支名稱符合規範
□ 從正確的基底分支創建
□ 本地和遠端同步
```

### 提交時

```markdown
□ Commit 訊息符合 Conventional Commits
□ 每個 commit 只包含相關變更
□ 測試通過
□ 沒有 console.log 或調試代碼
```

### 完成分支時

```markdown
□ 所有測試通過
□ 與基底分支同步
□ PR 描述完整
□ 請求 Code Review
□ 處理所有反饋
□ 清理已合併分支
```

---

## 參考資源

- [obra/superpowers - finishing-a-development-branch](https://github.com/obra/superpowers)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)

---

**版本**: 1.0.0
**最後更新**: 2025-12-26
