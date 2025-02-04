import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogAPI from "../../api/blogAPI";

// Blog Ekleme
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

// Tüm blogları getirme
export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await blogAPI.getBlogs();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Kullanıcının kendi bloglarını getirme
export const fetchUserBlogs = createAsyncThunk(
  "blog/fetchUserBlogs",
  async (token, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue("No token found.");
      }
      const response = await blogAPI.getUserBlogs(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Tekil Blog Getirme
export const fetchBlogDetails = createAsyncThunk(
  "blog/fetchBlogDetails",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await blogAPI.getBlogDetails(blogId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Blog Güncelleme
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ blogData, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue("No token found.");
      }
      const response = await blogAPI.updateBlog(blogData, token);
      return response.data.blog;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Blog Silme
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async ({ blogId, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue("No token found.");
      }
      await blogAPI.deleteBlog(blogId, token);
      return blogId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],        // Tüm bloglar
    userBlogs: [],    // Kullanıcının kendi blogları
    selectedBlog: null, // Seçili blogun detayları
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

      // fetchBlogDetails (Tekil Blog)
      .addCase(fetchBlogDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedBlog = null;
      })
      .addCase(fetchBlogDetails.fulfilled, (state, action) => {
        state.selectedBlog = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedBlog = null;
      })

      // updateBlog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBlog = action.payload;

        // blogs dizisinde güncelle
        const indexAll = state.blogs.findIndex(
          (blog) => blog._id === updatedBlog._id
        );
        if (indexAll !== -1) {
          state.blogs[indexAll] = updatedBlog;
        }

        // userBlogs dizisinde güncelle
        const indexUser = state.userBlogs.findIndex(
          (blog) => blog._id === updatedBlog._id
        );
        if (indexUser !== -1) {
          state.userBlogs[indexUser] = updatedBlog;
        }

        // selectedBlog güncelle
        state.selectedBlog = updatedBlog;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteBlog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;

        // Tüm bloglar dizisinden çıkar
        state.blogs = state.blogs.filter((b) => b._id !== deletedId);

        // Kullanıcının bloglar dizisinden çıkar
        state.userBlogs = state.userBlogs.filter((b) => b._id !== deletedId);

        // Eğer silinen blog seçiliyse, onu sıfırla
        if (state.selectedBlog?._id === deletedId) {
          state.selectedBlog = null;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default blogSlice.reducer;
