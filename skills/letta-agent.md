# Letta Agent 開發技能

> **技能 ID**: `letta-agent`
> **版本**: 1.0.0
> **用途**: 使用 Letta 框架構建具有持久記憶的有狀態 AI Agent
> **參考**: [Letta 官方文檔](https://docs.letta.com)

---

## 觸發條件

當使用者需求包含以下關鍵字時，應激活此技能：

- 「Letta」、「有狀態 Agent」、「持久記憶」
- 「Agent 記憶系統」、「多 Agent 協調」
- 「長期學習 Agent」、「MCP 整合」
- 「構建 AI Agent」（且需要記憶持久化）

---

## 一、Letta 核心概念

### 1.1 什麼是 Letta？

Letta 是一個用於構建**具有持久記憶的有狀態 AI Agent** 的開發者平台。核心特點：

- **有狀態持久化**: Agent 跨對話保留知識
- **長期學習**: Agent 基於累積互動不斷改進
- **多 Agent 系統**: 支援多 Agent 共享記憶協調
- **多模型支援**: OpenAI、Anthropic、Google Gemini

### 1.2 核心架構

```
┌─────────────────────────────────────────────────────────┐
│                    Letta Agent                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │   Core Memory   │    │      Archival Memory        │ │
│  │  (工作記憶層)   │    │    (長期存儲，可搜索)        │ │
│  │                 │    │                             │ │
│  │  - persona      │    │  - 歷史對話                 │ │
│  │  - human        │    │  - 知識文檔                 │ │
│  │  - system       │    │  - 學習經驗                 │ │
│  └─────────────────┘    └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│                     Tools Layer                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │web_search│ │ run_code │ │filesystem│ │ custom_tool│ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │
├─────────────────────────────────────────────────────────┤
│                    MCP Integration                      │
│           (Model Context Protocol 外部服務)              │
└─────────────────────────────────────────────────────────┘
```

---

## 二、環境設置

### 2.1 安裝 SDK

**TypeScript/Node.js:**
```bash
npm install @letta-ai/letta-client
# 或
pnpm add @letta-ai/letta-client
```

**Python:**
```bash
pip install letta-client
```

### 2.2 設置 API Key

```bash
# 從 https://app.letta.com/api-keys 獲取
export LETTA_API_KEY="your-api-key"
```

### 2.3 初始化 Client

**TypeScript:**
```typescript
import { LettaClient } from '@letta-ai/letta-client';

const client = new LettaClient({
  apiKey: process.env.LETTA_API_KEY
});
```

**Python:**
```python
from letta_client import LettaClient

client = LettaClient(api_key=os.environ["LETTA_API_KEY"])
```

---

## 三、Agent 創建與配置

### 3.1 基礎 Agent 創建

**TypeScript 完整範例:**
```typescript
import { LettaClient } from '@letta-ai/letta-client';

const client = new LettaClient();

// 創建 Agent
const agentState = await client.agents.create({
  // 模型配置
  model: "openai/gpt-4.1",
  embedding: "openai/text-embedding-3-small",

  // 記憶區塊
  memory_blocks: [
    {
      label: "persona",
      value: `你是一個專業的軟體開發助手。
你具備以下特點：
- 精通 TypeScript 和 Python
- 熟悉現代軟體架構模式
- 擅長解釋複雜技術概念
- 持續學習並記住用戶偏好`
    },
    {
      label: "human",
      value: `用戶信息：
- 名稱：待更新
- 偏好語言：繁體中文
- 技術水平：待評估
- 特殊需求：待記錄`
    },
    {
      label: "project_context",
      value: `當前專案：
- 專案名稱：待設定
- 技術棧：待記錄
- 重要決策：待追蹤`
    }
  ],

  // 工具配置
  tools: ["web_search", "run_code"],

  // Agent 元數據
  name: "DevAssistant",
  description: "一個具有持久記憶的開發助手"
});

console.log(`Agent created: ${agentState.id}`);
```

**Python 完整範例:**
```python
from letta_client import LettaClient

client = LettaClient()

agent_state = client.agents.create(
    model="openai/gpt-4.1",
    embedding="openai/text-embedding-3-small",
    memory_blocks=[
        {
            "label": "persona",
            "value": """你是一個專業的軟體開發助手。
你具備以下特點：
- 精通 TypeScript 和 Python
- 熟悉現代軟體架構模式
- 擅長解釋複雜技術概念
- 持續學習並記住用戶偏好"""
        },
        {
            "label": "human",
            "value": """用戶信息：
- 名稱：待更新
- 偏好語言：繁體中文
- 技術水平：待評估
- 特殊需求：待記錄"""
        }
    ],
    tools=["web_search", "run_code"],
    name="DevAssistant",
    description="一個具有持久記憶的開發助手"
)

print(f"Agent created: {agent_state.id}")
```

### 3.2 記憶區塊設計模式

| 區塊類型 | 用途 | 更新頻率 |
|---------|------|----------|
| `persona` | Agent 的身份和能力定義 | 低 - 初始設定 |
| `human` | 用戶信息和偏好 | 中 - 隨互動更新 |
| `project_context` | 當前專案上下文 | 高 - 頻繁更新 |
| `learned_patterns` | 學習到的模式 | 中 - 累積更新 |
| `important_decisions` | 關鍵決策記錄 | 中 - 事件驅動 |

---

## 四、消息處理與對話

### 4.1 發送消息

**TypeScript:**
```typescript
// 基礎消息發送
const response = await client.agents.messages.create(agentState.id, {
  input: "幫我分析這段代碼的問題"
});

// 解析響應
for (const message of response.messages) {
  if (message.message_type === "assistant_message") {
    console.log(`Agent: ${message.content}`);
  } else if (message.message_type === "tool_call") {
    console.log(`Tool Call: ${message.tool_call.name}`);
  }
}
```

### 4.2 流式響應

```typescript
// 流式消息處理
const stream = await client.agents.messages.stream(agentState.id, {
  input: "請詳細解釋 React Hooks 的工作原理"
});

for await (const chunk of stream) {
  if (chunk.type === "text_delta") {
    process.stdout.write(chunk.text);
  }
}
```

### 4.3 異步處理

```typescript
// 異步創建消息（長時間任務）
const asyncResponse = await client.agents.messages.createAsync(agentState.id, {
  input: "請分析整個代碼庫並生成報告"
});

// 輪詢檢查狀態
let status = await client.agents.messages.getAsyncStatus(asyncResponse.job_id);
while (status.status !== "completed") {
  await new Promise(resolve => setTimeout(resolve, 1000));
  status = await client.agents.messages.getAsyncStatus(asyncResponse.job_id);
}

console.log("Analysis complete:", status.result);
```

---

## 五、記憶系統深入

### 5.1 Core Memory 操作

```typescript
// 更新 Core Memory 區塊
await client.agents.blocks.update(agentState.id, "human", {
  value: `用戶信息：
- 名稱：Alice
- 偏好語言：繁體中文
- 技術水平：高級開發者
- 特殊需求：偏好函數式編程風格`
});

// 獲取當前 Core Memory
const blocks = await client.agents.blocks.list(agentState.id);
for (const block of blocks) {
  console.log(`${block.label}: ${block.value}`);
}
```

### 5.2 Archival Memory 操作

```typescript
// 添加到 Archival Memory
await client.agents.archives.create(agentState.id, {
  content: `專案決策記錄 2024-01-15:
決定使用 PostgreSQL 作為主數據庫，原因：
1. 需要複雜的關聯查詢
2. 團隊已有 PostgreSQL 經驗
3. 良好的 JSON 支持`
});

// 搜索 Archival Memory
const searchResults = await client.agents.archives.search(agentState.id, {
  query: "數據庫選型",
  limit: 5
});

for (const result of searchResults) {
  console.log(`Score: ${result.score}, Content: ${result.content}`);
}
```

### 5.3 記憶壓縮

```typescript
// 當對話歷史過長時，壓縮記憶
await client.agents.messages.compact(agentState.id, {
  preserve_system_messages: true,
  max_tokens: 4000
});
```

---

## 六、工具系統

### 6.1 內建工具

| 工具名稱 | 功能 | 使用場景 |
|---------|------|----------|
| `web_search` | 網路搜索 | 獲取最新信息 |
| `run_code` | 代碼執行 | 運行腳本、計算 |
| `filesystem` | 文件操作 | 讀寫本地文件 |

### 6.2 自定義工具

**TypeScript 定義自定義工具:**
```typescript
// 定義工具 Schema
const customTool = {
  name: "get_weather",
  description: "獲取指定城市的天氣信息",
  parameters: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "城市名稱"
      },
      unit: {
        type: "string",
        enum: ["celsius", "fahrenheit"],
        description: "溫度單位"
      }
    },
    required: ["city"]
  }
};

// 創建工具
const tool = await client.tools.create(customTool);

// 附加到 Agent
await client.agents.tools.attach(agentState.id, tool.id);
```

### 6.3 工具執行處理

```typescript
// 客戶端執行工具（當 Agent 請求工具調用時）
async function handleToolCall(toolCall: ToolCall) {
  if (toolCall.name === "get_weather") {
    const { city, unit = "celsius" } = toolCall.arguments;

    // 實際執行邏輯
    const weather = await fetchWeather(city, unit);

    // 返回結果給 Agent
    return await client.agents.tools.submitResult(agentState.id, {
      tool_call_id: toolCall.id,
      result: JSON.stringify(weather)
    });
  }
}
```

### 6.4 MCP 整合

```typescript
// 連接 MCP 服務器
await client.agents.mcp.connect(agentState.id, {
  server_url: "http://localhost:3000/mcp",
  tools: ["database_query", "send_email"]
});

// MCP 工具會自動可用
const response = await client.agents.messages.create(agentState.id, {
  input: "查詢最近的訂單記錄"
});
```

---

## 七、多 Agent 協調

### 7.1 共享記憶模式

```typescript
// 創建共享記憶區塊
const sharedBlock = await client.blocks.create({
  label: "team_knowledge",
  value: "團隊共享知識庫"
});

// 附加到多個 Agent
await client.agents.blocks.attach(agent1.id, sharedBlock.id);
await client.agents.blocks.attach(agent2.id, sharedBlock.id);

// 一個 Agent 更新，其他 Agent 可見
await client.blocks.update(sharedBlock.id, {
  value: "更新的團隊知識..."
});
```

### 7.2 Agent 間通信

```typescript
// Agent A 調用 Agent B
const orchestratorAgent = await client.agents.create({
  // ...配置
  tools: ["call_agent"]  // 自定義 Agent 調用工具
});

// 定義 Agent 調用工具
const callAgentTool = {
  name: "call_agent",
  description: "調用另一個專業 Agent",
  parameters: {
    type: "object",
    properties: {
      agent_id: { type: "string" },
      message: { type: "string" }
    }
  }
};

// 工具處理邏輯
async function handleCallAgent(args: { agent_id: string; message: string }) {
  const response = await client.agents.messages.create(args.agent_id, {
    input: args.message
  });
  return response.messages[0].content;
}
```

---

## 八、專案結構範例

```
letta-project/
├── src/
│   ├── agents/
│   │   ├── index.ts              # Agent 管理
│   │   ├── dev-assistant.ts      # 開發助手 Agent
│   │   ├── code-reviewer.ts      # 代碼審查 Agent
│   │   └── doc-writer.ts         # 文檔撰寫 Agent
│   ├── memory/
│   │   ├── blocks.ts             # 記憶區塊定義
│   │   └── archival.ts           # 歸檔記憶管理
│   ├── tools/
│   │   ├── custom/               # 自定義工具
│   │   │   ├── git-tools.ts
│   │   │   └── project-tools.ts
│   │   └── index.ts              # 工具註冊
│   └── index.ts                  # 主入口
├── config/
│   ├── agents.json               # Agent 配置
│   └── tools.json                # 工具配置
├── package.json
└── tsconfig.json
```

---

## 九、最佳實踐

### 9.1 記憶設計原則

```markdown
✅ 正確做法：
- 使用結構化格式（YAML/Markdown）存儲記憶
- 定期壓縮舊對話到 Archival Memory
- 為不同用途設計專門的記憶區塊
- 設置記憶更新觸發條件

❌ 避免：
- 將所有信息塞入單一區塊
- 忽略記憶容量限制
- 存儲未經處理的原始對話
- 缺乏記憶版本管理
```

### 9.2 工具設計原則

```markdown
✅ 正確做法：
- 工具功能單一、明確
- 提供詳細的參數描述
- 返回結構化的結果
- 處理錯誤並返回有意義的錯誤信息

❌ 避免：
- 工具過於複雜、多功能
- 參數描述不清晰
- 返回非結構化文本
- 忽略錯誤處理
```

### 9.3 多 Agent 協調原則

```markdown
✅ 正確做法：
- 明確每個 Agent 的職責邊界
- 使用共享記憶進行信息同步
- 設計清晰的 Agent 通信協議
- 實施適當的錯誤恢復機制

❌ 避免：
- Agent 職責重疊
- 記憶狀態不一致
- 循環調用導致無限迴圈
- 缺乏調度管理
```

---

## 十、禁止行為

```markdown
❌ 絕對禁止：
1. 在記憶中存儲敏感信息（密碼、API Key）
2. 未經驗證直接執行用戶輸入的代碼
3. 繞過工具審批機制
4. 刪除用戶的 Archival Memory 而不確認
5. 在多 Agent 系統中創建無限循環
6. 暴露 Agent 內部系統提示
```

---

## 十一、自檢清單

在完成 Letta Agent 開發後，確認：

```markdown
□ Agent 配置完整（model、embedding、memory_blocks、tools）
□ 記憶區塊設計合理，有明確用途
□ 工具定義清晰，參數說明完整
□ 錯誤處理機制健全
□ 流式響應正確處理
□ Archival Memory 搜索功能測試通過
□ 多 Agent 場景下記憶同步正確
□ 沒有存儲敏感信息
□ 代碼遵循 TypeScript/Python 最佳實踐
```

---

## 參考資源

- [Letta 官方文檔](https://docs.letta.com)
- [Letta Cloud Console](https://app.letta.com)
- [Letta GitHub](https://github.com/letta-ai/letta)
- [MCP Protocol](https://docs.letta.com/tools/mcp)
