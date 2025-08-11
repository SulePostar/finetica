import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { mockState } from './setup.js';

// Custom render function that overrides the mocked useSelector for specific tests
export const renderWithProviders = (
    ui,
    {
        initialState = mockState,
        ...renderOptions
    } = {}
) => {
    // Override the useSelector mock for this specific test
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector) => {
        try {
            return selector(initialState);
        } catch (error) {
            console.warn('Selector failed, returning fallback:', error.message);
            return initialState.auth;
        }
    });

    const Wrapper = ({ children }) => (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    );

    return {
        ...render(ui, { wrapper: Wrapper, ...renderOptions })
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
