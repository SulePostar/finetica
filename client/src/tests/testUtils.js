import React from 'react';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import usersReducer from '../redux/users/usersSlice';
import userReducer from '../redux/user/userSlice';
import rolesReducer from '../redux/roles/rolesSlice';
import statusesReducer from '../redux/statuses/statusesSlice';

export const renderWithProviders = (
    ui,
    {
        preloadedState = {},
        store = configureStore({
            reducer: {
                users: usersReducer,
                user: userReducer,
                roles: rolesReducer,
                statuses: statusesReducer,
            },
            preloadedState,
        }),
        ...renderOptions
    } = {}
) => {
    const Wrapper = ({ children }) => (
        <Provider store={store}>
            <BrowserRouter>{children}</BrowserRouter>
        </Provider>
    );

    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};