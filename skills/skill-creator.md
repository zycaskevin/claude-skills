# Skill Creator - 技能創建指南

> **技能 ID**: skill-creator
> **版本**: v1.0
> **用途**: 提供標準化的技能創建框架，確保新技能符合 Claude Code 規範
> **來源**: 基於 Anthropic 官方 Skill Creator，適配繁體中文環境

---

## 🎯 觸發條件

### 關鍵字列表
```
技能開發、創建技能、skill development、新增技能、
技能框架、skill template、技能模板、擴展 Claude、
技能設計、skill design、技能規範
```

### 使用場景
1. **創建新技能** - 需要標準化的技能結構
2. **技能重構** - 優化現有技能的組織方式
3. **技能審查** - 檢查技能是否符合最佳實踐
4. **團隊協作** - 統一技能開發規範

---

## 🧠 核心設計原則

### 1. 簡潔性原則（Conciseness）

> **黃金法則**: "上下文視窗是公共資源"

**指導思想**:
- Claude 已經擁有大量基礎知識，**只包含它真正需要的新信息**
- 每增加一行內容前，問自己：「Claude 真的不知道這個嗎？」
- 避免重複解釋常識性概念

**實際應用**:
```markdown
❌ 錯誤示範：
"Python 是一種高級編程語言，支援物件導向和函數式編程。
要使用 Python，需要先安裝 Python 解釋器..."

✅ 正確示範：
"使用 `poetry` 管理依賴，配置文件結構如下：
[工具特定的配置範例]"
```

---

### 2. 適度自由度原則（Appropriate Degrees of Freedom）

根據任務性質選擇合適的指導方式：

| 自由度 | 使用時機 | 表現形式 | 範例 |
|--------|---------|---------|------|
| **高** | 多種有效方法 | 文字說明 | "設計一個使用者友善的界面" |
| **中** | 有優選模式 | 偽代碼 + 參數 | "使用 Builder 模式，參數包括..." |
| **低** | 容易出錯的操作 | 具體腳本 | "執行 `init_skill.py --name=...`" |

**判斷標準**:
- 🟢 **高自由度**: UX 設計、架構選型、創意發想
- 🟡 **中自由度**: 演算法實現、API 設計、測試策略
- 🔴 **低自由度**: 文件系統操作、配置文件生成、構建腳本

---

### 3. 漸進式披露原則（Progressive Disclosure）

**三層加載策略**:

```
Layer 1: 元數據（Metadata）
├─ 總是加載
├─ 大小: ~100 字
└─ 內容: 技能名稱、描述、觸發條件

Layer 2: 核心指令（SKILL.md）
├─ 技能觸發時加載
├─ 大小: <5,000 字（~1,250 tokens）
└─ 內容: 工作流程、規範、範例

Layer 3: 資源文件（Bundled Resources）
├─ 按需加載
├─ 大小: 不限
└─ 內容: 腳本、參考文檔、範本
```

**Token 預算管理**:
- 元數據: ~25 tokens
- SKILL.md: ~1,250 tokens
- 資源文件: 動態加載（不計入初始預算）

---

## 🏗️ 技能結構規範

### 標準目錄結構

```
skill-name/
├── SKILL.md（必須）
│   ├── YAML Frontmatter（元數據）
│   └── Markdown Body（核心指令）
└── 資源文件（可選）
    ├── scripts/（可執行腳本）
    │   ├── init.py
    │   └── validate.sh
    ├── references/（參考文檔）
    │   ├── api-schema.json
    │   └── style-guide.md
    └── assets/（輸出範本）
        ├── template.html
        └── config.yaml
```

---

### SKILL.md 文件規範

#### Frontmatter（YAML 元數據）

```yaml
---
name: skill-name
description: |
  簡潔描述技能用途（觸發關鍵信息）。
  包含使用場景和關鍵字。
  此描述決定技能是否被觸發。
---
```

**重要提醒**:
- `description` 是**主要觸發機制**，必須包含：
  - 核心功能描述
  - 典型使用場景
  - 關鍵觸發詞

#### Markdown Body（核心指令）

**推薦結構**:

```markdown
# 技能名稱

## 🎯 觸發條件
[關鍵字列表 + 使用場景]

## 🏗️ 核心規範
[架構設計 + 編碼規範]

## 📖 工作流程
[步驟式指導]

## ❌ 禁止事項
[常見錯誤 + 反模式]

## 📖 參考範例
[完整代碼範例]

## ✅ 自我檢查清單
[驗證項目]

## 💡 記憶口訣
[快速記憶]
```

