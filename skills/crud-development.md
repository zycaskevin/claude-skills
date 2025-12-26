# CRUD 開發技能

> **技能 ID**: crud-development
> **版本**: v2.0 (Skill Creator 優化版)
> **用途**: 快速開發符合規範的 CRUD 業務模塊
> **Token 預算**: ~2,800 字 (~700 tokens)

---

## 🎯 觸發條件

### 關鍵字

```
CRUD、增刪改查、業務模塊、Entity、Service、DAO、
分頁查詢、新增、修改、刪除
```

### 使用場景

1. **全新業務模塊**: "開發廣告管理功能"
2. **擴展現有模塊**: "在用戶模塊新增分頁查詢"
3. **修復規範問題**: "Service 繼承了 ServiceImpl，如何修正？"

---

## 🏗️ 核心規範

### 四層架構

```
Controller → Service → DAO → Mapper

Controller: HTTP 接口，參數驗證
Service:    業務邏輯，事務管理，對象轉換
DAO:        構建查詢條件（buildQueryWrapper）
Mapper:     執行 SQL，資料庫交互
```

**關鍵原則**:

- 單一職責：每層只做自己的事
- 向下依賴：上層依賴下層，不可反向
- **查詢條件必須在 DAO 層**（buildQueryWrapper 方法）

---

## 📦 Entity 規範

### 核心要求

```java
@Data
@TableName("ad")
public class Ad extends TenantEntity {  // ✅ 必須繼承 TenantEntity
    private String title;
    private String content;
    private Integer status;
}
```

**TenantEntity 提供**:

- `id`: 雪花 ID（全域唯一）
- `tenantId`: 多租戶支持
- `createTime`/`updateTime`: 審計欄位
- `deleted`: 邏輯刪除

**禁止**:

- ❌ 自定義 `@TableId(type = IdType.AUTO)`（覆蓋雪花 ID）

---

## 🗄️ DAO 規範

### 查詢條件構建模式

```java
@Repository
public class AdDaoImpl implements AdDao {
    @Autowired
    private AdMapper mapper;

    @Override
    public PageResult<Ad> pageQuery(AdPageReqVO reqVO) {
        return mapper.selectPage(reqVO, buildQueryWrapper(reqVO));
    }

    // ✅ 核心方法：集中構建查詢條件
    private LambdaQueryWrapper<Ad> buildQueryWrapper(AdPageReqVO reqVO) {
        return new LambdaQueryWrapper<Ad>()
            // String 欄位用 like()
            .like(StringUtils.isNotBlank(reqVO.getTitle()),
                  Ad::getTitle, reqVO.getTitle())

            // 數字欄位用 eq()
            .eq(reqVO.getStatus() != null,
                Ad::getStatus, reqVO.getStatus())

            // 日期範圍
            .ge(reqVO.getStartTime() != null,
                Ad::getCreateTime, reqVO.getStartTime())
            .le(reqVO.getEndTime() != null,
                Ad::getCreateTime, reqVO.getEndTime())

            // 排序
            .orderByDesc(Ad::getCreateTime);
    }
}
```

### like() vs likeCast()

| 欄位類型 | 使用方法 | 範例 |
|---------|---------|------|
| String | `like()` | `.like(Ad::getTitle, "關鍵字")` |
| 數字/日期 | `likeCast()` | `.likeCast(Ad::getId, 123)` |

**原因**: 數字欄位需先轉字串再模糊查詢。

---

## 🔧 Service 規範

### ❌ 禁止繼承 ServiceImpl

```java
// ❌ 錯誤
public class AdServiceImpl extends ServiceImpl<AdMapper, Ad> {
    // 問題：違反分層原則，難以測試
}

// ✅ 正確
public class AdServiceImpl implements AdService {
    @Autowired
    private AdDao adDao;  // 透過 DAO 操作資料庫
}
```

**原因**:

1. Service 不應直接操作 Mapper（職責混淆）
2. 繼承後難以 Mock 測試
3. 正確流程：Service → DAO → Mapper

### 對象轉換

```java
// ❌ 禁止 BeanUtil.copyProperties()（反射，慢）
BeanUtil.copyProperties(ad, respVO);

// ✅ 使用 MapstructUtils.convert()（編譯期生成，快）
AdRespVO respVO = MapstructUtils.convert(ad, AdRespVO.class);
```

### Service 核心模式

