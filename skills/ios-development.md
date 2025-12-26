# iOS 開發技能（iOS Development）

> **技能 ID**: `ios-development`
> **版本**: 1.0.0
> **用途**: iOS 原生開發、SwiftUI/UIKit、Xcode 整合、App Store 發布
> **參考**: [ios-simulator-skill](https://github.com/conorluddy/ios-simulator-skill), [claude-flow](https://github.com/ruvnet/claude-flow)

---

## 觸發條件

當使用者需求包含以下關鍵字時，應激活此技能：

- 「iOS」、「iPhone」、「iPad」
- 「Swift」、「SwiftUI」、「UIKit」
- 「Xcode」、「App Store」
- 「iOS App」、「蘋果應用」

---

## 一、核心原則

```
╔════════════════════════════════════════════════════════════╗
║    iOS 開發：Swift 優先、SwiftUI 現代化、用戶體驗至上       ║
║  Swift-first, SwiftUI-modern, User Experience Matters      ║
╚════════════════════════════════════════════════════════════╝
```

---

## 二、專案結構

### 2.1 推薦目錄結構

```
MyApp/
├── MyApp/
│   ├── App/
│   │   ├── MyAppApp.swift          # @main 入口
│   │   └── AppDelegate.swift       # 生命週期（如需要）
│   ├── Scenes/                     # 功能模組
│   │   ├── Home/
│   │   │   ├── HomeView.swift
│   │   │   ├── HomeViewModel.swift
│   │   │   └── Components/
│   │   ├── Auth/
│   │   │   ├── LoginView.swift
│   │   │   ├── RegisterView.swift
│   │   │   └── AuthViewModel.swift
│   │   └── Settings/
│   ├── Core/
│   │   ├── Models/                 # 資料模型
│   │   ├── Services/               # 業務服務
│   │   │   ├── NetworkService.swift
│   │   │   ├── AuthService.swift
│   │   │   └── StorageService.swift
│   │   ├── Utilities/              # 工具類
│   │   └── Extensions/             # Swift 擴展
│   ├── UI/
│   │   ├── Components/             # 可重用組件
│   │   ├── Styles/                 # 樣式定義
│   │   └── Modifiers/              # View Modifiers
│   └── Resources/
│       ├── Assets.xcassets
│       ├── Localizable.strings
│       └── Info.plist
├── MyAppTests/
├── MyAppUITests/
└── MyApp.xcodeproj
```

---

## 三、SwiftUI 開發規範

### 3.1 View 結構

```swift
import SwiftUI

struct HomeView: View {
    // MARK: - Properties
    @StateObject private var viewModel = HomeViewModel()
    @State private var isShowingSheet = false

    // MARK: - Body
    var body: some View {
        NavigationStack {
            content
                .navigationTitle("首頁")
                .toolbar { toolbarContent }
                .sheet(isPresented: $isShowingSheet) { sheetContent }
        }
        .task { await viewModel.loadData() }
    }

    // MARK: - View Components
    @ViewBuilder
    private var content: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(viewModel.items) { item in
                    ItemCard(item: item)
                }
            }
            .padding()
        }
    }

    @ToolbarContentBuilder
    private var toolbarContent: some ToolbarContent {
        ToolbarItem(placement: .primaryAction) {
            Button("新增") { isShowingSheet = true }
        }
    }

    private var sheetContent: some View {
        AddItemView()
    }
}

// MARK: - Preview
#Preview {
    HomeView()
}
```

### 3.2 ViewModel 結構

```swift
import Foundation
import Observation

@Observable
final class HomeViewModel {
    // MARK: - Published State
    var items: [Item] = []
    var isLoading = false
    var errorMessage: String?

    // MARK: - Dependencies
    private let service: ItemServiceProtocol

    // MARK: - Init
    init(service: ItemServiceProtocol = ItemService()) {
        self.service = service
    }

    // MARK: - Public Methods
    @MainActor
    func loadData() async {
        isLoading = true
        defer { isLoading = false }

        do {
            items = try await service.fetchItems()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func addItem(_ item: Item) async {
        do {
            let newItem = try await service.createItem(item)
            await MainActor.run {
                items.append(newItem)
            }
        } catch {
            await MainActor.run {
                errorMessage = error.localizedDescription
            }
        }
    }
}
```

---

## 四、網路層設計

### 4.1 API Client

```swift
import Foundation

// MARK: - API Error
enum APIError: LocalizedError {
    case invalidURL
    case invalidResponse
    case decodingError
    case serverError(Int)
    case networkError(Error)

    var errorDescription: String? {
        switch self {
        case .invalidURL: return "無效的 URL"
        case .invalidResponse: return "無效的回應"
        case .decodingError: return "資料解析錯誤"
        case .serverError(let code): return "伺服器錯誤: \(code)"
        case .networkError(let error): return error.localizedDescription
        }
    }
}

// MARK: - API Client
actor APIClient {
    static let shared = APIClient()

    private let session: URLSession
    private let decoder: JSONDecoder
    private let baseURL: URL

    init(
        baseURL: URL = URL(string: "https://api.example.com/v1")!,
        session: URLSession = .shared
    ) {
        self.baseURL = baseURL
        self.session = session
        self.decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        decoder.dateDecodingStrategy = .iso8601
    }

    func request<T: Decodable>(
        endpoint: String,
        method: HTTPMethod = .get,
        body: Encodable? = nil
    ) async throws -> T {
        guard let url = URL(string: endpoint, relativeTo: baseURL) else {
            throw APIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = method.rawValue
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // Add auth token if available
        if let token = AuthService.shared.accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        guard 200...299 ~= httpResponse.statusCode else {
            throw APIError.serverError(httpResponse.statusCode)
        }

        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            throw APIError.decodingError
        }
    }
}

enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case patch = "PATCH"
    case delete = "DELETE"
}
```

---

## 五、資料持久化

### 5.1 SwiftData（iOS 17+）

```swift
import SwiftData

@Model
final class Item {
    var id: UUID
    var title: String
    var createdAt: Date
    var isCompleted: Bool

    @Relationship(deleteRule: .cascade)
    var tags: [Tag]

    init(title: String) {
        self.id = UUID()
        self.title = title
        self.createdAt = Date()
        self.isCompleted = false
        self.tags = []
    }
}

@Model
final class Tag {
    var id: UUID
    var name: String

    init(name: String) {
        self.id = UUID()
        self.name = name
    }
}

// 使用
@main
struct MyAppApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: [Item.self, Tag.self])
    }
}
```

### 5.2 UserDefaults（簡單資料）

```swift
import Foundation

@propertyWrapper
struct UserDefault<T> {
    let key: String
    let defaultValue: T

    var wrappedValue: T {
        get { UserDefaults.standard.object(forKey: key) as? T ?? defaultValue }
        set { UserDefaults.standard.set(newValue, forKey: key) }
    }
}

// 使用
enum AppSettings {
    @UserDefault(key: "isDarkMode", defaultValue: false)
    static var isDarkMode: Bool

    @UserDefault(key: "selectedLanguage", defaultValue: "zh-TW")
    static var selectedLanguage: String
}
```

---

## 六、測試規範

### 6.1 單元測試

```swift
import XCTest
@testable import MyApp

final class HomeViewModelTests: XCTestCase {
    var sut: HomeViewModel!
    var mockService: MockItemService!

    override func setUp() {
        super.setUp()
        mockService = MockItemService()
        sut = HomeViewModel(service: mockService)
    }

    override func tearDown() {
        sut = nil
        mockService = nil
        super.tearDown()
    }

    func testLoadData_Success() async {
        // Given
        let expectedItems = [Item(title: "Test")]
        mockService.mockItems = expectedItems

        // When
        await sut.loadData()

        // Then
        XCTAssertEqual(sut.items.count, 1)
        XCTAssertEqual(sut.items.first?.title, "Test")
        XCTAssertNil(sut.errorMessage)
    }

    func testLoadData_Failure() async {
        // Given
        mockService.shouldFail = true

        // When
        await sut.loadData()

        // Then
        XCTAssertTrue(sut.items.isEmpty)
        XCTAssertNotNil(sut.errorMessage)
    }
}

// Mock Service
class MockItemService: ItemServiceProtocol {
    var mockItems: [Item] = []
    var shouldFail = false

    func fetchItems() async throws -> [Item] {
        if shouldFail {
            throw APIError.networkError(NSError(domain: "", code: -1))
        }
        return mockItems
    }
}
```

### 6.2 UI 測試

```swift
import XCTest

final class HomeViewUITests: XCTestCase {
    var app: XCUIApplication!

    override func setUp() {
        super.setUp()
        continueAfterFailure = false
        app = XCUIApplication()
        app.launchArguments = ["UI_TESTING"]
        app.launch()
    }

    func testAddItem() {
        // Given
        let addButton = app.buttons["新增"]

        // When
        addButton.tap()

        // Then
        XCTAssertTrue(app.sheets.element.exists)
    }

    func testNavigateToSettings() {
        // Given
        let settingsTab = app.tabBars.buttons["設定"]

        // When
        settingsTab.tap()

        // Then
        XCTAssertTrue(app.navigationBars["設定"].exists)
    }
}
```

---

## 七、安全最佳實踐

### 7.1 Keychain 存儲

```swift
import Security

enum KeychainError: Error {
    case duplicateEntry
    case unknown(OSStatus)
    case notFound
}

final class KeychainService {
    static let shared = KeychainService()

    func save(_ data: Data, for key: String, requireBiometrics: Bool = false) throws {
        var query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ]

        if requireBiometrics {
            var error: Unmanaged<CFError>?
            guard let accessControl = SecAccessControlCreateWithFlags(
                nil,
                kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
                .biometryAny,
                &error
            ) else {
                throw KeychainError.unknown(errSecParam)
            }
            query[kSecAttrAccessControl as String] = accessControl
        }

        let status = SecItemAdd(query as CFDictionary, nil)

        if status == errSecDuplicateItem {
            try update(data, for: key)
        } else if status != errSecSuccess {
            throw KeychainError.unknown(status)
        }
    }

    func read(for key: String) throws -> Data {
        // ... (省略 read 實作，需注意讀取時也要處理 biometrics prompt) ...
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        guard status == errSecSuccess, let data = result as? Data else {
            throw KeychainError.notFound
        }
        return data
    }

    // ... (update method) ...
    private func update(_ data: Data, for key: String) throws {
       // Implementation omitted for brevity
    }
}
```

### 7.2 生物辨識

(保留原有內容)

---

## ❌ 禁止事項

```markdown
❌ 絕對禁止：

1. **硬編碼敏感資訊** (API Key, Token)
   - 禁止在代碼中直接寫死密鑰
   - 強制使用 `xcconfig` 或環境變數

2. **在 Log 中打印敏感數據**
   - 禁止 `print(user.password)` 或 `print(request.headers)`
   - Release 版必須禁用 console log

3. **不安全的數據存儲**
   - 禁止將 Token/密碼存入 `UserDefaults` (這是純文本 plist)
   - 強制使用 Keychain

4. 在主線程執行網路請求
5. 強制解包（force unwrap）可選值
6. 忽略 App Store 審核指南
```

---

## 十、自檢清單

### 開發階段

```markdown
□ 專案結構符合 MVVM 模式
□ 使用 @Observable 或 ObservableObject
□ 網路請求使用 async/await
□ 敏感資料存儲在 Keychain
□ 支援 Dark Mode
□ 支援 Dynamic Type
```

### 提交前

```markdown
□ 所有測試通過
□ 無記憶體洩漏
□ 支援所有目標設備尺寸
□ 無硬編碼字串（使用 Localizable.strings）
□ App Icon 和 Launch Screen 配置完成
□ 隱私說明（Privacy Manifest）配置
```

### 發布前

```markdown
□ App Store Connect 資料完整
□ 截圖準備完成
□ 隱私政策 URL 有效
□ TestFlight 測試完成
□ 審核指南檢查完成
```

---

## 參考資源

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [ios-simulator-skill](https://github.com/conorluddy/ios-simulator-skill)
- [SwiftUI Tutorials](https://developer.apple.com/tutorials/swiftui)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

**版本**: 1.0.0
**最後更新**: 2025-12-26
