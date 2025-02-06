import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commentAPI from "../../api/commentAPI";

// Yorum ekleme
export const addComment = createAsyncThunk(
  "comment/addComment",
  async ({ blogId, text, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue("No token found.");
      }
      const response = await commentAPI.createComment(blogId, text, token);
      return response.data.comment; // Backend'den gelen yorum objesi
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const fetchComments = createAsyncThunk(
  "comment/fetchComments",
  async ({ blogId, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue("No token found.");
      }
      const response = await commentAPI.getComments(blogId, token);
      return response.data.map((comment) => ({
        ...comment,
        replies: comment.replies?.filter(Boolean) || [], // Yanıtları undefined olmaktan koru
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const toggleLike = createAsyncThunk(
  "comment/toggleLike",
  async ({ commentId, token }, { rejectWithValue }) => {
    try {
      const response = await commentAPI.toggleLike(commentId, token);
      return {
        commentId,
        likedByUser: response.data.likedByUser,
        likes: response.data.likes,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const replyToComment = createAsyncThunk(
  "comment/replyToComment",
  async ({ commentId, text, token }, { rejectWithValue }) => {
    try {
      const response = await commentAPI.replyToComment(commentId, text, token);
      return { commentId, reply: response.data.reply };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//Yorum Güncelleme 
export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async ({ commentId, text, token, blogId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await commentAPI.updateComment(commentId, text, token);
      dispatch(fetchComments({ blogId, token })); // Blog'daki yorumları güncelle
      return response.data.comment;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//Yorum Silme
export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async ({ commentId, token, blogId }, { dispatch, rejectWithValue }) => {
    try {
      await commentAPI.deleteComment(commentId, token);
      dispatch(fetchComments({ blogId, token })); // Blog'daki yorumları güncelle
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const fetchAllComments = createAsyncThunk(
  "comment/fetchAllComments",
  async ({ token }, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue("No token found.");
      }
      const response = await commentAPI.getAllComments(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);



const commentSlice = createSlice({
  name: "comment",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(toggleLike.fulfilled, (state, action) => {
        const { commentId, likedByUser, likes } = action.payload;
        const comment = state.comments.find((c) => c._id === commentId);
        if (comment) {
          comment.likes = likes;
          comment.likedByUser = likedByUser;
        }
      })

      .addCase(replyToComment.fulfilled, (state, action) => {
        const { commentId, reply } = action.payload;
        const comment = state.comments.find((c) => c._id === commentId);
        if (comment) {
          comment.replies.push(reply);
        }
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      })

      .addCase(fetchAllComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchAllComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commentSlice.reducer;
