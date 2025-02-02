import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, // Kullanıcı yetkilendirme state yönetimi
  },
});

export default store;
