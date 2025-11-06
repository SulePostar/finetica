import {
  CForm,
  CFormInput,
  CFormLabel,
  CCardTitle,
} from "@coreui/react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { formatDateTime } from "../../helpers/formatDate";
import { useSidebarWidth } from "../../hooks/useSidebarWidth";
import ProfilePhotoUpload from "../Register/ProfilePhotoUpload/ProfilePhotoUpload";
import AppButton from "../AppButton/AppButton";
import StatusBadge from "./StatusBadge";
import { useProfileForm } from "./useProfileForm";

const ProfileForm = () => {
  const profile = useSelector((state) => state.user.profile);
  const statusesState = useSelector((state) => state.statuses || {});
  const statuses = statusesState.statuses || [];

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
    setIsEditable,
  } = useProfileForm(profile);

  // Opcionalno: boja teksta za dark mode polja
  const darkThemeColor = isDarkMode ? "inherit" : "initial";

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <Card
          className={`profile-form-card border-0 shadow-sm p-3 p-md-4 ${isDarkMode ? "bg-dark text-light" : "bg-light"
            }`}
          style={{
            marginLeft: sidebarWidth,
            width: `calc(100% - ${sidebarWidth}px)`,
            transition: "margin-left 0.3s ease, width 0.3s ease",
          }}
        >
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 px-2 px-md-3 pt-2 pt-md-3">
            <div className="mb-3 mb-md-0">
              <CCardTitle className="form-title">User Profile</CCardTitle>
              <div className="text-muted small">
                {isEditable ? "Edit your profile information" : "View and manage your profile"}
              </div>
            </div>
            {!isEditable && (
              <AppButton size="md" type="button" onClick={() => setIsEditable(true)}>
                Edit Profile
              </AppButton>
            )}
          </div>

          {/* Profile Photo Section */}
          <div className="section-box p-3 mb-4">
            <ProfilePhotoUpload
              onPhotoSelect={handlePhotoSelect}
              disabled={!isEditable}
              currentPhoto={profile?.profileImage || null}
              onRemove={handlePhotoRemove}
            />
          </div>

          {/* User Info Section */}
          <div className="section-box p-3">
            <CForm onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <CFormLabel>First Name</CFormLabel>
                  <CFormInput
                    type="text"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleChange}
                    disabled={!isEditable}
                    style={{
                      cursor: isEditable ? "text" : "not-allowed",
                      color: darkThemeColor,
                    }}
                  />
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <CFormLabel>Last Name</CFormLabel>
                  <CFormInput
                    type="text"
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleChange}
                    disabled={!isEditable}
                    style={{
                      cursor: isEditable ? "text" : "not-allowed",
                      color: darkThemeColor,
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <CFormLabel>Email Address</CFormLabel>
                  <CFormInput
                    value={formData.email || ""}
                    disabled
                    style={{
                      cursor: "not-allowed",
                      color: darkThemeColor,
                    }}
                  />
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <CFormLabel>Role</CFormLabel>
                  <CFormInput
                    value={formData.roleName || ""}
                    disabled
                    style={{
                      cursor: "not-allowed",
                      color: darkThemeColor,
                    }}
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
                    <CFormLabel className="mb-0">Account Status:</CFormLabel>
                    <StatusBadge
                      statusId={formData.statusId}
                      statusName={formData.statusName}
                      statuses={statuses}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <CFormLabel>Last Login</CFormLabel>
                  <CFormInput
                    className="border-0 bg-transparent p-0 text-body"
                    value={formatDateTime(formData.lastLoginAt)}
                    disabled
                    style={{
                      cursor: "not-allowed",
                      color: darkThemeColor,
                    }}
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
