import React from 'react';
import { CBadge } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload } from '@coreui/icons';
import { colors } from '../../styles/colors';

const SidebarDriveStatus = ({ unfoldable, isHovered, driveConnected }) => {
    return unfoldable && !isHovered ? (
        <div className="d-none d-lg-flex justify-content-center align-items-center p-3">
            <div
                className="d-flex align-items-center justify-content-center"
                style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    backgroundColor: driveConnected
                        ? colors.success.background
                        : colors.error.background,
                }}
            >
                <CIcon
                    icon={cilCloudDownload}
                    style={{
                        color: driveConnected ? colors.success.text : colors.error.text,
                        fontSize: 16,
                    }}
                />
            </div>
        </div>
    ) : (
        <div className="d-none d-lg-flex justify-content-between align-items-center px-3 py-2">
            <div
                className="fw-semibold small"
                style={{ color: 'var(--cui-sidebar-color, #212529)' }}
            >
                Google Drive
            </div>
            <CBadge
                size="sm"
                style={{
                    backgroundColor: driveConnected
                        ? colors.success.background
                        : 'var(--cui-sidebar-bg, #ede9fe)',
                    color: driveConnected
                        ? colors.success.text
                        : 'var(--cui-sidebar-color, #212529)',
                }}
            >
                {driveConnected ? 'Connected' : 'Disconnected'}
            </CBadge>
        </div>
    );
};

export default SidebarDriveStatus;
