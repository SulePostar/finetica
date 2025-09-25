import React from "react";
import { CButton } from "@coreui/react";
import CIcon from '@coreui/icons-react';
import { cilCheck, cilPencil, cilTrash, cilSave, cilX } from '@coreui/icons';
import "./AppButton.css";

// Map string names to actual icon imports
const ICONS = {
    'mdi:check': cilCheck,
    'mdi:pencil': cilPencil,
    'mdi:trash': cilTrash,
    'mdi:content-save': cilSave,
    'mdi:close': cilX,
};

const AppButton = ({
    variant = "primary",
    size = "md",
    icon,
    children,
    className = "",
    ...rest
}) => {
    const classes = `btn-custom btn-${variant} btn-${size} ${icon && !children ? "btn-icon" : ""} ${className}`;

    return (
        <CButton className={classes} {...rest}>
            {icon && ICONS[icon] && <CIcon icon={ICONS[icon]} />}
            {children}
        </CButton>
    );
};

export default AppButton;
