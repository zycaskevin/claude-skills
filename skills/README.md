# Claude Code Skills 技能庫

> **用途**: 集中管理所有可用的專業技能模板
> **語言**: 繁體中文
> **版本**: v1.0

---

## 📚 技能索引

### 🏗️ 後端開發

| 技能 ID | 名稱 | 說明 | 狀態 | 文檔 |
|---------|------|------|------|------|
| **crud-development** | CRUD 開發 | 四層架構、Entity/Service/DAO 規範（v2.0 優化版） | ✅ 已完成 | [查看](crud-development.md) |
| **rest-api-design** | REST API 設計 | RESTful 規範、HTTP 方法、版本控制、分頁、錯誤處理（⭐⭐⭐⭐⭐ 推薦） | ✅ 已完成 | [查看](rest-api-design.md) |
| **spring-boot-crud** | Spring Boot CRUD | DDD 四層架構、Aggregate、JPA、功能模組設計（⭐⭐⭐⭐ Java 專用） | ✅ 已完成 | [查看](spring-boot-crud.md) |
| **database-ops** | 資料庫操作 | PostgreSQL/Supabase、RLS、索引、查詢優化（⭐⭐⭐⭐⭐ 推薦） | ✅ 已完成 | [查看](database-ops.md) |

### 🎨 前端開發

| 技能 ID | 名稱 | 說明 | 狀態 | 文檔 |
|---------|------|------|------|------|
| **frontend-design** | 前端設計 | 獨特美學設計、反 AI 通用風格、Production-Grade 代碼 | ✅ 已完成 | [查看](frontend-design.md) |
| **web-artifacts-builder** | 網頁成品建構 | React + shadcn/ui 打包成單一 HTML（⭐⭐⭐⭐ 推薦） | ✅ 已完成 | [查看](web-artifacts-builder.md) |
| ui-pc | PC 端 UI | AForm/AModal/Table 組件開發 | ⏳ 待建立 | - |
| ui-mobile | 移動端 UI | MD UI 組件/響應式設計 | ⏳ 待建立 | - |

### 🔌 整合開發

| 技能 ID | 名稱 | 說明 | 狀態 | 文檔 |
|---------|------|------|------|------|
| **mcp-builder** | MCP 伺服器開發 | 模型上下文協議開發、外部 API 整合（⭐⭐⭐⭐⭐ 強烈推薦） | ✅ 已完成 | [查看](mcp-builder.md) |
| **letta-agent** | Letta Agent 開發 | 持久記憶 AI Agent、多 Agent 協調、MCP 整合（⭐⭐⭐⭐⭐ 強烈推薦） | ✅ 已完成 | [查看](letta-agent.md) |

### 🔧 開發工具

| 技能 ID | 名稱 | 說明 | 狀態 | 文檔 |
|---------|------|------|------|------|
| **skill-creator** | 技能創建 | 標準化技能開發框架、Anthropic 規範 | ✅ 已完成 | [查看](skill-creator.md) |
| **brainstorming** | 設計腦力激盪 | 探索創意/需求/方案，Hook 深度整合 | ✅ 已完成 | [查看](brainstorming.md) |
| **testing** | 測試策略 | TDD/BDD、Vitest/Playwright、單元/整合/E2E（⭐⭐⭐⭐⭐ 推薦） | ✅ 已完成 | [查看](testing.md) |
| **git-workflow** | Git 工作流 | 分支管理、Commit 規範、PR 流程、分支完成（⭐⭐⭐⭐ 推薦） | ✅ 已完成 | [查看](git-workflow.md) |
| **writing-plans** | 撰寫計畫 | 細粒度任務分解、完整代碼範例、TDD 整合（⭐⭐⭐⭐ 推薦） | ✅ 已完成 | [查看](writing-plans.md) |

### 🛡️ 品質保證

