# 資料庫操作技能（Database Operations）

> **技能 ID**: `database-ops`
> **版本**: 1.0.0
> **用途**: PostgreSQL / Supabase 資料庫設計、查詢優化、安全性配置
> **參考**:
> - [Supabase Docs](https://supabase.com/docs/guides/database)
> - [PostgreSQL Docs](https://www.postgresql.org/docs/)
> - [sql-expert](https://github.com/0xfurai/claude-code-subagents)

---

## 觸發條件

當使用者需求包含以下關鍵字時，應激活此技能：

- 「資料庫」、「Database」、「DB」
- 「SQL」、「PostgreSQL」、「Postgres」
- 「Supabase」、「RLS」、「Row Level Security」
- 「建表」、「索引」、「Index」
- 「查詢優化」、「Query Optimization」
- 「遷移」、「Migration」

---

## 一、PostgreSQL 核心概念

### 1.1 資料類型選擇

| 類型 | 用途 | 範例 |
|------|------|------|
| `bigint` / `int8` | 大整數（推薦主鍵） | ID、計數器 |
| `uuid` | 唯一識別碼 | 分散式系統 ID |
| `text` | 變長字串（無限制） | 描述、內容 |
| `varchar(n)` | 限長字串 | 名稱、郵件 |
| `boolean` | 布林值 | 狀態標記 |
| `timestamptz` | 帶時區時間戳 | 創建/更新時間 |
| `jsonb` | 二進位 JSON | 動態屬性 |
| `decimal(p,s)` | 精確數值 | 金額、價格 |

### 1.2 主鍵設計

```sql
-- ✅ 推薦：Identity Column（自增主鍵）
CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ✅ 推薦：UUID（分散式系統）
CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id bigint REFERENCES users(id),
  total_amount decimal(10,2) NOT NULL
);

-- ❌ 避免：手動管理序列
CREATE TABLE bad_example (
  id serial PRIMARY KEY  -- 使用 identity 替代
);
```

### 1.3 命名規範

```sql
-- ✅ 正確命名
CREATE TABLE order_items (          -- 小寫 + 底線 + 複數
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id uuid REFERENCES orders(id),
  product_id bigint NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ❌ 錯誤命名
CREATE TABLE "Order Items" (...)    -- 禁止空格
CREATE TABLE orderItems (...)       -- 禁止 camelCase
CREATE TABLE ORDERS (...)           -- 禁止全大寫
```

---

## 二、Supabase 整合

### 2.1 Supabase 專案初始化

```bash
# 安裝 Supabase CLI
npm install -g supabase

# 初始化專案
supabase init

# 連接遠端專案
supabase link --project-ref <project-id>

# 推送本地遷移
supabase db push
```

### 2.2 TypeScript Client 配置

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// 服務端專用（有完整權限）
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

### 2.3 類型生成

```bash
# 生成 TypeScript 類型
supabase gen types typescript --project-id <project-id> > lib/database.types.ts

# 或從本地 DB 生成
supabase gen types typescript --local > lib/database.types.ts
```

---

## 三、Row Level Security (RLS)

### 3.1 RLS 核心概念

```sql
-- 啟用 RLS（必須！）
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 強制所有用戶（包括 owner）遵守 RLS
ALTER TABLE profiles FORCE ROW LEVEL SECURITY;
```

### 3.2 Policy 模式

#### SELECT Policy（讀取控制）

```sql
-- 用戶只能看自己的資料
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 公開資料可被所有人看到
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (is_public = true);
```

#### INSERT Policy（寫入控制）

```sql
-- 用戶只能創建自己的資料
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

#### UPDATE Policy（更新控制）

```sql
-- 用戶只能更新自己的資料
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

#### DELETE Policy（刪除控制）

```sql
-- 用戶只能刪除自己的資料
CREATE POLICY "Users can delete own profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### 3.3 進階 RLS 模式

```sql
-- 組織層級 RLS
CREATE POLICY "Organization members can view"
ON documents FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id
    FROM organization_members
    WHERE user_id = auth.uid()
  )
);

-- 角色型 RLS
CREATE POLICY "Admins can manage all"
ON documents FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 時間限制 RLS
CREATE POLICY "Published content only"
ON articles FOR SELECT
USING (
  published_at IS NOT NULL
  AND published_at <= now()
);
```

### 3.4 RLS 最佳實踐

```sql
-- ✅ 正確：使用 (select auth.uid()) 提升效能
CREATE POLICY "Optimized policy"
ON profiles FOR SELECT
USING ((select auth.uid()) = user_id);

-- ❌ 錯誤：直接使用 auth.uid() 可能每行都執行
CREATE POLICY "Slow policy"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- ✅ 正確：明確處理 NULL
CREATE POLICY "Explicit null handling"
ON profiles FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND auth.uid() = user_id
);

