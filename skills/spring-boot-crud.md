# Spring Boot CRUD Patterns - Spring Boot CRUD 模式

> **技能 ID**: spring-boot-crud
> **版本**: v1.1
> **用途**: Spring Boot 3.5+ 的 CRUD 架構模式，使用 DDD 分層設計與 Spring Data JPA
> **來源**: 基於 [giuseppe-trisciuoglio/developer-kit](https://github.com/giuseppe-trisciuoglio/developer-kit)
> **完整範例**: [references/spring-boot-crud-examples.md](references/spring-boot-crud-examples.md)

---

## 🎯 觸發條件

### 關鍵字列表
```
Spring Boot CRUD、Spring Data JPA、DDD、領域驅動設計、
四層架構、Aggregate、Repository、Service Layer、
Controller、DTO、Entity、JPA、Java 後端
```

### 使用場景
1. **REST 端點實作** - 創建 CRUD API 端點
2. **Repository 設計** - 設計資料存取層
3. **DTO 映射** - Entity 與 DTO 轉換
4. **DDD 架構** - 實作領域驅動設計

---

## 🧠 核心架構

### 四層架構（DDD 風格）

```
┌─────────────────────────────────────────────────┐
│                 Presentation Layer              │
│  (Controllers, Request/Response DTOs, Mappers)  │
├─────────────────────────────────────────────────┤
│                 Application Layer               │
│     (Services, Use Cases, Transaction Mgmt)     │
├─────────────────────────────────────────────────┤
│                   Domain Layer                  │
│   (Aggregates, Entities, Value Objects, Ports)  │
├─────────────────────────────────────────────────┤
│               Infrastructure Layer              │
│  (JPA Adapters, Repositories, External APIs)    │
└─────────────────────────────────────────────────┘
```

### 功能模組結構（Feature-Aligned）

```
src/main/java/com/example/app/
├── feature/
│   └── product/                      # 功能模組
│       ├── domain/                   # 領域層
│       │   ├── Product.java          # Aggregate Root
│       │   ├── ProductId.java        # Value Object
│       │   └── ProductRepository.java # Port (Interface)
│       ├── application/              # 應用層
│       │   ├── ProductService.java   # Use Case
│       │   ├── CreateProductCommand.java
│       │   └── ProductDTO.java
│       ├── infrastructure/           # 基礎設施層
│       │   ├── JpaProductRepository.java  # Adapter
│       │   └── ProductJpaEntity.java      # JPA Entity
│       └── presentation/             # 表現層
│           ├── ProductController.java
│           └── ProductResponse.java
└── shared/                           # 共用元件
    ├── exception/
    └── validation/
```

---

## 🏗️ 核心模式摘要

### 1. Domain Layer - Aggregate Root

```java
public class Product {
    private final ProductId id;
    private final String name;
    // 不可變設計 + 工廠方法
    public static Product create(String name, BigDecimal price) { ... }
    public static Product reconstitute(...) { ... }
    public Product update(...) { return new Product(...); }
}
```

**關鍵點**: 不可變、工廠方法創建、業務邏輯封裝

### 2. Domain Layer - Repository Port

```java
public interface ProductRepository {
    Product save(Product product);
    Optional<Product> findById(ProductId id);
    // 定義在 Domain 層，不依賴 Spring
}
```

### 3. Application Layer - Service

```java
@Service
@Transactional(readOnly = true)
public class ProductService {
    private final ProductRepository productRepository;

    @Transactional
    public ProductDTO create(CreateProductCommand command) { ... }
}
```

**關鍵點**: 構造器注入、@Transactional 管理

### 4. Infrastructure Layer - Adapter

```java
@Component
public class JpaProductRepository implements ProductRepository {
    private final SpringDataProductRepository springDataRepository;

    @Override
    public Product save(Product product) {
        ProductJpaEntity entity = ProductJpaEntity.fromDomain(product);
        return springDataRepository.save(entity).toDomain();
    }
}
```

**關鍵點**: 實作 Domain Port、Domain ↔ JPA Entity 轉換

### 5. Presentation Layer - Controller

```java
@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody CreateProductRequest request) { ... }
}
```

> 📖 **完整代碼範例**: 參見 [references/spring-boot-crud-examples.md](references/spring-boot-crud-examples.md)

---

## ❌ 禁止事項

### 架構違規
- ❌ 在 Controller 直接使用 Repository（跳過 Service）
- ❌ 在 Domain 層依賴 Spring 框架
- ❌ 直接暴露 JPA Entity 到 API 響應
- ❌ 混用 Field Injection 和 Constructor Injection

### 代碼品質
- ❌ 在 Entity 中嵌入業務邏輯（應放在 Domain Aggregate）
- ❌ 使用可變 DTO（應使用 record）
- ❌ 忽略輸入驗證
- ❌ 硬編碼分頁參數

### 事務管理
- ❌ 在非 Service 層使用 @Transactional
- ❌ 忽略 readOnly = true 優化
- ❌ 在循環中執行資料庫操作（N+1 問題）

---

## ✅ 自我檢查清單

### 架構層面
- [ ] 四層分離清晰（Domain/Application/Infrastructure/Presentation）
- [ ] Domain 層不依賴 Spring
- [ ] Repository 接口定義在 Domain 層
- [ ] JPA Entity 與 Domain Aggregate 分離

### 代碼品質
- [ ] 使用構造器注入
- [ ] DTO 使用 record（不可變）
- [ ] 包含輸入驗證
- [ ] 統一錯誤處理

### 事務管理
- [ ] Service 層使用 @Transactional
- [ ] 讀取操作使用 readOnly = true
- [ ] 分頁查詢有預設值

---

## 💡 記憶口訣

**四層架構**:
> Domain 核心，Application 協調
> Infrastructure 實作，Presentation 展示

**DDD 原則**:
> Aggregate 封裝業務，Value Object 值相等
> Port 定義契約，Adapter 實作細節

**代碼規範**:
> 構造器注入，DTO 不可變
> 驗證不可少，異常統一處理

---

## 📚 參考資源

- **完整代碼範例**: [references/spring-boot-crud-examples.md](references/spring-boot-crud-examples.md)
- **來源**: [giuseppe-trisciuoglio/developer-kit](https://github.com/giuseppe-trisciuoglio/developer-kit)
- **相關技能**: crud-development, rest-api-design

---

**版本**: v1.1（精簡版）
**創建時間**: 2025-12-27
**維護者**: Claude Code + zycaskevin