| 技能 ID | 名稱 | 說明 | 狀態 | 文檔 |
|---------|------|------|------|------|
| **systematic-debugging** | 系統性除錯 | 四階段根因分析、科學化除錯（⭐⭐⭐⭐⭐ 強烈推薦） | ✅ 已完成 | [查看](systematic-debugging.md) |
| **verification-before-completion** | 完成前驗證 | 強制驗證步驟、防止假完成（⭐⭐⭐⭐⭐ 強烈推薦） | ✅ 已完成 | [查看](verification-before-completion.md) |
| **requesting-code-review** | 請求 Code Review | 預審查清單、嚴重度分類、規格驗證（⭐⭐⭐⭐ 推薦） | ✅ 已完成 | [查看](requesting-code-review.md) |
| **error-handler** | 異常處理規範 | 統一錯誤碼、全局異常處理、日誌脫敏（⭐⭐⭐⭐⭐ 新增） | ✅ 已完成 | [查看](error-handler.md) |
| **security-guard** | 安全防護規範 | OWASP Top 10、XSS/SQL注入防護、認證安全（⭐⭐⭐⭐⭐ 新增） | ✅ 已完成 | [查看](security-guard.md) |

### 💳 業務整合

| 技能 ID | 名稱 | 說明 | 狀態 | 文檔 |
|---------|------|------|------|------|
| **file-storage** | 文件存儲規範 | 雲端存儲整合、預簽名URL、分片上傳（⭐⭐⭐⭐⭐ 新增） | ✅ 已完成 | [查看](file-storage.md) |
| **payment-integration** | 支付整合規範 | Stripe/PayPal、訂單狀態機、Webhook安全（⭐⭐⭐⭐⭐ 新增） | ✅ 已完成 | [查看](payment-integration.md) |

---

## 🎯 技能使用方式

### 方式 1: UserPromptSubmit Hook 自動觸發

當用戶輸入包含關鍵字時，Hook 會自動評估並激活相關技能：

```
用戶: "開發商品管理的 CRUD 功能"
    ↓
UserPromptSubmit Hook 觸發
    ↓
評估: crud-development - 是 - 需要 Entity/Service/DAO 開發
    ↓
激活: Skill('crud-development')
    ↓
AI 按照 crud-development.md 規範生成代碼
```

### 方式 2: 手動調用技能

```
用戶: "請按照 CRUD 開發規範創建訂單模塊"

AI: 我將使用 crud-development 技能...
    [讀取 .claude/skills/crud-development.md]
    [按照規範生成代碼]
```

---

## 📖 已完成技能詳解

### 1. crud-development（CRUD 開發）

**文檔**: [crud-development.md](crud-development.md)

**核心內容**:
- ✅ 四層架構規範（Controller → Service → DAO → Mapper）
- ✅ Entity 規範（繼承 TenantEntity、雪花 ID）
- ✅ Service 規範（禁止繼承 ServiceImpl、MapstructUtils）
- ✅ DAO 規範（buildQueryWrapper()、like/likeCast）
- ✅ Controller 規範（明確路徑）
- ✅ 禁止事項（清單式檢查）
- ✅ 完整範例（從 Entity 到 Controller）

**觸發關鍵字**:
```
CRUD、增刪改查、業務模塊、Entity、Service、DAO、
分頁查詢、新增、修改、刪除
```

**使用場景**:
1. 開發全新業務模塊
2. 擴展現有 CRUD 功能
3. 修復規範問題
4. Code Review 檢查

**範例代碼**:
- Entity: 廣告管理（Ad.java）
- DAO: 查詢條件構建（AdDaoImpl.java）
- Service: 業務邏輯處理（AdServiceImpl.java）
- Controller: HTTP 接口（AdController.java）

---

### 2. rest-api-design（REST API 設計）⭐⭐⭐⭐⭐

**文檔**: [rest-api-design.md](rest-api-design.md)

**核心內容**:

- ✅ REST 成熟度模型（Level 0-3，HATEOAS）
- ✅ 資源建模規範（命名、五大資源模式）
- ✅ HTTP 方法規範（GET/POST/PUT/PATCH/DELETE）
- ✅ 版本控制策略（URI/Header/Content Negotiation）
- ✅ 分頁設計（Offset/Cursor/Page-based）
- ✅ 過濾與排序規範
- ✅ 錯誤處理標準化
- ✅ HATEOAS 超媒體驅動
- ✅ 安全規範（JWT/Rate Limiting）
- ✅ FastAPI + Express.js 完整範例

