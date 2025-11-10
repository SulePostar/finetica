import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunks
export const fetchRoles = createAsyncThunk('roles/fetchRoles', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/user-roles');
        console.log('Fetched roles:', response.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const addRole = createAsyncThunk('roles/addRole', async (roleData, { rejectWithValue }) => {
    try {
        const { id, ...payload } = roleData;
        const response = await api.post('/user-roles', payload);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const deleteRole = createAsyncThunk(
    'roles/deleteRole',
    async (roleId, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/user-roles/${roleId}`);
            return { id: roleId, message: res.data?.message || 'Role deleted successfully' };
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


const rolesSlice = createSlice({
    name: 'roles',
    initialState: {
        roles: [],
        loading: false,
        error: null,
        success: null,
    },
    reducers: {
        clearRolesError: (state) => {
            state.error = null;
        },
        clearRolesSuccess: (state) => {
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.roles = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(addRole.pending, (state) => {
                state.error = null;
            })
            .addCase(addRole.fulfilled, (state, action) => {
                state.roles.push(action.payload.data);
                state.success = 'Role added successfully';
            })
            .addCase(addRole.rejected, (state, action) => {
                state.error = action.payload;
            });

        builder
            .addCase(deleteRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = state.roles.filter(role => role.id !== action.payload.id);
                state.success = action.payload.message; // show backend message
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export const { clearRolesError, clearRolesSuccess } = rolesSlice.actions;

// Selectors
export const selectRoles = (state) => state.roles.roles;
export const selectRolesLoading = (state) => state.roles.loading;
export const selectRolesError = (state) => state.roles.error;
export const selectRolesSuccess = (state) => state.roles.success;

export default rolesSlice.reducer;