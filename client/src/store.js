import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import usersReducer from './redux/users/usersSlice';
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
    // Only update the UI state properties that are provided in the action
    const updates = {};
    if ('sidebarShow' in action) updates.sidebarShow = action.sidebarShow;
    if ('sidebarUnfoldable' in action) updates.sidebarUnfoldable = action.sidebarUnfoldable;
    if ('headerShow' in action) updates.headerShow = action.headerShow;

    return { ...state, ...updates };
  }
  return state;
};

// Root reducer: auth, user, ui
const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  ui: uiReducer,
  users: usersReducer,
});

// Konfiguracija za redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'auth'], // samo user i auth se čuvaju u localStorage, UI state nije persistovan
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

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
