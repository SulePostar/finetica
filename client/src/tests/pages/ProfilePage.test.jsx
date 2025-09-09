/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// Corrected: Path from the test file to the page component
import ProfilePage from '../../pages/Profile/ProfilePage';

// --- MOCKS SETUP ---

jest.mock('../../components/AppHeader', () => {
    return () => <div data-testid="app-header"></div>;
});

jest.mock('../../components/Sidebar/AppSidebar', () => {
    return () => <div data-testid="app-sidebar"></div>;
});

jest.mock('../../layout/DefaultLayout', () => {
    return ({ children }) => <div data-testid="default-layout">{children}</div>;
});

jest.mock('../../components/Profile/ProfileForm', () => {
    return () => <div data-testid="profile-form"></div>;
});


// --- TEST SUITE FOR ProfilePage.jsx ---

describe('ProfilePage', () => {
    test('renders ProfileForm within the DefaultLayout', () => {
        render(<ProfilePage />);

        const layout = screen.getByTestId('default-layout');
        expect(layout).toBeInTheDocument();

        const form = screen.getByTestId('profile-form');
        expect(layout).toContainElement(form);
    });
});
