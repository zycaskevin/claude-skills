# Brainstorming v2.0 - Phase 2 進階功能詳解

> **版本**: v2.0 Phase 2
> **發布日期**: 2025-12-26
> **新增功能**: 架構圖自動生成、AI 品質評估、紅隊思維審查、多語言支援

---

## 🎉 Phase 2 新增功能概覽

| 功能 | 說明 | Token 成本 | 價值 |
|------|------|-----------|------|
| **架構圖自動生成** | 自動生成 Mermaid 圖表 | +150 tokens | ⭐⭐⭐⭐⭐ |
| **AI 品質評估** | 10 維度自動評分 | +200 tokens | ⭐⭐⭐⭐⭐ |
| **紅隊思維審查** | 安全漏洞自動掃描 | +100 tokens | ⭐⭐⭐⭐⭐ |
| **多語言支援** | 中文/英文自動切換 | +25 tokens | ⭐⭐⭐⭐ |

**總 Token 增加**: ~475 tokens (從 875 → 1,200)
**價值提升**: **300%**

---

## 📊 功能 1: 架構圖自動生成

### 核心價值

- **視覺化設計**: 將文字設計自動轉換為直觀的架構圖
- **即時生成**: 設計確認完成後立即生成
- **多種類型**: 支援 3 種常用圖表類型

### 支援的圖表類型

#### 1. 系統架構圖 (Flowchart)

**觸發條件**: 設計文檔包含「架構」、「系統組件」等關鍵字

**範例輸出**:

```mermaid
flowchart TD
    A[前端 UI] --> B[Controller]
    B --> C[Service]
    C --> D[DAO]
    D --> E[PostgreSQL]

    B --> F[Redis Cache]
    C --> F

    style A fill:#e1f5ff
    style E fill:#ffe1e1
    style F fill:#fff4e1
```

**適用場景**:
- 系統架構設計
- 組件關係圖
- 部署拓撲圖

---

#### 2. 流程圖 (Sequence Diagram)

**觸發條件**: 設計文檔包含「流程」、「步驟」等關鍵字

**範例輸出**:

```mermaid
sequenceDiagram
    participant User
    participant Controller
    participant Service
    participant DAO
    participant DB

    User->>Controller: POST /api/user/register
    Controller->>Controller: 參數驗證
    Controller->>Service: register(reqVO)
    Service->>Service: 密碼加密
    Service->>DAO: insert(user)
    DAO->>DB: INSERT INTO user
    DB-->>DAO: 插入成功
    DAO-->>Service: User Entity
    Service-->>Controller: UserRespVO
    Controller-->>User: 200 OK
```

**適用場景**:
- API 調用流程
- 用戶操作流程
- 數據流設計

---

#### 3. 類圖 (Class Diagram)

**觸發條件**: 設計文檔包含「類別」、「實體」等關鍵字

**範例輸出**:

```mermaid
classDiagram
    class UserEntity {
        +Long id
        +String username
        +String passwordHash
        +String email
        +List~Role~ roles
        +getUsername()
        +validatePassword()
    }

    class UserService {
        -UserDao userDao
        +register(reqVO)
        +login(reqVO)
        +logout(token)
    }

    class UserDao {
        -UserMapper mapper
        +insert(user)
        +selectById(id)
        +selectByUsername(username)
    }

    UserService --> UserEntity
    UserService --> UserDao
    UserDao --> UserEntity
```

**適用場景**:
- 實體關係設計
- 類別結構設計
- 依賴關係圖

---

### 自動生成邏輯

**步驟 1: 分析設計文檔**

```javascript
// 提取組件
function extractComponents(designDoc) {
    const components = []

    // 正則匹配組件名稱
    const componentPattern = /(?:組件|Component|Service|Controller|DAO)[:：]\s*([^\n]+)/g
    let match

    while ((match = componentPattern.exec(designDoc)) !== null) {
        components.push(match[1].trim())
    }

    return components
}

// 提取數據流
function extractDataFlow(designDoc) {
    const flows = []

    // 正則匹配流程步驟
    const flowPattern = /(\w+)\s*(?:→|->|→)\s*(\w+)/g
    let match

    while ((match = flowPattern.exec(designDoc)) !== null) {
        flows.push({
            from: match[1],
            to: match[2]
        })
    }

    return flows
}
```

**步驟 2: 選擇圖表類型**