---

### 資源文件組織

#### 1. Scripts（腳本）

**用途**: 需要確定性可靠性的重複操作

**範例**:
```python
# scripts/init_skill.py
"""
初始化新技能的標準目錄結構
"""
import os
import sys

def create_skill_structure(skill_name: str):
    base_path = f".claude/skills/{skill_name}"
    os.makedirs(f"{base_path}/scripts", exist_ok=True)
    os.makedirs(f"{base_path}/references", exist_ok=True)
    os.makedirs(f"{base_path}/assets", exist_ok=True)

    # 創建 SKILL.md 模板
    with open(f"{base_path}/SKILL.md", "w", encoding="utf-8") as f:
        f.write(SKILL_TEMPLATE)

    print(f"✅ 技能結構已創建: {base_path}")

if __name__ == "__main__":
    create_skill_structure(sys.argv[1])
```

#### 2. References（參考文檔）

**用途**: 按需加載到上下文的文檔（API、Schema、規範）

**範例**:
```json
// references/api-schema.json
{
  "openapi": "3.0.0",
  "paths": {
    "/api/v1/users": {
      "get": {
        "summary": "獲取使用者列表",
        "parameters": [...]
      }
    }
  }
}
```

#### 3. Assets（輸出範本）

**用途**: 直接使用的範本文件（不加載到上下文）

**範例**:
```html
<!-- assets/component-template.html -->
<template>
  <div class="{{componentName}}">
    <!-- 自動生成的內容 -->
  </div>
</template>
```

---

## 📖 技能創建流程

### 步驟 1: 理解（Understand）

**定義具體使用範例**:

```markdown
情境 1: 開發者想創建一個新的 CRUD 技能
期望: 自動生成符合四層架構的代碼範本

情境 2: 開發者想創建一個 API 設計技能
期望: 提供 RESTful 規範和範例

情境 3: 開發者想創建一個測試策略技能
期望: 生成測試計劃和測試代碼範本
```

**驗證標準**:
- [ ] 至少定義 3 個具體使用情境
- [ ] 每個情境都有明確的輸入和期望輸出
- [ ] 情境覆蓋主要使用場景

---

### 步驟 2: 規劃（Plan）

**識別可重用內容**:

| 內容類型 | 放置位置 | 範例 |
|---------|---------|------|
| **工作流程** | SKILL.md | TDD 流程、Git 工作流 |
| **代碼範本** | assets/ | Entity.java、Controller.java |
| **配置文件** | assets/ | .eslintrc.json、tsconfig.json |
| **驗證腳本** | scripts/ | validate_structure.py |
| **API 文檔** | references/ | OpenAPI spec、GraphQL schema |

**決策樹**:

```
這個內容是否需要 Claude 理解？
├─ 是 → 放在 SKILL.md 或 references/
└─ 否 → 放在 assets/（直接使用）

這個操作是否容易出錯？
├─ 是 → 提供具體腳本（scripts/）
└─ 否 → 提供文字指導（SKILL.md）

這個文檔是否總是需要？
├─ 是 → 放在 SKILL.md
└─ 否 → 放在 references/（按需加載）
```

---

### 步驟 3: 初始化（Initialize）

**使用腳本生成模板**:

```bash
# 方法 1: 使用 Python 腳本
python scripts/init_skill.py --name="api-design"

# 方法 2: 手動創建
mkdir -p .claude/skills/api-design/{scripts,references,assets}
touch .claude/skills/api-design/SKILL.md
```

**檢查清單**:
- [ ] 目錄結構正確
- [ ] SKILL.md 包含完整的 Frontmatter
- [ ] 子目錄根據需要創建

---

### 步驟 4: 編輯（Edit）

#### 4.1 編寫 SKILL.md

**Frontmatter 範例**:
```yaml
---
name: api-design
description: |
  RESTful API 設計規範與最佳實踐。
  涵蓋端點設計、HTTP 方法選擇、狀態碼、錯誤處理。
  適用於新建 API 或重構現有 API。
---
```

