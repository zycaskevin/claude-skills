# Brainstorming 技能

> **技能 ID**: brainstorming
> **版本**: v2.0 (Phase 2 進階功能版)
> **用途**: 在實作前探索創意、需求、設計方案
> **Token 預算**: ~4,800 字 (~1,200 tokens)
> **新增功能**: 架構圖自動生成、AI 品質評估、多語言支援

---

## 🎯 觸發條件

### 關鍵字

```
brainstorm、腦力激盪、創意設計、方案設計、idea、
設計方案、需求分析、架構設計、探索想法
```

### 使用場景

1. **創意工作前**: "我想設計一個新功能"
2. **需求不明確**: "不確定該怎麼實現"
3. **多種方案選擇**: "有幾種做法，哪種最好？"

---

## 🏗️ 核心流程

### 階段 1: 理解意圖（Understand）

**目標**: 透過一次一個問題的方式理解需求

**檢查清單**:
- [ ] 專案當前狀態（Git status、文件、文檔）
- [ ] 理解目的（為什麼要做？）
- [ ] 理解限制（技術棧、時間、預算）
- [ ] 理解成功標準（如何判斷成功？）

**提問模式**（優先多選題）:

```markdown
## 問題 [N]: [簡短標題]

[問題描述]

**A. [選項 1]** (推薦/如適用)
- [說明]
- **優點**: ...
- **缺點**: ...

**B. [選項 2]**
- [說明]
- **優點**: ...
- **缺點**: ...

您希望選擇哪一個？（或者有其他想法？）
```

---

### 實際問題範例

**範例 1: 理解功能目標**

```markdown
## 問題 1: 這個功能的主要目標是什麼？

請選擇最符合的描述：

**A. 解決現有問題** (推薦給緊急需求)
- 修復現有系統的 Bug 或性能問題
- **優點**: 優先級高，影響範圍明確，可快速驗證
- **缺點**: 可能是治標不治本，未來需要重構
- **適用場景**: 生產環境故障、用戶投訴、性能瓶頸

**B. 新增功能**
- 擴展系統能力，增加新功能模塊
- **優點**: 提升用戶體驗，增加產品價值
- **缺點**: 需要更多設計時間，可能引入新的複雜度
- **適用場景**: 產品迭代、競爭力提升、用戶需求

**C. 技術債務優化**
- 重構現有代碼，改善架構設計
- **優點**: 長期收益，降低維護成本，提升代碼質量
- **缺點**: 短期無可見效果，需要說服利益相關者
- **適用場景**: 代碼難以維護、頻繁出現 Bug、團隊效率低

您希望選擇哪一個？（或者有其他想法？）
```

---

**範例 2: 理解技術限制**

```markdown
## 問題 2: 這個功能有哪些技術限制？

請選擇所有適用的限制（可多選）：

**A. 技術棧限制**
- 必須使用現有技術棧（Java/Spring Boot/PostgreSQL）
- **影響**: 方案選擇範圍縮小，但學習成本低
- **需考慮**: 現有技術棧是否能滿足需求？

**B. 性能要求**
- 響應時間 < 100ms，支持 1000+ 併發
- **影響**: 需要考慮緩存、異步處理、數據庫優化
- **需考慮**: 是否需要引入 Redis、消息隊列？

**C. 預算/時間限制**
- 必須在 2 週內完成，不能引入新服務
- **影響**: 優先 MVP（最小可行產品），延後非核心功能
- **需考慮**: 哪些功能可以延後？哪些是必需的？

**D. 相容性要求**
- 必須向下相容現有 API，不能破壞舊版本
- **影響**: 需要版本管理、API 設計更複雜
- **需考慮**: 如何優雅地處理舊版本？

請選擇所有適用的限制：____
```

---

**範例 3: 理解成功標準**

