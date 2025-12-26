# Spring Boot CRUD Patterns - Spring Boot CRUD 模式

> **技能 ID**: spring-boot-crud
> **版本**: v1.0
> **用途**: Spring Boot 3.5+ 的 CRUD 架構模式，使用 DDD 分層設計與 Spring Data JPA
> **來源**: 基於 [giuseppe-trisciuoglio/developer-kit](https://github.com/giuseppe-trisciuoglio/developer-kit/tree/main/skills/spring-boot/spring-boot-crud-patterns)
> **授權**: MIT

---

## 🎯 觸發條件

### 關鍵字列表
```
Spring Boot CRUD、Spring Data JPA、DDD、領域驅動設計、
四層架構、Aggregate、Repository、Service Layer、
Controller、DTO、Entity、JPA、Spring Boot 開發、
Java 後端、RESTful Service
```

### 使用場景
1. **REST 端點實作** - 創建 CRUD API 端點
2. **Repository 設計** - 設計資料存取層
3. **DTO 映射** - Entity 與 DTO 轉換
4. **DDD 架構** - 實作領域驅動設計
5. **功能模組開發** - 按功能組織代碼結構

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
│           ├── ProductRequest.java
│           └── ProductResponse.java
└── shared/                           # 共用元件
    ├── exception/
    └── validation/
```

---

## 🏗️ 實作模式

### 1. Domain Layer（領域層）

#### Aggregate Root

```java
package com.example.app.feature.product.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * Product Aggregate Root
 * - 不可變設計
 * - 工廠方法創建
 * - 業務邏輯封裝
 */
public class Product {

    private final ProductId id;
    private final String name;
    private final String description;
    private final BigDecimal price;
    private final ProductStatus status;
    private final Instant createdAt;
    private final Instant updatedAt;

    // Private constructor - 使用工廠方法
    private Product(ProductId id, String name, String description,
                    BigDecimal price, ProductStatus status,
                    Instant createdAt, Instant updatedAt) {
        this.id = Objects.requireNonNull(id, "id must not be null");
        this.name = Objects.requireNonNull(name, "name must not be null");
        this.description = description;
        this.price = Objects.requireNonNull(price, "price must not be null");
        this.status = Objects.requireNonNull(status, "status must not be null");
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        // 業務規則驗證
        validatePrice(price);
    }

    // 工廠方法 - 創建新產品
    public static Product create(String name, String description, BigDecimal price) {
        Instant now = Instant.now();
        return new Product(
            ProductId.generate(),
            name,
            description,
            price,
            ProductStatus.ACTIVE,
            now,
            now
        );
    }

    // 工廠方法 - 從持久化重建
    public static Product reconstitute(ProductId id, String name, String description,
                                        BigDecimal price, ProductStatus status,
                                        Instant createdAt, Instant updatedAt) {
        return new Product(id, name, description, price, status, createdAt, updatedAt);
    }

    // 業務方法 - 更新產品
    public Product update(String name, String description, BigDecimal price) {
        return new Product(
            this.id,
            name,
            description,
            price,
            this.status,
            this.createdAt,
            Instant.now()
        );
    }

    // 業務方法 - 停用產品
    public Product deactivate() {
        if (this.status == ProductStatus.INACTIVE) {
            throw new IllegalStateException("Product is already inactive");
        }
        return new Product(
            this.id, this.name, this.description, this.price,
            ProductStatus.INACTIVE, this.createdAt, Instant.now()
        );
    }

    // 業務規則驗證
    private void validatePrice(BigDecimal price) {
        if (price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price must be positive");
        }
    }

    // Getters (no setters - immutable)
    public ProductId getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public ProductStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
```

#### Value Object

```java
package com.example.app.feature.product.domain;

import java.util.Objects;
import java.util.UUID;

/**
 * ProductId Value Object
 * - 不可變
 * - 值相等性
 */
public record ProductId(UUID value) {

    public ProductId {
        Objects.requireNonNull(value, "ProductId value must not be null");
    }

    public static ProductId generate() {
        return new ProductId(UUID.randomUUID());
    }

    public static ProductId of(String value) {
        return new ProductId(UUID.fromString(value));
    }

    public static ProductId of(UUID value) {
        return new ProductId(value);
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
```

#### Repository Port（接口）

```java
package com.example.app.feature.product.domain;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Product Repository Port
 * - 定義在 Domain 層
 * - 不依賴 Spring Data
 */
public interface ProductRepository {

    Product save(Product product);

    Optional<Product> findById(ProductId id);

    Page<Product> findAll(Pageable pageable);

    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    void deleteById(ProductId id);

    boolean existsById(ProductId id);
}
```

---

### 2. Application Layer（應用層）

#### Command 對象

```java
package com.example.app.feature.product.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

/**
 * Create Product Command
 * - 不可變
 * - 包含驗證
 */
public record CreateProductCommand(
    @NotBlank(message = "Name is required")
    String name,

    String description,

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    BigDecimal price
) {}
```

```java
package com.example.app.feature.product.application;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record UpdateProductCommand(
    @NotNull(message = "Product ID is required")
    UUID id,

    String name,

    String description,

    BigDecimal price
) {}
```

#### Application Service

```java
package com.example.app.feature.product.application;

import com.example.app.feature.product.domain.*;
import com.example.app.shared.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    // 構造器注入（推薦）
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional
    public ProductDTO create(CreateProductCommand command) {
        Product product = Product.create(
            command.name(),
            command.description(),
            command.price()
        );

        Product saved = productRepository.save(product);
        return toDTO(saved);
    }

    public ProductDTO findById(ProductId id) {
        return productRepository.findById(id)
            .map(this::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Product", "id", id.toString()
            ));
    }

    public Page<ProductDTO> findAll(Pageable pageable) {
        return productRepository.findAll(pageable)
            .map(this::toDTO);
    }

    public Page<ProductDTO> findByStatus(ProductStatus status, Pageable pageable) {
        return productRepository.findByStatus(status, pageable)
            .map(this::toDTO);
    }

    @Transactional
    public ProductDTO update(UpdateProductCommand command) {
        ProductId id = ProductId.of(command.id());

        Product existing = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Product", "id", id.toString()
            ));

        Product updated = existing.update(
            command.name() != null ? command.name() : existing.getName(),
            command.description() != null ? command.description() : existing.getDescription(),
            command.price() != null ? command.price() : existing.getPrice()
        );

        Product saved = productRepository.save(updated);
        return toDTO(saved);
    }

    @Transactional
    public void delete(ProductId id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", "id", id.toString());
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public ProductDTO deactivate(ProductId id) {
        Product existing = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Product", "id", id.toString()
            ));

        Product deactivated = existing.deactivate();
        Product saved = productRepository.save(deactivated);
        return toDTO(saved);
    }

    // DTO 轉換
    private ProductDTO toDTO(Product product) {
        return new ProductDTO(
            product.getId().value(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            product.getStatus().name(),
            product.getCreatedAt(),
            product.getUpdatedAt()
        );
    }
}
```

#### DTO

```java
package com.example.app.feature.product.application;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ProductDTO(
    UUID id,
    String name,
    String description,
    BigDecimal price,
    String status,
    Instant createdAt,
    Instant updatedAt
) {}
```

---

### 3. Infrastructure Layer（基礎設施層）

#### JPA Entity

```java
package com.example.app.feature.product.infrastructure;

