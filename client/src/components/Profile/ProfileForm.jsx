import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
  CFormLabel,
} from '@coreui/react';
import { Card } from 'react-bootstrap';
import { formatDateTime } from '../../helpers/formatDate.js';
import { capitalizeFirst } from '../../helpers/capitalizeFirstLetter.js';
import { setUserProfile } from '../../redux/user/userSlice';
import ProfilePhotoUpload from '../Register/ProfilePhotoUpload/ProfilePhotoUpload';
import FileUploadService from '../../services/fileUploadService';
import notify from '../../utilis/toastHelper';
import { colors } from '../../styles/colors';
import './ProfileForm.css'
import { useSidebarWidth } from '../../hooks/useSidebarWidth'; // <-- NEW

const ProfileForm = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const sidebarWidth = useSidebarWidth(); // <-- NEW

  const [formData, setFormData] = useState(profile || {});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-coreui-theme') === 'dark'
  );

  const [editHover, setEditHover] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);

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

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoSelect = useCallback((file) => {
    setProfilePhoto(file);
  }, []);

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
          notify.onSuccess('Profile image selected successfully!');
        } else {
          notify.onWarning('Profile image upload failed, profile saved without new image.');
        }
      }

      const payload = { ...formData, profileImage: profileImageUrl };

      const res = await axios.put(`http://localhost:4000/api/users/me`, payload, {
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

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <Card className="shadow-sm border-0 bg-light dark:bg-dark form-container-card"
          data-theme={isDarkMode ? 'dark' : 'light'}
          style={{
            marginLeft: sidebarWidth,
            width: `calc(100% - ${sidebarWidth}px)`,
            transition: 'margin-left 0.3s ease, width 0.3s ease',
          }}
        >
          <div className="d-flex justify-content-center align-items-center mb-4">
            <h2 className='form-title'>User Profile</h2>
          </div>

          <div className="text-center mb-4">
            <ProfilePhotoUpload
              onPhotoSelect={handlePhotoSelect}
              disabled={!isEditable}
              currentPhoto={profile?.profileImage || null}
              onRemove={() => {
                notify.onSuccess('Profile photo removed successfully!');
                setFormData((prev) => ({ ...prev, profileImage: null }));
                setProfilePhoto(null);
              }}
            />
          </div>

          <CForm onSubmit={handleSubmit}>
            <div className="d-flex justify-content-end mb-3">
              <CButton
                className="edit-toggle"
                type="button"
                size="sm"
                onClick={() => setIsEditable((prev) => !prev)}
                style={{
                  backgroundColor: editHover ? colors.primary : 'transparent',
                  color: editHover
                    ? colors.white
                    : isDarkMode
                      ? colors.white
                      : colors.primary,
                }}
                onMouseEnter={() => setEditHover(true)}
                onMouseLeave={() => setEditHover(false)}
              >
                {isEditable ? 'Cancel' : 'Edit Profile'}
              </CButton>
            </div>

            <CInputGroup className="mb-3">
              <CInputGroupText className="input-group-text">
                <CFormLabel className="label-in-input-group-text">First name</CFormLabel>
              </CInputGroupText>
              <CFormInput
                type='text'
                name='firstName'
                placeholder='First name'
                className={isEditable ? "form-input" : "form-input-disabled"}
                value={formData.firstName || ''}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText className="input-group-text">
                <CFormLabel className="label-in-input-group-text">Last name</CFormLabel>
              </CInputGroupText>
              <CFormInput
                type='text'
                name='lastName'
                placeholder='Last name'
                className={isEditable ? "form-input" : "form-input-disabled"}
                value={formData.lastName || ''}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText className="input-group-text">
                <CFormLabel className="label-in-input-group-text">Email</CFormLabel>
              </CInputGroupText>
              <CFormInput
                type='email'
                name='email'
                placeholder='Email'
                className={isEditable ? "form-input" : "form-input-disabled"}
                value={formData.email || ''}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText className="input-group-text">
                <CFormLabel className="label-in-input-group-text">Role</CFormLabel>
              </CInputGroupText>
              <CFormInput className="form-input-disabled" value={capitalizeFirst(formData.roleName)} disabled />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText className="input-group-text">
                <CFormLabel className="label-in-input-group-text">Status</CFormLabel>
              </CInputGroupText>
              <CFormInput className="form-input-disabled" value={capitalizeFirst(formData.statusName)} disabled />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText className="input-group-text">
                <CFormLabel className="label-in-input-group-text">Last login</CFormLabel>
              </CInputGroupText>
              <CFormInput className="form-input-disabled" value={formatDateTime(formData.lastLoginAt)} disabled />
            </CInputGroup>

            {isEditable && (
              <div className="d-flex justify-content-center mt-4">
                <CButton type="submit" className="profile-button"
                  style={{
                    backgroundColor: submitHover ? colors.primary : 'transparent',
                    color: submitHover
                      ? colors.white
                      : isDarkMode
                        ? colors.white
                        : colors.primary,
                  }}
                  onMouseEnter={() => setSubmitHover(true)}
                  onMouseLeave={() => setSubmitHover(false)}
                >
                  Submit Changes
                </CButton>
              </div>
            )}
          </CForm>
        </Card>
      </div >
    </div >
  );
};

export default ProfileForm;