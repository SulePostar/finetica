import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../../redux/user/userSlice";
import FileUploadService from "../../services/fileUploadService";
import notify from "../../utilis/toastHelper";

const url = import.meta.env.VITE_API_BASE_URL;

export const useProfileForm = (profile) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(profile || {});
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.getAttribute("data-coreui-theme") === "dark"
    );

    useEffect(() => {
        if (profile) setFormData(profile);
    }, [profile]);

    useEffect(() => {
        const handler = () => {
            setIsDarkMode(
                document.documentElement.getAttribute("data-coreui-theme") === "dark"
            );
        };
        window.document.documentElement.addEventListener("ColorSchemeChange", handler);
        return () => {
            window.document.documentElement.removeEventListener("ColorSchemeChange", handler);
        };
    }, []);

    const handleChange = ({ target: { name, value } }) => {
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
                notify.onSuccess("Profile photo updated successfully!");
            } else {
                notify.onWarning("Profile image upload failed.");
            }
        } catch (err) {
            console.error(err);
            notify.onError("Error uploading profile image.");
        }
    }, [dispatch, formData]);

    const handlePhotoRemove = useCallback(async () => {
        try {
            const updatedProfile = { ...formData, profileImage: null };
            setFormData(updatedProfile);
            dispatch(setUserProfile(updatedProfile));
            notify.onSuccess("Profile photo removed successfully!");
        } catch (err) {
            console.error(err);
            notify.onError("Error removing profile photo.");
        }
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
                if (uploadResult.success && uploadResult.url) {
                    profileImageUrl = uploadResult.url;
                } else {
                    notify.onWarning("Profile image upload failed, profile saved without new image.");
                }
            }

            const payload = { ...formData, profileImage: profileImageUrl };

            const res = await axios.put(`${url}/users/me`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
            });

            dispatch(setUserProfile(res.data));
            notify.onSuccess("Profile updated successfully!");
            setProfilePhoto(null);
            setIsEditable(false);
        } catch (err) {
            console.error(err);
            notify.onError("Failed to update profile. Please try again.");
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
        setIsEditable,
    };
};
