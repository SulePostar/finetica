import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
// Thunks
export const fetchStatuses = createAsyncThunk('statuses/fetchStatuses', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/user-statuses');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const addStatus = createAsyncThunk('statuses/addStatus', async (statusData, { rejectWithValue }) => {
    try {
        const response = await api.post('/user-statuses', statusData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const deleteStatus = createAsyncThunk(
    'statuses/deleteStatus',
    async (statusId, { rejectWithValue }) => {
        try {
            const res = await api.delete(`/user-statuses/${statusId}`);
            return { id: statusId, message: res.data?.message || 'Status deleted successfully' };
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const statusesSlice = createSlice({
    name: 'statuses',
    initialState: {
        statuses: [],
        loading: false,
        error: null,
        success: null,
    },
    reducers: {
        clearStatusesError: (state) => {
            state.error = null;
        },
        clearStatusesSuccess: (state) => {
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStatuses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStatuses.fulfilled, (state, action) => {
                state.statuses = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(addStatus.pending, (state) => {
                state.error = null;
            })
            .addCase(addStatus.fulfilled, (state, action) => {
                state.statuses.push(action.payload);
                state.success = 'Status added successfully';
            })
            .addCase(addStatus.rejected, (state, action) => {
                state.error = action.payload;
            });

        builder
            .addCase(deleteStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.statuses = state.statuses.filter(status => status.id !== action.payload.id);
                state.success = action.payload.message;
            })
            .addCase(deleteStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export const { clearStatusesError, clearStatusesSuccess } = statusesSlice.actions;

// Selectors
export const selectStatuses = (state) => state.statuses.statuses;
export const selectStatusesLoading = (state) => state.statuses.loading;
export const selectStatusesError = (state) => state.statuses.error;
export const selectStatusesSuccess = (state) => state.statuses.success;

export default statusesSlice.reducer;