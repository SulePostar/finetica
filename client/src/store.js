import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './redux/user/userSlice';
import authReducer from './redux/auth/authSlice';

// Simple UI state reducer
const initialUIState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  headerShow: true,
};

const uiReducer = (state = initialUIState, action) => {
  if (action.type === 'set') {
    return { ...state, ...action };
  }
  return state;
};

// Root reducer: auth, user (persistirani) + ui (nije persistiran)
const rootReducer = (state, action) => {
  return combineReducers({
    user: userReducer,
    auth: authReducer,
  })(state, action);
};

// Enhanced root reducer with UI state
const enhancedRootReducer = (state, action) => {
  const combinedState = rootReducer(state, action);
  const uiState = uiReducer(state, action);

  return {
    ...combinedState,
    ...uiState,
  };
};

// Konfiguracija za redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'auth'], // samo user i auth se čuvaju u localStorage, UI state nije persistovan
};

const persistedReducer = persistReducer(persistConfig, enhancedRootReducer);

// Store konfiguracija
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Persistor (za redux-persist)
export const persistor = persistStore(store);
