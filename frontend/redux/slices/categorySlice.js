import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      // Her kategori için blogCount'un varsa kullan, yoksa 0 atayalım.
      const data = response.data.map(category => ({
        ...category,
        blogCount: category.blogCount || 0
      }));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Kategori yüklenemedi");
    }
  }
);
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
