// src/redux/slices/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Kullanıcı listesini çekmek için async thunk
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Kullanıcılar array şeklinde dönecektir.
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Kullanıcılar yüklenirken hata oluştu."
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Ek işlemler eklenebilir.
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default usersSlice.reducer;
