// src/redux/slices/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const API_URL = "http://localhost:5000/api/users";

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



// Kullanıcı Silme
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Kullanıcı silinirken hata oluştu."
      );
    }
  }
);

// Kullanıcı Bloklama
export const blockUser = createAsyncThunk(
  "users/blockUser",
  async ({ id, block, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/block/${id}`, { block }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Kullanıcı bloklanırken hata oluştu."
      );
    }
  }
);

// Kullanıcıyı Admin Yapma
export const makeAdmin = createAsyncThunk(
  "users/makeAdmin",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/make-admin/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Kullanıcı admin yapılırken hata oluştu."
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
      })

       // deleteUser thunk'u için:
       .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      // blockUser thunk'u için:
      .addCase(blockUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      // makeAdmin thunk'u için:
      .addCase(makeAdmin.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
  },
});

export default usersSlice.reducer;
