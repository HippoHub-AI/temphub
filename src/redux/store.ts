import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import popReducer from "./slices/popup.slice";
import loaderReducer from "./slices/loaderSlice";

const persistCongig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user", "chat"],
};
const reducer = combineReducers({
  user: userReducer,
  popUp: popReducer,
  loader: loaderReducer,
});
const persistedReducer = persistReducer(persistCongig, reducer);
export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});
