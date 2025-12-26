# Frontend Design - 前端設計技能

> **技能 ID**: frontend-design
> **版本**: v1.0
> **用途**: 創建獨特、生產級的前端介面，拒絕「AI 通用美學」
> **來源**: 基於 [Anthropic 官方 Frontend Design Skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design)
> **授權**: Apache 2.0

---

## 🎯 觸發條件

### 關鍵字列表
```
前端設計、UI 設計、界面設計、frontend design、
網頁設計、web design、CSS、HTML、React 組件、
視覺設計、美學設計、用戶介面、landing page、
dashboard、儀表板、表單設計、卡片設計
```

### 使用場景
1. **網頁/組件設計** - 創建新的頁面或組件
2. **介面重構** - 優化現有 UI 美學
3. **Landing Page** - 製作高轉換率著陸頁
4. **Dashboard** - 設計數據可視化儀表板
5. **表單/卡片** - 創建獨特的表單和卡片組件

---

## 🧠 核心設計理念

### 反 AI 通用美學（Anti-AI Slop Aesthetics）

> **核心原則**: 每個設計都應該有**明確的美學觀點**，而不是通用的「AI 風格」

**必須避免的「AI 通用美學」特徵**:

| 反模式 | 問題 | 替代方案 |
|--------|------|---------|
| 過度使用的字體 | Arial, Inter, Roboto | 選擇獨特字體：JetBrains Mono, Playfair Display, Space Grotesk |
| 陳腐的配色 | #4F46E5 (藍紫), 彩虹漸層 | 建立有性格的調色板：單色主導 + 銳利點綴色 |
| 可預測的佈局 | 12 欄格線、卡片牆、英雄區 + 功能區 | 不對稱、意外的空間構圖、大膽的負空間 |
| 通用的動效 | 淡入淡出、基本懸停效果 | 意圖明確的微互動、高影響力時刻的動畫 |
| 缺乏深度 | 純色背景、無紋理 | 大氣背景、微妙漸層、情境細節 |

---

## 🎨 設計思維框架（Design Before Code）

在編寫任何代碼之前，必須建立**大膽的美學方向**：

### 四個核心問題

```markdown
1. PURPOSE（目的）
   - 這個介面解決什麼問題？
   - 目標用戶是誰？
   - 用戶的情感需求是什麼？

2. TONE（調性）
   選擇一個大膽的美學方向：
   - 極簡主義（Minimalist）
   - 極繁主義（Maximalist）
   - 復古未來主義（Retro-Futuristic）
   - 粗獷主義（Brutalist）
   - 有機自然（Organic）
   - 科技感（Tech/Cyberpunk）
   - 手工質感（Handcrafted）

3. CONSTRAINTS（限制）
   - 技術限制（瀏覽器支援、效能要求）
   - 品牌規範（如果有）
   - 無障礙要求（WCAG 等級）

4. DIFFERENTIATION（獨特性）
   - 什麼讓這個設計令人難忘？
   - 用戶離開後會記得什麼？
   - 有什麼意想不到的元素？
```

---

## 🏗️ 前端美學五大支柱

### 1. 排版（Typography）

**核心原則**: 字體是設計的聲音，選擇要有意圖

```css
/* ❌ 避免：過度使用的字體 */
font-family: 'Inter', 'Roboto', 'Arial', sans-serif;

/* ✅ 推薦：獨特的字體組合 */
/* 科技感 */
font-family: 'JetBrains Mono', 'Fira Code', monospace;

/* 優雅感 */
font-family: 'Playfair Display', 'Cormorant Garamond', serif;

/* 現代感 */
font-family: 'Space Grotesk', 'DM Sans', sans-serif;

/* 實驗性 */
font-family: 'Archivo Black', 'Bebas Neue', sans-serif;
```

**排版層次**:
- 使用 2-3 種字體（標題 + 正文 + 可選的 accent）
- 建立明確的字體大小階梯（使用 clamp() 實現響應式）
- 字重對比強烈（400 vs 700+）
- 行高有呼吸感（1.5-1.75 用於正文）

### 2. 色彩與主題（Color & Theme）

**核心原則**: 凝聚的調色板，主導色 + 銳利點綴色

