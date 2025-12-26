# REST API Design - RESTful API 設計規範

> **技能 ID**: rest-api-design
> **版本**: v1.0
> **用途**: RESTful API 設計規範，涵蓋資源建模、HTTP 方法、版本控制、分頁、錯誤處理與安全
> **來源**: 基於 [luxor-claude-marketplace/rest-api-design-patterns](https://github.com/manutej/luxor-claude-marketplace) + 業界最佳實踐
> **授權**: MIT

---

## 🎯 觸發條件

### 關鍵字列表
```
REST API、RESTful、API 設計、端點設計、HTTP 方法、
API 版本控制、分頁設計、API 錯誤處理、HATEOAS、
資源建模、API 規範、OpenAPI、Swagger、
FastAPI、Express、Spring Boot API
```

### 使用場景
1. **設計新 API** - 從零開始設計 RESTful API
2. **重構現有 API** - 優化 API 結構和規範
3. **API Code Review** - 檢查 API 是否符合最佳實踐
4. **API 文檔生成** - 撰寫 OpenAPI/Swagger 規範
5. **微服務 API** - 設計服務間通訊介面

---

## 🧠 核心理念

### REST 成熟度模型 (Richardson Maturity Model)

```
Level 3: HATEOAS (超媒體驅動)
   ↑ 響應中包含相關資源連結
Level 2: HTTP 動詞 (推薦最低標準)
   ↑ 正確使用 GET/POST/PUT/PATCH/DELETE
Level 1: 資源
   ↑ 使用 URI 識別資源
Level 0: POX (Plain Old XML/JSON)
   └ 單一端點，RPC 風格
```

> **目標**: 至少達到 **Level 2**，理想達到 **Level 3**

---

## 🏗️ 資源建模規範

### 命名規則

| 規則 | 正確 ✅ | 錯誤 ❌ |
|------|---------|---------|
| 使用名詞 | `/users` | `/getUsers` |
| 使用複數 | `/products` | `/product` |
| 小寫 + 連字號 | `/user-profiles` | `/userProfiles` |
| 資源層級 | `/users/{id}/orders` | `/getUserOrders` |

### 五大資源模式

```markdown
1. 集合資源 (Collection)
   GET /api/v1/users          → 列表
   POST /api/v1/users         → 創建

2. 單一資源 (Item)
   GET /api/v1/users/{id}     → 讀取
   PUT /api/v1/users/{id}     → 完整更新
   PATCH /api/v1/users/{id}   → 部分更新
   DELETE /api/v1/users/{id}  → 刪除

3. 巢狀資源 (Nested)
   GET /api/v1/users/{id}/orders
   POST /api/v1/users/{id}/orders

4. 動作端點 (Action) - 非 CRUD 操作
   POST /api/v1/users/{id}/activate
   POST /api/v1/orders/{id}/cancel

5. 批量操作 (Bulk)
   POST /api/v1/users/bulk-create
   DELETE /api/v1/users/bulk-delete
```

---

## 🔧 HTTP 方法規範

### 方法對照表

| 方法 | 用途 | 安全性 | 冪等性 | 請求體 | 成功狀態碼 |
|------|------|--------|--------|--------|-----------|
| GET | 讀取資源 | ✅ | ✅ | ❌ | 200 |
| POST | 創建資源 | ❌ | ❌ | ✅ | 201 |
| PUT | 完整更新 | ❌ | ✅ | ✅ | 200 |
| PATCH | 部分更新 | ❌ | ❌ | ✅ | 200 |
| DELETE | 刪除資源 | ❌ | ✅ | ❌ | 204 |

### FastAPI 範例

```python
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI()

class UserCreate(BaseModel):
    name: str
    email: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

class User(BaseModel):
    id: int
    name: str
    email: str

# GET - 列表
@app.get("/api/v1/users", response_model=List[User])
async def list_users(
    skip: int = 0,
    limit: int = 20,
    sort: str = "created_at"
):
    return users[skip:skip + limit]

# GET - 單一資源
@app.get("/api/v1/users/{user_id}", response_model=User)
async def get_user(user_id: int):
    user = find_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "USER_NOT_FOUND", "message": f"User {user_id} not found"}
        )
    return user

# POST - 創建
@app.post("/api/v1/users", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    new_user = User(id=generate_id(), **user.dict())
    return new_user

# PUT - 完整更新
@app.put("/api/v1/users/{user_id}", response_model=User)
async def update_user(user_id: int, user: UserCreate):
    existing = find_user(user_id)
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")
    return User(id=user_id, **user.dict())

# PATCH - 部分更新
@app.patch("/api/v1/users/{user_id}", response_model=User)
async def patch_user(user_id: int, user: UserUpdate):
    existing = find_user(user_id)
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")
    update_data = user.dict(exclude_unset=True)
    return User(id=user_id, **{**existing.dict(), **update_data})

# DELETE - 刪除
@app.delete("/api/v1/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int):
    if not find_user(user_id):
        raise HTTPException(status_code=404, detail="User not found")
    remove_user(user_id)
    return None
```

### Express.js 範例

```javascript
const express = require('express');
const router = express.Router();

// GET - 列表
router.get('/api/v1/users', async (req, res) => {
  const { skip = 0, limit = 20, sort = 'created_at' } = req.query;
  const users = await User.find()
    .sort(sort)
    .skip(parseInt(skip))
    .limit(parseInt(limit));
  res.json({ data: users, meta: { skip, limit, total: await User.count() } });
});

// GET - 單一資源
router.get('/api/v1/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      error: { code: 'USER_NOT_FOUND', message: `User ${req.params.id} not found` }
    });
  }
  res.json({ data: user });
});

// POST - 創建
router.post('/api/v1/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: error.message }
    });
  }
});

// PUT - 完整更新
router.put('/api/v1/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!user) return res.status(404).json({ error: { code: 'USER_NOT_FOUND' } });
  res.json({ data: user });
});

// PATCH - 部分更新
router.patch('/api/v1/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!user) return res.status(404).json({ error: { code: 'USER_NOT_FOUND' } });
  res.json({ data: user });
});

// DELETE - 刪除
router.delete('/api/v1/users/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: { code: 'USER_NOT_FOUND' } });
  res.status(204).send();
});

module.exports = router;
```

---

## 📊 版本控制策略

### 四種策略比較

| 策略 | 範例 | 優點 | 缺點 | 推薦度 |
|------|------|------|------|--------|
| **URI 版本** | `/api/v1/users` | 清晰、易緩存 | URL 變更 | ⭐⭐⭐⭐⭐ |
| Header 版本 | `X-API-Version: 1` | URL 乾淨 | 不易發現 | ⭐⭐⭐ |
| Content 協商 | `Accept: application/vnd.api.v1+json` | 標準做法 | 複雜 | ⭐⭐⭐ |
| Query 參數 | `/users?version=1` | 簡單 | 不利緩存 | ⭐⭐ |

### URI 版本（推薦）

```python
# FastAPI - 使用 Router 前綴
from fastapi import APIRouter

v1_router = APIRouter(prefix="/api/v1")
v2_router = APIRouter(prefix="/api/v2")

@v1_router.get("/users")
async def list_users_v1():
    return {"version": "1.0", "data": users}

@v2_router.get("/users")
async def list_users_v2():
    # V2 新增 metadata 欄位
    return {"version": "2.0", "data": users, "metadata": {...}}

app.include_router(v1_router)
app.include_router(v2_router)
```

---

## 📄 分頁設計

### 三種分頁模式

| 模式 | 適用場景 | 優點 | 缺點 |
|------|---------|------|------|
| **Offset** | 小型資料集 | 簡單、可跳頁 | 大資料集效能差 |
| **Cursor** | 大型資料集 | 效能好、一致性 | 不能跳頁 |
| **Page** | 傳統 UI | 直觀 | 同 Offset |

### Offset 分頁（小型資料集）

```python
# 請求
GET /api/v1/users?offset=0&limit=20

# 響應
{
    "data": [...],
    "pagination": {
        "offset": 0,
        "limit": 20,
        "total": 150,
        "has_more": true
    }
}
```

### Cursor 分頁（大型資料集，推薦）

```python
# 請求
GET /api/v1/users?cursor=eyJpZCI6MTAwfQ&limit=20

# 響應
{
    "data": [...],
    "pagination": {
        "next_cursor": "eyJpZCI6MTIwfQ",
        "prev_cursor": "eyJpZCI6ODB9",
        "limit": 20,
        "has_more": true
    },
    "links": {
        "next": "/api/v1/users?cursor=eyJpZCI6MTIwfQ&limit=20",
        "prev": "/api/v1/users?cursor=eyJpZCI6ODB9&limit=20"
    }
}
```

### FastAPI 實作

```python
from fastapi import Query
from typing import Optional
import base64
import json

def encode_cursor(data: dict) -> str:
    return base64.b64encode(json.dumps(data).encode()).decode()

def decode_cursor(cursor: str) -> dict:
    return json.loads(base64.b64decode(cursor.encode()).decode())

@app.get("/api/v1/users")
async def list_users(
    cursor: Optional[str] = None,
    limit: int = Query(default=20, le=100)
):
    # 解析 cursor
    if cursor:
        cursor_data = decode_cursor(cursor)
        query = User.filter(id__gt=cursor_data["id"])
    else:
        query = User.all()

    users = await query.limit(limit + 1).all()
    has_more = len(users) > limit
    users = users[:limit]

    # 生成下一頁 cursor
    next_cursor = None
    if has_more and users:
        next_cursor = encode_cursor({"id": users[-1].id})

    return {
        "data": users,
        "pagination": {
            "next_cursor": next_cursor,
            "limit": limit,
            "has_more": has_more
        }
    }
```

---

## 🔍 過濾與排序

### 查詢參數規範

```bash
# 基本過濾
GET /api/v1/users?status=active&role=admin

# 範圍過濾
GET /api/v1/products?price_min=100&price_max=500

# 搜尋
GET /api/v1/users?search=john

# 排序（多欄位）
GET /api/v1/users?sort=-created_at,name  # - 表示降序

# 欄位選擇
GET /api/v1/users?fields=id,name,email

# 組合查詢
GET /api/v1/products?category=electronics&price_min=100&sort=-rating&limit=10
```

### FastAPI 實作

```python
from fastapi import Query
from typing import Optional, List

@app.get("/api/v1/products")
async def list_products(
    # 過濾
    category: Optional[str] = None,
    status: Optional[str] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    # 搜尋
    search: Optional[str] = None,
    # 排序
    sort: str = Query(default="-created_at"),
    # 欄位選擇
    fields: Optional[str] = None,
    # 分頁
    offset: int = 0,
    limit: int = Query(default=20, le=100)
):
    query = Product.all()

    # 應用過濾
    if category:
        query = query.filter(category=category)
    if status:
        query = query.filter(status=status)
    if price_min:
        query = query.filter(price__gte=price_min)
    if price_max:
        query = query.filter(price__lte=price_max)
    if search:
        query = query.filter(name__icontains=search)

    # 應用排序
    for sort_field in sort.split(","):
        if sort_field.startswith("-"):
            query = query.order_by(f"-{sort_field[1:]}")
        else:
            query = query.order_by(sort_field)

    # 應用分頁
    products = await query.offset(offset).limit(limit).all()

    # 欄位選擇
    if fields:
        field_list = fields.split(",")
        products = [{k: v for k, v in p.dict().items() if k in field_list} for p in products]

    return {"data": products, "meta": {"offset": offset, "limit": limit}}
```

---

## ⚠️ 錯誤處理規範

### 標準錯誤格式

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid request parameters",
        "details": [
            {
                "field": "email",
                "message": "Invalid email format"
            },
            {
                "field": "age",
                "message": "Must be a positive integer"
            }
        ],
        "request_id": "req_abc123",
        "timestamp": "2025-01-15T10:30:00Z",
        "documentation_url": "https://api.example.com/docs/errors#VALIDATION_ERROR"
    }
}
```

### HTTP 狀態碼規範

| 狀態碼 | 用途 | 錯誤代碼範例 |
|--------|------|-------------|
| 400 | 請求參數錯誤 | VALIDATION_ERROR, INVALID_JSON |
| 401 | 未認證 | UNAUTHORIZED, TOKEN_EXPIRED |
| 403 | 無權限 | FORBIDDEN, INSUFFICIENT_PERMISSIONS |
| 404 | 資源不存在 | NOT_FOUND, USER_NOT_FOUND |
| 409 | 資源衝突 | CONFLICT, DUPLICATE_EMAIL |
| 422 | 語義錯誤 | UNPROCESSABLE_ENTITY |
| 429 | 請求過多 | RATE_LIMIT_EXCEEDED |
| 500 | 伺服器錯誤 | INTERNAL_ERROR |
| 503 | 服務不可用 | SERVICE_UNAVAILABLE |

### FastAPI 錯誤處理

```python
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

