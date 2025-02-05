import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTags = createAsyncThunk(
    "tags/fetchTags",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.post("http://localhost:5000/api/tags"); 
        console.log("Gelen Etiketler:", response.data); 
      } catch (error) {
        return rejectWithValue(error.response?.data || "Etiketler yüklenemedi.");
      }
    }
  );
  

const tagSlice = createSlice({
  name: "tag",
  initialState: {
    tags: [],         
    selectedTags: [], 
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags = action.payload;
        state.loading = false;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setSelectedTags } = tagSlice.actions;
export default tagSlice.reducer;
