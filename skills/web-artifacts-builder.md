# Web Artifacts Builder - 網頁成品建構器

> **技能 ID**: web-artifacts-builder
> **版本**: v1.0
> **用途**: 建立可分享的單一 HTML 網頁成品（React + Vite + Tailwind + shadcn/ui）
> **來源**: 基於 [Anthropic 官方 Web Artifacts Builder Skill](https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder)
> **授權**: Apache 2.0

---

## 🎯 觸發條件

### 關鍵字列表
```
web artifact、網頁成品、單一 HTML、bundle HTML、
React 組件、shadcn、Tailwind、Vite、
可分享網頁、獨立網頁、自包含 HTML、
artifact builder、打包網頁、網頁打包
```

### 使用場景
1. **創建可分享網頁** - 產生單一 HTML 文件，可直接開啟使用
2. **快速原型開發** - 使用 React + shadcn/ui 快速建立 UI
3. **Claude Artifact** - 創建可在 Claude 對話中分享的網頁成品
4. **獨立工具頁面** - 建立不需部署的獨立網頁工具

---

## 🧠 核心理念

### 什麼是 Web Artifact？

> **Web Artifact** = 單一 HTML 文件，包含所有 JavaScript、CSS 和資源，可直接在瀏覽器中開啟運行

**特點**:
- ✅ 無需伺服器，直接開啟即可使用
- ✅ 可嵌入 Claude 對話分享
- ✅ 完整的 React 應用功能
- ✅ 包含 40+ shadcn/ui 組件

---

## 🏗️ 五步工作流程

```
步驟 1: 初始化專案
    ↓ scripts/init-artifact.sh <project-name>
步驟 2: 開發代碼
    ↓ 編輯 src/ 目錄下的組件
步驟 3: 打包成 HTML
    ↓ scripts/bundle-artifact.sh
步驟 4: 分享成品
    ↓ 開啟 bundle.html 或分享給用戶
步驟 5: 測試（可選）
    └ 在瀏覽器中測試功能
```

---

## 🛠️ 技術棧

| 技術 | 用途 | 版本 |
|------|------|------|
| **React** | UI 框架 | 18+ |
| **TypeScript** | 類型安全 | 5+ |
| **Vite** | 開發伺服器 | 5+ |
| **Tailwind CSS** | 樣式框架 | 3+ |
| **shadcn/ui** | 組件庫 | 40+ 組件 |
| **Parcel** | 打包工具 | 2+ |

---

## 📖 快速開始

### 步驟 1: 初始化專案

```bash
# 創建新專案
bash .claude/skills/scripts/init-artifact.sh my-artifact

# 進入專案目錄
cd my-artifact

# 啟動開發伺服器
pnpm dev
```