```markdown
## 問題 3: 如何判斷這個功能成功？

請選擇最重要的成功指標：

**A. 功能完整性** (推薦給 MVP)
- 核心功能可用，滿足基本需求
- **驗收標準**:
  - 用戶可以完成核心流程（如：註冊 → 登入 → 使用）
  - 通過基本測試用例
- **適用場景**: 快速驗證想法、早期產品

**B. 性能指標**
- 響應時間、吞吐量、資源使用率達標
- **驗收標準**:
  - 平均響應時間 < 100ms
  - 支持 1000+ 併發用戶
  - CPU/記憶體使用率 < 70%
- **適用場景**: 高流量系統、性能敏感應用

**C. 用戶體驗**
- 用戶滿意度高，操作流暢
- **驗收標準**:
  - NPS (Net Promoter Score) > 50
  - 用戶完成率 > 80%
  - 錯誤率 < 1%
- **適用場景**: 面向消費者產品、競爭激烈市場

**D. 代碼質量**
- 可維護、可測試、可擴展
- **驗收標準**:
  - 測試覆蓋率 > 80%
  - Cyclomatic Complexity < 10
  - 技術債務評分 A 級
- **適用場景**: 長期維護專案、團隊協作

您希望選擇哪一個作為主要成功標準？____
```

---

### 階段 2: 探索方案（Explore）

**目標**: 提出 2-3 種方案並分析權衡

**方案模板**:

```markdown
## 方案探索

### 方案 A: [名稱] (推薦)
**核心思路**: ...
**技術棧**: ...
**優點**:
- ...
**缺點**:
- ...
**適用場景**: ...

### 方案 B: [名稱]
...

### 方案 C: [名稱]
...

---

## 推薦方案: A
**理由**: ...
```

**YAGNI 原則**:
- ❌ 刪除「可能未來需要」的功能
- ✅ 只保留「現在確定需要」的功能
- 📝 記錄被刪除的想法（供未來參考）

---

### 階段 3: 設計確認（Design）

**目標**: 分段展示設計，每段後確認

**設計章節**（每段 200-300 字）:

1. **架構概覽**
   - 系統組件
   - 數據流
   - 關鍵接口

2. **核心組件**
   - 組件 A
   - 組件 B
   - 組件 C

3. **數據流與狀態管理**
   - 輸入 → 處理 → 輸出
   - 狀態變更邏輯

4. **錯誤處理與邊界條件**
   - 常見錯誤場景
   - 處理策略

5. **測試策略**
   - 單元測試
   - 整合測試
   - E2E 測試

**確認方式**:
每段後詢問：「這部分看起來對嗎？需要調整嗎？」

---

### 階段 3.5: 架構圖自動生成（NEW in v2.0）

**目標**: 設計確認完成後，自動生成 Mermaid 架構圖

**支援圖表類型**:

1. **系統架構圖** (Flowchart)
   ```mermaid
   flowchart TD
       A[前端 UI] --> B[Controller]
       B --> C[Service]
       C --> D[DAO]
       D --> E[Database]
   ```

2. **流程圖** (Sequence Diagram)
   ```mermaid
   sequenceDiagram
       User->>Controller: HTTP Request
       Controller->>Service: 業務邏輯
       Service->>DAO: 數據查詢
       DAO->>Database: SQL
       Database-->>DAO: 結果
       DAO-->>Service: Entity
       Service-->>Controller: DTO
       Controller-->>User: JSON Response
   ```

3. **類圖** (Class Diagram)
   ```mermaid
   classDiagram
       class UserEntity {
           +Long id
           +String username
           +String email
       }
       class UserService {
           +register()
           +login()
       }
       UserService --> UserEntity
   ```

**自動生成邏輯**:

```javascript
// 步驟 1: 分析設計文檔
const components = extractComponents(designDoc)
const dataFlow = extractDataFlow(designDoc)

// 步驟 2: 選擇合適的圖表類型
if (designDoc.includes("架構")) {
    generateFlowchart(components)
} else if (designDoc.includes("流程")) {
    generateSequenceDiagram(dataFlow)
} else if (designDoc.includes("類別")) {
    generateClassDiagram(components)
}

// 步驟 3: 插入設計文檔
insertDiagram(designDoc, mermaidCode)
```

