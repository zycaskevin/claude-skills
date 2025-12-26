# Android 開發技能（Android Development）

> **技能 ID**: `android-development`
> **版本**: 1.0.0
> **用途**: Android 原生開發、Kotlin/Jetpack Compose、Material Design、Play Store 發布
> **參考**: [claude-flow](https://github.com/ruvnet/claude-flow), [Android Developers](https://developer.android.com)

---

## 觸發條件

當使用者需求包含以下關鍵字時，應激活此技能：

- 「Android」、「安卓」
- 「Kotlin」、「Jetpack Compose」
- 「Play Store」、「Google Play」
- 「Material Design」、「Android App」

---

## 一、核心原則

```
╔════════════════════════════════════════════════════════════╗
║  Android 開發：Kotlin 優先、Compose 現代化、Material You    ║
║  Kotlin-first, Compose-modern, Material You Design         ║
╚════════════════════════════════════════════════════════════╝
```

---

## 二、專案結構

### 2.1 推薦目錄結構（Clean Architecture）

```
app/
├── src/
│   ├── main/
│   │   ├── java/com/example/myapp/
│   │   │   ├── MyApplication.kt
│   │   │   ├── MainActivity.kt
│   │   │   ├── ui/                      # Presentation Layer
│   │   │   │   ├── theme/
│   │   │   │   │   ├── Color.kt
│   │   │   │   │   ├── Theme.kt
│   │   │   │   │   └── Type.kt
│   │   │   │   ├── navigation/
│   │   │   │   │   └── NavGraph.kt
│   │   │   │   ├── screens/
│   │   │   │   │   ├── home/
│   │   │   │   │   │   ├── HomeScreen.kt
│   │   │   │   │   │   ├── HomeViewModel.kt
│   │   │   │   │   │   └── HomeUiState.kt
│   │   │   │   │   ├── auth/
│   │   │   │   │   └── settings/
│   │   │   │   └── components/          # 可重用組件
│   │   │   ├── domain/                  # Domain Layer
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   └── usecase/
│   │   │   ├── data/                    # Data Layer
│   │   │   │   ├── repository/
│   │   │   │   ├── local/
│   │   │   │   │   ├── database/
│   │   │   │   │   └── datastore/
│   │   │   │   ├── remote/
│   │   │   │   │   ├── api/
│   │   │   │   │   └── dto/
│   │   │   │   └── mapper/
│   │   │   └── di/                      # Dependency Injection
│   │   │       ├── AppModule.kt
│   │   │       ├── NetworkModule.kt
│   │   │       └── DatabaseModule.kt
│   │   ├── res/
│   │   └── AndroidManifest.xml
│   ├── test/                            # Unit Tests
│   └── androidTest/                     # Instrumented Tests
├── build.gradle.kts
└── proguard-rules.pro
```

---

## 三、Jetpack Compose 開發規範

### 3.1 Screen 結構

```kotlin
package com.example.myapp.ui.screens.home

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: HomeViewModel = hiltViewModel(),
    onNavigateToDetail: (String) -> Unit
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("首頁") },
                actions = {
                    IconButton(onClick = { /* TODO */ }) {
                        Icon(Icons.Default.Settings, contentDescription = "設定")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { viewModel.onAddClick() }) {
                Icon(Icons.Default.Add, contentDescription = "新增")
            }
        }
    ) { paddingValues ->
        HomeContent(
            uiState = uiState,
            onItemClick = onNavigateToDetail,
            modifier = Modifier.padding(paddingValues)
        )
    }
}

@Composable
private fun HomeContent(
    uiState: HomeUiState,
    onItemClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    when {
        uiState.isLoading -> {
            Box(modifier = modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        }
        uiState.error != null -> {
            ErrorScreen(message = uiState.error, onRetry = { /* TODO */ })
        }
        else -> {
            LazyColumn(
                modifier = modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(
                    items = uiState.items,
                    key = { it.id }
                ) { item ->
                    ItemCard(
                        item = item,
                        onClick = { onItemClick(item.id) }
                    )
                }
            }
        }
    }
}
```

### 3.2 ViewModel 結構

```kotlin
package com.example.myapp.ui.screens.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.myapp.domain.model.Item
import com.example.myapp.domain.usecase.GetItemsUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val items: List<Item> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val getItemsUseCase: GetItemsUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        loadItems()
    }

    private fun loadItems() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            getItemsUseCase()
                .catch { e ->
                    _uiState.update { it.copy(isLoading = false, error = e.message) }
                }
                .collect { items ->
                    _uiState.update { it.copy(isLoading = false, items = items) }
                }
        }
    }

    fun onAddClick() {
        // Handle add action
    }

    fun onRefresh() {
        loadItems()
    }
}
```

### 3.3 UI State 模式

```kotlin
// Sealed class for complex states
sealed interface HomeUiState {
    data object Loading : HomeUiState
    data class Success(val items: List<Item>) : HomeUiState
    data class Error(val message: String) : HomeUiState
}

// 在 ViewModel 中使用
private val _uiState = MutableStateFlow<HomeUiState>(HomeUiState.Loading)
val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()
```

---

## 四、網路層設計

### 4.1 Retrofit + Kotlin Coroutines

```kotlin
package com.example.myapp.data.remote.api

import com.example.myapp.data.remote.dto.ItemDto
import com.example.myapp.data.remote.dto.CreateItemRequest
import retrofit2.http.*

interface ItemApi {

    @GET("items")
    suspend fun getItems(): List<ItemDto>

    @GET("items/{id}")
    suspend fun getItem(@Path("id") id: String): ItemDto

    @POST("items")
    suspend fun createItem(@Body request: CreateItemRequest): ItemDto

    @PUT("items/{id}")
    suspend fun updateItem(
        @Path("id") id: String,
        @Body request: CreateItemRequest
    ): ItemDto

    @DELETE("items/{id}")
    suspend fun deleteItem(@Path("id") id: String)
}
```

### 4.2 Network Module（Hilt）

```kotlin
package com.example.myapp.di

import com.example.myapp.data.remote.api.ItemApi
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .addInterceptor { chain ->
                val request = chain.request().newBuilder()
                    .addHeader("Content-Type", "application/json")
                    .build()
                chain.proceed(request)
            }
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com/v1/")
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    @Provides
    @Singleton
    fun provideItemApi(retrofit: Retrofit): ItemApi {
        return retrofit.create(ItemApi::class.java)
    }
}
```

---

## 五、資料持久化

### 5.1 Room Database

```kotlin
package com.example.myapp.data.local.database

import androidx.room.*
import kotlinx.coroutines.flow.Flow

// Entity
@Entity(tableName = "items")
data class ItemEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String?,
    val createdAt: Long,
    val isCompleted: Boolean = false
)

// DAO
@Dao
interface ItemDao {
    @Query("SELECT * FROM items ORDER BY createdAt DESC")
    fun getAllItems(): Flow<List<ItemEntity>>

    @Query("SELECT * FROM items WHERE id = :id")
    suspend fun getItemById(id: String): ItemEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertItem(item: ItemEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertItems(items: List<ItemEntity>)

    @Delete
    suspend fun deleteItem(item: ItemEntity)

    @Query("DELETE FROM items")
    suspend fun deleteAllItems()
}

// Database
@Database(
    entities = [ItemEntity::class],
    version = 1,
    exportSchema = true
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun itemDao(): ItemDao
}
```

### 5.2 DataStore（取代 SharedPreferences）

```kotlin
package com.example.myapp.data.local.datastore

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

@Singleton
class SettingsDataStore @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private object Keys {
        val IS_DARK_MODE = booleanPreferencesKey("is_dark_mode")
        val LANGUAGE = stringPreferencesKey("language")
        val NOTIFICATION_ENABLED = booleanPreferencesKey("notification_enabled")
    }

    val isDarkMode: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[Keys.IS_DARK_MODE] ?: false
    }

    val language: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[Keys.LANGUAGE] ?: "zh-TW"
    }

    suspend fun setDarkMode(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[Keys.IS_DARK_MODE] = enabled
        }
    }

    suspend fun setLanguage(language: String) {
        context.dataStore.edit { preferences ->
            preferences[Keys.LANGUAGE] = language
        }
    }
}
```

---

## 六、導航

### 6.1 Compose Navigation

```kotlin
package com.example.myapp.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.example.myapp.ui.screens.home.HomeScreen
import com.example.myapp.ui.screens.detail.DetailScreen
import com.example.myapp.ui.screens.settings.SettingsScreen

sealed class Screen(val route: String) {
    data object Home : Screen("home")
    data object Detail : Screen("detail/{itemId}") {
        fun createRoute(itemId: String) = "detail/$itemId"
    }
    data object Settings : Screen("settings")
}

@Composable
fun NavGraph(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Screen.Home.route
    ) {
        composable(Screen.Home.route) {
            HomeScreen(
                onNavigateToDetail = { itemId ->
                    navController.navigate(Screen.Detail.createRoute(itemId))
                }
            )
        }

        composable(
            route = Screen.Detail.route,
            arguments = listOf(
                navArgument("itemId") { type = NavType.StringType }
            )
        ) { backStackEntry ->
            val itemId = backStackEntry.arguments?.getString("itemId") ?: return@composable
            DetailScreen(
                itemId = itemId,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Settings.route) {
            SettingsScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}
```

---

## 七、測試規範

### 7.1 單元測試

```kotlin
package com.example.myapp.ui.screens.home

import app.cash.turbine.test
import com.example.myapp.domain.model.Item
import com.example.myapp.domain.usecase.GetItemsUseCase
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Before
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@OptIn(ExperimentalCoroutinesApi::class)
class HomeViewModelTest {

    private lateinit var viewModel: HomeViewModel
    private lateinit var getItemsUseCase: GetItemsUseCase
    private val testDispatcher = StandardTestDispatcher()

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        getItemsUseCase = mockk()
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `when loadItems succeeds, uiState contains items`() = runTest {
        // Given
        val items = listOf(Item("1", "Test Item", null))
        coEvery { getItemsUseCase() } returns flowOf(items)

        // When
        viewModel = HomeViewModel(getItemsUseCase)
        advanceUntilIdle()

        // Then
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals(items, state.items)
            assertEquals(false, state.isLoading)
        }
    }

    @Test
    fun `when loadItems fails, uiState contains error`() = runTest {
        // Given
        val errorMessage = "Network error"
        coEvery { getItemsUseCase() } throws Exception(errorMessage)

        // When
        viewModel = HomeViewModel(getItemsUseCase)
        advanceUntilIdle()

        // Then
        viewModel.uiState.test {
            val state = awaitItem()
            assertTrue(state.items.isEmpty())
            assertEquals(errorMessage, state.error)
        }
    }
}
```

### 7.2 UI 測試（Compose）

```kotlin
package com.example.myapp.ui.screens.home

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import org.junit.Rule
import org.junit.Test

class HomeScreenTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun homeScreen_displaysItems() {
        // Given
        val items = listOf(
            Item("1", "Item 1", null),
            Item("2", "Item 2", null)
        )
        val uiState = HomeUiState(items = items)

        // When
        composeTestRule.setContent {
            HomeContent(
                uiState = uiState,
                onItemClick = {},
                modifier = Modifier
            )
        }

        // Then
        composeTestRule.onNodeWithText("Item 1").assertIsDisplayed()
        composeTestRule.onNodeWithText("Item 2").assertIsDisplayed()
    }

    @Test
    fun homeScreen_showsLoading() {
        // Given
        val uiState = HomeUiState(isLoading = true)

        // When
        composeTestRule.setContent {
            HomeContent(
                uiState = uiState,
                onItemClick = {},
                modifier = Modifier
            )
        }

        // Then
        composeTestRule.onNode(hasProgressBarRangeInfo(ProgressBarRangeInfo.Indeterminate))
            .assertIsDisplayed()
    }
}
```

---

## 八、安全最佳實踐

### 8.1 EncryptedSharedPreferences

```kotlin
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

fun getEncryptedPreferences(context: Context): SharedPreferences {
    val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    return EncryptedSharedPreferences.create(
        context,
        "secure_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
}
```

### 8.2 ProGuard / R8 配置 (代碼混淆)

```proguard
# 基本混淆
-keep class com.example.myapp.data.remote.dto.** { *; }
-keep class com.example.myapp.domain.model.** { *; }

# 移除 Log
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
    public static int i(...);
    public static int w(...);
    public static int e(...);
}

# Retrofit
-keepattributes Signature
-keepattributes Exceptions

# Gson
-keepattributes *Annotation*
-keep class com.google.gson.** { *; }
```

### 8.3 Network Security Config (防止明文傳輸)

**res/xml/network_security_config.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- 禁止所有明文 HTTP 流量 (Cleartext Traffic) -->
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    
    <!-- 僅允許特定測試網域 (Debug Only) -->
    <debug-overrides>
        <trust-anchors>
            <certificates src="user" />
        </trust-anchors>
    </debug-overrides>
</network-security-config>
```

---

## ❌ 禁止事項

```markdown
❌ 絕對禁止：

1. **明文傳輸 (Cleartext HTTP)**
   - 禁止在 Manifest 中啟用 `nsAllowsArbitraryLoads`
   - 強制使用 HTTPS 與 Network Security Config

2. **在 LogCat 洩漏敏感資**
   - 禁止 `Log.d("TAG", "Token: " + token)`
   - Release Build 必須移除所有 Log

3. **主線程阻塞**
   - 禁止在 Main Thread 執行網路/資料庫操作 (ANR 風險)

4. **硬編碼密鑰**
   - 禁止將 API Key 直接寫在 Java/Kotlin 代碼中
   - 強制使用 `local.properties` (不提交 Git) + `BuildConfig`

5. 使用 !! 強制解包 (Null Safety Violation)
6. 忽略 Android Lint 警告
```

---

## 十、自檢清單

### 開發階段

```markdown
□ 專案結構符合 Clean Architecture
□ 使用 Hilt 進行依賴注入
□ ViewModel 使用 StateFlow
□ 使用 Room 進行本地存儲
□ 支援 Material You 動態主題
□ 支援深色模式
```

### 提交前

```markdown
□ 所有測試通過
□ 無記憶體洩漏（LeakCanary）
□ ProGuard 規則配置完成
□ 支援不同螢幕尺寸
□ 無 Lint 錯誤
□ 使用 Baseline Profiles 優化啟動
```

### 發布前

```markdown
□ Google Play Console 資料完整
□ 截圖準備完成
□ 隱私政策 URL 有效
□ 內部測試完成
□ 簽名配置正確
□ 版本號已更新
```

---

## 參考資源

- [Android Developers](https://developer.android.com)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
- [Material Design 3](https://m3.material.io)
- [Android Architecture Guide](https://developer.android.com/topic/architecture)

---

**版本**: 1.0.0
**最後更新**: 2025-12-26
