# 並行 Agent 調度技能（Dispatching Parallel Agents）

> **技能 ID**: `dispatching-parallel-agents`
> **版本**: 1.0.0
> **用途**: 並行 subagent 調度、獨立問題並發處理、效率最大化
> **參考**: [obra/superpowers](https://github.com/obra/superpowers)

---

## 觸發條件

當以下情況發生時，應激活此技能：

- 3+ 個獨立問題需要處理
- 問題之間沒有依賴關係
- 需要加速調試或開發
- 多個測試文件獨立失敗

---

## 一、核心原則

```
╔════════════════════════════════════════════════════════════╗
║    每個獨立問題域調度一個 Agent，讓它們並發工作            ║
║  Dispatch one agent per independent problem domain.        ║
║  Let them work concurrently.                               ║
╚════════════════════════════════════════════════════════════╝
```

---

## 二、何時使用

### 2.1 適用場景

```markdown
✅ 使用並行調度：

1. **多個不相關的測試文件失敗**
   - auth.test.ts 失敗
   - payment.test.ts 失敗
   - user.test.ts 失敗
   → 3 個獨立問題，並行處理

2. **多個獨立模組需要開發**
   - UserService 需要重構
   - OrderService 需要新功能
   - NotificationService 需要修復
   → 無共享狀態，並行開發

3. **多個獨立 Bug 需要修復**
   - 登入頁面 CSS 問題
   - API 響應格式錯誤
   - 資料庫查詢效能
   → 不同領域，並行調查
```

### 2.2 不適用場景

```markdown
❌ 避免並行調度：

1. **問題相互關聯**
   - 失敗 A 可能是失敗 B 的結果
   - 需要先解決 A 才能理解 B

2. **共享資源衝突**
   - 多個 Agent 會修改同一文件
   - 可能產生合併衝突

3. **需要完整系統理解**
   - 問題涉及整體架構
   - 需要跨模組分析

4. **數量太少**
   - 只有 1-2 個問題
   - 並行開銷不值得
```

---

## 三、決策流程圖

```
┌─────────────────────────────────────────────────────────────┐
│                  是否使用並行調度？                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Q1: 有多少個獨立問題？                                     │
│      ├─ < 3 → 順序處理                                      │
│      └─ ≥ 3 → 繼續評估                                      │
│                    ↓                                        │
│  Q2: 問題之間有依賴嗎？                                     │
│      ├─ 有依賴 → 順序處理                                   │
│      └─ 無依賴 → 繼續評估                                   │
│                    ↓                                        │
│  Q3: 會修改相同文件嗎？                                     │
│      ├─ 會 → 順序處理（避免衝突）                           │
│      └─ 不會 → ✅ 使用並行調度                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 四、實作結構

### 4.1 四階段流程

```
Stage 1: 識別獨立域
         ↓
Stage 2: 創建聚焦任務
         ↓
Stage 3: 調度並發工作
         ↓
Stage 4: 審查與整合
```

### 4.2 階段詳解

#### Stage 1: 識別獨立域

```markdown
分析失敗/任務，識別獨立問題域：

範例輸入：
- tests/auth.test.ts: 3 failures
- tests/payment.test.ts: 2 failures
- tests/user.test.ts: 1 failure

分析結果：
| 問題域 | 文件 | 失敗數 | 依賴 |
|--------|------|--------|------|
| 認證 | auth.test.ts | 3 | 無 |
| 支付 | payment.test.ts | 2 | 無 |
| 用戶 | user.test.ts | 1 | 無 |

結論：3 個獨立問題域，適合並行處理
```

#### Stage 2: 創建聚焦任務

**每個任務必須包含**：

```markdown
1. **聚焦範圍**
   - 只處理一個問題域
   - 明確的文件邊界

2. **完整上下文**
   - 完整的錯誤訊息
   - 相關的代碼位置
   - 必要的背景信息

3. **明確期望**
   - 預期的交付物
   - 驗證標準
   - 邊界約束
```

**任務模板**：

```markdown
## Agent 任務: [問題域名稱]

### 問題描述
[具體的失敗/問題描述]

### 錯誤詳情
\`\`\`
[完整錯誤訊息]
\`\`\`

### 相關文件
- `[文件路徑 1]`
- `[文件路徑 2]`

### 範圍限制
- ✅ 可修改: [列出可修改的文件]
- ❌ 不可修改: [列出不可動的文件]

### 預期交付
1. 根因分析
2. 修復代碼
3. 驗證測試通過

### 驗證命令
\`\`\`bash
npm test -- [具體測試]
\`\`\`
```

#### Stage 3: 調度並發工作

使用 Claude Code 的 Task 工具調度多個 Agent：

```markdown
## 並行調度

### Agent 1: 認證問題
[調用 Task 工具處理 auth.test.ts]

### Agent 2: 支付問題
[調用 Task 工具處理 payment.test.ts]

### Agent 3: 用戶問題
[調用 Task 工具處理 user.test.ts]

---
等待所有 Agent 完成...
```

#### Stage 4: 審查與整合

```markdown
## 整合報告

### Agent 1 結果
- 狀態: ✅ 成功
- 修改文件: src/auth/validator.ts
- 測試: 3/3 passed

### Agent 2 結果
- 狀態: ✅ 成功
- 修改文件: src/payment/processor.ts
- 測試: 2/2 passed

### Agent 3 結果
- 狀態: ✅ 成功
- 修改文件: src/user/service.ts
- 測試: 1/1 passed

### 整體驗證
\`\`\`bash
npm test
# 輸出: ✅ 6/6 tests passed
\`\`\`

### 衝突檢查
- ✅ 無文件衝突
- ✅ 無邏輯衝突
```

---

## 五、有效的 Agent 提示

### 5.1 三個必要特徵

```markdown
1. **聚焦範圍**
   只關注一個問題域

2. **自包含上下文**
   Agent 不需要額外查詢就能理解問題

3. **明確期望**
   清晰的交付物和驗證標準
```

### 5.2 好的提示 vs 壞的提示

```markdown
❌ 壞的提示：
"修復所有測試"
"看看怎麼回事"
"處理這些錯誤"

✅ 好的提示：
"修復 auth.test.ts 中的 3 個失敗測試。
錯誤訊息顯示 validateToken() 返回 undefined。
請檢查 src/auth/validator.ts 中的 token 處理邏輯。
修復後運行 npm test -- auth 驗證。"
```

---

## 六、常見陷阱

```markdown
🚫 避免這些錯誤：

1. **任務範圍太廣**
   ❌ "修復所有認證問題"
   ✅ "修復 validateToken() 返回 undefined"

2. **缺少上下文**
   ❌ "auth.test.ts 失敗了"
   ✅ [附上完整錯誤訊息和堆棧追蹤]

3. **未定義邊界**
   ❌ "想辦法修好"
   ✅ "只修改 src/auth/，不要動其他模組"

4. **模糊的輸出期望**
   ❌ "修好後告訴我"
   ✅ "提供：根因、修復代碼、驗證結果"
```

---

## 七、實際案例

### 案例：6 個失敗的調試

```markdown
## 問題
6 個測試失敗，分布在 3 個文件：
- auth.test.ts: 2 failures
- payment.test.ts: 3 failures
- notification.test.ts: 1 failure

## 分析
- 3 個獨立問題域
- 無共享依賴
- 不會修改相同文件

## 並行調度
調度 3 個 Agent 並行處理

## 結果
- 完成時間: 1x（相當於處理 1 個問題的時間）
- 衝突: 0
- 效率提升: 3x
```

---

## 八、與其他技能的配合

```markdown
dispatching-parallel-agents
         ↓
    並行處理
         ↓
    ├─ systematic-debugging（每個 Agent 使用）
    ├─ verification-before-completion（驗證結果）
    └─ git-workflow（整合提交）
```

---

## 九、禁止行為

```markdown
❌ 絕對禁止：

1. 並行處理相互依賴的問題
2. 讓多個 Agent 修改同一文件
3. 不提供完整上下文就調度
4. 跳過整合驗證
5. 忽略衝突警告
6. 任務範圍過於寬泛
7. 強行並行處理 < 3 個問題
```

---

## 十、自檢清單

### 調度前

```markdown
□ 確認 ≥ 3 個獨立問題
□ 驗證無依賴關係
□ 確認無共享資源衝突
□ 每個任務有完整上下文
□ 每個任務有明確邊界
```

### 調度後

```markdown
□ 所有 Agent 完成
□ 收集所有結果
□ 檢查文件衝突
□ 執行整體驗證
□ 整合報告完成
```

---

## 參考資源

- [obra/superpowers - dispatching-parallel-agents](https://github.com/obra/superpowers)
- **相關技能**:
  - `systematic-debugging` - 每個 Agent 的調試方法
  - `subagent-driven-development` - 另一種 subagent 使用模式
  - `executing-plans` - 順序執行計畫

---

**版本**: 1.0.0
**最後更新**: 2025-12-26