**初始化腳本會自動**:
- 創建 Vite + React + TypeScript 專案
- 安裝 Tailwind CSS 和 PostCSS
- 配置路徑別名（@/* → src/*）
- 解壓 40+ shadcn/ui 組件
- 設置深色/淺色主題 CSS 變數

### 步驟 2: 開發代碼

```tsx
// src/App.tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>My Web Artifact</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => alert("Hello!")}>
            Click Me
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
```

### 步驟 3: 打包成 HTML

```bash
# 打包成單一 HTML
bash .claude/skills/scripts/bundle-artifact.sh

# 輸出: bundle.html
```

**打包腳本會自動**:
- 安裝 Parcel 打包工具
- 編譯 TypeScript 和 React
- 內聯所有 CSS 和 JavaScript
- 生成自包含的 `bundle.html`

### 步驟 4: 分享成品

```bash
# 直接在瀏覽器開啟
open bundle.html  # macOS
start bundle.html # Windows

# 或分享給用戶
# bundle.html 可直接發送或嵌入
```

---

## 🎨 設計規範

### 反 AI 通用美學（與 frontend-design 技能一致）

> **必須避免**的設計陷阱：

| 反模式 | 問題 | 替代方案 |
|--------|------|---------|
| 過度置中 | 缺乏視覺層次 | 使用不對稱佈局 |
| 紫色漸層 | AI 通用標誌 | 選擇獨特配色 |
| 統一圓角 | 缺乏個性 | 混合使用不同圓角 |
| Inter 字體 | 過度使用 | 選擇獨特字體組合 |

### shadcn/ui 組件使用原則

```tsx
// ✅ 推薦：組合使用組件，創建獨特介面
<Card className="border-none shadow-2xl">
  <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-700">
    <CardTitle className="text-white">Custom Card</CardTitle>
  </CardHeader>
</Card>

// ❌ 避免：直接使用預設樣式，無客製化
<Card>
  <CardHeader>
    <CardTitle>Default Card</CardTitle>
  </CardHeader>
</Card>
```

---

## 📦 可用組件列表

### shadcn/ui 40+ 組件

```
Accordion          Dialog              RadioGroup
Alert              DropdownMenu        ResizablePanel
AlertDialog        Form                ScrollArea
AspectRatio        HoverCard           Select
Avatar             Input               Separator
Badge              InputOTP            Sheet
Breadcrumb         Label               Sidebar
Button             Menubar             Skeleton
Calendar           NavigationMenu      Slider
Card               Pagination          Sonner (Toast)
Carousel           Popover             Switch
Chart              Progress            Table
Checkbox           ProgressCircle      Tabs
Collapsible        ProgressDualRange   Textarea
Command            ProgressRangeDual   Toast
ContextMenu        ProgressTimeline    Tooltip
                                       Toggle
```

### 組件引入方式

```tsx
// 從 @/components/ui/ 引入
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
```

---

## 📖 完整範例

### 範例 1: 計算器 Artifact

```tsx
// src/App.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previous, setPrevious] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === "0" ? num : prev + num)
  }

  const handleOperator = (op: string) => {
    setPrevious(parseFloat(display))
    setOperator(op)
    setDisplay("0")
  }

  const handleEquals = () => {
    if (previous === null || operator === null) return
    const current = parseFloat(display)
    let result = 0
    switch (operator) {
      case "+": result = previous + current; break
      case "-": result = previous - current; break
      case "*": result = previous * current; break
      case "/": result = previous / current; break
    }
    setDisplay(String(result))
    setPrevious(null)
    setOperator(null)
  }

  const handleClear = () => {
    setDisplay("0")
    setPrevious(null)
    setOperator(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-80 bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-right font-mono text-3xl">
            {display}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-2">
          <Button variant="outline" className="col-span-2" onClick={handleClear}>
            AC
          </Button>
          <Button variant="outline" onClick={() => handleOperator("/")}>÷</Button>
          <Button variant="outline" onClick={() => handleOperator("*")}>×</Button>

          {["7", "8", "9"].map(n => (
            <Button key={n} variant="secondary" onClick={() => handleNumber(n)}>
              {n}
            </Button>
          ))}
          <Button variant="outline" onClick={() => handleOperator("-")}>−</Button>

          {["4", "5", "6"].map(n => (
            <Button key={n} variant="secondary" onClick={() => handleNumber(n)}>
              {n}
            </Button>
          ))}
          <Button variant="outline" onClick={() => handleOperator("+")}>+</Button>

          {["1", "2", "3"].map(n => (
            <Button key={n} variant="secondary" onClick={() => handleNumber(n)}>
              {n}
            </Button>
          ))}
          <Button
            className="row-span-2 bg-cyan-500 hover:bg-cyan-400"
            onClick={handleEquals}
          >
            =
          </Button>

          <Button variant="secondary" className="col-span-2" onClick={() => handleNumber("0")}>
            0
          </Button>
          <Button variant="secondary" onClick={() => handleNumber(".")}>.</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Calculator
```

---

## ❌ 禁止事項

### 1. 避免打包問題

```markdown
❌ 不要:
- 使用外部 CDN 資源（打包後無法載入）
- 引用本地圖片路徑（應使用 Base64 或 SVG）
- 使用動態 import（Parcel 可能無法正確處理）
- 依賴 Node.js 環境 API
```

### 2. 避免開發環境依賴

```markdown
❌ 不要:
- 假設有後端 API（artifact 是純前端）
- 使用 localStorage 跨域（不同開啟方式可能隔離）
- 依賴特定瀏覽器功能（保持兼容性）
```

### 3. 避免過大的打包文件

```markdown
❌ 不要:
- 引入完整的圖標庫（只引入需要的）
- 使用大型第三方庫（考慮輕量替代方案）
- 打包未使用的組件
```

---

## ✅ 自我檢查清單

### 開發階段
- [ ] 專案使用 `init-artifact.sh` 初始化
- [ ] 組件從 `@/components/ui/` 正確引入
- [ ] 開發伺服器正常運行 (`pnpm dev`)
- [ ] 無 TypeScript 類型錯誤

### 打包階段
- [ ] 執行 `bundle-artifact.sh` 無錯誤
- [ ] `bundle.html` 成功生成
- [ ] 文件大小合理（通常 < 500KB）
- [ ] 無外部資源依賴

### 測試階段
- [ ] `bundle.html` 可直接在瀏覽器開啟
- [ ] 所有功能正常運作
- [ ] 深色/淺色主題正常
- [ ] 響應式佈局正常

### 設計階段
- [ ] 避免 AI 通用美學
- [ ] 有獨特的視覺風格
- [ ] 組件有適當客製化
- [ ] 動效有意圖性

---

## 💡 記憶口訣

**工作流程**:
> 初始化，開發碼
> 打包成，HTML 一個
> 分享開，瀏覽器見

**技術棧**:
> React Vite 做框架
> Tailwind 管樣式
> shadcn 供組件
> Parcel 來打包

**設計原則**:
> 拒絕通用，擁抱獨特
> 組件客製，風格統一
> 輕量優先，效能為王

---

## 📚 參考資源

### 官方文檔
- [Anthropic Skills 倉庫](https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder)
- [shadcn/ui 組件文檔](https://ui.shadcn.com/docs/components)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [Vite 文檔](https://vitejs.dev/guide/)

### 相關技能
- **frontend-design** - 前端設計規範（美學指南）
- **skill-creator** - 技能創建框架

---

## 🔧 腳本位置

```
.claude/skills/scripts/
├── init-artifact.sh        # 專案初始化腳本
├── bundle-artifact.sh      # HTML 打包腳本
└── shadcn-components.tar.gz # 組件庫壓縮包
```

---

**版本**: v1.0
**創建時間**: 2025-12-26
**維護者**: Claude Code + zycaskevin
**授權**: Apache 2.0（基於 Anthropic 官方技能）
