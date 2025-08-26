import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../tests/testUtils';
import UserDashboard from './UserDashboard';
import api from '../../../services/api';
import notify from '../../../utilis/toastHelper';

jest.mock('../../../services/api');
jest.mock('../../../utilis/toastHelper');
jest.mock('@coreui/icons-react', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockUsers = [
    { id: 1, email: 'admin@example.com', fullName: 'Admin User', roleId: 1, statusId: 2 },
    { id: 2, email: 'user1@example.com', fullName: 'Test User One', roleId: 2, statusId: 1 },
    { id: 3, email: 'user2@example.com', fullName: 'Another User', roleId: 2, statusId: 2 },
];
const paginatedUsers = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    email: `user${i + 1}@example.com`,
    fullName: `User ${i + 1}`,
    roleId: 2,
    statusId: 2,
}));
const mockCurrentUser = { id: 1, email: 'admin@example.com' };

describe('UserDashboard', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render loading spinner, then display users after fetch', async () => {
        api.get.mockResolvedValue({ data: mockUsers });
        renderWithProviders(<UserDashboard />, {
            preloadedState: { user: { profile: mockCurrentUser } },
        });
        expect(await screen.findByTestId('loading-spinner')).toBeInTheDocument();
        expect(await screen.findByText('Admin User')).toBeInTheDocument();
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    test('should handle API failure gracefully', async () => {
        const errorMessage = 'Failed to fetch';
        api.get.mockRejectedValue(new Error(errorMessage));
        renderWithProviders(<UserDashboard />, {
            preloadedState: { user: { profile: mockCurrentUser } },
        });
        await waitFor(() => {
            expect(notify.onError).toHaveBeenCalledWith(errorMessage);
        });
    });

    test('should show a success notification on successful update', async () => {
        api.get.mockResolvedValue({ data: mockUsers });
        api.patch.mockResolvedValue({ data: {} });

        renderWithProviders(<UserDashboard />, {
            preloadedState: { user: { profile: mockCurrentUser } },
        });
        const editButtons = await screen.findAllByTitle('Edit User');
        await userEvent.click(editButtons[1]);

        const modal = await screen.findByRole('dialog');
        const confirmButton = within(modal).getByRole('button', { name: /update user/i });
        await userEvent.click(confirmButton);

        await waitFor(() => {
            expect(notify.onSuccess).toHaveBeenCalledWith('User updated successfully');
        });
    });

    describe('Search and Filter', () => {
        beforeEach(() => {
            api.get.mockResolvedValue({ data: mockUsers });
        });

        test('should filter users by search term', async () => {
            renderWithProviders(<UserDashboard />, {
                preloadedState: { user: { profile: mockCurrentUser } },
            });
            await screen.findByText('Admin User');
            const searchInput = screen.getByPlaceholderText(/search users/i);
            await userEvent.type(searchInput, 'One');
            expect(screen.queryByText('Admin User')).not.toBeInTheDocument();
            expect(screen.getByText('Test User One')).toBeInTheDocument();
        });

        test('should filter users by role', async () => {
            renderWithProviders(<UserDashboard />, {
                preloadedState: { user: { profile: mockCurrentUser } },
            });
            await screen.findByText('Admin User');
            const roleSelect = screen.getByDisplayValue('All Roles');
            await userEvent.selectOptions(roleSelect, '1');
            expect(screen.getByText('Admin User')).toBeInTheDocument();
            expect(screen.queryByText('Test User One')).not.toBeInTheDocument();
        });
    });

    describe('Full Modal Actions', () => {
        beforeEach(() => {
            api.get.mockResolvedValue({ data: mockUsers });
            api.patch.mockResolvedValue({ data: {} });
            api.delete.mockResolvedValue({});
        });

        test('should update a user and send correct API call', async () => {
            renderWithProviders(<UserDashboard />, {
                preloadedState: { user: { profile: mockCurrentUser } },
            });
            const editButtons = await screen.findAllByTitle('Edit User');
            await userEvent.click(editButtons[1]);
            const modal = await screen.findByRole('dialog');
            const confirmButton = within(modal).getByRole('button', { name: /update user/i });
            await userEvent.click(confirmButton);
            await waitFor(() => {
                expect(api.patch).toHaveBeenCalledWith('/users/2', expect.any(Object));
            });
        });

        test('should delete a user and send correct API call', async () => {
            renderWithProviders(<UserDashboard />, {
                preloadedState: { user: { profile: mockCurrentUser } },
            });
            const deleteButtons = await screen.findAllByTitle('Delete User');
            await userEvent.click(deleteButtons[1]);
            const modal = await screen.findByRole('dialog');
            const confirmButton = within(modal).getByRole('button', { name: /delete user/i });
            await userEvent.click(confirmButton);
            await waitFor(() => {
                expect(api.delete).toHaveBeenCalledWith('/users/2');
            });
        });

        test('should quick change a user status and send correct API call', async () => {
            renderWithProviders(<UserDashboard />, {
                preloadedState: { user: { profile: mockCurrentUser } },
            });
            const statusDropdowns = await screen.findAllByTitle('Change Status');
            await userEvent.selectOptions(statusDropdowns[1], '2');
            const modal = await screen.findByRole('dialog');
            const confirmButton = within(modal).getByRole('button', { name: /update status/i });
            await userEvent.click(confirmButton);
            await waitFor(() => {
                expect(api.patch).toHaveBeenCalledWith('/users/2', { statusId: 2 });
            });
        });
    });

    test('should disable delete button for the current user', async () => {
        api.get.mockResolvedValue({ data: mockUsers });
        renderWithProviders(<UserDashboard />, { preloadedState: { user: { profile: mockCurrentUser } } });
        await screen.findByText('Admin User');
        const deleteButtons = screen.getAllByTitle('Delete User');
        expect(deleteButtons[0]).toBeDisabled();
        expect(deleteButtons[1]).not.toBeDisabled();
    });

    describe('Form Validation', () => {
        test('should show validation error if email is invalid', async () => {
            api.get.mockResolvedValue({ data: mockUsers });
            renderWithProviders(<UserDashboard />, {
                preloadedState: { user: { profile: mockCurrentUser } },
            });
            const editButtons = await screen.findAllByTitle('Edit User');
            await userEvent.click(editButtons[1]);

            const confirmButton = await screen.findByRole('button', { name: /update user/i });
            const modal = confirmButton.closest('div.modal');
            const emailInput = within(modal).getByLabelText(/email/i);

            await userEvent.clear(emailInput);
            await userEvent.type(emailInput, 'invalid-email');
            await userEvent.click(confirmButton);

            expect(await within(modal).findByText(/please fix the validation errors/i)).toBeInTheDocument();
            expect(api.patch).not.toHaveBeenCalled();
        });
    });

    describe('Pagination', () => {
        test('should navigate between pages', async () => {
            api.get.mockResolvedValue({ data: paginatedUsers });
            renderWithProviders(<UserDashboard />, { preloadedState: { user: { profile: mockCurrentUser } } });
            expect(await screen.findByText('User 1')).toBeInTheDocument();
            expect(screen.queryByText('User 11')).not.toBeInTheDocument();
            const nextPageButton = screen.getByRole('button', { name: /next page/i });
            await userEvent.click(nextPageButton);
            expect(await screen.findByText('User 11')).toBeInTheDocument();
            expect(screen.queryByText('User 1')).not.toBeInTheDocument();
        });
    });
});