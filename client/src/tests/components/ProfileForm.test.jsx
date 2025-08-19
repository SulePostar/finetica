/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import ProfileForm from '../../components/Profile/ProfileForm';
import FileUploadService from '../../services/fileUploadService';

// --- MOCKS SETUP ---

jest.mock('axios');

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: () => mockDispatch,
}));

jest.mock('../../services/fileUploadService', () => ({
    uploadProfileImage: jest.fn(),
}));
jest.mock('../../utilis/toastHelper', () => ({
    onSuccess: jest.fn(),
    onError: jest.fn(),
    onWarning: jest.fn(),
}));
jest.mock('../../helpers/formatDate.js', () => ({
    formatDateTime: (date) => (date ? `formatted-${date}` : ''),
}));
jest.mock('../../helpers/capitalizeFirstLetter.js', () => ({
    capitalizeFirst: (str) => (str ? `capitalized-${str}` : ''),
}));

// Mocking the child Photo Upload component to include a remove button
jest.mock('../../components/Register/ProfilePhotoUpload/ProfilePhotoUpload', () => {
    return ({ onPhotoSelect, disabled, onRemove }) => (
        <div>
            <label htmlFor="photo-upload">Mock Profile Photo Upload</label>
            <input
                id="photo-upload"
                type="file"
                data-testid="profile-photo-upload"
                onChange={(e) => onPhotoSelect(e.target.files[0])}
                disabled={disabled}
            />
            <button data-testid="remove-photo-button" onClick={onRemove} disabled={disabled}>Remove</button>
        </div>
    );
});

// --- TEST SUITE FOR ProfileForm.jsx ---

