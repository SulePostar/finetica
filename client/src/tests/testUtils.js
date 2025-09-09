import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { mockState } from './setup.js';

// Create a test store
const createTestStore = (initialState = mockState) => {
    return configureStore({
        reducer: {
            auth: (state = initialState.auth) => state,
            user: (state = initialState.user || {}) => state,
            users: (state = initialState.users || {}) => state,
            roles: (state = initialState.roles || {}) => state,
            statuses: (state = initialState.statuses || {}) => state,
            ui: (state = initialState.ui || {}) => state,
        },
        preloadedState: initialState,
    });
};

// Custom render function that overrides the mocked useSelector for specific tests
export const renderWithProviders = (
    ui,
    {
        initialState = mockState,
        store = createTestStore(initialState),
        ...renderOptions
    } = {}
) => {
    const Wrapper = ({ children }) => (
        <Provider store={store}>
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </Provider>
    );

    return {
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
        store,
    };
};

export const mockUserFactory = (overrides = {}) => ({
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    isAuthenticated: true,
    ...overrides
});

export const mockAuthStateFactory = (overrides = {}) => ({
    user: mockUserFactory(),
    isAuthenticated: true,
    loading: false,
    error: null,
    ...overrides
});

export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Custom rerender function that works with renderWithProviders
export const rerenderWithProviders = (
    ui,
    {
        initialState = mockState,
        ...renderOptions
    } = {}
) => {
    return renderWithProviders(ui, { initialState, ...renderOptions });
};

export const commonAssertions = {
    expectElementToBeVisible: (element) => {
        expect(element).toBeInTheDocument();
        expect(element).toBeVisible();
    },
    expectElementToHaveText: (element, text) => {
        expect(element).toBeInTheDocument();
        expect(element).toHaveTextContent(text);
    }
};