-- ✅ 正確：指定角色
CREATE POLICY "Role specific"
ON profiles FOR SELECT
TO authenticated  -- 只對 authenticated 角色生效
USING (auth.uid() = user_id);
```

---

## 四、索引策略

### 4.1 索引類型

```sql
-- B-Tree 索引（預設，最常用）
CREATE INDEX idx_users_email ON users(email);

-- 唯一索引
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- 複合索引（注意欄位順序）
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- 部分索引（僅索引特定條件資料）
CREATE INDEX idx_orders_pending ON orders(created_at)
WHERE status = 'pending';

-- GIN 索引（JSONB、全文搜索）
CREATE INDEX idx_products_metadata ON products USING gin(metadata);

-- 表達式索引
CREATE INDEX idx_users_lower_email ON users(lower(email));
```

### 4.2 何時建立索引

```markdown
✅ 應該建立索引：
- WHERE 子句經常查詢的欄位
- JOIN 操作的欄位
- ORDER BY 經常排序的欄位
- UNIQUE 約束欄位
- 外鍵欄位

❌ 不應該建立索引：
- 很少查詢的欄位
- 低基數欄位（如 boolean、status 只有幾個值）
- 頻繁更新的小型資料表
- 已經是主鍵的欄位
```

### 4.3 索引維護

```sql
-- 非阻塞式創建索引（大型資料表）
CREATE INDEX CONCURRENTLY idx_large_table_column
ON large_table(column);

-- 重建索引
REINDEX INDEX CONCURRENTLY idx_users_email;

-- 查看未使用的索引
SELECT
  schemaname, tablename, indexname,
  idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;

-- 刪除未使用的索引
DROP INDEX IF EXISTS idx_unused;
```

---

## 五、查詢優化

### 5.1 EXPLAIN 分析

```sql
-- 基本執行計劃
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- 詳細分析（包含實際執行時間）
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM users WHERE email = 'test@example.com';

-- 關鍵指標解讀：
-- Seq Scan → 全表掃描（通常需要優化）
-- Index Scan → 索引掃描（良好）
-- Index Only Scan → 僅索引掃描（最佳）
-- cost=0.00..123.45 → 啟動成本..總成本
-- rows=100 → 預估返回行數
```

### 5.2 常見優化模式

```sql
-- ❌ N+1 查詢問題
SELECT * FROM orders WHERE user_id = 1;
-- 然後為每個 order 執行
SELECT * FROM order_items WHERE order_id = ?;

-- ✅ JOIN 一次查詢
SELECT o.*, oi.*
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = 1;

-- ❌ 避免 SELECT *
SELECT * FROM users;

-- ✅ 只選需要的欄位
SELECT id, email, name FROM users;

-- ❌ 避免在 WHERE 中使用函數
SELECT * FROM users WHERE LOWER(email) = 'test@example.com';

-- ✅ 使用表達式索引或預處理
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
SELECT * FROM users WHERE LOWER(email) = 'test@example.com';
```

### 5.3 分頁查詢

```sql
-- ❌ OFFSET 分頁（大資料集效能差）
SELECT * FROM products
ORDER BY id
LIMIT 20 OFFSET 10000;  -- 需要掃描 10020 行

-- ✅ Keyset/Cursor 分頁（效能一致）
SELECT * FROM products
WHERE id > 10000  -- 上一頁最後一個 ID
ORDER BY id
LIMIT 20;

-- ✅ 複合鍵分頁
SELECT * FROM products
WHERE (created_at, id) > ('2024-01-01', 100)
ORDER BY created_at, id
LIMIT 20;
```

---

## 六、遷移管理

### 6.1 Supabase Migration

```bash
# 創建新遷移
supabase migration new create_users_table