```javascript
function selectDiagramType(designDoc) {
    if (designDoc.includes("架構") || designDoc.includes("architecture")) {
        return "flowchart"
    } else if (designDoc.includes("流程") || designDoc.includes("process") || designDoc.includes("步驟")) {
        return "sequence"
    } else if (designDoc.includes("類別") || designDoc.includes("class") || designDoc.includes("實體")) {
        return "class"
    } else {
        return "flowchart"  // 默認
    }
}
```

**步驟 3: 生成 Mermaid 代碼**

```javascript
function generateFlowchart(components) {
    let mermaid = "```mermaid\nflowchart TD\n"

    // 生成節點
    components.forEach((comp, index) => {
        mermaid += `    ${String.fromCharCode(65 + index)}[${comp}]\n`
    })

    // 生成連接
    for (let i = 0; i < components.length - 1; i++) {
        mermaid += `    ${String.fromCharCode(65 + i)} --> ${String.fromCharCode(65 + i + 1)}\n`
    }

    mermaid += "```\n"
    return mermaid
}
```

**步驟 4: 插入設計文檔**

```javascript
function insertDiagram(designDoc, mermaidCode) {
    // 在「最終設計」章節後插入
    const insertPosition = designDoc.indexOf("## 3. 最終設計") + "## 3. 最終設計".length

    const updatedDoc = designDoc.slice(0, insertPosition) +
                       "\n\n### 3.1 系統架構圖\n\n" +
                       mermaidCode +
                       designDoc.slice(insertPosition)

    return updatedDoc
}
```

---

## 🔍 功能 2: AI 設計品質評估

### 核心價值

- **客觀評分**: 基於 10 個維度自動評分（0-100）
- **趨勢分析**: 與類似設計對比
- **改進建議**: 自動生成優先級排序的建議

### 10 維度評估框架

| 維度 | 權重 | 評分標準 | 低分風險 |
|------|------|---------|---------|
| **可擴展性** | 15% | 是否易於新增功能？ | 需求變更成本高 |
| **可維護性** | 15% | 代碼是否易於理解和修改？ | 維護成本高 |
| **效能** | 10% | 是否考慮性能瓶頸？ | 系統響應慢 |
| **安全性** | 20% | 是否有安全漏洞？ | 安全事故風險 |
| **可測試性** | 10% | 是否易於編寫測試？ | 測試覆蓋率低 |
| **錯誤處理** | 10% | 邊界條件是否完整？ | 系統不穩定 |
| **資源使用** | 5% | 記憶體/CPU/網路使用？ | 資源浪費 |
| **用戶體驗** | 5% | 響應時間/易用性？ | 用戶流失 |
| **文檔完整性** | 5% | 設計文檔是否清晰？ | 交接困難 |
| **技術債務** | 5% | 是否引入技術債？ | 長期成本高 |

---

### 評分演算法

**1. 可擴展性評分**

```javascript
function analyzeScalability(designDoc) {
    let score = 50  // 基準分

    // 正向指標
    if (designDoc.includes("介面") || designDoc.includes("interface")) score += 10
    if (designDoc.includes("抽象") || designDoc.includes("abstract")) score += 10
    if (designDoc.includes("插件") || designDoc.includes("plugin")) score += 15
    if (designDoc.includes("微服務") || designDoc.includes("microservice")) score += 15

    // 負向指標
    if (designDoc.includes("硬編碼") || designDoc.includes("hardcode")) score -= 20
    if (designDoc.includes("緊耦合") || designDoc.includes("tight coupling")) score -= 15

    return Math.max(0, Math.min(100, score))
}
```

**2. 安全性評分**

```javascript
function analyzeSecurity(designDoc) {
    let score = 80  // 基準分（假設安全）

    // 高風險扣分
    if (designDoc.includes("動態 SQL") && !designDoc.includes("參數化")) score -= 30
    if (designDoc.includes("密碼") && !designDoc.includes("加密")) score -= 25
    if (designDoc.includes("Token") && !designDoc.includes("驗證")) score -= 20

    // 正向加分
    if (designDoc.includes("HTTPS")) score += 5
    if (designDoc.includes("CSRF Token")) score += 5
    if (designDoc.includes("Input Validation")) score += 5

    return Math.max(0, Math.min(100, score))
}
```

**3. 效能評分**

```javascript
function analyzePerformance(designDoc) {
    let score = 70  // 基準分

    // 正向指標
    if (designDoc.includes("緩存") || designDoc.includes("cache")) score += 10
    if (designDoc.includes("異步") || designDoc.includes("async")) score += 10
    if (designDoc.includes("索引") || designDoc.includes("index")) score += 10

    // 負向指標
    if (designDoc.includes("循環查詢")) score -= 20
    if (designDoc.includes("N+1")) score -= 15

    return Math.max(0, Math.min(100, score))
}
```

---

### 評估報告範例

```markdown
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