**完成提示**:
```
✅ 架構圖已生成！

📊 圖表類型: Flowchart (系統架構圖)
📏 組件數量: 5 個
📝 已插入到: docs/plans/YYYY-MM-DD-<topic>-design.md
```

---

### 階段 3.6: AI 設計品質評估 + 紅隊審查（NEW in v2.0）

**目標**: 使用 AI 自動評估設計品質，並透過紅隊思維找出潛在問題

#### 品質評估（10 維度）

| 維度 | 評分標準 | 權重 |
|------|---------|------|
| **可擴展性** | 是否易於新增功能？| 15% |
| **可維護性** | 代碼是否易於理解和修改？| 15% |
| **效能** | 是否考慮性能瓶頸？| 10% |
| **安全性** | 是否有安全漏洞？| 20% |
| **可測試性** | 是否易於編寫測試？| 10% |
| **錯誤處理** | 邊界條件是否完整？| 10% |
| **資源使用** | 記憶體/CPU/網路使用？| 5% |
| **用戶體驗** | 響應時間/易用性？| 5% |
| **文檔完整性** | 設計文檔是否清晰？| 5% |
| **技術債務** | 是否引入技術債？| 5% |

**評分邏輯**:

```javascript
// 自動評估函數
function evaluateDesign(designDoc) {
    const scores = {
        scalability: analyzeScalability(designDoc),    // 可擴展性
        maintainability: analyzeMaintainability(designDoc), // 可維護性
        performance: analyzePerformance(designDoc),     // 效能
        security: analyzeSecurity(designDoc),           // 安全性
        testability: analyzeTestability(designDoc),     // 可測試性
        errorHandling: analyzeErrorHandling(designDoc), // 錯誤處理
        resourceUsage: analyzeResources(designDoc),     // 資源使用
        userExperience: analyzeUX(designDoc),           // 用戶體驗
        documentation: analyzeDocumentation(designDoc), // 文檔完整性
        technicalDebt: analyzeTechnicalDebt(designDoc)  // 技術債務
    }

    // 加權計算總分
    const totalScore = calculateWeightedScore(scores)

    return {
        totalScore: totalScore,  // 0-100 分
        breakdown: scores,
        recommendations: generateRecommendations(scores)
    }
}
```

#### 紅隊思維審查（Red Team Thinking）

**攻擊面分析**:

1. **安全漏洞**
   - SQL 注入風險
   - XSS 攻擊可能性
   - CSRF 保護是否完整
   - 認證/授權機制漏洞

2. **性能攻擊**
   - DDoS 防護
   - 資源耗盡攻擊
   - 慢速查詢攻擊

3. **數據安全**
   - 敏感數據洩露
   - 日誌記錄過多信息
   - 備份策略是否安全

4. **業務邏輯漏洞**
   - 競態條件
   - 權限提升
   - 繞過業務規則

**紅隊審查邏輯**:

```javascript
function redTeamReview(designDoc) {
    const vulnerabilities = []

    // 1. 掃描 SQL 注入風險
    if (designDoc.includes("動態 SQL") && !designDoc.includes("參數化查詢")) {
        vulnerabilities.push({
            type: "SQL Injection",
            severity: "High",
            description: "使用動態 SQL 但未提及參數化查詢",
            recommendation: "使用 PreparedStatement 或 ORM 框架"
        })
    }

    // 2. 掃描認證漏洞
    if (designDoc.includes("JWT") && !designDoc.includes("黑名單")) {
        vulnerabilities.push({
            type: "Authentication Bypass",
            severity: "Medium",
            description: "JWT 登出機制不完整",
            recommendation: "實現 Token 黑名單機制"
        })
    }

    // 3. 掃描性能風險
    if (designDoc.includes("循環") && designDoc.includes("數據庫查詢")) {
        vulnerabilities.push({
            type: "N+1 Query Problem",
            severity: "Medium",
            description: "可能存在 N+1 查詢問題",
            recommendation: "使用批次查詢或 JOIN"
        })
    }

    return {
        totalVulnerabilities: vulnerabilities.length,
        criticalCount: vulnerabilities.filter(v => v.severity === "High").length,
        details: vulnerabilities
    }
}
```