describe('ProfileForm', () => {
    const mockProfile = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        roleName: 'user',
        statusName: 'active',
        lastLoginAt: '2023-10-27T10:00:00.000Z',
        profileImage: 'http://example.com/photo.jpg',
    };

    const setup = (profile = mockProfile) => {
        useSelector.mockImplementation((callback) => callback({ user: { profile } }));
        const utils = render(<ProfileForm />);
        return { ...utils };
    };

    beforeEach(() => {
        jest.clearAllMocks();
        document.documentElement.removeAttribute('data-coreui-theme');
        document.body.className = '';
        document.body.innerHTML = '';
    });

    // --- Core Functionality Tests ---

    test('renders profile data correctly in a disabled state', () => {
        setup();
        expect(screen.getByPlaceholderText('First name')).toHaveValue(mockProfile.firstName);
        expect(screen.getByPlaceholderText('First name')).toBeDisabled();
    });

    test('toggles to editable mode and back to disabled mode', () => {
        setup();
        const editButton = screen.getByText('Edit Profile');
        fireEvent.click(editButton);
        expect(screen.getByPlaceholderText('First name')).toBeEnabled();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        fireEvent.click(editButton);
        expect(screen.getByPlaceholderText('First name')).toBeDisabled();
    });

    test('updates form state on user input', () => {
        setup();
        fireEvent.click(screen.getByText('Edit Profile'));
        const firstNameInput = screen.getByPlaceholderText('First name');
        fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
        expect(firstNameInput).toHaveValue('Jane');
    });

    test('handles photo removal', async () => {
        setup();
        fireEvent.click(screen.getByText('Edit Profile'));
        const removeButton = screen.getByTestId('remove-photo-button');
        fireEvent.click(removeButton);
        expect(require('../../utilis/toastHelper').onSuccess).toHaveBeenCalledWith('Profile photo removed successfully!');
        axios.put.mockResolvedValue({ data: { ...mockProfile, profileImage: null } });
        fireEvent.click(screen.getByText('Submit Changes'));
        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ profileImage: null }),
                expect.any(Object)
            );
        });
    });

    test('handles failed photo upload but successful profile update', async () => {
        setup();
        fireEvent.click(screen.getByText('Edit Profile'));
        const newPhotoFile = new File(['(⌐□_□)'], 'photo.png', { type: 'image/png' });
        const photoInput = screen.getByTestId('profile-photo-upload');
        fireEvent.change(photoInput, { target: { files: [newPhotoFile] } });
        FileUploadService.uploadProfileImage.mockResolvedValue({ success: false, url: null });
        axios.put.mockResolvedValue({ data: { ...mockProfile } });
        fireEvent.click(screen.getByText('Submit Changes'));
        await waitFor(() => {
            expect(require('../../utilis/toastHelper').onWarning).toHaveBeenCalledWith('Profile image upload failed, profile saved without new image.');
            expect(axios.put).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ profileImage: mockProfile.profileImage }),
                expect.any(Object)
            );
        });
    });

    test('handles successful photo upload and checks specific success message', async () => {
        setup();
        fireEvent.click(screen.getByText('Edit Profile'));
        const newPhotoFile = new File(['(⌐□_□)'], 'photo.png', { type: 'image/png' });
        const photoInput = screen.getByTestId('profile-photo-upload');
        fireEvent.change(photoInput, { target: { files: [newPhotoFile] } });

        FileUploadService.uploadProfileImage.mockResolvedValue({ success: true, url: 'http://new.url/photo.jpg' });
        axios.put.mockResolvedValue({ data: { ...mockProfile } });
        fireEvent.click(screen.getByText('Submit Changes'));

        await waitFor(() => {
            expect(require('../../utilis/toastHelper').onSuccess).toHaveBeenCalledWith('Profile image selected successfully!');
            expect(require('../../utilis/toastHelper').onSuccess).toHaveBeenCalledWith('Profile updated successfully!');
        });
    });

    test('handles failed form submission and logs an error', async () => {
        // Spy on console.error to ensure it's called
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        const apiError = new Error('API Error');
        axios.put.mockRejectedValue(apiError);

        setup();
        fireEvent.click(screen.getByText('Edit Profile'));
        fireEvent.click(screen.getByText('Submit Changes'));

        await waitFor(() => {
            // Check that the error was logged
            expect(consoleErrorSpy).toHaveBeenCalledWith(apiError);
            // Check that the user-facing notification was shown
            expect(require('../../utilis/toastHelper').onError).toHaveBeenCalledWith('Failed to update profile. Please try again.');
        });

        // Restore the original console.error function
        consoleErrorSpy.mockRestore();
    });

    test('responds to dark mode theme changes', async () => {
        const { container } = setup();
        const formCard = container.querySelector('.card');
        expect(formCard).toHaveStyle('background-color: #5b3cc4');

        await act(async () => {
            document.documentElement.setAttribute('data-coreui-theme', 'dark');
            window.document.documentElement.dispatchEvent(new Event('ColorSchemeChange'));
        });

        expect(formCard).toHaveStyle('background-color: #303746ff');
    });

    test('responds to sidebar visibility changes', async () => {
        const sidebar = document.createElement('div');
        sidebar.className = 'sidebar';
        document.body.appendChild(sidebar);

        const { container } = setup();
        const formCard = container.querySelector('.card');
        expect(formCard).toHaveStyle('transform: translateX(0)');

        await act(async () => {
            document.body.classList.add('sidebar-show');
        });

        await waitFor(() => {
            expect(formCard).toHaveStyle('transform: translateX(127px)');
        });
    });

    test('renders correctly when no profile is in the store', () => {
        setup(null);
        expect(screen.getByPlaceholderText('First name')).toHaveValue('');
        expect(screen.getByPlaceholderText('Last name')).toHaveValue('');
        expect(screen.getByPlaceholderText('Email')).toHaveValue('');
    });

    test('simulates hover effects on buttons', () => {
        setup();
        fireEvent.click(screen.getByText('Edit Profile'));
        const submitButton = screen.getByText('Submit Changes');
        const editButton = screen.getByText('Cancel');
        fireEvent.mouseEnter(submitButton);
        expect(submitButton).toHaveStyle('background-color: #5b3cc4');
        fireEvent.mouseLeave(submitButton);
        expect(submitButton).toHaveStyle('background-color: rgba(0, 0, 0, 0)');
        fireEvent.mouseEnter(editButton);
        expect(editButton).toHaveStyle('background-color: #5b3cc4');
        fireEvent.mouseLeave(editButton);
        expect(editButton).toHaveStyle('background-color: rgba(0, 0, 0, 0)');
    });

    test('updates form when profile in redux store changes', () => {
        const { rerender } = setup();
        expect(screen.getByPlaceholderText('First name')).toHaveValue('John');
        const newProfile = { ...mockProfile, firstName: 'Jane' };
        useSelector.mockImplementation((callback) => callback({ user: { profile: newProfile } }));
        rerender(<ProfileForm />);
        expect(screen.getByPlaceholderText('First name')).toHaveValue('Jane');
    });

});