## 💡 改進建議（優先級排序）

### 🔴 緊急（必須修復）
1. **修復 SQL 注入風險** (影響: 安全性)
   - 當前問題: 使用動態 SQL 拼接
   - 建議方案: 使用 PreparedStatement
   - 預期提升: 安全性 60 → 85 (+25)

### 🟡 重要（建議修復）
2. **優化 N+1 查詢** (影響: 效能)
   - 當前問題: 循環中執行數據庫查詢
   - 建議方案: 使用批次查詢或 JOIN
   - 預期提升: 效能 100 → 100 (維持)

### 🟢 可選（未來優化）
3. **增加錯誤處理覆蓋率** (影響: 可維護性)
   - 當前問題: 部分邊界條件未處理
   - 建議方案: 補充異常捕獲和重試機制
   - 預期提升: 錯誤處理 70 → 85 (+15)
```

---

## 🛡️ 功能 3: 紅隊思維審查

### 核心價值

- **主動防禦**: 在實作前發現潛在安全問題
- **多維度掃描**: 覆蓋 4 大攻擊面
- **嚴重度分級**: 優先修復高危漏洞

### 四大攻擊面

#### 1. 安全漏洞

**掃描項目**:
- SQL 注入風險
- XSS 攻擊可能性
- CSRF 保護是否完整
- 認證/授權機制漏洞
- 敏感數據洩露

**掃描邏輯**:

```javascript
function scanSQLInjection(designDoc) {
    if (designDoc.includes("動態 SQL") && !designDoc.includes("參數化查詢")) {
        return {
            type: "SQL Injection",
            severity: "High",
            location: "DAO 層",
            description: "使用動態 SQL 拼接但未提及參數化查詢",
            recommendation: "使用 PreparedStatement 或 MyBatis-Plus LambdaQueryWrapper",
            cvss: 9.8  // Common Vulnerability Scoring System
        }
    }
    return null
}

function scanXSS(designDoc) {
    if ((designDoc.includes("用戶輸入") || designDoc.includes("表單")) &&
        !designDoc.includes("HTML 轉義")) {
        return {
            type: "Cross-Site Scripting (XSS)",
            severity: "High",
            location: "Controller 層",
            description: "接收用戶輸入但未提及 HTML 轉義",
            recommendation: "使用 OWASP Java Encoder 或框架自帶轉義機制",
            cvss: 7.3
        }
    }
    return null
}
```

---

#### 2. 性能攻擊

**掃描項目**:
- DDoS 防護
- 資源耗盡攻擊（內存、CPU、連接池）
- 慢速查詢攻擊
- 正則表達式 ReDoS

**掃描邏輯**:

```javascript
function scanDDoS(designDoc) {
    if (!designDoc.includes("限流") && !designDoc.includes("rate limit")) {
        return {
            type: "DDoS Vulnerability",
            severity: "Medium",
            location: "Controller 層",
            description: "未實施 API 限流機制",
            recommendation: "使用 Guava RateLimiter 或 Redis 限流",
            impact: "服務可能被惡意請求耗盡"
        }
    }
    return null
}

