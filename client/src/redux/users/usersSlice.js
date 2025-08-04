import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { extractErrorMessage } from '../../utils/formatters';

// Async thunks
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/${userId}`, userData);
      return { userId, user: response.data };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const quickChangeUserStatus = createAsyncThunk(
  'users/quickChangeStatus',
  async ({ userId, statusId }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/${userId}`, { statusId });
      return { userId, user: response.data };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const quickChangeUserRole = createAsyncThunk(
  'users/quickChangeRole',
  async ({ userId, roleId }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/${userId}`, { roleId });
      return { userId, user: response.data };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
  success: null,
  // Individual operation states
  updatingUser: null,
  deletingUser: null,
  changingStatus: null,
  changingRole: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearAllMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state, action) => {
        state.updatingUser = action.meta.arg.userId;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const { userId, user } = action.payload;
        const index = state.users.findIndex((u) => u.id === userId);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...user };
        }
        state.updatingUser = null;
        state.success = 'User updated successfully';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updatingUser = null;
        state.error = action.payload;
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state, action) => {
        state.deletingUser = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.deletingUser = null;
        state.success = 'User deleted successfully';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deletingUser = null;
        state.error = action.payload;
      });

    // Quick change status
    builder
      .addCase(quickChangeUserStatus.pending, (state, action) => {
        state.changingStatus = action.meta.arg.userId;
        state.error = null;
      })
      .addCase(quickChangeUserStatus.fulfilled, (state, action) => {
        const { userId, user } = action.payload;
        const index = state.users.findIndex((u) => u.id === userId);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...user };
        }
        state.changingStatus = null;
        state.success = 'User status updated successfully';
      })
      .addCase(quickChangeUserStatus.rejected, (state, action) => {
        state.changingStatus = null;
        state.error = action.payload;
      });

    // Quick change role
    builder
      .addCase(quickChangeUserRole.pending, (state, action) => {
        state.changingRole = action.meta.arg.userId;
        state.error = null;
      })
      .addCase(quickChangeUserRole.fulfilled, (state, action) => {
        const { userId, user } = action.payload;
        const index = state.users.findIndex((u) => u.id === userId);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...user };
        }
        state.changingRole = null;
        state.success = 'User role updated successfully';
      })
      .addCase(quickChangeUserRole.rejected, (state, action) => {
        state.changingRole = null;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearAllMessages } = usersSlice.actions;

// Selectors
export const selectUsers = (state) => state.users.users;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectUsersSuccess = (state) => state.users.success;
export const selectUpdatingUser = (state) => state.users.updatingUser;
export const selectDeletingUser = (state) => state.users.deletingUser;
export const selectChangingStatus = (state) => state.users.changingStatus;
export const selectChangingRole = (state) => state.users.changingRole;

export default usersSlice.reducer;
