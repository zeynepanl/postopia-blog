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

// Kategori oluşturma için thunk
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async ({ name, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/categories/create",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.category;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Kategori oluşturulurken hata oluştu."
      );
    }
  }
);


export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, name, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/categories/update",
        { id, name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.category;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Kategori güncellenirken hata oluştu."
      );
    }
  }
);


export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/categories/delete",
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Kategori silinirken hata oluştu."
      );
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
      })

       .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat._id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