**觸發關鍵字**:
```
REST API、RESTful、API 設計、端點設計、HTTP 方法、
API 版本控制、分頁設計、API 錯誤處理、HATEOAS
```

**使用場景**:

1. 設計新 RESTful API
2. 重構現有 API 結構
3. API Code Review
4. 微服務 API 設計

**核心規範**:

- **端點命名**: 名詞複數，小寫 + 連字號
- **HTTP 方法**: GET 讀、POST 建、PUT/PATCH 改、DELETE 刪
- **版本控制**: `/api/v1/` URI 版本（推薦）
- **錯誤處理**: 結構化 JSON + 對應狀態碼

**推薦理由**:

- ✅ 涵蓋 API 設計所有關鍵主題
- ✅ 雙框架範例（FastAPI + Express.js）
- ✅ 可直接用於生產環境
- ✅ 與 crud-development 完美搭配

---

### 3. spring-boot-crud（Spring Boot CRUD）⭐⭐⭐⭐

**文檔**: [spring-boot-crud.md](spring-boot-crud.md)

**核心內容**:

- ✅ DDD 四層架構（Domain/Application/Infrastructure/Presentation）
- ✅ Aggregate Root 與 Value Object 設計
- ✅ Repository Port/Adapter 模式
- ✅ JPA Entity 與 Domain 分離
- ✅ 功能模組結構（Feature-Aligned）
- ✅ 統一異常處理
- ✅ 完整 Java 代碼範例

**觸發關鍵字**:
```
Spring Boot CRUD、Spring Data JPA、DDD、領域驅動設計、
四層架構、Aggregate、Repository、Java 後端
```

**使用場景**:

1. Spring Boot 後端開發
2. DDD 架構實作
3. JPA Repository 設計
4. Java 微服務開發

**核心架構**:

```
Presentation → Application → Domain → Infrastructure
(Controller)   (Service)   (Aggregate)  (JPA Adapter)
```

**推薦理由**:

- ✅ Java/Spring Boot 專用最佳實踐
- ✅ DDD 風格清晰分層
- ✅ 可直接用於生產環境
- ✅ 與 rest-api-design 完美搭配

---

### 4. database-ops（資料庫操作）⭐⭐⭐⭐⭐

**文檔**: [database-ops.md](database-ops.md)

**核心內容**:

- ✅ PostgreSQL 核心概念（資料類型、主鍵設計、命名規範）
- ✅ Supabase 整合（CLI、TypeScript Client、類型生成）
- ✅ Row Level Security (RLS) 完整規範
- ✅ 索引策略（B-Tree、GIN、部分索引）
- ✅ 查詢優化（EXPLAIN、N+1、分頁）
- ✅ 遷移管理（Supabase Migration）
- ✅ Realtime 訂閱、RPC 函數、Edge Functions
- ✅ 安全性規範（API Key、SQL 注入防護）

**觸發關鍵字**:
```
資料庫、Database、SQL、PostgreSQL、Postgres、Supabase、
RLS、Row Level Security、建表、索引、查詢優化、遷移
```

**使用場景**:

1. PostgreSQL 資料庫設計
2. Supabase 專案開發
3. 資料庫效能優化
4. RLS 安全策略配置

**核心架構**:

```
┌─────────────────────────────────────────────┐
│              Supabase Stack                 │
├─────────────────────────────────────────────┤
│  Auth (GoTrue) │ Storage │ Edge Functions   │
├─────────────────────────────────────────────┤
│          PostgREST (API Layer)              │
├─────────────────────────────────────────────┤
│     PostgreSQL + RLS + Realtime Server      │
└─────────────────────────────────────────────┘
```

**推薦理由**:

- ✅ 涵蓋 PostgreSQL + Supabase 完整技術棧
- ✅ RLS 安全策略最佳實踐
- ✅ 索引與查詢優化實戰技巧
- ✅ 與 rest-api-design、crud-development 完美搭配