**Body 範例**:
```markdown
# API Design - API 設計規範

## 🎯 觸發條件

### 關鍵字列表
API 設計、RESTful、端點設計、HTTP 方法、
狀態碼、錯誤處理、API 規範

### 使用場景
1. 設計新的 RESTful API
2. 重構現有 API 結構
3. API Code Review

## 🏗️ 核心規範

### 1. 端點命名規範

- 使用名詞複數形式: `/api/v1/users`（不是 `/api/v1/getUsers`）
- 使用嵌套表示關係: `/api/v1/users/{id}/orders`
- 避免深層嵌套（最多 3 層）

[... 更多規範 ...]
```

#### 4.2 創建資源文件

**腳本範例**:
```python
# scripts/generate_api_template.py
def generate_endpoint(resource: str, methods: list[str]):
    """生成符合規範的 API 端點代碼"""
    template = """
@RestController
@RequestMapping("/api/v1/{resource}")
public class {ResourceName}Controller {{
    // 自動生成的端點
}}
    """.format(resource=resource, ResourceName=resource.capitalize())
    return template
```

**參考文檔範例**:
```yaml
# references/http-status-codes.yaml
success:
  200: OK - 請求成功
  201: Created - 資源已創建
  204: No Content - 成功但無返回內容

client_error:
  400: Bad Request - 請求參數錯誤
  401: Unauthorized - 未授權
  403: Forbidden - 禁止訪問
  404: Not Found - 資源不存在
```

---

### 步驟 5: 打包（Package）

**驗證結構**:
```bash
# 使用驗證腳本
python scripts/validate_skill.py api-design

# 輸出:
✅ SKILL.md 存在
✅ Frontmatter 格式正確
✅ 文件大小符合要求（3,245 字 < 5,000 字）
✅ 腳本可執行
✅ 參考文檔格式正確
```

**打包為 .skill 文件**:
```bash
# 創建分發包（zip 檔案）
python scripts/package_skill.py api-design

# 輸出: api-design.skill
```

---

### 步驟 6: 迭代（Iterate）

**基於實際使用優化**:

```markdown
觀察 1: 開發者經常忘記添加錯誤處理
行動: 在 SKILL.md 中增加錯誤處理範例

觀察 2: API 版本控制說明不夠清楚
行動: 新增 references/versioning-guide.md

觀察 3: 開發者需要快速生成 CRUD 端點
行動: 新增 scripts/generate_crud_endpoints.py
```

**版本控制**:
- 每次重大更新遞增版本號（v1.0 → v1.1）
- 在 SKILL.md 頂部記錄版本變更

---

## ❌ 禁止事項

### 1. 避免輔助文件

❌ **不要創建**:
- README.md（信息應在 SKILL.md）
- CHANGELOG.md（使用 Git 記錄）
- LICENSE（繼承專案授權）
- .gitignore（使用專案級配置）

✅ **正確做法**:
- 所有說明集中在 SKILL.md
- 版本變更記錄在 Git commit
- 專案級文件不重複

---

### 2. 避免過度詳細

❌ **錯誤示範**:
```markdown
## 什麼是 RESTful API？

REST（Representational State Transfer）是一種軟體架構風格，
由 Roy Fielding 在 2000 年提出。它定義了一組約束條件...
[3,000 字的 REST 理論介紹]
```

✅ **正確示範**:
```markdown
## RESTful API 核心約束

1. 無狀態（Stateless）: 每個請求包含所有必要信息
2. 可緩存（Cacheable）: 響應應明確標示是否可緩存
3. 統一接口（Uniform Interface）: 使用標準 HTTP 方法

[專注於實踐指導，而非理論介紹]
```

---

### 3. 避免未測試的腳本

❌ **危險做法**:
```python
# scripts/deploy.py
# 未測試就提交
def deploy():
    os.system("rm -rf /var/www/*")  # 危險操作！
    ...
```

✅ **正確做法**:
```python
# scripts/deploy.py
# 完整測試 + 安全檢查
def deploy(target_dir: str):
    if not target_dir.startswith("/var/www/safe-zone"):
        raise ValueError("部署路徑不安全")

    # 先備份
    backup(target_dir)

    # 再部署
    ...

# 附帶測試
if __name__ == "__main__":
    # 在沙盒環境測試
    test_deploy()
```

---

### 4. 避免參考文件過大

❌ **問題**:
```
references/complete-api-documentation.md  # 50,000 字
```

✅ **解決方案**:
```
references/
├── api-overview.md           # 1,000 字（總是加載）
├── endpoints/
│   ├── users.md             # 按需加載
│   ├── orders.md
│   └── products.md
└── schemas/
    ├── user-schema.json
    └── order-schema.json
```

