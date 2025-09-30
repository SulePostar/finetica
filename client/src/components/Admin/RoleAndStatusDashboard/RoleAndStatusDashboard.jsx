import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles, addRole, selectRoles, deleteRole } from '../../../redux/roles/rolesSlice';
import { fetchStatuses, addStatus, selectStatuses, deleteStatus } from '../../../redux/statuses/statusesSlice';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CBadge,
  CListGroup,
  CListGroupItem,
} from '@coreui/react';
import { cilShieldAlt, cilBolt, cilSettings, cilWarning, cilUser, cilChartLine } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import AppButton from '../../AppButton/AppButton'; 
import './RoleStatusManagement.css';

const normalizeType = (obj) => {
  const raw =
    obj?.type ??
    obj?.statusType ??
    obj?.status_type ??
    obj?.status ??
    obj?.name ??
    'Pending';

  const s = String(raw).trim().toLowerCase();
  if (s.startsWith('approv')) return 'Approved';
  if (s.startsWith('reject')) return 'Rejected';
  if (s.startsWith('delete') || s === 'removed') return 'Deleted';
  return 'Pending';
};

const RoleAndStatusDashboard = () => {
  const dispatch = useDispatch();
  const roles = useSelector(selectRoles) || [];
  const statuses = useSelector(selectStatuses) || [];

  const [roleName, setRoleName] = useState('');
  const [statusName, setStatusName] = useState('');
  const [statusType] = useState('Pending');

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchStatuses());
  }, [dispatch]);

  const onAddRole = useCallback(() => {
    const name = roleName.trim();
    if (!name) return;
    dispatch(addRole({ role: name })).then((res) => {
      if (!res.error) {
        setRoleName('');
        dispatch(fetchRoles());
      }
    });
  }, [dispatch, roleName]);

  const onAddStatus = useCallback(() => {
    const name = statusName.trim();
    if (!name) return;
    dispatch(addStatus({ status: name, type: statusType })).then((res) => {
      if (!res.error) {
        setStatusName('');
        dispatch(fetchStatuses());
      }
    });
  }, [dispatch, statusName, statusType]);

  const stats = useMemo(() => {
    const totalRoles = roles.length;
    const totalStatuses = statuses.length;
    const types = statuses.map(normalizeType);
    const approved = types.filter((t) => t === 'Approved').length;
    const pending = types.filter((t) => t === 'Pending').length;
    const rejected = types.filter((t) => t === 'Rejected').length;
    return { totalRoles, totalStatuses, approved, pending, rejected };
  }, [roles, statuses]);

  return (
    <>
      <CRow className="mb-4">
        <CCol sm={6} md={3}>
          <CCard className="stat-card">
            <CCardBody className="flex-center gap-3">
              <div className="dot"><CIcon icon={cilSettings} size="lg" /></div>
              <div>
                <div className="stat-label">Total Roles</div>
                <div className="stat-value">{stats.totalRoles}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} md={3}>
          <CCard className="stat-card">
            <CCardBody className="flex-center gap-3">
              <div className="dot"><CIcon icon={cilShieldAlt} size="lg" /></div>
              <div>
                <div className="stat-label">Total Statuses</div>
                <div className="stat-value">{stats.totalStatuses}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} md={3}>
          <CCard className="stat-card">
            <CCardBody className="flex-center gap-3">
              <div className="dot"><CIcon icon={cilBolt} size="lg" /></div>
              <div>
                <div className="stat-label">Approved</div>
                <div className="stat-value">{stats.approved}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} md={3}>
          <CCard className="stat-card">
            <CCardBody className="flex-center gap-3">
              <div className="dot dot-subtle"><CIcon icon={cilWarning} size="lg" /></div>
              <div>
                <div className="stat-label">Pending</div>
                <div className="stat-value">{stats.pending}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

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
                          onClick={() => dispatch(deleteRole(r.id))}
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
              <div className="panel-chips">
                <CBadge className="pill status-pill pending-custom">
                  {stats.pending} Pending
                </CBadge>
                <CBadge color="success" className="chip">
                  {stats.approved} Approved
                </CBadge>
                <CBadge color="danger" className="chip">
                  {stats.rejected} Rejected
                </CBadge>
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
                  {statuses.map((s, idx) => {
                    const type = normalizeType(s);
                    let badge;
                    switch (type) {
                      case 'Approved':
                        badge = (
                          <CBadge color="success" className="pill status-pill">
                            Approved
                          </CBadge>
                        );
                        break;
                      case 'Rejected':
                        badge = (
                          <CBadge color="danger" className="pill status-pill">
                            Rejected
                          </CBadge>
                        );
                        break;
                      case 'Deleted':
                        badge = (
                          <CBadge color="secondary" className="pill status-pill">
                            Deleted
                          </CBadge>
                        );
                        break;
                      default:
                        badge = (
                          <CBadge className="pill status-pill pending-custom">
                            Pending
                          </CBadge>
                        );
                    }
                    return (
                      <CListGroupItem key={s.id ?? idx} className="list-row list-row-statuses">
                        <div className="col-id">{s.id ?? (idx + 1)}</div>
                        <div className="col-name">{badge}</div>
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
                    );
                  })}
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
