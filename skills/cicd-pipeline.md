# CI/CD 流水線技能（CI/CD Pipeline）

> **技能 ID**: `cicd-pipeline`
> **版本**: 1.0.0
> **用途**: 自動化構建、測試、部署流程設計 (GitHub Actions 為主)
> **參考**: [GitHub Actions Docs](https://docs.github.com/en/actions)

---

## 觸發條件

當使用者需求包含以下關鍵字時，應激活此技能：

- 「CI/CD」、「流水線」、「Pipeline」
- 「GitHub Actions」、「Workflow」
- 「自動化部署」、「Deploy」、「Build」
- 「持續整合」、「持續交付」

---

## 一、核心原則

```
╔════════════════════════════════════════════════════════════╗
║    自動化一切重複性工作。讓機器做機器擅長的事。              ║
║    快速反饋 (Fast Feedback) 是 CI 的核心價值。               ║
║    Automate everything. Fast feedback is key.              ║
╚════════════════════════════════════════════════════════════╝
```

---

## 二、GitHub Actions 最佳實踐

### 2.1 基礎結構模板

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

# 權限最小化原則
permissions:
  contents: read

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Runtime
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test
```

### 2.2 關鍵策略

| 策略 | 說明 | 範例 |
|:---|:---|:---|
| **版本鎖定** | 始終鎖定 Action 版本 | `uses: actions/checkout@v4` (避免使用 `latest`) |
| **依賴緩存** | 加速構建時間 | `cache: 'npm'` 或 `actions/cache` |
| **權限控制** | 預設權限最小化 | `permissions: contents: read` |
| **矩陣測試** | 多環境並行測試 | `strategy: matrix: node: [18, 20]` |

---

## 三、安全規範 (Security)

### 3.1 Secrets 管理

```markdown
❌ **禁止**：
- 在 workflow 文件中硬編碼密碼/Token
- 直接打印 Secrets 到 Log

✅ **強制**：
- 使用 Repository Secrets: `${{ secrets.API_KEY }}`
- 使用 Environment Secrets 區分環境 (Staging/Prod)
```

### 3.2 危險的觸發器

- ⚠️ **`pull_request_target`**: 此觸發器擁有寫入權限且可訪問 Secrets。**嚴禁**在未經審查的代碼上直接 checkout 和執行（可能導致惡意代碼竊取 Secrets）。
  - *安全用法*: 僅用於標記 Label 或評論，不運行不受信任的代碼。

### 3.3 腳本注入防護

當在 `run` 命令中使用用戶輸入（如 Issue 標題）時，必須小心：

```yaml
# ❌ 危險：可能被 shell injection (如標題為 "a; rm -rf /")
- run: echo "Title: ${{ github.event.issue.title }}"

# ✅ 安全：通過環境變數傳遞
- run: echo "Title: $TITLE"
  env:
    TITLE: ${{ github.event.issue.title }}
```

---

## 四、部署流程 (CD)

### 4.1 Staging 與 Production 分離

建議使用 GitHub Environments 來管理審核流程：

```yaml
deploy-prod:
  needs: test
  runs-on: ubuntu-latest
  environment: 
    name: production
    url: https://api.myapp.com
  
  steps:
    - name: Deploy to Cloud
      # ... 部署步驟
```

### 4.2 Docker 構建範例

```yaml
jobs:
  docker:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write # 允許推送到 GHCR
      
    steps:
      - uses: actions/checkout@v4
      
      - name: Log in to Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/user/app:latest
```

---

## 五、禁止行為

```markdown
❌ 絕對禁止：
1. **Commit `node_modules`**：CI 應自行安裝依賴。
2. **使用 `npm install` 而非 `npm ci`**：CI 環境應保證依賴一致性 (`npm ci` 依賴 package-lock.json)。
3. **忽略 Lint 錯誤**：Lint 失敗應直接中斷 Pipeline。
4. **Skip Tests**：除了緊急 Hotfix，禁止跳過測試部署。
5. **在 CI 中 Debug**：禁止在 CI 腳本中留 `ls -R /` 或 `cat .env` 等偵錯指令。
```

---

## 六、自檢清單

```markdown
□ Workflow 權限已最小化 (permissions top-level key)
□ 使用了 `npm ci` / `yarn install --frozen-lockfile`
□ 第三方 Actions 版本已鎖定 (@vX.Y.Z)
□ Secrets 通過 `${{ secrets.NAME }}` 引用
□ 分支保護規則已啟用 (Require status checks to pass)
```

## 參考資源

- [Security hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Hitchhiker's Guide to GitHub Actions](https://www.youtube.com/watch?v=R8_veQiYBjI)
