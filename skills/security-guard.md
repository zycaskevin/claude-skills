# Security Guard - 安全防護規範

> **技能 ID**: security-guard
> **版本**: v1.0
> **用途**: 提供全面的應用程式安全防護指南，涵蓋 OWASP Top 10 及常見安全漏洞

---

## 🎯 觸發條件

### 關鍵字列表
```
安全防護、security、OWASP、XSS、SQL injection、
CSRF、認證安全、授權、加密、敏感數據、
安全審計、漏洞修復、security review
```

### 使用場景
1. **安全審計** - 檢查代碼安全漏洞
2. **新功能開發** - 確保安全最佳實踐
3. **認證授權** - 實現安全的身份驗證
4. **數據保護** - 敏感信息加密存儲

---

## 🏗️ 核心規範

### 1. OWASP Top 10 防護清單

| 威脅 | 防護措施 | 優先級 |
|------|---------|--------|
| A01: 訪問控制失效 | RBAC + 最小權限原則 | 🔴 Critical |
| A02: 加密失敗 | TLS 1.3 + AES-256 | 🔴 Critical |
| A03: 注入攻擊 | 參數化查詢 + 輸入驗證 | 🔴 Critical |
| A04: 不安全設計 | 威脅建模 + 安全設計模式 | 🟠 High |
| A05: 安全配置錯誤 | 安全默認值 + 配置審計 | 🟠 High |
| A06: 過時組件 | 依賴掃描 + 自動更新 | 🟡 Medium |
| A07: 身份驗證失敗 | MFA + 密碼策略 | 🔴 Critical |
| A08: 數據完整性 | 簽名驗證 + CI/CD 安全 | 🟠 High |
| A09: 日誌監控失敗 | 審計日誌 + 告警機制 | 🟡 Medium |
| A10: SSRF | URL 白名單 + 內網隔離 | 🟠 High |

---

### 2. 輸入驗證規範

```typescript
// ✅ 輸入驗證示例
import { z } from 'zod';

const UserInputSchema = z.object({
  email: z.string().email().max(255),
  username: z.string()
    .min(3).max(50)
    .regex(/^[a-zA-Z0-9_]+$/, '只允許字母數字和下劃線'),
  password: z.string()
    .min(8)
    .regex(/[A-Z]/, '需要大寫字母')
    .regex(/[a-z]/, '需要小寫字母')
    .regex(/[0-9]/, '需要數字')
    .regex(/[^A-Za-z0-9]/, '需要特殊字符'),
});

// 使用
const result = UserInputSchema.safeParse(input);
if (!result.success) {
  throw new ValidationError(result.error.issues);
}
```

---

### 3. SQL 注入防護

```java
// ❌ 危險：字符串拼接
String sql = "SELECT * FROM users WHERE id = " + userId;

// ✅ 安全：參數化查詢
@Query("SELECT u FROM User u WHERE u.id = :id")
Optional<User> findById(@Param("id") Long id);

// ✅ 安全：PreparedStatement
PreparedStatement stmt = conn.prepareStatement(
    "SELECT * FROM users WHERE email = ?"
);
stmt.setString(1, email);
```

---

### 4. XSS 防護

```typescript
// 前端：使用安全的渲染方式
// ❌ 危險
element.innerHTML = userInput;

// ✅ 安全
element.textContent = userInput;

// 或使用 DOMPurify
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// 後端：設置安全 Headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});
```

---

### 5. 認證安全

```typescript
// 密碼存儲
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT 安全配置
const jwtConfig = {
  algorithm: 'RS256',        // 使用 RSA，非 HS256
  expiresIn: '15m',          // 短期 token
  issuer: 'your-app',
  audience: 'your-api',
};

// Session 安全
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true,            // HTTPS only
    httpOnly: true,          // 防止 XSS
    sameSite: 'strict',      // 防止 CSRF
    maxAge: 30 * 60 * 1000,  // 30 分鐘
  },
  resave: false,
  saveUninitialized: false,
}));
```

---

### 6. 敏感數據處理

```typescript
// 加密存儲敏感數據
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes

function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

// 日誌脫敏
function sanitizeLog(obj: any): any {
  const sensitive = ['password', 'token', 'secret', 'creditCard', 'ssn'];
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    sensitive.includes(key.toLowerCase()) ? '***REDACTED***' : value
  ));
}
```

---

## ❌ 禁止事項

### 1. 硬編碼敏感信息
```java
// ❌ 絕對禁止
private static final String API_KEY = "sk-abc123xyz";
private static final String DB_PASSWORD = "admin123";

// ✅ 使用環境變量
private final String apiKey = System.getenv("API_KEY");
```

### 2. 使用弱加密算法
```java
// ❌ 禁止
MessageDigest.getInstance("MD5");
MessageDigest.getInstance("SHA1");

// ✅ 使用強加密
MessageDigest.getInstance("SHA-256");
```

### 3. 關閉安全檢查
```java
// ❌ 絕對禁止
SSLContext.getInstance("TLS").init(null, trustAllCerts, null);
httpClient.setHostnameVerifier(NoopHostnameVerifier.INSTANCE);
```

### 4. 過度暴露錯誤信息
```json
// ❌ 暴露敏感信息
{
  "error": "SQLException: Table users, Column password"
}

// ✅ 安全的錯誤響應
{
  "error": "Authentication failed"
}
```

---

## ✅ 安全檢查清單

### 認證與授權
- [ ] 密碼使用 bcrypt/argon2 哈希（rounds ≥ 12）
- [ ] JWT 使用 RS256 算法
- [ ] 實現了速率限制（Rate Limiting）
- [ ] 敏感操作需要 MFA

### 數據保護
- [ ] 所有通信使用 TLS 1.2+
- [ ] 敏感數據加密存儲
- [ ] 日誌已脫敏
- [ ] 數據庫連接使用參數化查詢

### 安全配置
- [ ] 設置了 Security Headers（CSP, HSTS, X-Frame-Options）
- [ ] 生產環境禁用調試模式
- [ ] 錯誤信息不暴露敏感細節
- [ ] 依賴已掃描漏洞

### 輸入輸出
- [ ] 所有用戶輸入已驗證
- [ ] 輸出已編碼（防 XSS）
- [ ] 文件上傳有類型和大小限制
- [ ] URL 重定向使用白名單

---

## 💡 記憶口訣

**輸入輸出**: 驗進編出，白名單優先
**認證授權**: 強哈希，短 Token，最小權限
**數據保護**: TLS 傳輸，AES 存儲，日誌脫敏
**配置安全**: 禁調試，設 Headers，掃依賴
