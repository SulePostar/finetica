import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './store/userSlice';
import authReducer from './redux/auth/authSlice'; // prilagodi putanju ako treba

// Dodatni UI reducer (za sidebar i theme)
const initialUIState = {
  sidebarShow: true,
  theme: 'light',
};

const uiReducer = (state = initialUIState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };
    default:
      return state;
  }
};

// Root reducer: auth, user (persistirani) + ui (nije persistiran)
const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  ui: uiReducer,
});

// Konfiguracija za redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'auth'] // samo user i auth se čuvaju u localStorage
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
    })
});

// Persistor (za redux-persist)
export const persistor = persistStore(store);
