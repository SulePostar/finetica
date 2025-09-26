import React from "react";
import { CButton } from "@coreui/react";
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilArrowLeft } from '@coreui/icons';
import "./AppButton.css";

const ICONS = {
    'mdi:pencil': cilPencil,
    'mdi:trash': cilTrash,
    'mdi:arrow-left': cilArrowLeft,
};

const AppButton = ({
    variant = "primary",
    size = "md",
    icon,
    children,
    className = "",
    ...rest
}) => {
    const variantClass = className.includes('btn-no-hover') ? '' : `btn-${variant}`;
    const classes = `btn btn-custom ${variantClass} btn-${size} ${icon && !children ? "btn-icon" : ""} ${className}`;

    return (
        <CButton className={classes} {...rest}>
            {icon && ICONS[icon] && <CIcon icon={ICONS[icon]} />}
            {children && <span className="btn-text">{children}</span>}
        </CButton>
    );
};

export default AppButton;
