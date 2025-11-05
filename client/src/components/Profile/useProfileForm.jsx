import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import FileUploadService from '../../services/fileUploadService';
import notify from '../../utilis/toastHelper';
import { setUserProfile } from '../../redux/user/userSlice';

const url = import.meta.env.VITE_API_BASE_URL;

export const useProfileForm = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.user.profile);

    const [formData, setFormData] = useState(profile || {});
    const [isEditable, setIsEditable] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.getAttribute('data-coreui-theme') === 'dark'
    );

    useEffect(() => {
        if (profile) setFormData(profile);
    }, [profile]);

    useEffect(() => {
        const handler = () =>
            setIsDarkMode(document.documentElement.getAttribute('data-coreui-theme') === 'dark');
        window.document.documentElement.addEventListener('ColorSchemeChange', handler);
        return () =>
            window.document.documentElement.removeEventListener('ColorSchemeChange', handler);
    }, []);

    const handleChange = (e) => {
        if (e.type === 'editMode') return setIsEditable(e.value);
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoSelect = useCallback(async (file) => {
        if (!file) return;
        try {
            const uploadResult = await FileUploadService.uploadProfileImage(
                file,
                formData.firstName,
                formData.lastName
            );

            if (uploadResult.success && uploadResult.url) {
                const updatedProfile = { ...formData, profileImage: uploadResult.url };
                setFormData(updatedProfile);
                dispatch(setUserProfile(updatedProfile));
                notify.onSuccess('Profile photo updated successfully!');
            } else {
                notify.onWarning('Profile image upload failed.');
            }
        } catch (err) {
            console.error(err);
            notify.onError('Error uploading profile image.');
        }
    }, [dispatch, formData]);

    const handlePhotoRemove = useCallback(async () => {
        const updatedProfile = { ...formData, profileImage: null };
        setFormData(updatedProfile);
        dispatch(setUserProfile(updatedProfile));
        notify.onSuccess('Profile photo removed successfully!');
    }, [dispatch, formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let profileImageUrl = formData.profileImage || null;

            if (profilePhoto) {
                const uploadResult = await FileUploadService.uploadProfileImage(
                    profilePhoto,
                    formData.firstName,
                    formData.lastName
                );
                if (uploadResult.success && uploadResult.url) profileImageUrl = uploadResult.url;
                else notify.onWarning('Profile image upload failed, profile saved without new image.');
            }

            const payload = { ...formData, profileImage: profileImageUrl };

            const res = await axios.put(`${url}/users/me`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt_token')}` },
            });

            dispatch(setUserProfile(res.data));
            notify.onSuccess('Profile updated successfully!');
            setProfilePhoto(null);
            setIsEditable(false);
        } catch (err) {
            console.error(err);
            notify.onError('Failed to update profile. Please try again.');
        }
    };

    const handleCancel = () => {
        setFormData(profile || {});
        setIsEditable(false);
    };

    return {
        formData,
        isEditable,
        isDarkMode,
        handleChange,
        handleSubmit,
        handleCancel,
        handlePhotoSelect,
        handlePhotoRemove,
    };
};
