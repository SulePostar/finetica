import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CListGroup,
  CListGroupItem,
} from '@coreui/react';
import { cilUser, cilChartLine } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import AppButton from '../../AppButton/AppButton';
import './RoleStatusManagement.css';
import StatusBadge from './RoleAndStatusDashboardComponents/StatusBadge';
import { useRoles } from '../../../hooks/useRoles';
import { useStatuses } from '../../../hooks/useStatuses';

const RoleAndStatusDashboard = () => {
  const { roles, roleName, setRoleName, onAddRole, deleteRole } = useRoles();
  const { statuses, statusName, setStatusName, onAddStatus, deleteStatus } = useStatuses();

  return (
    <>
      <CRow className="g-4">
        <CCol md={5}>
          <CCard className="panel">
            <CCardHeader className="panel-header">
              <div className="panel-title">
                <CIcon icon={cilUser} size="lg" className="role-icon" /> Roles <span className="muted">({roles.length})</span>
              </div>
            </CCardHeader>
            <CCardBody>
              <div className="add-row">
                <CFormInput
                  placeholder="Enter role name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
                <AppButton
                  variant="success"
                  className="btn-compact"
                  onClick={onAddRole}
                  icon={null}
                >
                  + Add Role
                </AppButton>
              </div>

              <div className="list-wrap list-roles">
                <div className="list-head list-head-roles">
                  <div className="col-id">ID</div>
                  <div className="col-name">Role Name</div>
                  <div className="col-actions">Actions</div>
                </div>
                <CListGroup>
                  {roles.map((r, idx) => (
                    <CListGroupItem key={r.id ?? idx} className="list-row list-row-roles">
                      <div className="col-id">{r.id ?? (idx + 1)}</div>
                      <div className="col-name">{r.role || r.name}</div>
                      <div className="col-actions">
                        <AppButton
                          variant="danger"
                          size="sm"
                          className="btn-compact btn-delete"
                          icon="mdi:trash"
                          onClick={() => deleteRole(r.id)}
                          title="Delete role"
                        >
                          Delete
                        </AppButton>
                      </div>
                    </CListGroupItem>
                  ))}
                  {roles.length === 0 && (
                    <CListGroupItem className="empty-row">No roles yet.</CListGroupItem>
                  )}
                </CListGroup>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={7}>
          <CCard className="panel">
            <CCardHeader className="panel-header">
              <div className="panel-title">
                <CIcon icon={cilChartLine} size="lg" className="status-header-icon" /> Statuses{' '}
                <span className="muted">({statuses.length})</span>
              </div>
            </CCardHeader>

            <CCardBody>
              <div className="add-row">
                <CFormInput
                  placeholder="Enter status name"
                  value={statusName}
                  onChange={(e) => setStatusName(e.target.value)}
                />
                <AppButton
                  variant="success"
                  className="btn-compact"
                  onClick={onAddStatus}
                >
                  + Add Status
                </AppButton>
              </div>

              <div className="list-wrap list-statuses">
                <div className="list-head list-head-statuses">
                  <div className="col-id">ID</div>
                  <div className="col-name">Status</div>
                  <div className="col-actions">Actions</div>
                </div>

                <CListGroup>
                  {statuses.map((s, idx) => (
                    <CListGroupItem key={s.id ?? idx} className="list-row list-row-statuses">
                      <div className="col-id">{s.id ?? (idx + 1)}</div>
                      <div className="col-name">
                        <StatusBadge status={s.status} />
                      </div>
                      <div className="col-actions">
                        <AppButton
                          variant="danger"
                          size="sm"
                          className="btn-compact btn-delete"
                          icon="mdi:trash"
                          onClick={() => dispatch(deleteStatus(s.id))}
                          title="Delete status"
                        >
                          Delete
                        </AppButton>
                      </div>
                    </CListGroupItem>
                  ))}

                  {statuses.length === 0 && (
                    <CListGroupItem className="empty-row">No statuses yet.</CListGroupItem>
                  )}
                </CListGroup>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default RoleAndStatusDashboard;
