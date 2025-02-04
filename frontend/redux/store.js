import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import blogReducer from "./slices/blogSlice";
import commentReducer from "./slices/commentSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    comment: commentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Non-serializable değer hatalarını engeller
    }),
  devTools: process.env.NODE_ENV !== "production", // DevTools sadece geliştirme ortamında aktif
});

export default store;