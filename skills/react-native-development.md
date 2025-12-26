# React Native 開發技能（React Native Development）

> **技能 ID**: `react-native-development`
> **版本**: 1.0.0
> **用途**: React Native 跨平台開發、Expo、原生模組整合
> **參考**: [claude-flow](https://github.com/ruvnet/claude-flow), [React Native](https://reactnative.dev)

---

## 觸發條件

當使用者需求包含以下關鍵字時，應激活此技能：

- 「React Native」、「RN」
- 「Expo」、「跨平台 App」
- 「原生模組」、「Native Module」
- 「iOS + Android」同時開發

---

## 一、核心原則

```
╔════════════════════════════════════════════════════════════╗
║  React Native：一次編寫、雙平台運行、原生體驗              ║
║  Write Once, Run on Both Platforms, Native Experience      ║
╚════════════════════════════════════════════════════════════╝
```

---

## 二、專案結構

### 2.1 推薦目錄結構

```
my-app/
├── src/
│   ├── app/                        # App 入口
│   │   ├── App.tsx
│   │   └── index.ts
│   ├── screens/                    # 頁面組件
│   │   ├── HomeScreen/
│   │   │   ├── index.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── HomeScreen.styles.ts
│   │   │   └── components/
│   │   ├── AuthScreen/
│   │   └── SettingsScreen/
│   ├── components/                 # 共用組件
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── Card/
│   │   └── layout/
│   │       ├── Header/
│   │       └── TabBar/
│   ├── navigation/                 # 導航配置
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── services/                   # API 服務
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── endpoints/
│   │   └── storage/
│   ├── store/                      # 狀態管理
│   │   ├── index.ts
│   │   ├── slices/
│   │   └── hooks.ts
│   ├── hooks/                      # 自定義 Hooks
│   ├── utils/                      # 工具函數
│   ├── constants/                  # 常量
│   ├── types/                      # TypeScript 類型
│   └── theme/                      # 主題配置
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
├── android/                        # Android 原生代碼
├── ios/                            # iOS 原生代碼
├── __tests__/                      # 測試
├── app.json
├── babel.config.js
├── metro.config.js
├── tsconfig.json
└── package.json
```

---

## 三、組件開發規範

### 3.1 函數組件結構

```typescript
// src/screens/HomeScreen/HomeScreen.tsx
import React, { useCallback, useEffect } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchItems, selectItems, selectLoading } from '@/store/slices/itemsSlice';
import { ItemCard } from '@/components/common/ItemCard';
import { LoadingIndicator } from '@/components/common/LoadingIndicator';
import { ErrorView } from '@/components/common/ErrorView';
import { styles } from './HomeScreen.styles';
import type { Item } from '@/types';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectItems);
  const isLoading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleItemPress = useCallback((item: Item) => {
    navigation.navigate('Detail', { itemId: item.id });
  }, [navigation]);

  const renderItem = useCallback(({ item }: { item: Item }) => (
    <ItemCard item={item} onPress={() => handleItemPress(item)} />
  ), [handleItemPress]);

  const keyExtractor = useCallback((item: Item) => item.id, []);

  if (error) {
    return <ErrorView message={error} onRetry={handleRefresh} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          isLoading ? <LoadingIndicator /> : <EmptyView />
        }
      />
    </View>
  );
};
```

### 3.2 樣式定義

```typescript
// src/screens/HomeScreen/HomeScreen.styles.ts
import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
  },
  separator: {
    height: spacing.sm,
  },
});
```

### 3.3 可重用組件

```typescript
// src/components/common/Button/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : colors.white}
        />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  small: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  medium: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  large: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
});
```

---

## 四、導航配置

### 4.1 React Navigation

```typescript
// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

// Screens
import { HomeScreen } from '@/screens/HomeScreen';
import { DetailScreen } from '@/screens/DetailScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { LoginScreen } from '@/screens/LoginScreen';

// Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  HomeList: undefined;
  Detail: { itemId: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeList" component={HomeScreen} />
    <HomeStack.Screen name="Detail" component={DetailScreen} />
  </HomeStack.Navigator>
);

const MainNavigator = () => (
  <MainTab.Navigator>
    <MainTab.Screen
      name="Home"
      component={HomeNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        ),
      }}
    />
    <MainTab.Screen name="Profile" component={ProfileScreen} />
    <MainTab.Screen name="Settings" component={SettingsScreen} />
  </MainTab.Navigator>
);

export const RootNavigator = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
```

---

## 五、狀態管理（Redux Toolkit）

### 5.1 Store 配置

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

import authReducer from './slices/authSlice';
import itemsReducer from './slices/itemsSlice';
import settingsReducer from './slices/settingsSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'settings'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  items: itemsReducer,
  settings: settingsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 5.2 Slice 範例

```typescript
// src/store/slices/itemsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { itemsApi } from '@/services/api/endpoints/items';
import type { Item } from '@/types';
import type { RootState } from '../index';

interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await itemsApi.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearItems: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectItems = (state: RootState) => state.items.items;
export const selectLoading = (state: RootState) => state.items.loading;
export const selectError = (state: RootState) => state.items.error;

export const { addItem, removeItem, clearItems } = itemsSlice.actions;
export default itemsSlice.reducer;
```

---

## 六、API 服務

### 6.1 Axios 配置

```typescript
// src/services/api/client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
      await AsyncStorage.removeItem('accessToken');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 七、安全最佳實踐

### 7.1 安全存儲 (react-native-keychain)

```typescript
import * as Keychain from 'react-native-keychain';

export const AuthService = {
  async saveToken(token: string) {
    // iOS: Keychain
    // Android: Keystore (AES Encrypted)
    await Keychain.setGenericPassword('auth_token', token, {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },

  async getToken() {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Keychain Access Failed', error);
      return null;
    }
  },

  async clearToken() {
    await Keychain.resetGenericPassword();
  },
};
```

---

## 八、效能優化

### 8.1 列表優化

```typescript
// ✅ 正確：使用 React.memo 和 useCallback
const ItemCard = React.memo<{ item: Item; onPress: () => void }>(
  ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{item.title}</Text>
    </TouchableOpacity>
  )
);

// 在 FlatList 中使用
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  // 效能優化
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
  initialNumToRender={10}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### 8.2 圖片優化

```typescript
import FastImage from 'react-native-fast-image';

// 使用 FastImage 取代 Image
<FastImage
  source={{
    uri: imageUrl,
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable,
  }}
  style={styles.image}
  resizeMode={FastImage.resizeMode.cover}
/>
```

---

## 九、測試規範

### 9.1 組件測試

```typescript
// __tests__/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/common/Button';

describe('Button', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(
      <Button title="點擊我" onPress={() => {}} />
    );
    expect(getByText('點擊我')).toBeTruthy();
  });
  // ... 其他測試
});
```

---

## ❌ 禁止事項

```markdown
❌ 絕對禁止：

1. **不安全的存儲**
   - 禁止使用 `AsyncStorage` 儲存 Token
   - 強制使用 `react-native-keychain` 或 `react-native-encrypted-storage`

2. **在 Log 中打印敏感數據**
   - 禁止 `console.log('Token:', token)`
   - 生產環境必須移除 `console.*` (使用 babel-plugin-transform-remove-console)

3. **主線程阻塞**
   - 禁止在 JS Thread 執行繁重計算 (使用 Worklets 或 Native Modules)

4. **硬編碼密鑰**
   - 禁止將 API Key 直接寫入代碼
   - 強制使用 `react-native-config` (.env)

5. 在 render 中創建新的函數/物件（導致重新渲染）
6. 不使用 keyExtractor 的 FlatList
7. 使用內聯樣式（影響效能）
8. 忽略平台差異
```

---

## 十一、自檢清單

### 開發階段

```markdown
□ 使用 TypeScript 嚴格模式
□ 組件使用 React.memo 優化
□ FlatList 使用效能優化參數
□ 使用 Redux Toolkit 管理狀態
□ API 請求統一封裝
□ 支援深色模式
□ 敏感資料加密存儲
```

### 提交前

```markdown
□ 所有測試通過
□ 無 ESLint/TypeScript 錯誤
□ iOS 和 Android 都能正常運行
□ 無控制台警告
□ 圖片已優化
□ Bundle 大小合理
```

---

## 參考資源

- [React Native](https://reactnative.dev)
- [Expo](https://expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Native Keychain](https://github.com/oblador/react-native-keychain)

---

**版本**: 1.0.0
**最後更新**: 2025-12-26
