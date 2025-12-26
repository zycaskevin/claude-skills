# Flutter 開發技能（Flutter Development）

> **技能 ID**: `flutter-development`
> **版本**: 1.0.0
> **用途**: Flutter 跨平台開發、Dart 語言、Material/Cupertino 設計
> **參考**: [Flutter](https://flutter.dev), [Dart](https://dart.dev)

---

## 觸發條件

當使用者需求包含以下關鍵字時，應激活此技能：

- 「Flutter」、「Dart」
- 「跨平台」、「多平台 App」
- 「Material Design」、「Cupertino」
- 「Widget」、「Flutter App」

---

## 一、核心原則

```
╔════════════════════════════════════════════════════════════╗
║  Flutter：一套代碼、六大平台、原生效能、精美 UI            ║
║  One Codebase, Six Platforms, Native Performance           ║
╚════════════════════════════════════════════════════════════╝
```

---

## 二、專案結構

### 2.1 推薦目錄結構（Feature-First）

```
my_app/
├── lib/
│   ├── main.dart                    # 入口
│   ├── app/
│   │   ├── app.dart                 # App Widget
│   │   ├── routes.dart              # 路由配置
│   │   └── di.dart                  # 依賴注入
│   ├── core/                        # 核心模組
│   │   ├── constants/
│   │   ├── errors/
│   │   ├── extensions/
│   │   ├── theme/
│   │   │   ├── app_theme.dart
│   │   │   ├── colors.dart
│   │   │   └── typography.dart
│   │   ├── utils/
│   │   └── widgets/                 # 共用 Widget
│   ├── features/                    # 功能模組
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   ├── models/
│   │   │   │   └── repositories/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   ├── repositories/
│   │   │   │   └── usecases/
│   │   │   └── presentation/
│   │   │       ├── bloc/
│   │   │       ├── pages/
│   │   │       └── widgets/
│   │   ├── home/
│   │   └── settings/
│   └── shared/                      # 共享模組
│       ├── data/
│       │   ├── api/
│       │   └── local/
│       └── domain/
├── test/                            # 測試
│   ├── unit/
│   ├── widget/
│   └── integration/
├── android/
├── ios/
├── web/
├── pubspec.yaml
└── analysis_options.yaml
```

---

## 三、Widget 開發規範

### 3.1 StatelessWidget

```dart
// lib/features/home/presentation/widgets/item_card.dart
import 'package:flutter/material.dart';
import 'package:my_app/features/home/domain/entities/item.dart';

class ItemCard extends StatelessWidget {
  const ItemCard({
    super.key,
    required this.item,
    required this.onTap,
  });

  final Item item;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                item.title,
                style: theme.textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Text(
                item.description,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

### 3.2 StatefulWidget

```dart
// lib/features/auth/presentation/pages/login_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:my_app/features/auth/presentation/bloc/auth_bloc.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    if (_formKey.currentState?.validate() ?? false) {
      context.read<AuthBloc>().add(
        LoginRequested(
          email: _emailController.text.trim(),
          password: _passwordController.text,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('登入')),
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message)),
            );
          } else if (state is AuthAuthenticated) {
            Navigator.of(context).pushReplacementNamed('/home');
          }
        },
        builder: (context, state) {
          return SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    TextFormField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        prefixIcon: Icon(Icons.email),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return '請輸入 Email';
                        }
                        if (!value.contains('@')) {
                          return '請輸入有效的 Email';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _passwordController,
                      obscureText: _obscurePassword,
                      decoration: InputDecoration(
                        labelText: '密碼',
                        prefixIcon: const Icon(Icons.lock),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword
                                ? Icons.visibility
                                : Icons.visibility_off,
                          ),
                          onPressed: () {
                            setState(() {
                              _obscurePassword = !_obscurePassword;
                            });
                          },
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return '請輸入密碼';
                        }
                        if (value.length < 8) {
                          return '密碼至少 8 個字元';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton(
                        onPressed: state is AuthLoading ? null : _handleLogin,
                        child: state is AuthLoading
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              )
                            : const Text('登入'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
```

---

## 四、狀態管理（BLoC）

### 4.1 Event

```dart
// lib/features/home/presentation/bloc/home_event.dart
part of 'home_bloc.dart';

sealed class HomeEvent extends Equatable {
  const HomeEvent();

  @override
  List<Object?> get props => [];
}

final class HomeLoadRequested extends HomeEvent {
  const HomeLoadRequested();
}

final class HomeRefreshRequested extends HomeEvent {
  const HomeRefreshRequested();
}

final class HomeItemDeleted extends HomeEvent {
  const HomeItemDeleted(this.itemId);

  final String itemId;

  @override
  List<Object?> get props => [itemId];
}
```

### 4.2 State

```dart
// lib/features/home/presentation/bloc/home_state.dart
part of 'home_bloc.dart';

sealed class HomeState extends Equatable {
  const HomeState();

  @override
  List<Object?> get props => [];
}

final class HomeInitial extends HomeState {
  const HomeInitial();
}

final class HomeLoading extends HomeState {
  const HomeLoading();
}

final class HomeLoaded extends HomeState {
  const HomeLoaded(this.items);

  final List<Item> items;

  @override
  List<Object?> get props => [items];
}

final class HomeError extends HomeState {
  const HomeError(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
```

### 4.3 BLoC

```dart
// lib/features/home/presentation/bloc/home_bloc.dart
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:my_app/features/home/domain/entities/item.dart';
import 'package:my_app/features/home/domain/usecases/get_items.dart';
import 'package:my_app/features/home/domain/usecases/delete_item.dart';

part 'home_event.dart';
part 'home_state.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  HomeBloc({
    required GetItems getItems,
    required DeleteItem deleteItem,
  })  : _getItems = getItems,
        _deleteItem = deleteItem,
        super(const HomeInitial()) {
    on<HomeLoadRequested>(_onLoadRequested);
    on<HomeRefreshRequested>(_onRefreshRequested);
    on<HomeItemDeleted>(_onItemDeleted);
  }

  final GetItems _getItems;
  final DeleteItem _deleteItem;

  Future<void> _onLoadRequested(
    HomeLoadRequested event,
    Emitter<HomeState> emit,
  ) async {
    emit(const HomeLoading());

    final result = await _getItems();

    result.fold(
      (failure) => emit(HomeError(failure.message)),
      (items) => emit(HomeLoaded(items)),
    );
  }

  Future<void> _onRefreshRequested(
    HomeRefreshRequested event,
    Emitter<HomeState> emit,
  ) async {
    final result = await _getItems();

    result.fold(
      (failure) => emit(HomeError(failure.message)),
      (items) => emit(HomeLoaded(items)),
    );
  }

  Future<void> _onItemDeleted(
    HomeItemDeleted event,
    Emitter<HomeState> emit,
  ) async {
    final currentState = state;
    if (currentState is HomeLoaded) {
      final result = await _deleteItem(event.itemId);

      result.fold(
        (failure) => emit(HomeError(failure.message)),
        (_) {
          final updatedItems = currentState.items
              .where((item) => item.id != event.itemId)
              .toList();
          emit(HomeLoaded(updatedItems));
        },
      );
    }
  }
}
```

---

## 五、Clean Architecture

### 5.1 Entity

```dart
// lib/features/home/domain/entities/item.dart
import 'package:equatable/equatable.dart';

class Item extends Equatable {
  const Item({
    required this.id,
    required this.title,
    required this.description,
    required this.createdAt,
    this.isCompleted = false,
  });

  final String id;
  final String title;
  final String description;
  final DateTime createdAt;
  final bool isCompleted;

  Item copyWith({
    String? id,
    String? title,
    String? description,
    DateTime? createdAt,
    bool? isCompleted,
  }) {
    return Item(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      createdAt: createdAt ?? this.createdAt,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }

  @override
  List<Object?> get props => [id, title, description, createdAt, isCompleted];
}
```

### 5.2 Repository Interface

```dart
// lib/features/home/domain/repositories/item_repository.dart
import 'package:dartz/dartz.dart';
import 'package:my_app/core/errors/failures.dart';
import 'package:my_app/features/home/domain/entities/item.dart';

abstract class ItemRepository {
  Future<Either<Failure, List<Item>>> getItems();
  Future<Either<Failure, Item>> getItem(String id);
  Future<Either<Failure, Item>> createItem(Item item);
  Future<Either<Failure, Item>> updateItem(Item item);
  Future<Either<Failure, void>> deleteItem(String id);
}
```

### 5.3 Use Case

```dart
// lib/features/home/domain/usecases/get_items.dart
import 'package:dartz/dartz.dart';
import 'package:my_app/core/errors/failures.dart';
import 'package:my_app/features/home/domain/entities/item.dart';
import 'package:my_app/features/home/domain/repositories/item_repository.dart';

class GetItems {
  const GetItems(this._repository);

  final ItemRepository _repository;

  Future<Either<Failure, List<Item>>> call() {
    return _repository.getItems();
  }
}
```

### 5.4 Repository Implementation

```dart
// lib/features/home/data/repositories/item_repository_impl.dart
import 'package:dartz/dartz.dart';
import 'package:my_app/core/errors/exceptions.dart';
import 'package:my_app/core/errors/failures.dart';
import 'package:my_app/features/home/data/datasources/item_remote_datasource.dart';
import 'package:my_app/features/home/data/datasources/item_local_datasource.dart';
import 'package:my_app/features/home/domain/entities/item.dart';
import 'package:my_app/features/home/domain/repositories/item_repository.dart';

class ItemRepositoryImpl implements ItemRepository {
  const ItemRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  final ItemRemoteDataSource remoteDataSource;
  final ItemLocalDataSource localDataSource;

  @override
  Future<Either<Failure, List<Item>>> getItems() async {
    try {
      final items = await remoteDataSource.getItems();
      await localDataSource.cacheItems(items);
      return Right(items.map((m) => m.toEntity()).toList());
    } on ServerException catch (e) {
      // Try to get cached data
      try {
        final cachedItems = await localDataSource.getCachedItems();
        return Right(cachedItems.map((m) => m.toEntity()).toList());
      } catch (_) {
        return Left(ServerFailure(e.message));
      }
    } on NetworkException {
      try {
        final cachedItems = await localDataSource.getCachedItems();
        return Right(cachedItems.map((m) => m.toEntity()).toList());
      } catch (_) {
        return const Left(NetworkFailure('網路連線失敗'));
      }
    }
  }

  // ... 其他方法
}
```

---

## 六、依賴注入（GetIt）

```dart
// lib/app/di.dart
import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';
import 'package:my_app/features/home/data/datasources/item_remote_datasource.dart';
import 'package:my_app/features/home/data/repositories/item_repository_impl.dart';
import 'package:my_app/features/home/domain/repositories/item_repository.dart';
import 'package:my_app/features/home/domain/usecases/get_items.dart';
import 'package:my_app/features/home/presentation/bloc/home_bloc.dart';

final sl = GetIt.instance;

Future<void> initDependencies() async {
  // External
  sl.registerLazySingleton<Dio>(() => Dio(
    BaseOptions(
      baseUrl: 'https://api.example.com/v1',
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
    ),
  ));

  // Data Sources
  sl.registerLazySingleton<ItemRemoteDataSource>(
    () => ItemRemoteDataSourceImpl(sl()),
  );

  // Repositories
  sl.registerLazySingleton<ItemRepository>(
    () => ItemRepositoryImpl(
      remoteDataSource: sl(),
      localDataSource: sl(),
    ),
  );

  // Use Cases
  sl.registerLazySingleton(() => GetItems(sl()));
  sl.registerLazySingleton(() => DeleteItem(sl()));

  // BLoCs
  sl.registerFactory(() => HomeBloc(
    getItems: sl(),
    deleteItem: sl(),
  ));
}
```

---

## 七、測試規範

### 7.1 單元測試

```dart
// test/unit/features/home/domain/usecases/get_items_test.dart
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:my_app/features/home/domain/entities/item.dart';
import 'package:my_app/features/home/domain/repositories/item_repository.dart';
import 'package:my_app/features/home/domain/usecases/get_items.dart';

class MockItemRepository extends Mock implements ItemRepository {}

void main() {
  late GetItems usecase;
  late MockItemRepository mockRepository;

  setUp(() {
    mockRepository = MockItemRepository();
    usecase = GetItems(mockRepository);
  });

  final tItems = [
    Item(
      id: '1',
      title: 'Test Item',
      description: 'Description',
      createdAt: DateTime.now(),
    ),
  ];

  test('should get items from repository', () async {
    // arrange
    when(() => mockRepository.getItems())
        .thenAnswer((_) async => Right(tItems));

    // act
    final result = await usecase();

    // assert
    expect(result, Right(tItems));
    verify(() => mockRepository.getItems()).called(1);
    verifyNoMoreInteractions(mockRepository);
  });
}
```

### 7.2 Widget 測試

```dart
// test/widget/features/home/presentation/widgets/item_card_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/features/home/domain/entities/item.dart';
import 'package:my_app/features/home/presentation/widgets/item_card.dart';

void main() {
  final tItem = Item(
    id: '1',
    title: 'Test Title',
    description: 'Test Description',
    createdAt: DateTime.now(),
  );

  testWidgets('ItemCard displays item information', (tester) async {
    bool tapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ItemCard(
            item: tItem,
            onTap: () => tapped = true,
          ),
        ),
      ),
    );

    expect(find.text('Test Title'), findsOneWidget);
    expect(find.text('Test Description'), findsOneWidget);

    await tester.tap(find.byType(ItemCard));
    expect(tapped, isTrue);
  });
}
```

---

## 八、安全最佳實踐

### 8.1 安全存儲 (flutter_secure_storage)

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  static const _storage = FlutterSecureStorage();

  static const _options = IOSOptions(
    accountName: 'my_app_secure_account',
    accessibility: KeychainAccessibility.unlocked_this_device,
  );

  static const _androidOptions = AndroidOptions(
    encryptedSharedPreferences: true,
  );

  Future<void> saveToken(String token) async {
    await _storage.write(
      key: 'auth_token',
      value: token,
      iOptions: _options,
      aOptions: _androidOptions,
    );
  }

  Future<String?> getToken() async {
    return await _storage.read(
      key: 'auth_token',
      iOptions: _options,
      aOptions: _androidOptions,
    );
  }
}
```

