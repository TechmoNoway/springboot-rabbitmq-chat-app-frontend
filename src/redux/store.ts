import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import webSocketReducer from "./webSocketSlice";
import { PersistConfig, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist";

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: "root",
  storage,
  blacklist: ["webSocket"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  webSocket: webSocketReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "webSocket/setStompClient",
          "persist/PERSIST",
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.stompClient"],
        // Ignore these paths in the state
        ignoredPaths: ["webSocket.stompClient"],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