import com.example.app.feature.product.domain.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "products")
public class ProductJpaEntity {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProductStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // JPA 需要無參構造器
    protected ProductJpaEntity() {}

    // 從 Domain 對象創建
    public static ProductJpaEntity fromDomain(Product product) {
        ProductJpaEntity entity = new ProductJpaEntity();
        entity.id = product.getId().value();
        entity.name = product.getName();
        entity.description = product.getDescription();
        entity.price = product.getPrice();
        entity.status = product.getStatus();
        entity.createdAt = product.getCreatedAt();
        entity.updatedAt = product.getUpdatedAt();
        return entity;
    }

    // 轉換為 Domain 對象
    public Product toDomain() {
        return Product.reconstitute(
            ProductId.of(this.id),
            this.name,
            this.description,
            this.price,
            this.status,
            this.createdAt,
            this.updatedAt
        );
    }

    // Getters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public ProductStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
```

#### Spring Data Repository

```java
package com.example.app.feature.product.infrastructure;

import com.example.app.feature.product.domain.ProductStatus;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringDataProductRepository extends JpaRepository<ProductJpaEntity, UUID> {

    Page<ProductJpaEntity> findByStatus(ProductStatus status, Pageable pageable);
}
```

#### Repository Adapter（Port 實作）

```java
package com.example.app.feature.product.infrastructure;

import com.example.app.feature.product.domain.*;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class JpaProductRepository implements ProductRepository {

    private final SpringDataProductRepository springDataRepository;

    public JpaProductRepository(SpringDataProductRepository springDataRepository) {
        this.springDataRepository = springDataRepository;
    }

    @Override
    public Product save(Product product) {
        ProductJpaEntity entity = ProductJpaEntity.fromDomain(product);
        ProductJpaEntity saved = springDataRepository.save(entity);
        return saved.toDomain();
    }

    @Override
    public Optional<Product> findById(ProductId id) {
        return springDataRepository.findById(id.value())
            .map(ProductJpaEntity::toDomain);
    }

    @Override
    public Page<Product> findAll(Pageable pageable) {
        return springDataRepository.findAll(pageable)
            .map(ProductJpaEntity::toDomain);
    }

    @Override
    public Page<Product> findByStatus(ProductStatus status, Pageable pageable) {
        return springDataRepository.findByStatus(status, pageable)
            .map(ProductJpaEntity::toDomain);
    }

    @Override
    public void deleteById(ProductId id) {
        springDataRepository.deleteById(id.value());
    }

    @Override
    public boolean existsById(ProductId id) {
        return springDataRepository.existsById(id.value());
    }
}
```

---

### 4. Presentation Layer（表現層）

#### Request/Response DTOs

```java
package com.example.app.feature.product.presentation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record CreateProductRequest(
    @NotBlank(message = "Name is required")
    String name,

    String description,

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    BigDecimal price
) {}
```

```java
package com.example.app.feature.product.presentation;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ProductResponse(
    UUID id,
    String name,
    String description,
    BigDecimal price,
    String status,
    Instant createdAt,
    Instant updatedAt
) {}
```

#### REST Controller

```java
package com.example.app.feature.product.presentation;

import com.example.app.feature.product.application.*;
import com.example.app.feature.product.domain.*;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(
            @Valid @RequestBody CreateProductRequest request) {

        CreateProductCommand command = new CreateProductCommand(
            request.name(),
            request.description(),
            request.price()
        );

        ProductDTO dto = productService.create(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> findById(@PathVariable UUID id) {
        ProductDTO dto = productService.findById(ProductId.of(id));
        return ResponseEntity.ok(toResponse(dto));
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> findAll(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable,
            @RequestParam(required = false) ProductStatus status) {

        Page<ProductDTO> page = status != null
            ? productService.findByStatus(status, pageable)
            : productService.findAll(pageable);

        return ResponseEntity.ok(page.map(this::toResponse));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProductRequest request) {

        UpdateProductCommand command = new UpdateProductCommand(
            id,
            request.name(),
            request.description(),
            request.price()
        );

        ProductDTO dto = productService.update(command);
        return ResponseEntity.ok(toResponse(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        productService.delete(ProductId.of(id));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<ProductResponse> deactivate(@PathVariable UUID id) {
        ProductDTO dto = productService.deactivate(ProductId.of(id));
        return ResponseEntity.ok(toResponse(dto));
    }

    private ProductResponse toResponse(ProductDTO dto) {
        return new ProductResponse(
            dto.id(),
            dto.name(),
            dto.description(),
            dto.price(),
            dto.status(),
            dto.createdAt(),
            dto.updatedAt()
        );
    }
}
```

---

## 🔧 共用元件

### Exception 處理

```java
package com.example.app.shared.exception;

public class ResourceNotFoundException extends RuntimeException {

    private final String resourceName;
    private final String fieldName;
    private final String fieldValue;

    public ResourceNotFoundException(String resourceName, String fieldName, String fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    public String getResourceName() { return resourceName; }
    public String getFieldName() { return fieldName; }
    public String getFieldValue() { return fieldValue; }
}
```

```java
package com.example.app.shared.exception;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(
            ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
            "error", Map.of(
                "code", "RESOURCE_NOT_FOUND",
                "message", ex.getMessage(),
                "timestamp", Instant.now().toString()
            )
        ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        List<Map<String, String>> errors = ex.getBindingResult().getFieldErrors()
            .stream()
            .map(error -> Map.of(
                "field", error.getField(),
                "message", error.getDefaultMessage()
            ))
            .toList();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
            "error", Map.of(
                "code", "VALIDATION_ERROR",
                "message", "Validation failed",
                "details", errors,
                "timestamp", Instant.now().toString()
            )
        ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(
            IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
            "error", Map.of(
                "code", "INVALID_ARGUMENT",
                "message", ex.getMessage(),
                "timestamp", Instant.now().toString()
            )
        ));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(
            IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
            "error", Map.of(
                "code", "INVALID_STATE",
                "message", ex.getMessage(),
                "timestamp", Instant.now().toString()
            )
        ));
    }
}
```

---

## ❌ 禁止事項

### 1. 架構違規

```markdown
❌ 不要:
- 在 Controller 直接使用 Repository（跳過 Service）
- 在 Domain 層依賴 Spring 框架
- 直接暴露 JPA Entity 到 API 響應
- 混用 Field Injection 和 Constructor Injection
```

### 2. 代碼品質

```markdown
❌ 不要:
- 在 Entity 中嵌入業務邏輯（應放在 Domain Aggregate）
- 使用可變 DTO（應使用 record 或不可變類）
- 忽略輸入驗證
- 硬編碼分頁參數
```

### 3. 事務管理

```markdown
❌ 不要:
- 在非 Service 層使用 @Transactional
- 忽略 readOnly = true 優化
- 在循環中執行資料庫操作（N+1 問題）
```

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

### 測試
- [ ] Unit Test 覆蓋 Service 層
- [ ] Integration Test 使用 Testcontainers
- [ ] Controller 有 MockMvc 測試

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

### 來源
- [giuseppe-trisciuoglio/developer-kit](https://github.com/giuseppe-trisciuoglio/developer-kit)
- [Spring Boot CRUD Patterns](https://github.com/giuseppe-trisciuoglio/developer-kit/tree/main/skills/spring-boot/spring-boot-crud-patterns)

### 官方文檔
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)

### 相關技能
- **crud-development** - 通用 CRUD 開發規範
- **rest-api-design** - REST API 設計規範

---

**版本**: v1.0
**創建時間**: 2025-12-26
**維護者**: Claude Code + zycaskevin
**授權**: MIT
