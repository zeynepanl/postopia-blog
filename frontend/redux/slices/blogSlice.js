// frontend/redux/slices/blogSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogAPI from "../../api/blogAPI";

// 1) Blog ekleme
export const addBlog = createAsyncThunk(
  "blog/addBlog",
  async ({ blogData, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue("No token found.");
      }
      console.log("Gönderilen Blog Verisi:", blogData);
      const response = await blogAPI.createBlog(blogData, token);
      return response.data; // Backend'den gelen { message, blog } yapısı
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// 2) Tüm blogları getirme
export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await blogAPI.getBlogs();
      return response.data; // Tüm blogların listesi
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// 3) Kullanıcının kendi bloglarını getirme
export const fetchUserBlogs = createAsyncThunk(
  "blog/fetchUserBlogs",
  async (token, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue("No token found.");
      }
      const response = await blogAPI.getUserBlogs(token);
      return response.data; // Kullanıcının blog listesi
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// 4) Post Güncelleme
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ blogData, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue("No token found.");
      }
      // blogData => { id, title, content, categories, tags, ... }
      const response = await blogAPI.updateBlog(blogData, token);
      // Backend'de res.json({ message: "Blog post updated successfully.", blog: updatedBlog })
      // şeklinde dönüyorsa:
      return response.data.blog; // Güncellenmiş blog dokümanı
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],      // Tüm bloglar
    userBlogs: [],  // Kullanıcının kendi blogları
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // addBlog
      .addCase(addBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
        state.loading = false;
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchBlogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchUserBlogs
      .addCase(fetchUserBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBlogs.fulfilled, (state, action) => {
        state.userBlogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateBlog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBlog = action.payload; 
        
        const indexAll = state.blogs.findIndex(
          (blog) => blog._id === updatedBlog._id
        );
        if (indexAll !== -1) {
          state.blogs[indexAll] = updatedBlog;
        }

        const indexUser = state.userBlogs.findIndex(
          (blog) => blog._id === updatedBlog._id
        );
        if (indexUser !== -1) {
          state.userBlogs[indexUser] = updatedBlog;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default blogSlice.reducer;
