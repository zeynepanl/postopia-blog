import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import blogReducer from "./slices/blogSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Non-serializable değer hatalarını engeller
    }),
  devTools: process.env.NODE_ENV !== "production", // DevTools sadece geliştirme ortamında aktif
});

export default store;