---

## 九、效能優化

### 9.1 Widget 優化

```dart
// ✅ 使用 const 構造函數
const SizedBox(height: 16);
const Padding(padding: EdgeInsets.all(16));

// ✅ 使用 ListView.builder 而非 ListView
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemCard(item: items[index]),
);

// ✅ 使用 RepaintBoundary 隔離重繪
RepaintBoundary(
  child: ExpensiveWidget(),
);
```

### 9.2 圖片優化

```dart
// 使用 cached_network_image
CachedNetworkImage(
  imageUrl: imageUrl,
  placeholder: (context, url) => const CircularProgressIndicator(),
  errorWidget: (context, url, error) => const Icon(Icons.error),
  fadeInDuration: const Duration(milliseconds: 300),
);
```

---

## ❌ 禁止事項

```markdown
❌ 絕對禁止：

1. **不安全的存儲**
   - 禁止使用 `SharedPreferences` 儲存 Token
   - 強制使用 `flutter_secure_storage`

2. **在此打印敏感 Log**
   - 禁止 `print('Token: $token')`
   - Release Mode 必須移除 `debugPrint`

3. **主線程阻塞**
   - 禁止在 `build` 方法中執行 `await` 或大量運算

4. **硬編碼密鑰**
   - 禁止將 API Key 寫死在 Dart 檔案
   - 使用 `--dart-define` 或 `.env`

5. 忽略 dispose 清理資源 (Memory Leak 風險)
6. 在 StatelessWidget 中使用可變狀態
7. 忽略 null safety
```

---

## 十一、自檢清單

### 開發階段

```markdown
□ 使用 Clean Architecture 分層
□ BLoC 管理狀態
□ 依賴注入（GetIt）
□ 使用 const 優化
□ 支援深色模式
□ 國際化（l10n）配置
□ 敏感資料已加密存儲
```

### 提交前

```markdown
□ 所有測試通過
□ flutter analyze 無錯誤
□ iOS 和 Android 都能運行
□ 無 debug print
□ 資源已優化
□ 版本號已更新
```

---

## 參考資源

- [Flutter](https://flutter.dev)
- [Dart](https://dart.dev)
- [BLoC Library](https://bloclibrary.dev)
- [Clean Architecture](https://resocoder.com/flutter-clean-architecture-tdd/)
- [Flutter Secure Storage](https://pub.dev/packages/flutter_secure_storage)

---

**版本**: 1.0.0
**最後更新**: 2025-12-26