---

### 5. skill-creator（技能創建）

**文檔**: [skill-creator.md](skill-creator.md)

**核心內容**:

- ✅ 三大設計原則（簡潔性、適度自由度、漸進式披露）
- ✅ 標準技能結構（SKILL.md + scripts/references/assets）
- ✅ 六步創建流程（理解→規劃→初始化→編輯→打包→迭代）
- ✅ YAML Frontmatter 規範（name + description 觸發機制）
- ✅ Token 預算管理（元數據 ~25、SKILL.md ~1,250）
- ✅ 禁止事項（無輔助文件、無過度詳細、無未測腳本）
- ✅ 完整範例（API Design Skill）

**觸發關鍵字**:
```
技能開發、創建技能、skill development、新增技能、
技能框架、skill template、技能模板、擴展 Claude、
技能設計、skill design、技能規範
```

**使用場景**:

1. 創建新技能（標準化結構）
2. 技能重構（優化組織方式）
3. 技能審查（檢查最佳實踐）
4. 團隊協作（統一開發規範）

**核心原則**:

- **簡潔性**: "上下文視窗是公共資源"，只包含 Claude 真正需要的信息
- **適度自由度**: 高（文字）→ 中（偽代碼）→ 低（腳本）
- **漸進式披露**: 元數據（總是）→ SKILL.md（觸發時）→ 資源（按需）

---

### 6. brainstorming（設計腦力激盪）

**文檔**: [brainstorming.md](brainstorming.md) | [英文版](brainstorming-en.md)

**核心內容** (v2.0 Phase 2 進階功能):

- ✅ 四階段流程（理解意圖 → 探索方案 → 設計確認 → 自動化執行）
- ✅ 一次一個問題（優先多選題）
- ✅ 2-3 種方案對比（權衡分析 + YAGNI 原則）
- ✅ 分段設計確認（200-300 字/段）
- ✅ 深度 Hook 整合（自動 Git commit + Stop hook）
- ✅ 自動化腳本（brainstorming-commit.sh）
- ✅ 完整範例（用戶認證系統設計）
- ✨ **NEW**: 架構圖自動生成（Mermaid/PlantUML）
- ✨ **NEW**: AI 品質評估（10 維度評分）
- ✨ **NEW**: 紅隊思維審查（安全漏洞掃描）
- ✨ **NEW**: 多語言支援（中文/英文）

**觸發關鍵字**:
```
brainstorm、腦力激盪、創意設計、方案設計、idea、
設計方案、需求分析、架構設計、探索想法
```

**使用場景**:

1. 創意工作前（"我想設計一個新功能"）
2. 需求不明確（"不確定該怎麼實現"）
3. 多種方案選擇（"有幾種做法，哪種最好？"）
4. 架構設計討論（"如何設計這個系統？"）

**核心流程** (v2.0):

```
階段 1: 理解意圖
├─ 一次一個問題（多選題優先）
├─ 理解目的、限制、成功標準
└─ 檢查專案當前狀態

階段 2: 探索方案
├─ 提出 2-3 種方案
├─ 每種方案包含權衡分析
└─ 推薦最佳方案（附理由）

階段 3: 設計確認
├─ 分段展示（200-300 字/段）
└─ 每段後詢問「看起來對嗎？」

階段 3.5: 架構圖自動生成 ✨ NEW
├─ Flowchart（系統架構圖）
├─ Sequence Diagram（流程圖）
└─ Class Diagram（類圖）

階段 3.6: AI 品質評估 + 紅隊審查 ✨ NEW
├─ 10 維度品質評分（0-100 分）
├─ 紅隊思維安全掃描
└─ 自動生成改進建議

階段 4: 自動化執行
├─ 寫入 docs/plans/YYYY-MM-DD-<topic>-design.md
├─ 插入架構圖 + 評估報告
├─ Git add + commit（Conventional Commits）
└─ 觸發 Stop hook（自動整理文檔）
```

**輔助資源**:

- `scripts/brainstorming-commit.sh` - Git 自動提交腳本
- `references/brainstorming-example-design.md` - 完整設計範例（用戶認證系統）
- `brainstorming-en.md` - 英文版技能文檔

**Phase 2 新增功能**:

1. **架構圖自動生成**
   - 支援 3 種圖表類型（Flowchart, Sequence, Class）
   - 自動分析設計文檔並選擇合適圖表
   - Mermaid 語法自動生成

2. **AI 品質評估**
   - 10 維度評分（可擴展性、安全性、效能等）
   - 加權計算總分（0-100）
   - 自動生成改進建議

3. **紅隊思維審查**
   - 掃描 SQL 注入、XSS、CSRF 風險
   - 識別 N+1 查詢、性能瓶頸
   - 嚴重度分級（High/Medium/Low）

4. **多語言支援**
   - 繁體中文版（brainstorming.md）
   - 英文版（brainstorming-en.md）
   - 自動語言檢測

---

### 7. frontend-design（前端設計）

**文檔**: [frontend-design.md](frontend-design.md)

**核心內容**:

- ✅ 反 AI 通用美學（Anti-AI Slop Aesthetics）
- ✅ 設計思維框架（Purpose, Tone, Constraints, Differentiation）
- ✅ 前端美學五大支柱（Typography, Color, Motion, Space, Background）
- ✅ Production-Grade 代碼標準
- ✅ 完整 CSS/HTML 範例
- ✅ 禁止事項清單

**觸發關鍵字**:
```
前端設計、UI 設計、界面設計、frontend design、
網頁設計、web design、CSS、HTML、React 組件、
視覺設計、美學設計、landing page、dashboard
```

**使用場景**:

1. 網頁/組件設計（創建新頁面或組件）
2. 介面重構（優化現有 UI 美學）
3. Landing Page（高轉換率著陸頁）
4. Dashboard（數據可視化儀表板）

**核心理念**:

- **拒絕通用**: 避免過度使用的字體（Inter, Roboto）、陳腐配色（#4F46E5）
- **大膽獨特**: 每個設計都應有明確的美學觀點
- **意圖明確**: 動效用於高影響力時刻，非裝飾
- **精心打磨**: Production-Grade 代碼，可直接用於生產環境

---

### 8. mcp-builder（MCP 伺服器開發）⭐⭐⭐⭐⭐

**文檔**: [mcp-builder.md](mcp-builder.md)

**核心內容**:

- ✅ MCP 協議規範與最佳實踐
- ✅ 四階段開發流程（研究 → 實作 → 審查 → 評估）
- ✅ Python (FastMCP) 完整範例
- ✅ TypeScript (MCP SDK) 完整範例
- ✅ 工具命名規範（`{domain}_{action}_{target}`）
- ✅ 錯誤處理規範（具體建議 + 後續步驟）
- ✅ 回應格式規範（結構化資料 + 人類可讀）
- ✅ Claude Code 整合配置

**觸發關鍵字**:
```
MCP、模型上下文協議、MCP 伺服器、FastMCP、MCP SDK、
外部 API 整合、LLM 工具開發、Claude 工具擴展
```

**使用場景**:

1. 整合外部 API 到 Claude Code
2. 建立可重複使用的工具集
3. 擴展 Claude 能力（資料庫、第三方服務）
4. 企業級 LLM 整合

**推薦理由**:

- ✅ 官方認證的 MCP 開發最佳實踐
- ✅ 直接提升 Claude Code 能力
- ✅ 可整合任何外部服務
- ✅ 未來生態系統的核心

---

### 9. web-artifacts-builder（網頁成品建構）⭐⭐⭐⭐

**文檔**: [web-artifacts-builder.md](web-artifacts-builder.md)

**核心內容**:

- ✅ 五步工作流程（初始化 → 開發 → 打包 → 分享 → 測試）
- ✅ React 18 + TypeScript + Vite + Tailwind CSS
- ✅ 40+ shadcn/ui 組件預配置
- ✅ 單一 HTML 打包（自包含，無需伺服器）
- ✅ 完整初始化和打包腳本
- ✅ 設計規範（反 AI 通用美學）