class ErrorDetail(BaseModel):
    field: Optional[str] = None
    message: str

class ErrorResponse(BaseModel):
    code: str
    message: str
    details: Optional[List[ErrorDetail]] = None
    request_id: str
    timestamp: str

class APIException(Exception):
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        details: List[ErrorDetail] = None
    ):
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details

@app.exception_handler(APIException)
async def api_exception_handler(request: Request, exc: APIException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": [d.dict() for d in exc.details] if exc.details else None,
                "request_id": str(uuid.uuid4()),
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        }
    )

# 使用範例
@app.get("/api/v1/users/{user_id}")
async def get_user(user_id: int):
    user = await find_user(user_id)
    if not user:
        raise APIException(
            status_code=404,
            code="USER_NOT_FOUND",
            message=f"User with ID {user_id} not found"
        )
    return {"data": user}
```

---

## 🔗 HATEOAS（超媒體驅動）

### 響應中包含連結

```json
{
    "data": {
        "id": 123,
        "name": "John Doe",
        "email": "john@example.com"
    },
    "links": {
        "self": "/api/v1/users/123",
        "orders": "/api/v1/users/123/orders",
        "profile": "/api/v1/users/123/profile",
        "update": "/api/v1/users/123",
        "delete": "/api/v1/users/123"
    },
    "actions": {
        "activate": {
            "href": "/api/v1/users/123/activate",
            "method": "POST"
        },
        "deactivate": {
            "href": "/api/v1/users/123/deactivate",
            "method": "POST"
        }
    }
}
```

---

## 🔒 安全規範

### JWT 認證

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

security = HTTPBearer()

async def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=["HS256"]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "TOKEN_EXPIRED", "message": "Token has expired"}
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_TOKEN", "message": "Invalid token"}
        )

@app.get("/api/v1/users/me")
async def get_current_user(user: dict = Depends(verify_token)):
    return {"data": user}
```

