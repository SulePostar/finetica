import { CForm, CFormInput, CFormLabel, CCardTitle } from '@coreui/react';
import { Card } from 'react-bootstrap';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import ProfilePhotoUpload from '../Register/ProfilePhotoUpload/ProfilePhotoUpload';
import AppButton from '../AppButton/AppButton';
import StatusBadge from './statusBagde';
import { useProfileForm } from './useProfileForm';
import './ProfileForm.css';

const ProfileForm = () => {
  const sidebarWidth = useSidebarWidth();
  const {
    formData,
    isEditable,
    isDarkMode,
    handleChange,
    handleSubmit,
    handleCancel,
    handlePhotoSelect,
    handlePhotoRemove,
  } = useProfileForm();

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
              <AppButton size="md" type="button" onClick={() => handleChange({ type: 'editMode', value: true })}>
                Edit Profile
              </AppButton>
            )}
          </div>

          {/* Profile Photo Section */}
          <div className="section-box p-3 mb-4">
            <ProfilePhotoUpload
              onPhotoSelect={handlePhotoSelect}
              disabled={!isEditable}
              currentPhoto={formData.profileImage || null}
              onRemove={handlePhotoRemove}
            />
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
                    value={formData.roleName || ''}
                    disabled
                    className='disabled-cursor form-input-responsive'
                  />
                </div>
              </div>

              {isEditable && (
                <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3 mt-3 mb-4">
                  <AppButton type="submit" variant="primary" className="btn-responsive flex-grow-1 flex-sm-grow-0">
                    Save Changes
                  </AppButton>
                  <AppButton variant="no-hover" onClick={handleCancel} className="btn-responsive flex-grow-1 flex-sm-grow-0">
                    Cancel
                  </AppButton>
                </div>
              )}

              <div className="row mt-3">
                <div className="col-12 col-md-6 mb-3">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <CFormLabel className="mb-0 form-label-responsive">Account Status:</CFormLabel>
                    <StatusBadge statusName={formData.statusName} />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <CFormLabel className="form-label-responsive">Last Login</CFormLabel>
                  <CFormInput
                    className="no-bg-form-input form-input-responsive"
                    value={formData.lastLoginAt || ''}
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
