import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // для localStorage
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import notificationAlertReducer from "./features/notificationAlert/notificationAlert";
import searchCardCatalogReducer from "./features/searchCardCatalog/searchCardCatalog";
import themeReducer from "./features/theme/theme";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["theme"], // whitelist: ["theme", "notificationAlert"],
};

const rootReducer = combineReducers({
  theme: themeReducer,
  notificationAlert: notificationAlertReducer,
  searchCard: searchCardCatalogReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