### Rate Limiting

```python
from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/api/v1/users")
@limiter.limit("100/minute")
async def list_users(request: Request):
    return {"data": users}
```

### 輸入驗證

```python
from pydantic import BaseModel, EmailStr, Field, validator
import re

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)

    @validator("name")
    def validate_name(cls, v):
        if not re.match(r"^[a-zA-Z\s]+$", v):
            raise ValueError("Name can only contain letters and spaces")
        return v.strip()

    @validator("password")
    def validate_password(cls, v):
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain uppercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain digit")
        return v
```

---

## 📖 OpenAPI 文檔

### FastAPI 自動生成

```python
from fastapi import FastAPI

app = FastAPI(
    title="My API",
    description="RESTful API following best practices",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

@app.get(
    "/api/v1/users/{user_id}",
    summary="Get user by ID",
    description="Retrieve a single user by their unique identifier",
    response_description="The requested user",
    responses={
        200: {"description": "User found"},
        404: {"description": "User not found"}
    },
    tags=["Users"]
)
async def get_user(user_id: int):
    """
    Get a user by ID.

    - **user_id**: The unique identifier of the user
    """
    return {"data": user}
```

---

## ❌ 禁止事項

### 1. 端點命名

```markdown
❌ 不要使用動詞:
   /api/v1/getUsers → /api/v1/users
   /api/v1/createOrder → /api/v1/orders (POST)
   /api/v1/deleteUser/123 → /api/v1/users/123 (DELETE)

❌ 不要使用單數:
   /api/v1/user → /api/v1/users

❌ 不要使用 camelCase:
   /api/v1/userProfiles → /api/v1/user-profiles
```

