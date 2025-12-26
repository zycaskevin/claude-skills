# MCP Builder - MCP 伺服器開發指南

> **技能 ID**: mcp-builder
> **版本**: v1.0
> **評分**: ⭐⭐⭐⭐⭐（5/5 強烈推薦）
> **用途**: 模型上下文協議（MCP）伺服器開發，整合外部 API 與 LLM
> **來源**: 基於 Anthropic 官方 MCP Builder Skill

---

## 🎯 觸發條件

### 關鍵字列表
```
MCP、模型上下文協議、Model Context Protocol、
MCP 伺服器、MCP Server、外部 API 整合、
FastMCP、MCP SDK、LLM 工具開發、
外部服務連接、Claude 工具擴展
```

### 使用場景
1. **LLM 外部整合** - 需要 Claude 與外部系統（API、資料庫）互動
2. **工具開發** - 建立可重複使用的結構化工具集
3. **企業級整合** - 整合公司內部 API 到 Claude Code
4. **自動化擴展** - 擴展 Claude Code 的能力範圍

---

## 🧠 核心概念

### 什麼是 MCP？

**Model Context Protocol (MCP)** 是 Anthropic 提供的標準協議，用於：
- 讓 LLM 調用外部工具
- 提供結構化的輸入/輸出格式
- 實現可發現、可驗證的工具集

### 支援語言

| 語言 | 框架 | 推薦場景 |
|------|------|---------|
| **Python** | FastMCP | 快速開發、資料處理、科學計算 |
| **TypeScript/Node.js** | MCP SDK | 前端整合、全棧應用、NPM 生態 |

---

## 📖 開發流程

### Phase 1: 深度研究 🔬

```
1.1 理解 MCP 設計原理
├─ 閱讀官方 MCP 規範文檔
├─ 理解 Tool、Resource、Prompt 三大概念
└─ 研究 JSON-RPC 通訊協議

1.2 學習目標 API
├─ 獲取 API 文檔（OpenAPI/Swagger）
├─ 測試 API 端點（Postman/curl）
└─ 識別認證方式（API Key、OAuth、JWT）

1.3 研讀框架文檔
├─ Python: FastMCP 快速入門
├─ Node.js: @modelcontextprotocol/sdk
└─ 參考現有 MCP 伺服器範例
```

### Phase 2: 實作開發 💻

```
2.1 專案初始化
├─ 建立目錄結構
├─ 安裝依賴套件
└─ 配置環境變數

2.2 實現核心功能
├─ 定義 Tool Schema
├─ 實現工具邏輯
└─ 處理錯誤情況

2.3 整合測試
├─ 單元測試
├─ 整合測試
└─ Claude Code 實際調用測試
```

### Phase 3: 審查測試 ✅

```
3.1 程式碼品質
├─ Type hints 完整
├─ Docstrings 清晰
└─ 遵循 PEP8/ESLint 規範

3.2 安全檢查
├─ API 金鑰安全存儲
├─ 輸入驗證
└─ 錯誤訊息不洩漏敏感資訊

3.3 MCP 檢查器驗證
├─ 執行 `mcp inspect`
├─ 確認工具定義正確
└─ 驗證回應格式
```

### Phase 4: 評估創建 📊

```
4.1 設計驗證問題
├─ 針對每個工具設計測試問題
├─ 涵蓋正常和邊界情況
└─ 記錄預期輸出

4.2 確認伺服器有效性
├─ 在 Claude Code 中實際使用
├─ 驗證工具調用成功
└─ 確認回應格式正確
```

---

## 🏗️ 專案結構規範

### Python (FastMCP)

```
mcp-server-name/
├── src/
│   ├── __init__.py
│   ├── server.py           # MCP 伺服器主入口
│   ├── tools/              # 工具定義
│   │   ├── __init__.py
│   │   ├── api_tools.py    # API 相關工具
│   │   └── data_tools.py   # 資料處理工具
│   └── utils/              # 輔助函數
│       ├── __init__.py
│       └── api_client.py   # API 客戶端
├── tests/
│   ├── test_tools.py
│   └── test_server.py
├── pyproject.toml          # 專案配置
├── .env.example            # 環境變數範本
└── README.md
```

### TypeScript (MCP SDK)

```
mcp-server-name/
├── src/
│   ├── index.ts            # MCP 伺服器主入口
│   ├── tools/              # 工具定義
│   │   ├── index.ts
│   │   └── api-tools.ts
│   └── utils/              # 輔助函數
│       └── api-client.ts
├── tests/
│   └── tools.test.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🔧 實作範例

### Python FastMCP 範例

```python
# src/server.py
from fastmcp import FastMCP
from dotenv import load_dotenv
import os
import httpx

