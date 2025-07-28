
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    id: null,
    email: '',
    fullName: '',
    firstName : '',
    lastName: '',
    roleId: null,
    roleName: '',
    statusId: null,
    statusName: '',
    lastLoginAt: null,
    createdAt: null,
    updatedAt: null
  },
  loading: false,
  error: null
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
        roleId,
        roleName,
        statusId,
        status,
        lastLoginAt,
        createdAt,
        updatedAt
      } = action.payload;

      state.profile = {
        id,
        email,
        fullName,
        firstName,
        lastName,
        roleId,
        roleName,
        statusId,
        status,
        lastLoginAt,
        createdAt,
        updatedAt
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
    }
  }
});

export const {
  setUserProfile,
  clearUserProfile,
  setUserLoading,
  setUserError
} = userSlice.actions;

export default userSlice.reducer;