### 2. HTTP 方法

```markdown
❌ 不要用 GET 修改資料:
   GET /api/v1/users/123/delete → DELETE /api/v1/users/123

❌ 不要用 POST 做所有事:
   POST /api/v1/users/get → GET /api/v1/users
```

### 3. 狀態碼

```markdown
❌ 不要總是返回 200:
   錯誤時返回 200 + error body → 返回對應 4xx/5xx

❌ 不要返回空 body 給錯誤:
   返回空 body → 返回結構化錯誤訊息
```

---

## ✅ 自我檢查清單

### 設計階段
- [ ] 資源使用名詞複數
- [ ] URL 使用小寫 + 連字號
- [ ] 遵循 REST Level 2+
- [ ] 版本控制策略確定

### 實作階段
- [ ] HTTP 方法使用正確
- [ ] 狀態碼返回正確
- [ ] 錯誤格式標準化
- [ ] 分頁實作完成
- [ ] 過濾/排序支援

### 安全階段
- [ ] 認證機制實作
- [ ] 輸入驗證完成
- [ ] Rate Limiting 設置
- [ ] CORS 配置正確

### 文檔階段
- [ ] OpenAPI 規範完整
- [ ] 範例請求/響應
- [ ] 錯誤代碼文檔

---

## 💡 記憶口訣

**端點設計**:
> 名詞複數，動詞靠 HTTP
> 小寫連字，層級清晰

**方法選擇**:
> GET 讀，POST 建
> PUT 全改，PATCH 部分
> DELETE 刪，狀態碼對

**版本控制**:
> URI 版本最推薦
> `/api/v1/` 開頭寫

**錯誤處理**:
> 結構統一，代碼明確
> 4xx 客戶，5xx 伺服

---

## 📚 參考資源

### 來源
- [luxor-claude-marketplace/rest-api-design-patterns](https://github.com/manutej/luxor-claude-marketplace)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [Google API Design Guide](https://cloud.google.com/apis/design)

### 框架文檔
- [FastAPI](https://fastapi.tiangolo.com/)
- [Express.js](https://expressjs.com/)
- [Spring Boot](https://spring.io/projects/spring-boot)

### 相關技能
- **crud-development** - CRUD 開發規範
- **mcp-builder** - MCP/API 整合

---

**版本**: v1.0
**創建時間**: 2025-12-26
**維護者**: Claude Code + zycaskevin
**授權**: MIT