---

## 📖 完整範例：API Design Skill

### 目錄結構

```
.claude/skills/api-design/
├── SKILL.md
├── scripts/
│   ├── generate_crud.py
│   └── validate_openapi.py
├── references/
│   ├── http-status-codes.yaml
│   └── rest-constraints.md
└── assets/
    ├── controller-template.java
    └── openapi-template.yaml
```

### SKILL.md 內容

```markdown
---
name: api-design
description: |
  RESTful API 設計規範。涵蓋端點命名、HTTP 方法、
  狀態碼、錯誤處理、版本控制。適用於新建或重構 API。
---

# API Design - API 設計規範

## 🎯 觸發條件

### 關鍵字
API 設計、RESTful、端點設計、HTTP 方法、狀態碼

### 使用場景
1. 設計新的 RESTful API
2. 重構現有 API
3. API Code Review

## 🏗️ 端點命名規範

### 基本規則

1. **使用名詞複數**
   ```
   ✅ GET /api/v1/users
   ❌ GET /api/v1/getUsers
   ```

2. **嵌套表示關係**
   ```
   ✅ GET /api/v1/users/{id}/orders
   ❌ GET /api/v1/user-orders?userId={id}
   ```

3. **避免深層嵌套**
   ```
   ✅ GET /api/v1/orders/{id}/items
   ❌ GET /api/v1/users/{id}/orders/{orderId}/items/{itemId}/details
   ```

## 🔧 HTTP 方法選擇

| 方法 | 用途 | 範例 |
|------|------|------|
| GET | 獲取資源 | `GET /users` - 列表<br>`GET /users/123` - 單個 |
| POST | 創建資源 | `POST /users` - 創建新用戶 |
| PUT | 完整更新 | `PUT /users/123` - 替換整個用戶 |
| PATCH | 部分更新 | `PATCH /users/123` - 更新部分欄位 |
| DELETE | 刪除資源 | `DELETE /users/123` - 刪除用戶 |

## 📊 狀態碼規範

加載參考文檔: `references/http-status-codes.yaml`

**常用狀態碼**:
- 200: 成功
- 201: 已創建（POST 成功）
- 400: 請求參數錯誤
- 401: 未授權
- 404: 資源不存在
- 500: 伺服器錯誤

## ❌ 常見錯誤

1. **在 URL 中使用動詞**
   ```
   ❌ POST /api/v1/createUser
   ✅ POST /api/v1/users
   ```

2. **不一致的命名**
   ```
   ❌ GET /api/v1/user-list
       POST /api/v1/users
   ✅ GET /api/v1/users
       POST /api/v1/users
   ```

## ✅ 自我檢查清單

- [ ] 端點使用名詞複數
- [ ] HTTP 方法選擇正確
- [ ] 狀態碼使用恰當
- [ ] 錯誤響應包含詳細信息
- [ ] API 版本化（/v1/）
- [ ] 文檔完整（OpenAPI）

## 💡 記憶口訣

**URL 設計**: 名詞複數，動詞靠 HTTP
**狀態碼**: 2xx 成功，4xx 客戶端，5xx 伺服器
**CRUD 映射**: POST 建，GET 查，PUT/PATCH 改，DELETE 刪
```

### scripts/generate_crud.py

```python
"""
自動生成符合規範的 CRUD 端點代碼
"""

def generate_crud_controller(resource: str):
    """
    生成標準 CRUD Controller

    Args:
        resource: 資源名稱（單數形式），如 'user'

    Returns:
        生成的 Java Controller 代碼
    """
    resource_plural = resource + 's'
    resource_class = resource.capitalize()

    template = f'''
@RestController
@RequestMapping("/api/v1/{resource_plural}")
public class {resource_class}Controller {{

    @GetMapping
    public ResponseEntity<List<{resource_class}>> getAll() {{
        // 獲取所有資源
        return ResponseEntity.ok(service.findAll());
    }}

    @GetMapping("/{{id}}")
    public ResponseEntity<{resource_class}> getById(@PathVariable Long id) {{
        // 獲取單個資源
        return service.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }}

    @PostMapping
    public ResponseEntity<{resource_class}> create(@RequestBody @Valid {resource_class}DTO dto) {{
        // 創建資源
        {resource_class} created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }}

    @PutMapping("/{{id}}")
    public ResponseEntity<{resource_class}> update(
            @PathVariable Long id,
            @RequestBody @Valid {resource_class}DTO dto) {{
        // 完整更新資源
        return service.update(id, dto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }}

    @DeleteMapping("/{{id}}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {{
        // 刪除資源
        service.delete(id);
        return ResponseEntity.noContent().build();
    }}
}}
'''

    return template.strip()

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("用法: python generate_crud.py <resource_name>")
        print("範例: python generate_crud.py user")
        sys.exit(1)

    resource = sys.argv[1]
    code = generate_crud_controller(resource)

    # 輸出到文件
    output_file = f"{resource.capitalize()}Controller.java"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(code)

    print(f"✅ 已生成: {output_file}")
```