**觸發關鍵字**:
```
web artifact、網頁成品、單一 HTML、bundle HTML、
React 組件、shadcn、Tailwind、Vite、可分享網頁
```

**使用場景**:

1. 創建可分享網頁（單一 HTML 文件）
2. 快速原型開發（React + shadcn/ui）
3. Claude Artifact（可在對話中分享）
4. 獨立工具頁面（不需部署）

**核心工作流**:

```bash
# 1. 初始化專案
bash .claude/skills/scripts/init-artifact.sh my-app

# 2. 開發代碼
cd my-app && pnpm dev

# 3. 打包成 HTML
bash .claude/skills/scripts/bundle-artifact.sh

# 4. 分享成品
open bundle.html
```

**推薦理由**:

- ✅ 一鍵初始化完整 React 開發環境
- ✅ 40+ 預配置 shadcn/ui 組件
- ✅ 打包成單一 HTML，隨處可用
- ✅ 非常適合快速原型和工具開發

---

### 10. letta-agent（Letta Agent 開發）⭐⭐⭐⭐⭐

**文檔**: [letta-agent.md](letta-agent.md)

**核心內容**:

- ✅ Letta 框架核心概念（Agent、Memory、Tools）
- ✅ 雙層記憶系統（Core Memory + Archival Memory）
- ✅ Agent 創建與配置（TypeScript + Python）
- ✅ 消息處理與流式響應
- ✅ 自定義工具開發
- ✅ MCP 整合支援
- ✅ 多 Agent 協調模式
- ✅ 完整專案結構範例

**觸發關鍵字**:
```
Letta、有狀態 Agent、持久記憶、Agent 記憶系統、
多 Agent 協調、長期學習 Agent、MCP 整合
```

**使用場景**:

1. 構建具有持久記憶的 AI Agent
2. 開發長期學習型助手
3. 多 Agent 協作系統
4. 整合外部工具的智能 Agent

**核心架構**:

```
┌─────────────────────────────────────────────┐
│               Letta Agent                   │
├─────────────────────────────────────────────┤
│  Core Memory    │    Archival Memory        │
│  (工作記憶)     │    (長期存儲)             │
├─────────────────────────────────────────────┤
│             Tools + MCP Integration          │
└─────────────────────────────────────────────┘
```

**推薦理由**:

- ✅ 解決 LLM 無記憶問題的最佳方案
- ✅ 支援 OpenAI、Anthropic、Gemini 多模型
- ✅ 與 MCP 生態系統完美整合
- ✅ 適合構建企業級 AI Agent

---

### 11. testing（測試策略）⭐⭐⭐⭐⭐

**文檔**: [testing.md](testing.md)

**核心內容**:

- ✅ TDD 工作流程（Red-Green-Refactor）
- ✅ 測試金字塔（Unit/Integration/E2E）
- ✅ Vitest 單元測試完整配置
- ✅ Playwright E2E 測試
- ✅ Page Object Model 模式
- ✅ BDD 與 Gherkin 語法
- ✅ 覆蓋率策略與 CI 整合
- ✅ 測試最佳實踐

**觸發關鍵字**:
```
測試、Test、TDD、BDD、Red-Green-Refactor、
單元測試、Unit Test、整合測試、E2E、
Vitest、Jest、Playwright、Coverage
```

**使用場景**:

1. 實施 TDD 開發流程
2. 建立測試自動化
3. 提升代碼品質
4. CI/CD 測試整合

**核心架構**:

```
┌─────────────────────────────────────────────┐
│              測試金字塔                      │
├─────────────────────────────────────────────┤
│           E2E (10%)                         │
│        Integration (20%)                    │
│         Unit (70%)                          │
└─────────────────────────────────────────────┘
```

**推薦理由**:

- ✅ 完整的 TDD/BDD 工作流程
- ✅ 現代測試框架（Vitest + Playwright）
- ✅ 可直接用於生產環境
- ✅ 提升代碼品質和信心

---

## 🛠️ 技能開發指南

### 技能模板結構

每個技能文檔應包含以下章節：

