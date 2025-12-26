# 撰寫計畫技能（Writing Plans）

> **技能 ID**: `writing-plans`
> **版本**: 1.0.0
> **用途**: 詳細實作計畫、細粒度任務分解、完整代碼範例
> **參考**: [obra/superpowers](https://github.com/obra/superpowers)

---

## 觸發條件

當使用者需求包含以下關鍵字時，應激活此技能：

- 「計畫」、「Plan」、「規劃」
- 「實作步驟」、「開發計畫」
- 「怎麼實現」、「如何開發」
- 「任務分解」、「工作拆解」

---

## 一、核心原則

```
╔════════════════════════════════════════════════════════════╗
║   假設工程師對代碼庫零上下文，品味存疑                        ║
║   Write comprehensive implementation plans assuming the     ║
║   engineer has zero context for our codebase and           ║
║   questionable taste.                                      ║
╚════════════════════════════════════════════════════════════╝
```

---

## 二、計畫結構

### 2.1 文檔頭部

```markdown
# [功能名稱] 實作計畫

## 目標
[一句話描述這個功能的目的]

## 架構概述
[2-3 句話描述整體架構設計]

## 技術棧
- 語言: TypeScript
- 框架: Next.js 14
- 資料庫: PostgreSQL + Supabase
- 測試: Vitest + Playwright
```

### 2.2 文件清單

```markdown
## 涉及文件

### 新建文件
| 路徑 | 用途 |
|------|------|
| `src/services/auth.ts` | 認證服務 |
| `src/components/LoginForm.tsx` | 登入表單組件 |
| `tests/auth.test.ts` | 認證測試 |

### 修改文件
| 路徑 | 修改內容 |
|------|----------|
| `src/app/layout.tsx` | 加入 AuthProvider |
| `src/lib/supabase.ts` | 新增 auth helper |
```

---

## 三、任務分解原則

### 3.1 粒度要求

```markdown
每個任務 = 一個 TDD 循環 = 2-5 分鐘

任務結構：
1. 寫失敗測試
2. 驗證失敗
3. 實現最小代碼
4. 驗證通過
5. 提交

❌ 太大：「實現用戶認證」
✅ 剛好：「實現 validateEmail 函數」
```

### 3.2 任務模板

```markdown
### 任務 1: 實現 email 驗證函數

**目標**: 創建驗證 email 格式的工具函數

**步驟**:

1. **寫失敗測試**
   \`\`\`typescript
   // tests/utils/validation.test.ts
   import { describe, it, expect } from 'vitest';
   import { validateEmail } from '@/utils/validation';

   describe('validateEmail', () => {
     it('should return true for valid email', () => {
       expect(validateEmail('user@example.com')).toBe(true);
     });

     it('should return false for invalid email', () => {
       expect(validateEmail('invalid-email')).toBe(false);
     });
   });
   \`\`\`

2. **驗證失敗**
   \`\`\`bash
   npm test -- validation
   # 預期輸出: FAIL - Cannot find module '@/utils/validation'
   \`\`\`

3. **實現代碼**
   \`\`\`typescript
   // src/utils/validation.ts
   export function validateEmail(email: string): boolean {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
   }
   \`\`\`

4. **驗證通過**
   \`\`\`bash
   npm test -- validation
   # 預期輸出: PASS - 2 tests passed
   \`\`\`

5. **提交**
   \`\`\`bash
   git add src/utils/validation.ts tests/utils/validation.test.ts
   git commit -m "feat: add email validation utility"
   \`\`\`

**完成標準**: ✅ 測試通過，代碼已提交
```

---

## 四、核心指導原則

### 4.1 DRY - Don't Repeat Yourself

```markdown
❌ 重複代碼:
validateEmail() 寫在多個文件

✅ 提取公共:
src/utils/validation.ts 統一管理
```

### 4.2 YAGNI - You Aren't Gonna Need It

```markdown
❌ 過度設計:
一開始就支持 10 種認證方式

✅ 只做需要的:
先實現 email/password，後續按需擴展
```

### 4.3 TDD - Test-Driven Development

```markdown
永遠：測試先行

1. 紅燈（寫失敗測試）
2. 綠燈（最小實現）
3. 重構（清理代碼）
```

### 4.4 頻繁提交

```markdown
每完成一個任務就提交

commit 訊息格式:
- feat: 新功能
- fix: 修復
- refactor: 重構
- test: 測試
- docs: 文檔
```

---

## 五、完整計畫範例

```markdown
# 用戶登入功能 實作計畫

## 目標
實現 email/password 登入功能，支持記住登入狀態

## 架構概述
使用 Supabase Auth 進行認證，在 Next.js 中通過 middleware
保護路由，登入狀態存儲在 cookie 中。

## 技術棧
- Next.js 14 (App Router)
- Supabase Auth
- Vitest + Testing Library
- Zod (表單驗證)

---

## 涉及文件

### 新建
| 路徑 | 用途 |
|------|------|
| `src/lib/auth.ts` | 認證 helper 函數 |
| `src/components/LoginForm.tsx` | 登入表單 |
| `src/app/login/page.tsx` | 登入頁面 |
| `tests/auth.test.ts` | 認證測試 |

### 修改
| 路徑 | 修改內容 |
|------|----------|
| `middleware.ts` | 添加路由保護 |

---

## 任務清單

### 任務 1: 創建 email 驗證函數
[詳細步驟如上]

### 任務 2: 創建 password 驗證函數
**目標**: 驗證密碼強度（至少 8 位，包含數字）

**測試代碼**:
\`\`\`typescript
describe('validatePassword', () => {
  it('should return true for strong password', () => {
    expect(validatePassword('MyPass123')).toBe(true);
  });

  it('should return false for weak password', () => {
    expect(validatePassword('weak')).toBe(false);
  });
});
\`\`\`

**實現代碼**:
\`\`\`typescript
export function validatePassword(password: string): boolean {
  return password.length >= 8 && /\d/.test(password);
}
\`\`\`

### 任務 3: 創建 Supabase auth helper
[詳細步驟...]

### 任務 4: 創建 LoginForm 組件
[詳細步驟...]

### 任務 5: 創建登入頁面
[詳細步驟...]

### 任務 6: 添加路由保護 middleware
[詳細步驟...]

---

## 驗收標準

\`\`\`markdown
□ 可以使用 email/password 登入
□ 登入失敗顯示錯誤訊息
□ 登入成功重定向到 dashboard
□ 受保護路由無法未認證訪問
□ 所有測試通過
□ 覆蓋率 > 80%
\`\`\`
```

---

## 六、計畫輸出位置

```bash
docs/plans/YYYY-MM-DD-<feature-name>.md

範例:
docs/plans/2025-12-26-user-login.md
docs/plans/2025-12-27-payment-integration.md
```

---

## 七、執行選項

計畫完成後，提供兩個執行選項：

```markdown
## 下一步

計畫已保存至: `docs/plans/2025-12-26-user-login.md`

請選擇執行方式:

1. **當前會話執行**
   使用 subagent-driven-development，每個任務由新 agent 執行

2. **獨立分支執行**
   創建 Git worktree，在獨立分支執行計畫
```

---

## 八、禁止行為

```markdown
❌ 絕對禁止：
1. 任務粒度超過 5 分鐘
2. 只寫抽象描述不給代碼
3. 跳過測試步驟
4. 不提供具體命令
5. 假設讀者了解代碼庫
6. 遺漏錯誤處理
7. 不說明預期輸出
```

---

## 九、自檢清單

```markdown
□ 目標一句話清楚
□ 架構概述完整
□ 每個任務 2-5 分鐘
□ 包含完整測試代碼
□ 包含完整實現代碼
□ 包含驗證命令和預期輸出
□ 包含 git commit 命令
□ 遵循 DRY/YAGNI/TDD
```

---

## 參考資源

- [obra/superpowers - writing-plans](https://github.com/obra/superpowers)

---

**版本**: 1.0.0
**最後更新**: 2025-12-26
