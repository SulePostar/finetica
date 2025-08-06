import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './redux/user/userSlice';
import authReducer from './redux/auth/authSlice'; 


// Root reducer: auth, user (persistirani) + ui (nije persistiran)
const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  users: usersReducer,
  ui: uiReducer,
});

// Konfiguracija za redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'auth'],, // samo user i auth se čuvaju u localStorage, UI state nije persistovan
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
    }),,
});

// Persistor (za redux-persist)
export const persistor = persistStore(store);
