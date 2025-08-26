import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './redux/user/userSlice';


import usersReducer from './redux/users/usersSlice';
import authReducer from './redux/auth/authSlice';
import sidebarReducer from './redux/sidebar/sidebarSlice';
import rolesReducer from './redux/roles/rolesSlice';
import statusesReducer from './redux/statuses/statusesSlice';
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
  users: usersReducer,
  auth: authReducer,
  ui: uiReducer,
  sidebar: sidebarReducer,
  roles: rolesReducer,
  statuses: statusesReducer,
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
