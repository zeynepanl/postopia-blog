import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import blogReducer from "./slices/blogSlice";
import commentReducer from "./slices/commentSlice";
import category from "./slices/categorySlice";
import tagReducer from "./slices/tagSlice"; 

const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    comment: commentReducer,
    category: category,
    tag: tagReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Non-serializable değer hatalarını engeller
    }),
  devTools: process.env.NODE_ENV !== "production", // DevTools sadece geliştirme ortamında aktif
});

export default store;