**評估報告格式**:

````markdown
## 🔍 AI 設計品質評估報告

### 總體評分: 78/100 (良好)

**評分分佈**:
```
可擴展性:   ████████░░ 80/100
可維護性:   ███████░░░ 70/100
效能:       ██████████ 100/100
安全性:     ██████░░░░ 60/100 ⚠️
可測試性:   █████████░ 90/100
錯誤處理:   ███████░░░ 70/100
資源使用:   ████████░░ 80/100
用戶體驗:   █████████░ 90/100
文檔完整性: ████████░░ 80/100
技術債務:   ████████░░ 80/100
```

---

## 🛡️ 紅隊審查結果

**發現漏洞**: 3 個
**嚴重等級分佈**: 高 (1), 中 (2), 低 (0)

### 高危漏洞

**1. SQL Injection 風險**
- **嚴重度**: High
- **位置**: DAO 層查詢條件構建
- **描述**: 使用動態 SQL 但未提及參數化查詢
- **建議**: 使用 PreparedStatement 或 MyBatis-Plus 的 LambdaQueryWrapper

### 中危漏洞

**2. JWT 登出機制不完整**
- **嚴重度**: Medium
- **位置**: AuthenticationService.logout()
- **描述**: JWT 登出後 Token 仍可使用
- **建議**: 實現 Redis Token 黑名單機制

**3. N+1 查詢問題**
- **嚴重度**: Medium
- **位置**: UserService.getOrderHistory()
- **描述**: 循環中執行數據庫查詢
- **建議**: 使用批次查詢或 LEFT JOIN

---

## 💡 改進建議（優先級排序）

### 🔴 緊急（必須修復）
1. **修復 SQL 注入風險**
   - 將所有動態 SQL 改為參數化查詢
   - 使用 MyBatis-Plus 的 Wrapper 而非拼接 SQL

### 🟡 重要（建議修復）
2. **完善 JWT 登出機制**
   - 引入 Redis 存儲 Token 黑名單
   - 設置黑名單 TTL = Token 有效期

3. **優化 N+1 查詢**
   - 重構 getOrderHistory() 使用批次查詢
   - 考慮使用 @BatchSize 或自定義查詢

### 🟢 可選（未來優化）
4. **增加錯誤處理覆蓋率**
   - 補充邊界條件處理
   - 增加重試機制

---

## 📈 趨勢分析

與類似設計對比:
- 安全性: **低於平均** (60 vs 75)
- 效能: **優於平均** (100 vs 85)
- 可維護性: **持平** (70 vs 70)
````

**完成提示**:

```
✅ AI 品質評估完成！

📊 總體評分: 78/100 (良好)
🛡️ 發現漏洞: 3 個 (高危 1, 中危 2)
💡 改進建議: 4 項 (緊急 1, 重要 2, 可選 1)
📄 完整報告已插入設計文檔
```

---

### 階段 4: 自動化執行（Automate）

**文件生成**:
```bash
docs/plans/YYYY-MM-DD-<topic>-design.md
```

**內容結構**:
```markdown
# [主題] 設計文檔

**日期**: YYYY-MM-DD
**狀態**: 設計完成
**技能**: brainstorming

---

## 1. 需求理解
[階段 1 的結論]

## 2. 方案探索
[階段 2 的 2-3 種方案]

## 3. 最終設計
[階段 3 的完整設計]

## 4. 下一步行動
- [ ] 任務 1
- [ ] 任務 2
- [ ] 任務 3
```

---

### 自動化執行邏輯（偽代碼）

**步驟 1: 生成文檔路徑與內容**

```javascript
// 生成文件名
const today = formatDate(new Date(), 'YYYY-MM-DD')
const topic = sanitizeFilename(userTopic) // 移除特殊字符
const filename = `docs/plans/${today}-${topic}-design.md`

// 編譯設計內容
const content = `
# ${userTopic} 設計文檔

**日期**: ${today}
**狀態**: 設計完成
**技能**: brainstorming

---

## 1. 需求理解
${stage1_conclusions}

## 2. 方案探索
${stage2_solutions}