### references/http-status-codes.yaml

```yaml
# HTTP 狀態碼快速參考

success:
  200:
    name: OK
    description: 請求成功
    use_case: GET、PUT、PATCH 成功

  201:
    name: Created
    description: 資源已創建
    use_case: POST 成功創建資源

  204:
    name: No Content
    description: 成功但無返回內容
    use_case: DELETE 成功

client_error:
  400:
    name: Bad Request
    description: 請求參數錯誤
    use_case: 驗證失敗、JSON 格式錯誤

  401:
    name: Unauthorized
    description: 未授權
    use_case: Token 無效或缺失

  403:
    name: Forbidden
    description: 禁止訪問
    use_case: 權限不足

  404:
    name: Not Found
    description: 資源不存在
    use_case: 找不到指定 ID 的資源

  409:
    name: Conflict
    description: 資源衝突
    use_case: 唯一性約束違反（如重複的 email）

server_error:
  500:
    name: Internal Server Error
    description: 伺服器內部錯誤
    use_case: 未捕獲的異常

  503:
    name: Service Unavailable
    description: 服務不可用
    use_case: 維護中、過載
```

---

## ✅ 技能創建自我檢查清單

### 設計階段
- [ ] 定義了 3+ 個具體使用情境
- [ ] 識別了核心規範和最佳實踐
- [ ] 規劃了資源文件組織（scripts/references/assets）
- [ ] 評估了 Token 預算（SKILL.md < 5,000 字）

### 實現階段
- [ ] SKILL.md 包含完整的 YAML Frontmatter
- [ ] `description` 包含觸發關鍵字和使用場景
- [ ] 遵循簡潔性原則（無冗餘內容）
- [ ] 選擇了適當的自由度（文字/偽代碼/腳本）
- [ ] 實現了漸進式披露（核心在 SKILL.md，細節在 references）

### 資源文件
- [ ] 所有腳本已測試並可執行
- [ ] 參考文檔精簡且結構化
- [ ] 範本文件直接可用（assets）
- [ ] 避免了輔助文件（README、CHANGELOG 等）

### 驗證階段
- [ ] 使用驗證腳本檢查結構
- [ ] SKILL.md 字數 < 5,000 字
- [ ] 觸發機制正常工作
- [ ] 實際使用測試（至少 3 個場景）

### 文檔化
- [ ] 更新 `.claude/skills/README.md`
- [ ] 更新 `skill-forced-eval.js`
- [ ] 添加使用範例
- [ ] 記錄版本變更

---

## 💡 記憶口訣

**設計口訣**:
> 簡潔第一，上下文珍貴
> 自由適度，該緊則緊
> 漸進披露，按需加載

**結構口訣**:
> SKILL 核心，Scripts 輔助
> References 參考，Assets 範本
> 元數據觸發，Body 指導

**流程口訣**:
> 理解場景，規劃內容
> 初始模板，編輯完善
> 打包驗證，迭代優化

**禁止口訣**:
> 無輔助文件，無過度詳細
> 無未測腳本，無巨型參考

---

## 📚 參考資源

### 官方文檔
- [Anthropic Skills 倉庫](https://github.com/anthropics/skills)
- [Claude Code 文檔](https://docs.anthropic.com/claude-code)

### 相關技能
- **crud-development** - CRUD 開發規範（參考範例）
- **api-design** - API 設計規範（本技能創建的範例）

### 進階閱讀
- `references/progressive-disclosure-patterns.md` - 漸進式披露進階技巧
- `references/token-optimization-guide.md` - Token 優化指南

---

**版本**: v1.0
**創建時間**: 2025-12-26
**維護者**: Claude Code + zycaskevin
**授權**: MIT