load_dotenv()

# 初始化 MCP 伺服器
mcp = FastMCP("weather-service")

# API 配置
API_KEY = os.getenv("WEATHER_API_KEY")
BASE_URL = "https://api.weatherapi.com/v1"


@mcp.tool()
async def get_current_weather(location: str) -> dict:
    """
    獲取指定地點的當前天氣資訊。

    Args:
        location: 城市名稱或郵遞區號（如 "Taipei" 或 "100"）

    Returns:
        包含溫度、濕度、天氣狀況的字典
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{BASE_URL}/current.json",
                params={"key": API_KEY, "q": location}
            )
            response.raise_for_status()
            data = response.json()

            return {
                "location": data["location"]["name"],
                "country": data["location"]["country"],
                "temperature_c": data["current"]["temp_c"],
                "humidity": data["current"]["humidity"],
                "condition": data["current"]["condition"]["text"],
                "last_updated": data["current"]["last_updated"]
            }
        except httpx.HTTPStatusError as e:
            return {
                "error": f"API 請求失敗: {e.response.status_code}",
                "suggestion": "請檢查地點名稱是否正確"
            }
        except Exception as e:
            return {
                "error": f"發生錯誤: {str(e)}",
                "suggestion": "請稍後重試或聯繫管理員"
            }


@mcp.tool()
async def get_weather_forecast(location: str, days: int = 3) -> dict:
    """
    獲取指定地點的天氣預報。

    Args:
        location: 城市名稱或郵遞區號
        days: 預報天數（1-10 天，預設 3 天）

    Returns:
        包含每日預報的字典
    """
    days = max(1, min(10, days))  # 限制 1-10 天

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{BASE_URL}/forecast.json",
                params={"key": API_KEY, "q": location, "days": days}
            )
            response.raise_for_status()
            data = response.json()

            forecasts = []
            for day in data["forecast"]["forecastday"]:
                forecasts.append({
                    "date": day["date"],
                    "max_temp_c": day["day"]["maxtemp_c"],
                    "min_temp_c": day["day"]["mintemp_c"],
                    "condition": day["day"]["condition"]["text"],
                    "rain_chance": day["day"]["daily_chance_of_rain"]
                })

            return {
                "location": data["location"]["name"],
                "forecasts": forecasts
            }
        except Exception as e:
            return {
                "error": str(e),
                "suggestion": "請檢查參數或稍後重試"
            }


if __name__ == "__main__":
    mcp.run()
```

### TypeScript MCP SDK 範例

```typescript
// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = "https://api.weatherapi.com/v1";

// 建立 MCP 伺服器
const server = new Server(
  { name: "weather-service", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 定義可用工具
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "weather_get_current",
      description: "獲取指定地點的當前天氣資訊",
      inputSchema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "城市名稱或郵遞區號",
          },
        },
        required: ["location"],
      },
    },
    {
      name: "weather_get_forecast",
      description: "獲取指定地點的天氣預報",
      inputSchema: {
        type: "object",
        properties: {
          location: { type: "string", description: "城市名稱" },
          days: { type: "number", description: "預報天數（1-10）", default: 3 },
        },
        required: ["location"],
      },
    },
  ],
}));

// 處理工具調用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "weather_get_current":
        return await getCurrentWeather(args.location as string);
      case "weather_get_forecast":
        return await getForecast(
          args.location as string,
          (args.days as number) || 3
        );
      default:
        throw new Error(`未知工具: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : "未知錯誤",
            suggestion: "請檢查參數或稍後重試",
          }),
        },
      ],
    };
  }
});

async function getCurrentWeather(location: string) {
  const response = await fetch(
    `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}`
  );
  const data = await response.json();

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          location: data.location.name,
          temperature_c: data.current.temp_c,
          condition: data.current.condition.text,
        }),
      },
    ],
  };
}

async function getForecast(location: string, days: number) {
  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=${days}`
  );
  const data = await response.json();

  const forecasts = data.forecast.forecastday.map((day: any) => ({
    date: day.date,
    max_temp_c: day.day.maxtemp_c,
    min_temp_c: day.day.mintemp_c,
    condition: day.day.condition.text,
  }));

  return {
    content: [{ type: "text", text: JSON.stringify({ location, forecasts }) }],
  };
}

// 啟動伺服器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

---

## 📝 設計原則

### 1. 工具命名規範

```
✅ 正確示範:
weather_get_current      # 一致前綴 + 動作導向
weather_get_forecast
weather_search_history

❌ 錯誤示範:
getCurrentWeather        # 不一致的命名風格
fetch_weather           # 缺少領域前綴
getWeather              # 太通用
```

**命名規則**:
- 使用 `snake_case`
- 格式: `{domain}_{action}_{target}`
- 範例: `github_list_repos`, `slack_send_message`

### 2. 錯誤處理規範

```python
# ✅ 正確: 提供具體建議和後續步驟
return {
    "error": "API 請求失敗: 401 Unauthorized",
    "suggestion": "請檢查 API 金鑰是否正確設置",
    "next_steps": [
        "確認 .env 檔案中的 API_KEY",
        "檢查 API 金鑰是否過期",
        "聯繫 API 提供商確認權限"
    ]
}

# ❌ 錯誤: 只返回錯誤碼
return {"error": "401"}
```

### 3. 回應格式規範

```python
# ✅ 正確: 結構化資料 + 人類可讀文本
return {
    "data": {
        "temperature": 25.5,
        "humidity": 60,
        "condition": "晴朗"
    },
    "summary": "台北目前天氣晴朗，溫度 25.5°C，濕度 60%。"
}

# ❌ 錯誤: 只有原始資料
return {"temp": 25.5, "hum": 60}
```

---

## ❌ 禁止事項

### 1. 安全禁止

- ❌ **硬編碼 API 金鑰** - 必須使用環境變數
- ❌ **暴露敏感資訊** - 錯誤訊息不含內部細節
- ❌ **跳過輸入驗證** - 所有輸入必須驗證

### 2. 設計禁止

- ❌ **工具功能過於廣泛** - 每個工具專注單一職責
- ❌ **忽略錯誤處理** - 必須優雅處理所有錯誤
- ❌ **回應格式不一致** - 保持統一的回應結構

### 3. 實作禁止

- ❌ **同步阻塞調用** - 使用 async/await
- ❌ **無超時設置** - API 調用必須有超時
- ❌ **無重試機制** - 對暫時性錯誤實作重試

---

## ✅ 自我檢查清單

### 專案結構
- [ ] 目錄結構符合規範
- [ ] 環境變數使用 `.env` 管理
- [ ] 有 `.env.example` 範本

### 工具定義
- [ ] 工具命名遵循 `{domain}_{action}_{target}` 格式
- [ ] 每個工具有清晰的 description
- [ ] Input schema 定義完整（類型、必填、預設值）

### 錯誤處理
- [ ] 所有 API 調用有 try/catch
- [ ] 錯誤回應包含 suggestion
- [ ] 不洩漏敏感資訊

### 回應格式
- [ ] 結構化資料 + 人類可讀摘要
- [ ] 格式一致（所有工具相同結構）
- [ ] 包含必要的 metadata（時間戳、來源）

### 測試驗證
- [ ] 單元測試覆蓋核心邏輯
- [ ] 整合測試驗證 API 調用
- [ ] 使用 `mcp inspect` 驗證工具定義
- [ ] 在 Claude Code 中實際測試

---

## 🔗 Claude Code 整合

### 配置 MCP 伺服器

```json
// ~/.claude/settings.json 或 .claude/settings.json
{
  "mcpServers": {
    "weather": {
      "command": "python",
      "args": ["-m", "mcp_weather_server"],
      "env": {
        "WEATHER_API_KEY": "${WEATHER_API_KEY}"
      }
    }
  }
}
```

### 使用方式

```
用戶: "台北現在天氣如何？"

Claude: [調用 weather_get_current 工具]
        根據天氣服務，台北目前天氣晴朗，溫度 25.5°C，
        濕度 60%。適合戶外活動！
```

---

## 💡 記憶口訣

**開發流程**:
> 研究先行，實作跟進
> 審查測試，評估確認

**命名規範**:
> 領域_動作_目標
> snake_case 統一

**錯誤處理**:
> 錯誤要具體，建議要明確
> 敏感資訊不外露

**回應格式**:
> 結構化資料，人類可讀
> 格式統一，metadata 完整

---

## 📚 參考資源

### 官方文檔
- [MCP 官方規範](https://modelcontextprotocol.io)
- [FastMCP 文檔](https://github.com/jlowin/fastmcp)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

### 範例伺服器
- [Anthropic 官方 MCP 伺服器](https://github.com/modelcontextprotocol/servers)
- [社群 MCP 伺服器集合](https://github.com/punkpeye/awesome-mcp-servers)

---

**版本**: v1.0
**創建時間**: 2025-12-26
**維護者**: Claude Code + zycaskevin
**授權**: MIT