```css
/* ❌ 避免：AI 通用配色 */
--primary: #4F46E5;  /* 無處不在的紫藍色 */
--gradient: linear-gradient(to right, #667eea, #764ba2);

/* ✅ 推薦：有性格的調色板 */

/* 暗黑科技風 */
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #141414;
  --text-primary: #fafafa;
  --accent: #22d3ee;  /* 青色點綴 */
  --accent-glow: rgba(34, 211, 238, 0.3);
}

/* 溫暖自然風 */
:root {
  --bg-primary: #faf8f5;
  --bg-secondary: #f0ebe3;
  --text-primary: #2d2a26;
  --accent: #e07a5f;  /* 陶土橙 */
  --accent-muted: #f4a261;
}

/* 高對比極簡風 */
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
  --accent: #ff3366;  /* 唯一的顏色 */
}
```

### 3. 動效（Motion）

**核心原則**: 動效用於**高影響力時刻**，而非裝飾

```css
/* ❌ 避免：無意義的動效 */
transition: all 0.3s ease;  /* 懶惰的全局過渡 */

/* ✅ 推薦：意圖明確的動效 */

/* 微互動：按鈕懸停 */
.btn {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn:hover {
  transform: translateY(-2px) scale(1.02);
}

/* 入場動畫：驚喜時刻 */
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card {
  animation: reveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: calc(var(--index) * 0.1s);
}

/* 載入狀態：吸引注意力 */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px var(--accent-glow); }
  50% { box-shadow: 0 0 40px var(--accent-glow); }
}
```

### 4. 空間構圖（Spatial Composition）

**核心原則**: 不對稱、意外、大膽使用負空間

```css
/* ❌ 避免：可預測的格線佈局 */
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

/* ✅ 推薦：意外的構圖 */

/* 不對稱英雄區 */
.hero {
  display: grid;
  grid-template-columns: 1fr 2fr;  /* 黃金比例 */
  gap: clamp(2rem, 5vw, 6rem);
  padding: clamp(4rem, 10vh, 12rem) 0;
}

/* 大膽的負空間 */
.feature-section {
  max-width: 60ch;  /* 限制寬度 */
  margin: 0 auto;
  padding: 20vh 0;  /* 大量垂直空間 */
}

/* 打破格線的元素 */
.accent-image {
  position: relative;
  left: -10%;
  width: 120%;  /* 突破容器 */
}

/* 不規則間距 */
.stack > * + * {
  margin-top: clamp(1.5rem, 4vw, 4rem);
}
.stack > .highlight {
  margin-top: clamp(4rem, 8vw, 10rem);  /* 意外的間距 */
}
```

### 5. 背景與視覺細節（Backgrounds & Details）

**核心原則**: 大氣背景、微妙質感、情境細節

```css
/* ❌ 避免：純色背景 */
background: #ffffff;

/* ✅ 推薦：有深度的背景 */

/* 微妙漸層 */
.section {
  background: linear-gradient(
    180deg,
    var(--bg-primary) 0%,
    var(--bg-secondary) 100%
  );
}

/* 噪點紋理 */
.textured {
  background-image: url("data:image/svg+xml,...");  /* SVG 噪點 */
  background-size: 200px 200px;
}

/* 光暈效果 */
.glow-bg {
  position: relative;
}
.glow-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 30% 20%,
    var(--accent-glow) 0%,
    transparent 50%
  );
  pointer-events: none;
}

/* 玻璃擬態 */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

---

## 📝 實作標準

### 代碼品質要求

生成的代碼必須是：

| 標準 | 說明 |
|------|------|
| **Production-Grade** | 可直接用於生產環境，無需大幅修改 |
| **Visually Striking** | 視覺上令人印象深刻，有記憶點 |
| **Cohesive** | 統一的美學觀點，所有元素協調一致 |
| **Meticulously Refined** | 精心打磨的細節，無粗糙邊緣 |

### 複雜度匹配原則

> **代碼複雜度應該匹配設計願景**

```markdown
🎆 極繁主義設計
   → 複雜的動畫、多層視覺效果、豐富的交互

🎯 極簡主義設計
   → 精確的間距、完美的排版、克制的動效

⚡ 高性能要求
   → CSS 優先、避免 JS 動畫、優化關鍵渲染路徑
```

---

## 📖 完整範例

### 範例 1: 科技風 Landing Page Hero

```html
<!-- HTML 結構 -->
<section class="hero">
  <div class="hero-content">
    <span class="hero-tag">INTRODUCING</span>
    <h1 class="hero-title">
      Build <span class="gradient-text">impossible</span>
      interfaces
    </h1>
    <p class="hero-desc">
      The design system that breaks conventions.
      No templates. No compromises.
    </p>
    <div class="hero-cta">
      <button class="btn btn-primary">
        <span>Start Building</span>
        <svg class="btn-icon"><!-- arrow --></svg>
      </button>
      <button class="btn btn-ghost">Watch Demo</button>
    </div>
  </div>
  <div class="hero-visual">
    <div class="floating-card">
      <!-- 動態卡片 -->
    </div>
  </div>
</section>
```

```css
/* 科技風格變數 */
:root {
  --font-display: 'Space Grotesk', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --bg-deep: #030303;
  --bg-surface: #0f0f0f;
  --text: #fafafa;
  --text-muted: #737373;
  --accent: #22d3ee;
  --accent-glow: rgba(34, 211, 238, 0.4);
}

/* Hero 區域 */
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 0 clamp(2rem, 8vw, 8rem);
  background: var(--bg-deep);
  position: relative;
  overflow: hidden;
}

/* 大氣背景 */
.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 80%;
  height: 150%;
  background: radial-gradient(
    ellipse at center,
    var(--accent-glow) 0%,
    transparent 60%
  );
  opacity: 0.3;
  pointer-events: none;
}

/* 標籤 */
.hero-tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--accent);
  text-transform: uppercase;
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 1px solid var(--accent);
  border-radius: 2rem;
  margin-bottom: 2rem;
}

/* 標題 */
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent), #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 描述 */
.hero-desc {
  font-size: 1.25rem;
  color: var(--text-muted);
  max-width: 45ch;
  line-height: 1.7;
  margin-bottom: 3rem;
}

/* CTA 按鈕 */
.hero-cta {
  display: flex;
  gap: 1rem;
}

.btn {
  font-family: var(--font-display);
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-primary {
  background: var(--accent);
  color: var(--bg-deep);
  border: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 40px var(--accent-glow);
}

.btn-ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* 入場動畫 */
.hero-content > * {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 0.8s ease forwards;
}

.hero-tag { animation-delay: 0.1s; }
.hero-title { animation-delay: 0.2s; }
.hero-desc { animation-delay: 0.3s; }
.hero-cta { animation-delay: 0.4s; }

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## ❌ 禁止事項

### 1. 避免 AI 通用美學

```markdown
❌ 不要使用:
- 過度使用的字體（Inter, Roboto, Arial）
- #4F46E5 藍紫色和彩虹漸層
- 完全對稱的 12 欄格線佈局
- 無意義的懸停淡入淡出
- 純色單調背景
```

### 2. 避免無意圖的設計

```markdown
❌ 不要:
- 在沒有建立美學方向前開始編碼
- 使用「看起來不錯」作為設計理由
- 複製其他網站的佈局
- 忽略微妙的細節（間距、對齊、層次）
```

### 3. 避免過度設計

```markdown
❌ 不要:
- 為了獨特而犧牲可用性
- 添加不必要的動畫（影響效能）
- 使用過多的字體和顏色
- 忽視無障礙要求
```

---

## ✅ 自我檢查清單

### 設計階段
- [ ] 確定了明確的美學方向（極簡/極繁/復古等）
- [ ] 回答了四個核心問題（Purpose, Tone, Constraints, Differentiation）
- [ ] 設計中有至少一個「意想不到」的元素
- [ ] 調色板有性格（不是 AI 通用配色）

### 實作階段
- [ ] 字體選擇獨特且有意圖
- [ ] 動效用於高影響力時刻（非裝飾）
- [ ] 佈局有意外的空間構圖
- [ ] 背景有深度（漸層/紋理/光暈）
- [ ] 代碼是 Production-Grade（可直接使用）

### 品質階段
- [ ] 視覺上令人印象深刻
- [ ] 所有元素協調一致
- [ ] 細節精心打磨
- [ ] 通過無障礙基本要求（對比度等）

---

## 💡 記憶口訣

**反 AI 口訣**:
> 拒絕通用，擁抱獨特
> Inter 過時，配色要獨
> 格線可破，動效節制
> 深度背景，細節打磨

**設計前問**:
> 目的為何？調性如何？
> 限制在哪？獨特點何？

**五大支柱**:
> 字體有聲，色彩有性
> 動效有意，空間意外
> 背景有深，細節精緻

---

## 📚 參考資源

### 官方來源
- [Anthropic Skills 倉庫](https://github.com/anthropics/skills/tree/main/skills/frontend-design)
- [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0)

### 推薦字體資源
- [Google Fonts](https://fonts.google.com)
- [Fontshare](https://www.fontshare.com)

### 設計靈感
- [Awwwards](https://www.awwwards.com)
- [Dribbble](https://dribbble.com)

---

**版本**: v1.0
**創建時間**: 2025-12-26
**維護者**: Claude Code + zycaskevin
**授權**: Apache 2.0（基於 Anthropic 官方技能）
