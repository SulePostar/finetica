import {
  CForm,
  CFormInput,
  CFormLabel,
  CCardTitle,
  CBadge,
} from '@coreui/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { capitalizeFirst } from '../../helpers/capitalizeFirstLetter.js';
import { formatDateTime } from '../../helpers/formatDate.js';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import { setUserProfile } from '../../redux/user/userSlice';
import FileUploadService from '../../services/fileUploadService';
import notify from '../../utilis/toastHelper';
import ProfilePhotoUpload from '../Register/ProfilePhotoUpload/ProfilePhotoUpload';
import './ProfileForm.css';
import AppButton from '../AppButton/AppButton';
import { getStatusBadge } from '../../utilis/formatters';

const url = import.meta.env.VITE_API_BASE_URL;

const ProfileForm = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const sidebarWidth = useSidebarWidth();

  const [formData, setFormData] = useState(profile || {});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
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

  const statusesState = useSelector((state) => state.statuses || {});
  const statuses = statusesState.statuses || [];

  useEffect(() => {
  }, [statuses, formData?.statusId, formData?.statusName]);

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
    try {
      const updatedProfile = { ...formData, profileImage: null };
      setFormData(updatedProfile);
      dispatch(setUserProfile(updatedProfile));
      notify.onSuccess('Profile photo removed successfully!');
    } catch (err) {
      console.error(err);
      notify.onError('Error removing profile photo.');
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
          notify.onWarning('Profile image upload failed, profile saved without new image.');
        }
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

  const getStatusBadgeFromName = (statusName) => {
    const s = statusName?.trim().toLowerCase() || '';
    let color = 'info';
    if (s === 'approved') color = 'success';
    else if (s === 'rejected') color = 'danger';
    else if (s === 'pending') color = 'warning';

    return <CBadge color={color}>{capitalizeFirst(statusName)}</CBadge>;
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditable(false);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <Card
          className="profile-form-card shadow-sm border-0 bg-light dark:bg-dark p-3 p-md-4"
          data-theme={isDarkMode ? 'dark' : 'light'}
          style={{
            marginLeft: sidebarWidth,
            width: `calc(100% - ${sidebarWidth}px)`,
            transition: 'margin-left 0.3s ease, width 0.3s ease',
          }}
        >
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 px-2 px-md-3 pt-2 pt-md-3">
            <div className="mb-3 mb-md-0">
              <CCardTitle className="form-title mb-1">User Profile</CCardTitle>
              <div className="text-muted small">
                {isEditable ? 'Edit your profile information' : 'View and manage your profile'}
              </div>
            </div>
            {!isEditable && (
              <AppButton
                size="md"
                type="button"
                onClick={() => setIsEditable(true)}
              >
                Edit Profile
              </AppButton>
            )}
          </div>

          {/* Profile Photo Section */}
          <div className="section-box p-3 mb-4">
            <div>
              <ProfilePhotoUpload
                onPhotoSelect={handlePhotoSelect}
                disabled={!isEditable}
                currentPhoto={profile?.profileImage || null}
                onRemove={handlePhotoRemove}
              />
            </div>
          </div>

          {/* User Info Section */}
          <div className="section-box p-3">
            <CForm onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <CFormLabel className="form-label-responsive">First Name</CFormLabel>
                  <CFormInput
                    type="text"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className="form-input-responsive"
                  />
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <CFormLabel className="form-label-responsive">Last Name</CFormLabel>
                  <CFormInput
                    type="text"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className="form-input-responsive"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <CFormLabel className="form-label-responsive">Email Address</CFormLabel>
                  <CFormInput
                    value={formData.email || ''}
                    disabled
                    className='disabled-cursor form-input-responsive'
                  />
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <CFormLabel className="form-label-responsive">Role</CFormLabel>
                  <CFormInput
                    value={capitalizeFirst(formData.roleName)}
                    disabled
                    className='disabled-cursor form-input-responsive'
                  />
                </div>
              </div>

              {isEditable && (
                <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3 mt-3 mb-4">
                  <AppButton
                    type="submit"
                    variant="primary"
                    className="btn-responsive flex-grow-1 flex-sm-grow-0"
                  >
                    Save Changes
                  </AppButton>
                  <AppButton
                    variant="no-hover"
                    onClick={handleCancel}
                    className="btn-responsive flex-grow-1 flex-sm-grow-0"
                  >
                    Cancel
                  </AppButton>
                </div>
              )}

              <div className="row mt-3">
                <div className="col-12 col-md-6 mb-3">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <CFormLabel className="mb-0 form-label-responsive">Account Status:</CFormLabel>
                    {statuses.length > 0
                      ? getStatusBadge(formData.statusId, statuses)
                      : getStatusBadgeFromName(formData.statusName)}
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <CFormLabel className="form-label-responsive">Last Login</CFormLabel>
                  <CFormInput
                    className="no-bg-form-input form-input-responsive"
                    value={formatDateTime(formData.lastLoginAt)}
                    disabled
                  />
                </div>
              </div>
            </CForm>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileForm;