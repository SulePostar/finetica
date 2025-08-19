import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:4000/api/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
        },
      });
      return res.data;
    } catch (err) {
      console.error('Failed to fetch user profile:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  profile: {
    id: null,
    email: '',
    fullName: '',
    firstName: '',
    lastName: '',
    profileImage: '',
    roleId: null,
    roleName: '',
    statusId: null,
    statusName: '',
    lastLoginAt: null,
    createdAt: null,
    updatedAt: null,
  },
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile(state, action) {
      const {
        id,
        email,
        fullName,
        firstName,
        lastName,
        profileImage,
        roleId,
        roleName,
        statusId,
        statusName,
        lastLoginAt,
        createdAt,
        updatedAt,
      } = action.payload;

      state.profile = {
        id,
        email,
        fullName,
        firstName,
        lastName,
        profileImage,
        roleId,
        roleName,
        statusId,
        statusName,
        lastLoginAt,
        createdAt,
        updatedAt,
      };
      state.loading = false;
      state.error = null;
    },
    clearUserProfile(state) {
      state.profile = initialState.profile;
    },
    setUserLoading(state, action) {
      state.loading = action.payload;
    },
    setUserError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const {
  setUserProfile,
  clearUserProfile,
  setUserLoading,
  setUserError,
} = userSlice.actions;

export default userSlice.reducer;