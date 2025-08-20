import { CCard, CCardHeader, CCardBody, CCardTitle } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilFile } from '@coreui/icons';

/**
 * DocInfoCard Component
 * 
 * A reusable card wrapper component that provides consistent styling and structure.
 * 
 * @param {React.ReactNode} children - The content to render inside the card body
 * @param {string} title - The card title
 * @param {string} message - Optional message to display instead of children
 * @param {boolean} isError - Whether this is an error state (applies error styling)
 * @param {Object} ariaProps - Additional ARIA properties for accessibility
 */
const DocInfoCard = ({
    children,
    title,
    message = '',
    isError = false,
    ariaProps = {}
}) => {
    const cardClassName = `h-100 shadow-sm detail-card ${isError ? 'border-danger' : ''}`;
    const titleClassName = `mb-0 ${isError ? 'text-danger' : ''}`;

    // If message is provided, show it instead of children
    const content = message ? (
        <div className="text-center p-4">
            <p className="text-muted">{message}</p>
        </div>
    ) : children;

    return (
        <CCard className={cardClassName} {...ariaProps}>
            <CCardHeader>
                <CCardTitle className={titleClassName}>
                    <CIcon icon={cilFile} className="me-2" aria-hidden="true" />
                    {title}
                </CCardTitle>
            </CCardHeader>
            <CCardBody>
                {content}
            </CCardBody>
        </CCard>
    );
};

export default DocInfoCard;
