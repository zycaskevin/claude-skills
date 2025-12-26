# Token 消耗分析報告

## 🎯 分析目標

評估「在 Stop Hook 顯示 Token 消耗」功能本身的 Token 成本。

## 📊 可行方案比較

### 方案 1: 直接讀取 Claude Code API（❌ 不可行）

```javascript
// Claude Code Hook 無法直接訪問 Token 使用量
// Hook 運行在獨立的 Node.js 進程，無法訪問主進程數據
```

**Token 成本**: N/A
**結論**: 不可行

---

### 方案 2: 解析對話歷史檔案（⚠️ 高成本）

```javascript
// 讀取 .claude/conversation.json 或類似檔案
const conversation = fs.readFileSync('.claude/conversation.json');
const messages = JSON.parse(conversation);

// 使用 tiktoken 計算 Token
const tokenCount = estimateTokens(messages);
```

**Token 成本估算**:
- 讀取對話歷史: ~2,000 tokens（假設 10 輪對話）
- Tiktoken 計算邏輯: ~500 tokens
- 顯示輸出: ~200 tokens
- **總計**: ~2,700 tokens/次

**優點**:
- ✅ 精確計算
- ✅ 包含完整對話歷史

**缺點**:
- ❌ Token 成本高（~2,700 tokens）
- ❌ 需要額外依賴（tiktoken）
- ❌ 對話歷史可能很大（>100K tokens）

---

### 方案 3: 估算本次對話 Token（✅ 推薦）

```javascript
// 追蹤本次 Hook 執行的輸出
let hookOutputLength = 0;

console.log = new Proxy(console.log, {
  apply(target, thisArg, args) {
    const output = args.join(' ');
    hookOutputLength += output.length;
    return Reflect.apply(target, thisArg, args);
  }
});

// 簡單估算: 字符數 / 4 ≈ Token 數
const estimatedTokens = Math.ceil(hookOutputLength / 4);
```

**Token 成本估算**:
- 代理邏輯: ~100 tokens
- 顯示輸出: ~50 tokens
- **總計**: ~150 tokens/次

**優點**:
- ✅ 成本極低（~150 tokens）
- ✅ 無需外部依賴
- ✅ 實時追蹤

**缺點**:
- ⚠️ 僅為估算（誤差 ±20%）
- ⚠️ 只追蹤 Hook 輸出，不含對話歷史

---

### 方案 4: 顯示會話總 Token（✅ 最佳）

```javascript
// 方法 A: 從 Claude Code 系統提示中提取
// <budget:token_budget>200000</budget:token_budget>

// 方法 B: 靜態顯示提醒
console.log(`
💡 Token 管理提醒:
   - 總預算: 200,000 tokens
   - 建議閾值: 80% (160,000 tokens)
   - 壓縮時機: 查看對話計數器
`);
```

**Token 成本估算**:
- 靜態文本輸出: ~50 tokens
- **總計**: ~50 tokens/次

**優點**:
- ✅ 成本最低（~50 tokens）
- ✅ 無需計算
- ✅ 提供實用建議

**缺點**:
- ⚠️ 無法顯示實時使用量
- ⚠️ 需用戶自行監控

---

## 🎯 推薦方案

**方案 4（靜態提醒）+ 方案 3（Hook 輸出估算）組合**:

```javascript
// Stop Hook 增加以下輸出
console.log('\n📊 Token 使用提醒:');
console.log('   💡 建議定期檢查對話右上角的 Token 計數器');
console.log('   ⚠️ 超過 160K tokens (80%) 時考慮開始新對話');
console.log(`   📏 本次 Hook 輸出: ~${Math.ceil(hookOutputLength / 4)} tokens (估算)`);
```

**總 Token 成本**: ~100 tokens/次

---

## 📈 成本效益分析

| 方案 | Token 成本 | 精確度 | 推薦度 |
|------|-----------|--------|--------|
| 方案 1: API 讀取 | N/A | N/A | ❌ |
| 方案 2: 解析歷史 | ~2,700 | 95%+ | ❌ |
| 方案 3: 估算輸出 | ~150 | 80% | ✅ |
| 方案 4: 靜態提醒 | ~50 | N/A | ✅ |
| **推薦組合** | **~100** | **80%** | **⭐⭐⭐** |

---

## ✅ 最終建議

**實作方式**:
1. 在 Stop Hook 顯示靜態 Token 管理提醒
2. 估算本次 Hook 的輸出 Token
3. 提示用戶查看 Claude Code 界面右上角的實時 Token 計數器

**成本**: ~100 tokens/次（佔單次對話 0.05%，完全可接受）

**效益**:
- ✅ 提醒用戶注意 Token 使用
- ✅ 不增加顯著成本
- ✅ 提供實用的管理建議

---

**結論**: ✅ 可以實作，成本極低（~100 tokens），效益明顯。