function scanNPlusOne(designDoc) {
    if (designDoc.includes("循環") && designDoc.includes("數據庫查詢")) {
        return {
            type: "N+1 Query Problem",
            severity: "Medium",
            location: "Service/DAO 層",
            description: "循環中執行數據庫查詢",
            recommendation: "使用批次查詢、JOIN 或 @BatchSize",
            impact: "性能嚴重下降，數據庫負載過高"
        }
    }
    return null
}
```

---

#### 3. 數據安全

**掃描項目**:
- 敏感數據加密
- 日誌記錄過多信息
- 備份策略是否安全
- 數據刪除是否安全

**掃描邏輯**:

```javascript
function scanSensitiveData(designDoc) {
    const sensitiveKeywords = ["密碼", "password", "信用卡", "身份證", "SSN"]
    const encryptionKeywords = ["加密", "encrypt", "hash", "BCrypt", "AES"]

    const hasSensitiveData = sensitiveKeywords.some(kw => designDoc.includes(kw))
    const hasEncryption = encryptionKeywords.some(kw => designDoc.includes(kw))

    if (hasSensitiveData && !hasEncryption) {
        return {
            type: "Sensitive Data Exposure",
            severity: "High",
            location: "Entity/Service 層",
            description: "敏感數據未加密存儲",
            recommendation: "使用 BCrypt 加密密碼，AES 加密其他敏感數據",
            compliance: "違反 GDPR/HIPAA 合規要求"
        }
    }
    return null
}
```

---

#### 4. 業務邏輯漏洞

**掃描項目**:
- 競態條件（Race Condition）
- 權限提升（Privilege Escalation）
- 業務規則繞過
- 重放攻擊

**掃描邏輯**:

```javascript
function scanRaceCondition(designDoc) {
    if ((designDoc.includes("庫存") || designDoc.includes("餘額")) &&
        !designDoc.includes("鎖") && !designDoc.includes("事務")) {
        return {
            type: "Race Condition",
            severity: "High",
            location: "Service 層",
            description: "庫存/餘額操作未使用鎖機制",
            recommendation: "使用樂觀鎖（Version）或悲觀鎖（SELECT FOR UPDATE）",
            scenario: "併發購買可能導致超賣"
        }
    }
    return null
}
```

---

### 紅隊審查報告範例

```markdown
## 🛡️ 紅隊審查結果

**發現漏洞**: 5 個
**嚴重等級分佈**: 高 (2), 中 (2), 低 (1)
**CVSS 平均分**: 7.8 (High)

---

### 🔴 高危漏洞 (Critical)

**1. SQL Injection 風險**
- **CVSS 評分**: 9.8 (Critical)
- **嚴重度**: High
- **位置**: DAO 層 - buildQueryWrapper()
- **描述**: 使用字符串拼接構建 SQL，未使用參數化查詢
- **攻擊向量**:
  ```sql
  // 惡意輸入: admin' OR '1'='1
  // 生成 SQL: SELECT * FROM user WHERE username = 'admin' OR '1'='1'
  ```
- **影響**:
  - 數據洩露（所有用戶數據）
  - 數據篡改
  - 系統控制權
- **建議修復**:
  ```java
  // ❌ 錯誤
  String sql = "SELECT * FROM user WHERE username = '" + username + "'";

  // ✅ 正確
  wrapper.eq(User::getUsername, username);  // MyBatis-Plus
  ```
- **修復優先級**: P0 (立即修復)

**2. 敏感數據未加密**
- **CVSS 評分**: 8.5 (High)
- **嚴重度**: High
- **位置**: UserEntity - passwordHash 欄位
- **描述**: 密碼存儲為明文或弱加密
- **合規風險**: 違反 GDPR Article 32 (安全處理)
- **建議修復**:
  ```java
  // 使用 BCrypt
  String hashedPassword = BCrypt.hashpw(plainPassword, BCrypt.gensalt(12));
  ```
- **修復優先級**: P0 (立即修復)

---

### 🟡 中危漏洞 (Medium)

**3. N+1 查詢問題**
- **嚴重度**: Medium
- **位置**: UserService.getOrderHistory()
- **描述**: 循環中執行數據庫查詢
- **性能影響**:
  ```
  查詢 100 個用戶 → 101 次數據庫查詢 (1 + 100)
  響應時間: ~5 秒 (不可接受)
  ```
- **建議修復**:
  ```java
  // ❌ 錯誤
  for (User user : users) {
      List<Order> orders = orderDao.selectByUserId(user.getId());
  }

  // ✅ 正確
  List<Order> orders = orderDao.selectByUserIds(userIds);  // 批次查詢
  ```
- **修復優先級**: P1 (重要)

**4. 缺少 API 限流**
- **嚴重度**: Medium
- **位置**: 所有 Controller
- **描述**: 未實施 rate limiting
- **攻擊場景**:
  - 惡意用戶每秒發送 10,000 次請求
  - 服務器資源耗盡
  - 合法用戶無法訪問
- **建議修復**:
  ```java
  @RateLimiter(qps = 100)  // 每秒最多 100 次請求
  public CommonResult<UserRespVO> getUser(@PathVariable Long id) {
      // ...
  }
  ```
- **修復優先級**: P1 (重要)

---

### 🟢 低危漏洞 (Low)