# 編輯遷移文件
# supabase/migrations/20240101000000_create_users_table.sql
```

```sql
-- supabase/migrations/20240101000000_create_users_table.sql

-- UP
CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 啟用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 建立 Policies
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING ((select auth.uid()) = id);

-- 建立索引
CREATE INDEX idx_users_email ON users(email);

-- 建立觸發器（自動更新 updated_at）
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

### 6.2 遷移最佳實踐

```markdown
✅ 正確做法：
- 每個遷移只做一件事
- 遷移檔名包含時間戳
- 總是測試 rollback
- 使用 CONCURRENTLY 建索引

❌ 避免：
- 在遷移中刪除欄位（先標記廢棄）
- 直接重命名欄位（創建新欄位 + 資料遷移）
- 未測試的大型資料變更
```

---

## 七、Supabase 進階功能

### 7.1 Realtime 訂閱

```typescript
// 訂閱資料變更
const subscription = supabase
  .channel('orders_changes')
  .on(
    'postgres_changes',
    {
      event: '*',  // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'orders',
      filter: 'user_id=eq.' + userId
    },
    (payload) => {
      console.log('Change received:', payload);
    }
  )
  .subscribe();

// 取消訂閱
subscription.unsubscribe();
```

### 7.2 RPC 函數呼叫

```sql
-- 建立資料庫函數
CREATE OR REPLACE FUNCTION get_user_stats(target_user_id bigint)
RETURNS json AS $$
  SELECT json_build_object(
    'order_count', (SELECT COUNT(*) FROM orders WHERE user_id = target_user_id),
    'total_spent', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE user_id = target_user_id)
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

```typescript
// TypeScript 呼叫
const { data, error } = await supabase
  .rpc('get_user_stats', { target_user_id: userId });
```

### 7.3 Edge Functions

```typescript
// supabase/functions/hello/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(10);

  return new Response(
    JSON.stringify({ data, error }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
```

---

## 八、安全性規範

### 8.1 API Key 管理

```typescript
// ✅ 正確：環境變數
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ❌ 錯誤：硬編碼
const supabaseUrl = 'https://xxx.supabase.co';  // 禁止
const supabaseServiceKey = 'eyJ...';  // 絕對禁止
```

### 8.2 服務角色安全

```markdown
⚠️ service_role key 使用規則：

✅ 允許使用：
- 伺服器端背景任務
- Edge Functions
- 管理員專用 API

❌ 禁止使用：
- 前端代碼
- 客戶端 JavaScript
- 任何公開暴露的地方
```

### 8.3 SQL 注入防護

```typescript
// ❌ 錯誤：字串拼接（SQL 注入風險）
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ 正確：參數化查詢
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', email);

// ✅ 正確：使用 RPC 函數
const { data, error } = await supabase
  .rpc('search_users', { search_term: userInput });
```

---

## 九、禁止行為

```markdown
❌ 絕對禁止：
1. 在前端暴露 service_role key
2. 不啟用 RLS 的公開資料表
3. 使用字串拼接構造 SQL
4. 在遷移中直接刪除生產資料
5. 忽略 NULL 值處理
6. 使用 SELECT * 查詢大型資料表
7. 對小型查詢使用 OFFSET 分頁
8. 不建立外鍵索引
9. 儲存明文密碼
10. 在 RLS Policy 中使用不安全的 JWT claims
```

---

## 十、自檢清單

```markdown
□ 所有資料表啟用 RLS
□ 每個資料表有適當的 Policy
□ 外鍵欄位有索引
□ 常用查詢欄位有索引
□ 使用參數化查詢
□ 環境變數管理敏感資訊
□ 遷移檔案版本控制
□ 生產環境未使用 service_role key
□ updated_at 自動更新
□ 查詢使用 EXPLAIN 驗證
```

---

## 參考資源

- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [sql-expert Agent](https://github.com/0xfurai/claude-code-subagents)
- [claudekit-skills/databases](https://github.com/mrgoonie/claudekit-skills)
- [postgres-mcp](https://github.com/crystaldba/postgres-mcp)

---

**版本**: 1.0.0
**最後更新**: 2025-12-26
