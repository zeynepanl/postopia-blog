import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogAPI from '../../api/blogAPI';

//Blog ekleme işlemi
export const addBlog = createAsyncThunk('blog/addBlog', async ({ blogData, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue("No token found.");
      }
  
      console.log("Gönderilen Blog Verisi:", blogData); // Debugging için
      const response = await blogAPI.createBlog(blogData, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });
  
  

//Blogları getirme işlemi
export const fetchBlogs = createAsyncThunk('blog/fetchBlogs', async (_, { rejectWithValue }) => {
  try {
    const response = await blogAPI.getBlogs();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    blogs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Blog Ekleme
      .addCase(addBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
        state.loading = false;
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      //Blogları Getirme
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default blogSlice.reducer;
