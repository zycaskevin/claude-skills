# Spring Boot CRUD - 完整代碼範例

> **關聯技能**: [spring-boot-crud.md](../spring-boot-crud.md)
> **用途**: 提供完整的 Java 代碼範例，按需載入
> **版本**: v1.0

---

## 1. Domain Layer（領域層）

### Aggregate Root

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

### Value Object

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

### Repository Port（接口）

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

## 2. Application Layer（應用層）

### Command 對象

```java
package com.example.app.feature.product.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

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

### Application Service

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

### DTO

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

## 3. Infrastructure Layer（基礎設施層）

### JPA Entity

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

### Repository Adapter（Port 實作）

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

## 4. Presentation Layer（表現層）

### REST Controller

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
            Pageable pageable) {

        Page<ProductDTO> page = productService.findAll(pageable);
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

## 5. 共用元件

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
}
```

---

**版本**: v1.0
**創建時間**: 2025-12-27
**維護者**: Claude Code
