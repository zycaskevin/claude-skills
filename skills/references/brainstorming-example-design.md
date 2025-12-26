# 用戶認證系統 設計文檔

**日期**: 2025-12-26
**狀態**: 設計完成
**技能**: brainstorming

---

## 1. 需求理解

### 目標
新增功能 - 為現有系統增加用戶認證能力

### 限制
- 技術棧: Java 17 + Spring Boot 3.2 + PostgreSQL
- 性能要求: 登入響應 < 200ms，支持 500+ 併發
- 時間限制: 2 週內完成 MVP

### 成功標準
- 用戶可以註冊、登入、登出
- JWT Token 有效期管理
- 密碼加密存儲（BCrypt）
- 通過 80%+ 測試覆蓋率

---

## 2. 方案探索

### 方案 A: JWT + Spring Security（推薦）

**核心思路**:
- 使用 Spring Security 提供的認證框架
- JWT Token 存儲在 HTTP-only Cookie
- Redis 緩存 Token 黑名單（登出處理）

**技術棧**:
- Spring Security 6.2
- jjwt 0.12.3
- Redis 7.2

**優點**:
- 框架成熟，社群支持好
- 無狀態設計，易於水平擴展
- Spring Boot 原生整合，開發快速

**缺點**:
- 初次學習成本較高
- Token 刷新機制需要額外實現

**適用場景**:
標準 Web 應用、需要擴展性的系統

---

### 方案 B: Session + Spring Session

**核心思路**:
- 傳統 Session 機制
- Spring Session + Redis 實現分散式 Session

**優點**:
- 實現簡單，容易理解
- Session 管理由框架處理

**缺點**:
- 有狀態設計，擴展性較差
- Redis 成為單點故障風險

**適用場景**:
小型應用、單機部署

---

### 方案 C: OAuth2 + 第三方登入

**核心思路**:
- 整合 Google/GitHub OAuth2
- 自有用戶系統作為備選

**優點**:
- 用戶體驗好（免註冊）
- 安全性由第三方保障

**缺點**:
- 依賴第三方服務
- 實現複雜度高

**適用場景**:
面向消費者產品、需要社交登入

---

## 推薦方案: A（JWT + Spring Security）

**理由**:
1. 符合技術棧要求（Spring Boot）
2. 滿足性能要求（無狀態，易擴展）
3. 2 週時間可完成 MVP（框架成熟）
4. 長期維護成本低

---

## 3. 最終設計

### 3.1 架構概覽

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   前端 UI   │─────▶│  Controller  │─────▶│   Service    │
└─────────────┘      └──────────────┘      └──────────────┘
                            │                      │
                            ▼                      ▼
                     ┌──────────────┐      ┌──────────────┐
                     │  JWT Filter  │      │     DAO      │
                     └──────────────┘      └──────────────┘
                            │                      │
                            ▼                      ▼
                     ┌──────────────┐      ┌──────────────┐
                     │    Redis     │      │  PostgreSQL  │
                     │ (Token 黑名單)│      │ (用戶數據)   │
                     └──────────────┘      └──────────────┘
```

### 3.2 核心組件

**1. UserEntity**
- 繼承 TenantEntity（雪花 ID）
- 欄位: username, passwordHash, email, roles
- 密碼使用 BCrypt 加密

**2. JwtTokenProvider**
- 生成 JWT Token（有效期 24 小時）
- 驗證 Token 有效性
- 解析 Token 獲取用戶信息

**3. AuthenticationService**
- 註冊: 密碼加密 → 存儲用戶
- 登入: 驗證密碼 → 生成 Token
- 登出: Token 加入黑名單

**4. JwtAuthenticationFilter**
- 攔截所有請求
- 提取並驗證 JWT Token
- 設置 Spring Security Context

### 3.3 數據流

**註冊流程**:
```
用戶輸入 → 參數驗證 → 密碼加密 → 存儲數據庫 → 返回成功
```

**登入流程**:
```
用戶輸入 → 查詢用戶 → 驗證密碼 → 生成 JWT → 設置 Cookie → 返回 Token
```

**認證流程**:
```
請求到達 → 提取 Token → 檢查黑名單 → 驗證簽名 → 設置上下文 → 放行請求
```

### 3.4 錯誤處理

| 錯誤場景 | 處理策略 |
|---------|---------|
| 用戶不存在 | 返回 401 Unauthorized |
| 密碼錯誤 | 返回 401，記錄失敗次數（防暴力破解） |
| Token 過期 | 返回 401，前端自動跳轉登入頁 |
| Token 被篡改 | 返回 403 Forbidden，記錄安全日誌 |

### 3.5 測試策略

**單元測試**:
- JwtTokenProvider: Token 生成/驗證/解析
- BCryptPasswordEncoder: 密碼加密/驗證
- AuthenticationService: 註冊/登入/登出邏輯

**整合測試**:
- 完整認證流程（註冊 → 登入 → 訪問受保護資源 → 登出）
- Token 黑名單功能
- 併發登入測試

**E2E 測試**:
- 用戶註冊流程
- 登入後訪問 Dashboard
- 登出後無法訪問受保護頁面

---

## 4. 下一步行動

- [ ] **Week 1: 核心功能實現**
  - [ ] Day 1-2: UserEntity + DAO + Service（TDD）
  - [ ] Day 3-4: JwtTokenProvider + Filter（TDD）
  - [ ] Day 5: 註冊/登入 Controller（TDD）

- [ ] **Week 2: 整合測試 + 優化**
  - [ ] Day 1-2: 整合測試編寫
  - [ ] Day 3: Redis 黑名單整合
  - [ ] Day 4: E2E 測試
  - [ ] Day 5: 性能測試 + 文檔

- [ ] **後續優化**（Phase 2）
  - [ ] Token 刷新機制
  - [ ] 密碼重置功能
  - [ ] 多因子認證（2FA）

---

**設計者**: Claude Code + zycaskevin
**審查狀態**: 待 Code Review
