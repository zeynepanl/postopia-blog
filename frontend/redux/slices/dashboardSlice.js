// redux/slices/dashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (token, { rejectWithValue }) => {
    try {
      // Dashboard verilerini çekiyoruz
      const dashboardRes = await axios.get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Popüler blogları çekiyoruz (api/blogs/popular endpoint'ine yönlendirilmiş)
      const popularPostsRes = await axios.get("http://localhost:5000/api/blogs/popular", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // İki veriyi birleştirip tek bir nesne olarak döndürüyoruz
      return {
        ...dashboardRes.data,
        popularPosts: popularPostsRes.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
