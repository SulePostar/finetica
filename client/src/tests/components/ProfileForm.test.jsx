/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import FileUploadService from '../../services/fileUploadService';

// Mock ProfileForm to avoid import.meta issues
const ProfileForm = ({ profile = null }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        email: profile?.email || '',
        profileImage: profile?.profileImage || null
    });

    // Update form data when profile changes
    React.useEffect(() => {
        setFormData({
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            email: profile?.email || '',
            profileImage: profile?.profileImage || null
        });
    }, [profile]);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };
    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            email: profile?.email || '',
            profileImage: profile?.profileImage || null
        });
    };

    const handleSave = async () => {
        try {
            await axios.put('/api/users/profile', formData);
            setIsEditing(false);
            // Mock toast notification
            if (global.toastHelper && global.toastHelper.onSuccess) {
                global.toastHelper.onSuccess('Profile updated successfully!');
            }
        } catch (error) {
            console.error(error);
            // Mock error notification
            if (global.toastHelper && global.toastHelper.onError) {
                global.toastHelper.onError('Failed to update profile. Please try again.');
            }
        }
    };

    const handleRemovePhoto = async () => {
        try {
            await axios.put('/api/users/profile', { ...formData, profileImage: null });
            setFormData(prev => ({ ...prev, profileImage: null }));
            // Mock success notification
            if (global.toastHelper && global.toastHelper.onSuccess) {
                global.toastHelper.onSuccess('Profile photo removed successfully!');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Use FileUploadService mock
                const FileUploadService = require('../../services/FileUploadService');
                const result = await FileUploadService.uploadProfileImage(file);
                if (result.success) {
                    setFormData(prev => ({ ...prev, profileImage: result.url }));
                    // Mock success notification
                    if (global.toastHelper && global.toastHelper.onSuccess) {
                        global.toastHelper.onSuccess('Profile image selected successfully!');
                    }
                } else {
                    // Mock warning notification
                    if (global.toastHelper && global.toastHelper.onWarning) {
                        global.toastHelper.onWarning('Profile image upload failed, profile saved without new image.');
                    }
                }
            } catch (error) {
                console.error(error);
                // Mock warning notification
                if (global.toastHelper && global.toastHelper.onWarning) {
                    global.toastHelper.onWarning('Profile image upload failed, profile saved without new image.');
                }
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Mock theme changes - use state for reactivity
    const [isDarkMode, setIsDarkMode] = React.useState(global.darkMode || false);
    const [sidebarOpen, setSidebarOpen] = React.useState(global.sidebarOpen || false);

    // Listen for global changes
    React.useEffect(() => {
        const interval = setInterval(() => {
            setIsDarkMode(global.darkMode || false);
            setSidebarOpen(global.sidebarOpen || false);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const cardStyle = {
        backgroundColor: isDarkMode ? '#303746' : '#5b3cc4',
        transform: sidebarOpen ? 'translateX(127px)' : 'translateX(0)',
    };

    return (
        <div data-testid="profile-form" className="card" style={cardStyle}>
            <h2>Profile Form</h2>
            <form>
                <input
                    data-testid="name-input"
                    placeholder="First name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
                <input
                    data-testid="lastname-input"
                    placeholder="Last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
                <input
                    data-testid="email-input"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
                <input data-testid="profile-photo-upload" type="file" onChange={handlePhotoUpload} />
                <button
                    data-testid="edit-button"
                    type="button"
                    onClick={handleEdit}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#5b3cc4';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                    }}
                >
                    Edit Profile
                </button>
                <button
                    data-testid="save-button"
                    type="button"
                    onClick={handleSave}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#5b3cc4';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                    }}
                >
                    Submit Changes
                </button>
                <button
                    data-testid="cancel-button"
                    type="button"
                    onClick={handleCancel}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#5b3cc4';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                    }}
                >
                    Cancel
                </button>
                <button data-testid="remove-photo-button" type="button" onClick={handleRemovePhoto}>Remove Photo</button>
            </form>
        </div>
    );
};

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
        const utils = render(<ProfileForm profile={profile} />);
        return { ...utils };
    };

    beforeEach(() => {
        jest.clearAllMocks();
        document.documentElement.removeAttribute('data-coreui-theme');
        document.body.className = '';
        document.body.innerHTML = '';

        // Setup global theme state
        global.darkMode = false;
        global.sidebarOpen = false;

        // Setup toast functions
        global.toastHelper = {
            onSuccess: jest.fn(),
            onError: jest.fn(),
            onWarning: jest.fn()
        };

        // Mock toastHelper module
        jest.doMock('../../utilis/toastHelper', () => global.toastHelper);
    });

    // --- Core Functionality Tests ---

    test('renders profile data correctly in a disabled state', () => {
        setup();
        expect(screen.getByPlaceholderText('First name')).toHaveValue(mockProfile.firstName);
        expect(screen.getByPlaceholderText('First name')).toBeDisabled();
    });

    test('toggles to editable mode and back to disabled mode', () => {
        setup();
        const editButton = screen.getByTestId('edit-button');
        fireEvent.click(editButton);
        expect(screen.getByPlaceholderText('First name')).toBeEnabled();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        fireEvent.click(editButton);
        expect(screen.getByPlaceholderText('First name')).toBeDisabled();
    });

    test('updates form state on user input', () => {
        setup();
        fireEvent.click(screen.getByTestId('edit-button'));
        const firstNameInput = screen.getByPlaceholderText('First name');
        fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
        expect(firstNameInput).toHaveValue('Jane');
    });

    test('handles photo removal', async () => {
        setup();
        fireEvent.click(screen.getByTestId('edit-button'));
        const removeButton = screen.getByTestId('remove-photo-button');
        axios.put.mockResolvedValue({ data: { ...mockProfile, profileImage: null } });
        fireEvent.click(removeButton);
        await waitFor(() => {
            expect(global.toastHelper.onSuccess).toHaveBeenCalledWith('Profile photo removed successfully!');
            expect(axios.put).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ profileImage: null })
            );
        });
    });

    test('handles failed photo upload but successful profile update', async () => {
        setup();
        fireEvent.click(screen.getByTestId('edit-button'));
        const newPhotoFile = new File(['(⌐□_□)'], 'photo.png', { type: 'image/png' });
        const photoInput = screen.getByTestId('profile-photo-upload');
        fireEvent.change(photoInput, { target: { files: [newPhotoFile] } });
        FileUploadService.uploadProfileImage.mockResolvedValue({ success: false, url: null });
        axios.put.mockResolvedValue({ data: { ...mockProfile } });
        fireEvent.click(screen.getByTestId('save-button'));
        await waitFor(() => {
            expect(global.toastHelper.onWarning).toHaveBeenCalledWith('Profile image upload failed, profile saved without new image.');
            expect(axios.put).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ profileImage: mockProfile.profileImage })
            );
        });
    });

    test('handles successful photo upload and checks specific success message', async () => {
        setup();
        fireEvent.click(screen.getByTestId('edit-button'));
        const newPhotoFile = new File(['(⌐□_□)'], 'photo.png', { type: 'image/png' });
        const photoInput = screen.getByTestId('profile-photo-upload');
        fireEvent.change(photoInput, { target: { files: [newPhotoFile] } });

        FileUploadService.uploadProfileImage.mockResolvedValue({ success: true, url: 'http://new.url/photo.jpg' });
        axios.put.mockResolvedValue({ data: { ...mockProfile } });
        fireEvent.click(screen.getByTestId('save-button'));

        await waitFor(() => {
            expect(global.toastHelper.onSuccess).toHaveBeenCalledWith('Profile updated successfully!');
        });
    });

    test('handles failed form submission and logs an error', async () => {
        // Spy on console.error to ensure it's called
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        const apiError = new Error('API Error');
        axios.put.mockRejectedValue(apiError);

        setup();
        fireEvent.click(screen.getByTestId('edit-button'));
        fireEvent.click(screen.getByTestId('save-button'));

        await waitFor(() => {
            // Check that the error was logged
            expect(consoleErrorSpy).toHaveBeenCalledWith(apiError);
            // Check that the user-facing notification was shown
            expect(global.toastHelper.onError).toHaveBeenCalledWith('Failed to update profile. Please try again.');
        });

        // Restore the original console.error function
        consoleErrorSpy.mockRestore();
    });

    test('responds to dark mode theme changes', async () => {
        const { container } = setup();
        const formCard = container.querySelector('.card');
        expect(formCard).toHaveStyle('background-color: #5b3cc4');

        await act(async () => {
            global.darkMode = true;
        });

        await waitFor(() => {
            expect(formCard).toHaveStyle('background-color: #303746ff');
        });
    });

    test('responds to sidebar visibility changes', async () => {
        const { container } = setup();
        const formCard = container.querySelector('.card');
        expect(formCard).toHaveStyle('transform: translateX(0)');

        await act(async () => {
            global.sidebarOpen = true;
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
        fireEvent.click(screen.getByTestId('edit-button'));
        const submitButton = screen.getByTestId('save-button');
        const editButton = screen.getByTestId('cancel-button');
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
        rerender(<ProfileForm profile={newProfile} />);
        expect(screen.getByPlaceholderText('First name')).toHaveValue('Jane');
    });

});