## 3. 最終設計
${stage3_design}

## 4. 下一步行動
${generateTodoList()}
`

// 寫入文件
writeFile(filename, content)
```

**步驟 2: Git 自動提交**

```bash
# 檢查 Git 狀態
if not isGitRepo():
    print("⚠️ 非 Git 專案，跳過 Git 操作")
    return

# 添加文件
git add ${filename}

# 生成 Commit 訊息
commitMessage = `docs(brainstorming): 完成 ${topic} 設計文檔

- 探索 ${solutionCount} 種方案
- 選定方案: ${chosenSolution.name}
- 涵蓋: 架構/組件/數據流/測試

🧠 Generated via Brainstorming Skill`

# 提交
git commit -m "${commitMessage}"

# 推送（可選）
if userConfirm("是否推送到遠端？"):
    git push origin main
```

**步驟 3: 觸發 Stop Hook**

```javascript
// Stop Hook 會自動偵測 docs/plans/ 新文件
// 無需手動觸發，AI 回應完成後自動執行

// Hook 執行內容:
// 1. updateReadme() - 更新專案 README
// 2. organizeFiles() - 整理文件結構
// 3. displayTokenUsage() - 顯示 Token 統計
```

**步驟 4: 完成提示**

```javascript
console.log(`
✅ Brainstorming 完成！

📄 設計文檔: ${filename}
🎯 Git commit: ${getLastCommitHash()}
📊 Token 使用: ${calculateTokens()} tokens

下一步建議:
1. 開始實作（建議使用 TDD 流程）
2. 召喚 小程 Agent 協助開發
3. 使用 EvoMem 查詢類似實作經驗
`)
```

---

## ❌ 禁止事項

| 禁止行為 | 正確做法 |
|---------|---------|
| ❌ 一次問多個問題 | ✅ 一次一個問題 |
| ❌ 直接給出單一方案 | ✅ 提供 2-3 種方案比較 |
| ❌ 設計文檔一次性全部展示 | ✅ 分段展示，每段確認 |
| ❌ 手動創建 Git commit | ✅ 自動化 Git 操作 |
| ❌ 保留「可能需要」的功能 | ✅ YAGNI 原則嚴格執行 |

---

## ✅ 自我檢查清單

### 階段 1: 理解意圖
- [ ] 一次只問一個問題
- [ ] 優先使用多選題
- [ ] 理解目的、限制、成功標準

### 階段 2: 探索方案
- [ ] 提出 2-3 種方案
- [ ] 每種方案有權衡分析
- [ ] 明確推薦方案 + 理由
- [ ] 應用 YAGNI 原則

### 階段 3: 設計確認
- [ ] 每段 200-300 字
- [ ] 每段後確認
- [ ] 涵蓋 5 個核心章節

### 階段 4: 自動化執行
- [ ] 文件寫入 docs/plans/
- [ ] Git commit 自動執行
- [ ] Stop hook 自動觸發
- [ ] 完成提示清晰

---

## 💡 記憶口訣

```
理解意圖一次一問，多選優先邏輯清
探索方案二到三種，權衡分析 YAGNI 行
設計確認分段展示，每段確認不貪快
自動執行 Hook 整合，文檔 Git 一氣成
```

---

## 📚 參考資源

**Hook 整合**:
- `.claude/hooks/stop.js` - 自動觸發點
- `.claude/hooks/skill-forced-eval.js` - 技能激活

**Git 規範**:
- [Conventional Commits](https://www.conventionalcommits.org/)
- `.claude/hooks/user-prompt-submit.js` - Commit 格式檢查

**設計模板**:
- `docs/plans/` - 歷史設計文檔參考
- `.claude/skills/references/brainstorming-example-design.md` - 完整範例
- `EvoMem` - 查詢類似設計經驗

**自動化腳本**:
- `.claude/skills/scripts/brainstorming-commit.sh` - Git 自動提交腳本

---

**版本**: v1.0
**變更**: 深度整合 Hook 系統、Git 自動化、Token 優化
**維護者**: Claude Code + zycaskevin
**最後更新**: 2025-12-26