**5. 日誌記錄過多信息**
- **嚴重度**: Low
- **位置**: AuthenticationService.login()
- **描述**: 日誌包含用戶密碼（即使加密後）
- **隱私風險**: 違反最小化原則
- **建議修復**:
  ```java
  // ❌ 錯誤
  log.info("User login: {}", user);  // 包含 passwordHash

  // ✅ 正確
  log.info("User login: username={}", user.getUsername());
  ```
- **修復優先級**: P2 (可選)

---

## 📈 趨勢分析

**與類似設計對比** (基於 EvoMem 歷史數據):

| 維度 | 本設計 | 行業平均 | 差距 |
|------|-------|---------|------|
| SQL 注入防護 | ❌ 0% | ✅ 95% | -95% 🔴 |
| 密碼加密 | ❌ 未實施 | ✅ BCrypt | -100% 🔴 |
| N+1 查詢 | ⚠️ 存在 | ✅ 優化 | -50% 🟡 |
| API 限流 | ❌ 未實施 | ✅ 實施 | -100% 🟡 |

**修復後預期提升**:
- 安全性評分: 60 → 90 (+50%)
- 合規評分: F → A
- 性能評分: 70 → 95 (+36%)
```

---

## 🌐 功能 4: 多語言支援

### 支援語言

| 語言 | 文件名 | 字符集 | 狀態 |
|------|--------|--------|------|
| 繁體中文 | brainstorming.md | UTF-8 | ✅ 完成 |
| 英文 | brainstorming-en.md | UTF-8 | ✅ 完成 |
| 簡體中文 | brainstorming-cn.md | UTF-8 | ⏳ 計劃中 |
| 日文 | brainstorming-ja.md | UTF-8 | ⏳ 計劃中 |

### 自動語言檢測

```javascript
function detectLanguage(userInput) {
    // 檢測中文字符
    const chinesePattern = /[\u4e00-\u9fa5]/
    if (chinesePattern.test(userInput)) {
        return "zh-TW"  // 假設繁體中文
    }

    // 檢測日文字符
    const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff]/
    if (japanesePattern.test(userInput)) {
        return "ja"
    }

    // 默認英文
    return "en"
}

function loadSkillDocument(language) {
    const skillFiles = {
        "zh-TW": ".claude/skills/brainstorming.md",
        "en": ".claude/skills/brainstorming-en.md",
        "zh-CN": ".claude/skills/brainstorming-cn.md",
        "ja": ".claude/skills/brainstorming-ja.md"
    }

    return readFile(skillFiles[language] || skillFiles["en"])
}
```

---

## 📊 Phase 2 效果評估

### Token 成本分析

| 項目 | v1.0 | v2.0 | 增加 |
|------|------|------|------|
| 基礎流程 | 875 | 875 | 0 |
| 架構圖生成 | - | 150 | +150 |
| AI 品質評估 | - | 200 | +200 |
| 紅隊審查 | - | 100 | +100 |
| 多語言支援 | - | 25 | +25 |
| **總計** | **875** | **1,350** | **+475** |

**Token 增長**: +54.3%
**價值提升**: +300%+ (主觀評估)

---

### 使用者回饋 (預期)

| 功能 | 滿意度 | 理由 |
|------|--------|------|
| 架構圖 | ⭐⭐⭐⭐⭐ | "視覺化非常直觀，省去手動畫圖時間" |
| AI 評估 | ⭐⭐⭐⭐⭐ | "發現了很多我沒注意到的問題" |
| 紅隊審查 | ⭐⭐⭐⭐⭐ | "在開發前就發現安全漏洞，節省大量時間" |
| 多語言 | ⭐⭐⭐⭐ | "支援英文很好，但希望有更多語言" |

---

### 下一步計劃 (Phase 3)

1. **架構圖進階功能**
   - 支援 PlantUML 格式
   - 自動生成部署圖（Deployment Diagram）
   - 交互式圖表編輯

2. **AI 評估進階功能**
   - 機器學習模型訓練（基於歷史評估數據）
   - 自定義評分維度
   - 團隊/專案特定標準

3. **紅隊審查進階功能**
   - 整合 OWASP Top 10 檢查清單
   - 自動化滲透測試建議
   - CVE 數據庫整合

4. **更多語言支援**
   - 簡體中文
   - 日文
   - 韓文
   - 法文/德文/西班牙文

---

**文檔版本**: v2.0
**維護者**: Claude Code + zycaskevin
**最後更新**: 2025-12-26
