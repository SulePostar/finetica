import { CListGroup, CListGroupItem, CBadge, CFormInput, CFormSelect } from '@coreui/react';

const DocumentInfoField = ({
    label,
    value,
    isEditing,
    editComponent,
    isDarkMode
}) => (
    <CListGroupItem className={isDarkMode ? "bg-transparent text-light" : "bg-transparent text-dark"}>
        <small style={{ color: "var(--cui-secondary-color)", display: "block" }}>{label}</small>
        {isEditing ? editComponent : value}
    </CListGroupItem>
);

export const DocumentInformation = ({
    doc,
    isEditing,
    formData,
    setFormData,
    isDarkMode
}) => {
    if (!doc) return null;

    return (
        <CListGroup flush>
            <DocumentInfoField
                label="File Name"
                value={doc.filename}
                isEditing={isEditing}
                editComponent={
                    <CFormInput
                        value={formData.filename || ""}
                        onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
                    />
                }
                isDarkMode={isDarkMode}
            />

            <DocumentInfoField
                label="Message"
                value={doc.message || "-"}
                isEditing={isEditing}
                editComponent={
                    <CFormInput
                        value={formData.message || ""}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                }
                isDarkMode={isDarkMode}
            />

            <DocumentInfoField
                label="Status"
                value={doc.isValid ?
                    <CBadge color="success">Valid</CBadge> :
                    <CBadge color="danger">Invalid</CBadge>
                }
                isEditing={isEditing}
                editComponent={
                    <CFormSelect
                        value={formData.isValid ? "valid" : "invalid"}
                        onChange={(e) => setFormData({ ...formData, isValid: e.target.value === "valid" })}
                    >
                        <option value="valid">Valid</option>
                        <option value="invalid">Invalid</option>
                    </CFormSelect>
                }
                isDarkMode={isDarkMode}
            />

            <DocumentInfoField
                label="Processed"
                value={doc.isProcessed ?
                    <CBadge color="success">Yes</CBadge> :
                    <CBadge color="danger">No</CBadge>
                }
                isEditing={isEditing}
                editComponent={
                    <CFormSelect
                        value={formData.isProcessed ? "yes" : "no"}
                        onChange={(e) => setFormData({ ...formData, isProcessed: e.target.value === "yes" })}
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </CFormSelect>
                }
                isDarkMode={isDarkMode}
            />

            <DocumentInfoField
                label="Processed At"
                value={doc.processedAt ? new Date(doc.processedAt).toLocaleString() : "-"}
                isEditing={false}
                isDarkMode={isDarkMode}
            />

            <DocumentInfoField
                label="Created At"
                value={new Date(doc.createdAt).toLocaleString()}
                isEditing={false}
                isDarkMode={isDarkMode}
            />
        </CListGroup>
    );
};