```markdown
# 技能名稱

> 元信息（技能 ID、版本、用途）

## 🎯 觸發條件
- 關鍵字列表
- 使用場景

## 🏗️ 核心規範
- 架構設計
- 編碼規範
- 最佳實踐

## ❌ 禁止事項
- 常見錯誤
- 反模式

## 📖 參考範例
- 完整代碼範例
- 文件路徑

## ✅ 自我檢查清單
- 開發完成後的檢查項

## 💡 記憶口訣
- 快速記憶的口訣
```

### 新增技能步驟

1. **創建技能文檔**
   ```bash
   .claude/skills/[skill-id].md
   ```

2. **更新技能索引**
   - 編輯 `.claude/skills/README.md`
   - 新增技能到對應分類

3. **更新 Hook**
   - 編輯 `.claude/hooks/skill-forced-eval.js`
   - 新增技能到可用列表

4. **測試技能**
   - 使用關鍵字觸發
   - 驗證 AI 是否正確應用規範

---

## 📊 技能統計

| 分類 | 已完成 | 進行中 | 計劃中 | 總計 |
|------|--------|--------|--------|------|
| 後端開發 | 4 | 0 | 0 | 4 |
| 前端開發 | 2 | 0 | 2 | 4 |
| 整合開發 | 2 | 0 | 0 | 2 |
| 開發工具 | 5 | 0 | 0 | 5 |
| 品質保證 | 5 | 0 | 0 | 5 |
| 業務整合 | 2 | 0 | 0 | 2 |
| 行動開發 | 4 | 0 | 0 | 4 |
| DevOps | 1 | 0 | 0 | 1 |
| **總計** | **28** | **0** | **2** | **30** |

**完成度**: 93.3% (28/30)

---

## 🚀 未來規劃

### Phase 1（已完成）
- [x] crud-development（CRUD 開發規範）
- [x] skill-creator（技能創建框架）
- [x] brainstorming（設計腦力激盪）
- [x] 技能索引系統
- [x] UserPromptSubmit Hook 整合

### Phase 2（計劃中）
- [ ] api-development（API 設計規範）
- [ ] database-ops（資料庫操作規範）
- [ ] git-workflow（Git 工作流規範）

### Phase 3（未來）
- [ ] ui-pc（PC 端 UI 開發）
- [ ] ui-mobile（移動端 UI 開發）
- [ ] testing（測試策略）
- [ ] security（安全最佳實踐）
- [ ] performance（效能優化）

---

## 💡 使用建議

### 1. 開發新功能時

```
步驟 1: 分析需求
"我要開發商品管理功能"

步驟 2: 技能自動觸發
Hook 評估 → crud-development: 是

步驟 3: AI 按規範生成
- Entity（繼承 TenantEntity）
- DAO（buildQueryWrapper）
- Service（不繼承 ServiceImpl）
- Controller（明確路徑）
```

### 2. Code Review 時

```
檢查項:
- [ ] Entity 是否繼承 TenantEntity？
- [ ] Service 是否繼承 ServiceImpl？（應禁止）
- [ ] 是否使用 MapstructUtils.convert()？
- [ ] DAO 查詢條件是否在 buildQueryWrapper()？
- [ ] Controller 路徑是否明確？
```

### 3. 學習最佳實踐時

```
直接閱讀技能文檔:
.claude/skills/crud-development.md

包含:
- 為什麼這樣做？（原因）
- 怎麼做？（範例）
- 不要怎麼做？（禁止事項）
```

---

## 📞 貢獻指南

### 如何貢獻新技能？

1. **Fork 專案**
2. **創建技能文檔** (`.claude/skills/your-skill.md`)
3. **遵循模板結構**
4. **提交 Pull Request**

### 技能品質標準

- ✅ 清楚的觸發條件
- ✅ 完整的規範說明
- ✅ 實際的代碼範例
- ✅ 禁止事項清單
- ✅ 自我檢查清單
- ✅ 繁體中文撰寫

---

**版本**: v1.0
**維護者**: Claude Code + zycaskevin
**最後更新**: 2025-12-26
