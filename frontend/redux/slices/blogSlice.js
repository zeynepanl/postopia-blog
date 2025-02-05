import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogAPI from "../../api/blogAPI";
import axios from "axios";


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

export const fetchLatestBlogs = createAsyncThunk(
  "blog/fetchLatestBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await blogAPI.getLatestBlogs();
      return response.data;
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

// Blog beğenme fonksiyonu
export const toggleBlogLike = createAsyncThunk(
  "blog/toggleBlogLike",
  async ({ blogId, token }, { rejectWithValue }) => {
    try {
      if (!token) return rejectWithValue("No token found.");

      console.log(`Beğeni API'ye gidiyor: Blog ID -> ${blogId}`);

      const response = await fetch("http://localhost:5000/api/blogs/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: blogId }), // 🔥 API'nin beklediği 'id' olarak gönder!
      });

      if (!response.ok) {
        throw new Error("Beğeni güncellenemedi!");
      }

      const data = await response.json();
      return { blogId, likes: data.likes };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchPopularBlogs = createAsyncThunk(
  "blog/fetchPopularBlogs",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Redux: Popular blog API çağrılıyor...");
      const response = await blogAPI.getPopularBlogs();
      console.log("Redux: Gelen veriler", response.data);
      return response.data;
    } catch (error) {
      console.error("Redux Hatası:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const fetchBlogsByCategory = createAsyncThunk(
  "blog/fetchBlogsByCategory",
  async ({ categories }, { rejectWithValue }) => {
    try {
      console.log("Gönderilen Kategoriler:", categories); 
      const response = await axios.get("http://localhost:5000/api/blogs/search", {
        params: { categories: categories.join(",") }, 
      });
      console.log("Gelen Bloglar:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Bloglar yüklenemedi");
    }
  }
);


export const fetchBlogsByTags = createAsyncThunk(
  "blog/fetchBlogsByTags",
  async ({ tags }, { rejectWithValue }) => {
    try {
      console.log("Gönderilen Etiketler:", tags);
      const response = await axios.get("http://localhost:5000/api/blogs/search", {
        params: { tags: tags.join(",") }, // 🔥 API'ye tags'i string olarak gönderiyoruz
      });
      console.log("Gelen Bloglar:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Bloglar yüklenemedi");
    }
  }
);

export const fetchSearchedBlogs = createAsyncThunk(
  "blog/fetchSearchedBlogs",
  async (searchQuery, { rejectWithValue }) => {
    try {
      console.log("🔍 Arama yapılıyor:", searchQuery);
      const response = await axios.get("http://localhost:5000/api/blogs/search", {
        params: searchQuery, // Arama parametrelerini API'ye gönderiyoruz
      });
      console.log("✅ Arama Sonucu:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Arama sırasında hata oluştu.");
    }
  }
);



const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],        
    userBlogs: [],  
    latestBlogs: [],
    popularBlogs: [], 
    selectedCategories: [],
    selectedTags: [],
    searchedBlogs: [],
    selectedBlog: null, 
    selectedBlog: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload || [];
  },

  setSelectedTags: (state, action) => {
    state.selectedTags = action.payload || [];
  },

  resetSearchResults: (state) => {
    state.searchedBlogs = []; // Arama sonuçlarını temizleme fonksiyonu
  },


  },

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
      })

    
      .addCase(toggleBlogLike.fulfilled, (state, action) => {
        const { blogId, likes } = action.payload;
        const blogIndex = state.blogs.findIndex((b) => b._id === blogId);
        if (blogIndex !== -1) {
          state.blogs[blogIndex].likes = likes;
        }
      })

      .addCase(fetchLatestBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLatestBlogs.fulfilled, (state, action) => {
        state.latestBlogs = action.payload; 
        state.loading = false;
      })
      .addCase(fetchLatestBlogs.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchPopularBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPopularBlogs.fulfilled, (state, action) => {
        state.popularBlogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchPopularBlogs.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchBlogsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogsByCategory.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogsByCategory.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchBlogsByTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogsByTags.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogsByTags.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchSearchedBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSearchedBlogs.fulfilled, (state, action) => {
        state.searchedBlogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchSearchedBlogs.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

     
  },
});

export const { setSelectedCategories,setSelectedTags,resetSearchResults } = blogSlice.actions;
export default blogSlice.reducer;




