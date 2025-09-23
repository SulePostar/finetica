import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:4000/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update a user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/users/${userId}`,
        userData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('jwt_token')}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:4000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt_token')}` },
      });
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  updatingUser: null,
  deletingUser: null,
  error: null,
  success: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user
      .addCase(updateUser.pending, (state, action) => {
        state.updatingUser = action.meta.arg.userId;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) state.users[index] = updatedUser;
        state.updatingUser = null;
        state.success = 'User updated successfully';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updatingUser = null;
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state, action) => {
        state.deletingUser = action.meta.arg;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
        state.deletingUser = null;
        state.success = 'User deleted successfully';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deletingUser = null;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = usersSlice.actions;

export const selectUsers = (state) => state.users.users;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUpdatingUser = (state) => state.users.updatingUser;
export const selectDeletingUser = (state) => state.users.deletingUser;
export const selectUsersError = (state) => state.users.error;
export const selectUsersSuccess = (state) => state.users.success;

export default usersSlice.reducer;