```java
@Service
public class AdServiceImpl implements AdService {
    @Autowired
    private AdDao adDao;

    // 查詢（無需事務）
    @Override
    public PageResult<AdRespVO> pageQuery(AdPageReqVO reqVO) {
        PageResult<Ad> pageResult = adDao.pageQuery(reqVO);
        return MapstructUtils.convert(pageResult, AdRespVO.class);
    }

    // 新增（需要事務）
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(AdCreateReqVO reqVO) {
        // 1. 業務驗證
        validateTitleUnique(reqVO.getTitle());

        // 2. 對象轉換
        Ad ad = MapstructUtils.convert(reqVO, Ad.class);
        ad.setStatus(AdStatusEnum.ENABLED.getCode());

        // 3. 執行新增
        adDao.insert(ad);
        return ad.getId();
    }

    // 修改（需要事務）
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(AdUpdateReqVO reqVO) {
        Ad existAd = adDao.selectById(reqVO.getId());
        if (existAd == null) {
            throw new ServiceException(ErrorCodeConstants.AD_NOT_FOUND);
        }

        validateTitleUnique(reqVO.getId(), reqVO.getTitle());

        Ad ad = MapstructUtils.convert(reqVO, Ad.class);
        adDao.update(ad);
    }

    // 刪除（需要事務）
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteById(Long id) {
        Ad ad = adDao.selectById(id);
        if (ad == null) {
            throw new ServiceException(ErrorCodeConstants.AD_NOT_FOUND);
        }

        validateCanDelete(ad);
        adDao.deleteById(id);
    }
}
```

---

## 🌐 Controller 規範

### 路徑規範

```java
// ❌ 禁止通用路徑
@RequestMapping("/api")
@GetMapping("/page")      // ❌ 太通用！

// ✅ 明確的模塊前綴
@RequestMapping("/api/ad")
@GetMapping("/page")      // ✅ /api/ad/page
@GetMapping("/{adId}")    // ✅ /api/ad/{adId}
```

### Controller 模式

```java
@RestController
@RequestMapping("/api/ad")
@Validated
public class AdController {
    @Autowired
    private AdService adService;

    @GetMapping("/page")
    public CommonResult<PageResult<AdRespVO>> pageQuery(@Valid AdPageReqVO reqVO) {
        return success(adService.pageQuery(reqVO));
    }

    @GetMapping("/{adId}")
    public CommonResult<AdRespVO> getById(@PathVariable("adId") Long id) {
        return success(adService.getById(id));
    }

    @PostMapping("/create")
    public CommonResult<Long> create(@Valid @RequestBody AdCreateReqVO reqVO) {
        return success(adService.create(reqVO));
    }

    @PutMapping("/update")
    public CommonResult<Boolean> update(@Valid @RequestBody AdUpdateReqVO reqVO) {
        adService.update(reqVO);
        return success(true);
    }

    @DeleteMapping("/{adId}")
    public CommonResult<Boolean> deleteById(@PathVariable("adId") Long id) {
        adService.deleteById(id);
        return success(true);
    }
}
```

---

## ❌ 禁止事項

| 禁止行為 | 正確做法 |
|---------|---------|
| ❌ Service 繼承 ServiceImpl | ✅ Service → DAO → Mapper |
| ❌ BeanUtil.copyProperties() | ✅ MapstructUtils.convert() |
| ❌ Controller 通用路徑 `/page` | ✅ 明確路徑 `/ad/page` |
| ❌ Service 層構建查詢條件 | ✅ DAO 層 buildQueryWrapper() |

---

## ✅ 自我檢查清單

### Entity

- [ ] 繼承 TenantEntity
- [ ] 使用雪花 ID（不自定義）

### DAO

- [ ] 查詢條件在 buildQueryWrapper()
- [ ] String 用 like()，其他用 eq()/likeCast()

### Service

- [ ] 不繼承 ServiceImpl
- [ ] 不在 Service 構建查詢條件
- [ ] 使用 MapstructUtils.convert()
- [ ] 寫操作加 @Transactional

### Controller

- [ ] 路徑明確（/api/{module}/xxx）
- [ ] 參數驗證（@Valid）
- [ ] 統一返回格式（CommonResult）

---

## 💡 記憶口訣

```
Entity 繼承 Tenant，雪花 ID 全局唯一
DAO 組查詢條件，Wrapper 集中構建
Service 不繼承，業務邏輯最純粹
Controller 路徑明，轉換用 Mapstruct

四層架構記心間：
Controller → Service → DAO → Mapper
職責清晰易維護，測試部署都方便
```

---

## 📚 參考資源

**完整範例文件**（已在專案中）:

| 層級 | 參考文件 |
|------|---------|
| Entity | `ruoyi-module-ad/.../domain/Ad.java` |
| DAO | `ruoyi-module-ad/.../dao/impl/AdDaoImpl.java` |
| Service | `ruoyi-module-ad/.../service/impl/AdServiceImpl.java` |
| Controller | `ruoyi-module-ad/.../controller/AdController.java` |

**進階閱讀**（可選）:

- MyBatis-Plus 官方文檔
- Mapstruct 官方文檔
- 若依框架開發手冊

---

**版本**: v2.0
**變更**: 應用 Skill Creator 設計原則（簡潔性、適度自由度、漸進式披露）
**維護者**: Claude Code + zycaskevin
**最後更新**: 2025-12-26
