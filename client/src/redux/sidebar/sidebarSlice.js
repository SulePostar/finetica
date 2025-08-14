import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    showModal: false,
    driveConnected: false,
};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setShowModal(state, action) {
            state.showModal = action.payload;
        },
        setDriveConnected(state, action) {
            state.driveConnected = action.payload;
        },
    },
});

export const { setShowModal, setDriveConnected } = sidebarSlice.actions;
export default sidebarSlice.reducer;
