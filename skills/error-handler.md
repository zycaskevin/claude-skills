# Error Handler - 異常處理規範

> **技能 ID**: error-handler
> **版本**: v1.0
> **用途**: 提供標準化的異常處理框架，確保錯誤被正確捕獲、記錄和響應

---

## 🎯 觸發條件

### 關鍵字列表
```
異常處理、錯誤處理、error handling、exception、
try-catch、錯誤響應、error response、fault tolerance、
錯誤碼設計、error code
```

### 使用場景
1. **設計錯誤處理架構** - 統一異常處理策略
2. **實現業務異常** - 自定義業務錯誤類型
3. **API 錯誤響應** - 標準化錯誤返回格式
4. **日誌記錄** - 異常追蹤與監控

---

## 🏗️ 核心規範

### 1. 異常分層架構

```
Exception Hierarchy
├── SystemException（系統異常 - 500）
│   ├── DatabaseException
│   ├── NetworkException
│   └── ConfigurationException
├── BusinessException（業務異常 - 4xx）
│   ├── ValidationException（400）
│   ├── AuthenticationException（401）
│   ├── AuthorizationException（403）
│   └── ResourceNotFoundException（404）
└── ThirdPartyException（第三方異常）
    ├── PaymentException
    └── SmsException
```

### 2. 標準錯誤響應格式

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "找不到指定的用戶",
    "details": {
      "userId": "12345",
      "suggestion": "請確認用戶 ID 是否正確"
    },
    "timestamp": "2025-12-27T10:30:00Z",
    "traceId": "abc-123-xyz"
  }
}
```

### 3. 錯誤碼設計規範

| 類別 | 前綴 | 範例 | HTTP Status |
|------|------|------|-------------|
| 驗證錯誤 | `VAL_` | `VAL_REQUIRED_FIELD` | 400 |
| 認證錯誤 | `AUTH_` | `AUTH_TOKEN_EXPIRED` | 401 |
| 授權錯誤 | `PERM_` | `PERM_INSUFFICIENT` | 403 |
| 資源錯誤 | `RES_` | `RES_NOT_FOUND` | 404 |
| 業務錯誤 | `BIZ_` | `BIZ_ORDER_CANCELLED` | 422 |
| 系統錯誤 | `SYS_` | `SYS_DATABASE_ERROR` | 500 |

---

## 📖 實現模式

### Java/Spring Boot

```java
// 1. 自定義業務異常
public class BusinessException extends RuntimeException {
    private final String errorCode;
    private final HttpStatus status;

    public BusinessException(String errorCode, String message, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }
}

// 2. 全局異常處理器
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .code(ex.getErrorCode())
            .message(ex.getMessage())
            .traceId(MDC.get("traceId"))
            .timestamp(Instant.now())
            .build();

        log.warn("Business exception: {}", ex.getErrorCode());
        return ResponseEntity.status(ex.getStatus()).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unexpected error", ex);

        ErrorResponse error = ErrorResponse.builder()
            .code("SYS_INTERNAL_ERROR")
            .message("系統內部錯誤，請稍後重試")
            .traceId(MDC.get("traceId"))
            .build();

        return ResponseEntity.status(500).body(error);
    }
}
```

### TypeScript/Node.js

```typescript
// 1. 自定義錯誤類
class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// 2. 錯誤工廠
const Errors = {
  NotFound: (resource: string, id: string) =>
    new AppError('RES_NOT_FOUND', `${resource} not found`, 404, { id }),

  Validation: (field: string, reason: string) =>
    new AppError('VAL_INVALID', `Validation failed: ${field}`, 400, { field, reason }),

  Unauthorized: () =>
    new AppError('AUTH_REQUIRED', 'Authentication required', 401),
};

// 3. Express 中間件
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        traceId: req.headers['x-trace-id'],
      },
    });
  }

  // 未知錯誤
  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    error: {
      code: 'SYS_INTERNAL_ERROR',
      message: 'Internal server error',
    },
  });
};
```

---

## ❌ 禁止事項

### 1. 直接拋出通用異常
```java
// ❌ 錯誤
throw new RuntimeException("User not found");

// ✅ 正確
throw new ResourceNotFoundException("USER", userId);
```

### 2. 暴露技術細節給用戶
```json
// ❌ 錯誤（暴露 SQL）
{
  "error": "SQLSyntaxErrorException: Table 'users' doesn't exist"
}

// ✅ 正確
{
  "error": {
    "code": "SYS_DATABASE_ERROR",
    "message": "資料處理失敗，請稍後重試"
  }
}
```

### 3. 忽略異常
```java
// ❌ 錯誤（吞掉異常）
try {
    doSomething();
} catch (Exception e) {
    // 什麼都不做
}

// ✅ 正確
try {
    doSomething();
} catch (Exception e) {
    log.error("Operation failed", e);
    throw new BusinessException("OPERATION_FAILED", "操作失敗");
}
```

### 4. 錯誤碼不一致
```java
// ❌ 錯誤（同一錯誤多種碼）
throw new AppError("USER_NOT_EXIST");   // 這裡
throw new AppError("USER_NOT_FOUND");   // 那裡
throw new AppError("NO_SUCH_USER");     // 又一個

// ✅ 正確（統一錯誤碼）
public enum ErrorCode {
    USER_NOT_FOUND("RES_USER_NOT_FOUND", "用戶不存在", 404);
}
```

---

## ✅ 自我檢查清單

- [ ] 建立了統一的異常層級結構
- [ ] 所有業務異常都有明確的錯誤碼
- [ ] 錯誤響應格式一致（包含 code, message, traceId）
- [ ] 敏感信息不會暴露給客戶端
- [ ] 所有異常都有日誌記錄
- [ ] 全局異常處理器已配置
- [ ] 第三方服務異常有降級處理

---

## 💡 記憶口訣

**異常分層**: 系統/業務/第三方
**響應標準**: code + message + traceId
**錯誤碼前綴**: VAL/AUTH/PERM/RES/BIZ/SYS
**禁止事項**: 不吞、不暴露、不通用、不亂碼
