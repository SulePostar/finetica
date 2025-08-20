import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";
import { useSidebarWidth } from "../../hooks/useSidebarWidth";
import "./RoleStatusTable.css";
import { cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const RolesStatusesTable = ({ title, data, nameKey, onAdd, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );

  const sidebarWidth = useSidebarWidth();

  // watch theme change
  useEffect(() => {
    const handler = () => {
      setIsDarkMode(document.documentElement.getAttribute("data-theme") === "dark");
    };
    window.document.documentElement.addEventListener("ColorSchemeChange", handler);
    return () => {
      window.document.documentElement.removeEventListener("ColorSchemeChange", handler);
    };
  }, []);

  const handleAdd = () => {
    if (newValue.trim()) {
      onAdd({ [nameKey]: newValue });
      setNewValue("");
      setShowModal(false);
    }
  };

  return (
    <div
      className={`role-status-dashboard-outer ${isDarkMode ? "dark-mode" : ""}`}
    >
      <Card className="shadow-sm border-0 table-card">
        <Card.Body>
          {/* Title + Add button row */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title className="mb-0">{title}</Card.Title>
            <Button
              className="add-btn"
              size="sm"
              onClick={() => setShowModal(true)}
            >
              Add {title.slice(0, -1)}
            </Button>
          </div>

          <div className="table-wrapper">
            <Table
              striped
              bordered
              hover
              size="sm"
              responsive
              className="mb-0 text-center"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{nameKey.charAt(0).toUpperCase() + nameKey.slice(1)}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) &&
                  data.filter((item) => item && item.id).map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item[nameKey]}</td>
                      <td>
                        <Button
                          className="btn-delete-icon"
                          onClick={() => onDelete(item.id)}
                        >
                          <CIcon icon={cilTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>

          {/* Modal */}
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            className="custom-modal"
          >
            <Modal.Header closeButton className="custom-modal-header">
              <Modal.Title>Add {title.slice(0, -1)}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
              <Form.Control
                type="text"
                placeholder={`Enter ${nameKey}`}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAdd}>
                Add
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RolesStatusesTable;
