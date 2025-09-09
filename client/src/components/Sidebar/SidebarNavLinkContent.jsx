import React from 'react';
import CIcon from '@coreui/icons-react';
import { CBadge } from '@coreui/react';

const SidebarNavLinkContent = ({ name, icon, badge, indent }) => (
    <>
        {icon ? (
            <CIcon icon={icon} className="nav-icon" />
        ) : (
            indent && (
                <CBadge color="secondary" shape="rounded-pill" />
            )
        )}
        {name}
        {badge && (
            <CBadge color={badge.color} size="sm" shape="rounded-pill">
                {badge.text}
            </CBadge>
        )}
    </>
);

export default SidebarNavLinkContent;
