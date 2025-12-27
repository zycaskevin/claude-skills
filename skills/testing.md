# 測試策略技能（Testing Strategy）

> **技能 ID**: `testing`
> **版本**: 1.1.0
> **用途**: TDD/BDD 流程、單元/整合/E2E 測試、Vitest/Playwright 最佳實踐
> **完整範例**: [references/testing-examples.md](references/testing-examples.md)

---

## 觸發條件

當使用者需求包含以下關鍵字時，應激活此技能：

- 「測試」、「Test」、「TDD」、「BDD」
- 「單元測試」、「Unit Test」、「整合測試」
- 「E2E」、「Playwright」、「Vitest」、「Jest」
- 「測試覆蓋率」、「Coverage」

---

## 一、測試金字塔

```
                    ┌─────────┐
                    │   E2E   │ ← 少量、關鍵流程 (10%)
                   ─┴─────────┴─
                  ┌─────────────┐
                  │ Integration │ ← 中等數量 (20%)
                 ─┴─────────────┴─
                ┌─────────────────┐
                │   Unit Tests    │ ← 大量、快速 (70%)
                └─────────────────┘
```

| 層級 | 比例 | 執行時間 | 工具 |
|------|------|----------|------|
| Unit | 70% | 毫秒級 | Vitest, Jest |
| Integration | 20% | 秒級 | Testing Library |
| E2E | 10% | 分鐘級 | Playwright |

---

## 二、TDD 工作流程

### Red-Green-Refactor 循環

```
┌─────────────────────────────────────────────────────────┐
│   ┌─────────┐    ┌─────────┐    ┌──────────┐           │
│   │  🔴 Red  │ → │ 🟢 Green │ → │ 🔵 Refactor│          │
│   │ 寫失敗  │    │ 最小實現│    │  優化代碼 │           │
│   │ 的測試  │    │ 通過測試│    │  保持綠燈 │           │
│   └────┬────┘    └────┬────┘    └─────┬────┘           │
│        └──────────────┴───────────────┘                 │
│              重複直到功能完成                            │
└─────────────────────────────────────────────────────────┘
```

### TDD 三原則

```markdown
✅ 三原則：
1. 只有失敗的測試才能寫新的生產代碼
2. 只寫剛好讓測試失敗的測試代碼
3. 只寫剛好讓測試通過的生產代碼

✅ 正確流程：
1. 🔴 寫一個會失敗的測試
2. 🟢 寫最少的代碼讓測試通過
3. 🔵 重構代碼，保持測試通過
4. 重複
```

### TDD Git Commit 規範

```bash
# 🔴 Red Phase
git commit -m "test(TDD-Red): add failing test for user login"

# 🟢 Green Phase
git commit -m "feat(TDD-Green): implement user login"

# 🔵 Refactor Phase
git commit -m "refactor(TDD-Refactor): extract login validation"
```

---

## 三、工具配置摘要

### Vitest 關鍵配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: { statements: 80, branches: 80 },
    },
  },
});
```

### Playwright 關鍵配置

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
  },
});
```

> 📖 **完整配置與範例**: 參見 [references/testing-examples.md](references/testing-examples.md)

---

## 四、測試命名與 AAA 模式

### 好的命名

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid email', () => {});
    it('should throw error when email is invalid', () => {});
  });
});
```

### AAA 模式

```typescript
it('should calculate total with discount', () => {
  // Arrange（準備）
  const cart = new ShoppingCart();
  cart.addItem({ price: 100 });

  // Act（執行）
  const total = cart.calculateTotal(0.1);

  // Assert（斷言）
  expect(total).toBe(90);
});
```

---

## 五、覆蓋率目標

| 類型 | 最低要求 | 建議目標 |
|------|----------|----------|
| Statements | 70% | 80%+ |
| Branches | 70% | 80%+ |
| Functions | 70% | 80%+ |
| Lines | 70% | 80%+ |

---

## 六、禁止行為

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

## 七、自檢清單

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

## 八、常用命令

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
```

---

## 參考資源

- **完整範例**: [references/testing-examples.md](references/testing-examples.md)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
- [Testing Library](https://testing-library.com)

---

**版本**: 1.1.0（精簡版）
**最後更新**: 2025-12-27
