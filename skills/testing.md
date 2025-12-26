# 測試策略技能（Testing Strategy）

> **技能 ID**: `testing`
> **版本**: 1.0.0
> **用途**: TDD/BDD 流程、單元/整合/E2E 測試、Vitest/Playwright 最佳實踐
> **參考**:
> - [Vitest Docs](https://vitest.dev)
> - [Playwright Docs](https://playwright.dev)
> - [TDD Guard](https://github.com/nizos/tdd-guard)

---

## 觸發條件

當使用者需求包含以下關鍵字時，應激活此技能：

- 「測試」、「Test」、「Testing」
- 「TDD」、「BDD」、「Red-Green-Refactor」
- 「單元測試」、「Unit Test」
- 「整合測試」、「Integration Test」
- 「E2E」、「端到端測試」、「Playwright」
- 「Vitest」、「Jest」、「pytest」
- 「測試覆蓋率」、「Coverage」

---

## 一、測試金字塔

### 1.1 測試層級

```
                    ┌─────────┐
                    │   E2E   │ ← 少量、關鍵流程
                    │ Tests   │   (Playwright)
                   ─┴─────────┴─
                  ┌─────────────┐
                  │ Integration │ ← 中等數量
                  │   Tests     │   (API、組件整合)
                 ─┴─────────────┴─
                ┌─────────────────┐
                │   Unit Tests    │ ← 大量、快速
                │                 │   (Vitest/Jest)
                └─────────────────┘
```

### 1.2 測試比例建議

| 層級 | 比例 | 執行時間 | 工具 |
|------|------|----------|------|
| Unit | 70% | 毫秒級 | Vitest, Jest, pytest |
| Integration | 20% | 秒級 | Testing Library, Supertest |
| E2E | 10% | 分鐘級 | Playwright, Cypress |

---

## 二、TDD 工作流程

### 2.1 Red-Green-Refactor 循環

```
┌─────────────────────────────────────────────────────────┐
│                   TDD 循環                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────┐    ┌─────────┐    ┌──────────┐           │
│   │  🔴 Red  │ → │ 🟢 Green │ → │ 🔵 Refactor│          │
│   │ 寫失敗  │    │ 最小實現│    │  優化代碼 │           │
│   │ 的測試  │    │ 通過測試│    │  保持綠燈 │           │
│   └────┬────┘    └────┬────┘    └─────┬────┘           │
│        │              │               │                 │
│        └──────────────┴───────────────┘                 │
│                       ↓                                 │
│              重複直到功能完成                            │
└─────────────────────────────────────────────────────────┘
```

### 2.2 TDD 規則

```markdown
✅ TDD 三原則：
1. 只有失敗的測試才能寫新的生產代碼
2. 只寫剛好讓測試失敗的測試代碼（編譯失敗也算失敗）
3. 只寫剛好讓測試通過的生產代碼

✅ 正確流程：
1. 🔴 寫一個會失敗的測試
2. 🟢 寫最少的代碼讓測試通過
3. 🔵 重構代碼，保持測試通過
4. 重複

❌ 禁止：
- 先寫實現代碼再補測試
- 跳過紅燈階段
- 一次寫太多測試
- 重構時改變行為
```

### 2.3 TDD Git Commit 規範

```bash
# 🔴 Red Phase
git add tests/
git commit -m "test(TDD-Red): add failing test for user login"

# 🟢 Green Phase
git add src/
git commit -m "feat(TDD-Green): implement user login"

# 🔵 Refactor Phase
git add src/
git commit -m "refactor(TDD-Refactor): extract login validation"
```

---

## 三、Vitest 單元測試

### 3.1 專案設置

```bash
# 安裝 Vitest
npm install -D vitest @vitest/coverage-v8

# 安裝測試工具
npm install -D @testing-library/react @testing-library/jest-dom
```

### 3.2 配置文件

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // 測試環境
    environment: 'jsdom',

    // 全域設置
    globals: true,
    setupFiles: ['./tests/setup.ts'],

    // 覆蓋率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },

    // 包含/排除
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', 'e2e'],

    // 監視模式
    watch: false,

    // 報告器
    reporters: ['verbose', 'html'],
  },
});
```

### 3.3 測試設置文件

```typescript
// tests/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// 每個測試後清理
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// 全域 Mock
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
}));
```

### 3.4 測試範例

```typescript
// src/utils/calculator.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Cannot divide by zero');
  return a / b;
}
```

```typescript
// tests/utils/calculator.test.ts
import { describe, it, expect } from 'vitest';
import { add, divide } from '@/utils/calculator';

