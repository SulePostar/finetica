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
import { profileFormStyles } from './ProfileForm.styles';
import { formatDateTime } from '../../helpers/formatDate.js';
import { capitalizeFirst } from '../../helpers/capitalizeFirstLetter.js';
import { setUserProfile } from '../../redux/user/userSlice';
import ProfilePhotoUpload from '../Register/ProfilePhotoUpload/ProfilePhotoUpload';
import FileUploadService from '../../services/fileUploadService';
import notify from '../../utilis/toastHelper';

const ProfileForm = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);

  const [formData, setFormData] = useState(profile || {});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-coreui-theme') === 'dark'
  );

  const styles = useMemo(() => profileFormStyles(isDarkMode), [isDarkMode]);

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

      const res = await axios.put('http://localhost:4000/api/users/me', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt_token')}` },
      });

      dispatch(setUserProfile(res.data));
      notify.onSuccess('Profile updated successfully!');
      setProfilePhoto(null); // reset local selection
      setIsEditable(false);
    } catch (err) {
      console.error(err);
      notify.onError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-6" style={styles.formContainerCard}>
          <div className="d-flex justify-content-center align-items-center mb-4">
            <h2 style={styles.title}>User Profile</h2>
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
                type="button"
                size="sm"
                onClick={() => setIsEditable((prev) => !prev)}
                style={styles.editToggle}
              >
                {isEditable ? 'Cancel' : 'Edit Profile'}
              </CButton>
            </div>

            <CInputGroup className="mb-3">
              <CInputGroupText style={styles.inputGroupText}>
                <CFormLabel style={styles.labelInInputGroupText}>First name</CFormLabel>
              </CInputGroupText>
              <CFormInput
                type='text'
                name='firstName'
                placeholder='First name'
                style={isEditable ? styles.formInput : styles.formInputDisabled}
                value={formData.firstName || ''}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText style={styles.inputGroupText}>
                <CFormLabel style={styles.labelInInputGroupText}>First name</CFormLabel>
              </CInputGroupText>
              <CFormInput
                type='text'
                name='lastName'
                placeholder='Last name'
                style={isEditable ? styles.formInput : styles.formInputDisabled}
                value={formData.lastName || ''}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText style={styles.inputGroupText}>
                <CFormLabel style={styles.labelInInputGroupText}>Email</CFormLabel>
              </CInputGroupText>
              <CFormInput
                type='email'
                name='email'
                placeholder='Email'
                style={isEditable ? styles.formInput : styles.formInputDisabled}
                value={formData.email || ''}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText style={styles.inputGroupText}>
                <CFormLabel style={styles.labelInInputGroupText}>Role</CFormLabel>
              </CInputGroupText>
              <CFormInput style={styles.formInputDisabled} value={capitalizeFirst(formData.roleName)} disabled />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText style={styles.inputGroupText}>
                <CFormLabel style={styles.labelInInputGroupText}>Status</CFormLabel>
              </CInputGroupText>
              <CFormInput style={styles.formInputDisabled} value={capitalizeFirst(formData.statusName)} disabled />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText style={styles.inputGroupText}>
                <CFormLabel style={styles.labelInInputGroupText}>Last login</CFormLabel>
              </CInputGroupText>
              <CFormInput style={styles.formInputDisabled} value={formatDateTime(formData.lastLoginAt)} disabled />
            </CInputGroup>

            {isEditable && (
              <div className="d-flex justify-content-center mt-4">
                <CButton type="submit" style={styles.button}>
                  Submit Changes
                </CButton>
              </div>
            )}
          </CForm>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;