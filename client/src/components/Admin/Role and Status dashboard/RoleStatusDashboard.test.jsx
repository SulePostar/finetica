import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../tests/testUtils';
import RoleStatusDashboard from './RoleStatusDashboard';
import api from '../../../services/api';

jest.mock('../../../services/api');

const mockRolesPayload = { data: [{ id: 1, role: 'Admin' }, { id: 2, role: 'User' }] };
const mockStatusesPayload = { data: [{ id: 1, status: 'Pending' }, { id: 2, status: 'Approved' }] };

describe('RoleStatusDashboard', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('When data is available', () => {
        beforeEach(() => {
            api.get.mockImplementation(url => {
                if (url.includes('/user-roles')) {
                    return Promise.resolve({ data: mockRolesPayload });
                }
                if (url.includes('/user-statuses')) {
                    return Promise.resolve({ data: mockStatusesPayload });
                }
                return Promise.reject(new Error('not found'));
            });
            api.post.mockResolvedValue({});
            api.delete.mockResolvedValue({});
        });

        test('should render tables and fetch initial data', async () => {
            renderWithProviders(<RoleStatusDashboard />);
            expect(await screen.findByText('Admin')).toBeInTheDocument();
            expect(await screen.findByText('Pending')).toBeInTheDocument();
            expect(api.get).toHaveBeenCalledWith('/user-roles');
            expect(api.get).toHaveBeenCalledWith('/user-statuses');
        });

        test('should allow adding a new role and re-fetch the list', async () => {
            renderWithProviders(<RoleStatusDashboard />);
            await screen.findByText('Admin');
            const addRoleButton = screen.getByRole('button', { name: /Add Role/i });
            await userEvent.click(addRoleButton);
            const input = await screen.findByPlaceholderText('Enter role');
            const modalAddButton = screen.getByRole('button', { name: 'Add' });
            await userEvent.type(input, 'Moderator');
            await userEvent.click(modalAddButton);
            await waitFor(() => {
                expect(api.post).toHaveBeenCalledWith('/user-roles', { role: 'Moderator' });
            });
            await waitFor(() => {
                expect(api.get).toHaveBeenCalledTimes(3);
            });
        });

        test('should allow deleting a role', async () => {
            renderWithProviders(<RoleStatusDashboard />);
            await screen.findByText('Admin');

            const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
            await userEvent.click(deleteButtons[0]);

            await waitFor(() => {
                expect(api.delete).toHaveBeenCalledWith('/user-roles/1');
            });
        });

        test('should allow deleting a status', async () => {
            renderWithProviders(<RoleStatusDashboard />);
            await screen.findByText('Admin');

            const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
            await userEvent.click(deleteButtons[2]);

            await waitFor(() => {
                expect(api.delete).toHaveBeenCalledWith('/user-statuses/1');
            });
        });
    });

    describe('When no data is available', () => {
        test('should render tables without data rows', async () => {
            api.get.mockImplementation(url => {
                if (url.includes('/user-roles')) {
                    return Promise.resolve({ data: { data: [] } });
                }
                if (url.includes('/user-statuses')) {
                    return Promise.resolve({ data: { data: [] } });
                }
                return Promise.reject(new Error('not found'));
            });

            renderWithProviders(<RoleStatusDashboard />);

            expect(await screen.findByText('Roles')).toBeInTheDocument();
            expect(screen.getByText('Statuses')).toBeInTheDocument();
            expect(screen.queryByText('Admin')).not.toBeInTheDocument();
            expect(screen.queryByText('Pending')).not.toBeInTheDocument();
        });
    });
});