describe('Calculator', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(add(-1, 1)).toBe(0);
    });

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
    });

    it('should handle decimal results', () => {
      expect(divide(7, 2)).toBe(3.5);
    });
  });
});
```

### 3.5 React 組件測試

```typescript
// tests/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/Button';

describe('Button Component', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should apply variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });
});
```

### 3.6 Mock 與 Spy

```typescript
// tests/services/api.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchUser } from '@/services/api';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Service', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch user successfully', async () => {
    const mockUser = { id: 1, name: 'John' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });

    const user = await fetchUser(1);

    expect(mockFetch).toHaveBeenCalledWith('/api/users/1');
    expect(user).toEqual(mockUser);
  });

  it('should throw error on failed request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchUser(999)).rejects.toThrow('User not found');
  });
});
```

---

## 四、Playwright E2E 測試

### 4.1 專案設置

```bash
# 初始化 Playwright
npm init playwright@latest

# 或手動安裝
npm install -D @playwright/test
npx playwright install
```

### 4.2 配置文件

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 測試目錄
  testDir: './e2e',

  // 並行執行
  fullyParallel: true,

  // CI 禁止 .only
  forbidOnly: !!process.env.CI,

  // 重試次數
  retries: process.env.CI ? 2 : 0,

  // 並行數
  workers: process.env.CI ? 1 : undefined,

  // 報告器
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // 全域設置
  use: {
    // 基礎 URL
    baseURL: 'http://localhost:3000',

    // 收集追蹤
    trace: 'on-first-retry',

    // 截圖
    screenshot: 'only-on-failure',

    // 視頻
    video: 'retain-on-failure',
  },

  // 瀏覽器配置
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // 移動端
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // 開發伺服器
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### 4.3 E2E 測試範例

```typescript
// e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // 等待重定向
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('should persist login state', async ({ page, context }) => {
    // 登入
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/dashboard');

    // 新頁面應保持登入狀態
    const newPage = await context.newPage();
    await newPage.goto('/dashboard');
    await expect(newPage.getByText(/welcome/i)).toBeVisible();
  });
});
```

### 4.4 Page Object Model

```typescript
// e2e/pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.submitButton = page.getByRole('button', { name: /sign in/i });
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}
```

```typescript
// e2e/auth/login-pom.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login with POM', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully', async ({ page }) => {
    await loginPage.login('user@example.com', 'password123');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.login('wrong@example.com', 'wrong');
    await loginPage.expectError('Invalid credentials');
  });
});
```

### 4.5 API 測試

```typescript
// e2e/api/users.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Users API', () => {
  test('should create a new user', async ({ request }) => {
    const response = await request.post('/api/users', {
      data: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    });

    expect(response.ok()).toBeTruthy();

    const user = await response.json();
    expect(user).toMatchObject({
      name: 'John Doe',
      email: 'john@example.com',
    });
    expect(user.id).toBeDefined();
  });

  test('should get user by id', async ({ request }) => {
    const response = await request.get('/api/users/1');

    expect(response.ok()).toBeTruthy();

    const user = await response.json();
    expect(user.id).toBe(1);
  });

  test('should return 404 for non-existent user', async ({ request }) => {
    const response = await request.get('/api/users/99999');

    expect(response.status()).toBe(404);
  });
});
```

---

## 五、測試最佳實踐

### 5.1 測試命名規範

```typescript
// ✅ 好的命名：描述行為和預期結果
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid email', () => {});
    it('should throw error when email is invalid', () => {});
    it('should hash password before saving', () => {});
  });
});

// ❌ 壞的命名：不清楚測什麼
describe('tests', () => {
  it('test1', () => {});
  it('works', () => {});
});
```

### 5.2 AAA 模式

```typescript
it('should calculate total with discount', () => {
  // Arrange（準備）
  const cart = new ShoppingCart();
  cart.addItem({ name: 'Book', price: 100 });
  cart.addItem({ name: 'Pen', price: 10 });
  const discount = 0.1; // 10% off

  // Act（執行）
  const total = cart.calculateTotal(discount);

  // Assert（斷言）
  expect(total).toBe(99); // (100 + 10) * 0.9
});
```

### 5.3 測試隔離

```typescript
// ✅ 好：每個測試獨立
describe('Counter', () => {
  let counter: Counter;

  beforeEach(() => {
    counter = new Counter(); // 每次都是新實例
  });

  it('should start at zero', () => {
    expect(counter.value).toBe(0);
  });

  it('should increment', () => {
    counter.increment();
    expect(counter.value).toBe(1);
  });
});

// ❌ 壞：測試間共享狀態
let sharedCounter = new Counter(); // 危險！

describe('Counter', () => {
  it('should start at zero', () => {
    expect(sharedCounter.value).toBe(0);
  });

  it('should increment', () => {
    sharedCounter.increment();
    expect(sharedCounter.value).toBe(1); // 依賴上一個測試？
  });
});
```

### 5.4 避免測試實現細節

```typescript
// ❌ 壞：測試實現細節
it('should set isLoading to true then false', () => {
  const { result } = renderHook(() => useUsers());

  act(() => {
    result.current.fetchUsers();
  });

  expect(result.current.isLoading).toBe(true); // 實現細節
  // ...
});

// ✅ 好：測試行為
it('should display loading state while fetching', async () => {
  render(<UserList />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
```

---

## 六、覆蓋率策略

### 6.1 覆蓋率目標

| 類型 | 最低要求 | 建議目標 |
|------|----------|----------|
| Statements | 70% | 80%+ |
| Branches | 70% | 80%+ |
| Functions | 70% | 80%+ |
| Lines | 70% | 80%+ |

### 6.2 執行覆蓋率

```bash
# Vitest
npx vitest run --coverage

# 生成報告
npx vitest run --coverage --reporter=html
```

### 6.3 CI 整合

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 七、BDD 與 Gherkin

### 7.1 Gherkin 語法

```gherkin
# features/login.feature
Feature: User Login

  As a registered user
  I want to login to my account
  So that I can access my dashboard

  Background:
    Given I am on the login page

  Scenario: Successful login
    When I enter valid credentials
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see a welcome message

  Scenario: Failed login with wrong password
    When I enter an invalid password
    And I click the login button
    Then I should see an error message
    And I should remain on the login page

  Scenario Outline: Login validation
    When I enter "<email>" as email
    And I enter "<password>" as password
    And I click the login button
    Then I should see "<result>"

    Examples:
      | email           | password  | result            |
      | user@test.com   | correct   | Dashboard         |
      | user@test.com   | wrong     | Invalid password  |
      | invalid         | password  | Invalid email     |
```

### 7.2 步驟定義

```typescript
// steps/login.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am on the login page', async function () {
  await this.page.goto('/login');
});

When('I enter valid credentials', async function () {
  await this.page.getByLabel(/email/i).fill('user@example.com');
  await this.page.getByLabel(/password/i).fill('password123');
});

When('I click the login button', async function () {
  await this.page.getByRole('button', { name: /sign in/i }).click();
});

Then('I should be redirected to the dashboard', async function () {
  await expect(this.page).toHaveURL('/dashboard');
});

Then('I should see a welcome message', async function () {
  await expect(this.page.getByText(/welcome/i)).toBeVisible();
});
```

---

## 八、禁止行為

```markdown
❌ 絕對禁止：
1. 先寫實現代碼再補測試
2. 測試依賴執行順序
3. 測試共享可變狀態
4. 使用 sleep() 代替適當的等待
5. 測試私有方法或實現細節
6. 忽略測試失敗繼續提交
7. 硬編碼測試數據（如真實 API Key）
8. E2E 測試使用生產數據庫
9. 覆蓋率造假（無意義的測試）
10. 跳過邊界條件測試
```

---

## 九、自檢清單

```markdown
□ 遵循 TDD Red-Green-Refactor 流程
□ 測試覆蓋率 ≥ 80%
□ 每個測試獨立可重複執行
□ 使用 AAA 模式組織測試
□ 測試命名清晰描述行為
□ 關鍵用戶流程有 E2E 覆蓋
□ CI 管道包含測試步驟
□ Mock 外部依賴
□ 無硬編碼敏感數據
□ 測試錯誤路徑和邊界條件
```

---

## 十、常用命令

```bash
# Vitest
npx vitest              # 監視模式
npx vitest run          # 單次執行
npx vitest --coverage   # 覆蓋率
npx vitest --ui         # UI 模式

# Playwright
npx playwright test             # 執行所有測試
npx playwright test --ui        # UI 模式
npx playwright test --headed    # 顯示瀏覽器
npx playwright show-report      # 查看報告
npx playwright codegen          # 錄製測試

# 特定測試
npx vitest run auth             # 運行包含 auth 的測試
npx playwright test login.spec  # 運行特定文件
```

---

## 參考資源

- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [Testing Library](https://testing-library.com)
- [TDD Guard](https://github.com/nizos/tdd-guard)
- [Kent C. Dodds - Testing JavaScript](https://testingjavascript.com)

---

**版本**: 1.0.0
**最後更新**: 2025-12-26
