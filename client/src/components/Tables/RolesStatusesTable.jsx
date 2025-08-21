import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";
import { useSidebarWidth } from "../../hooks/useSidebarWidth";
import "./RoleStatusTable.css";
import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const RolesStatusesTable = ({ title, data, nameKey, onAdd, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute("data-coreui-theme") === "dark"
  );

  const sidebarWidth = useSidebarWidth();

  useEffect(() => {
    const handler = () =>
      setIsDarkMode(
        document.documentElement.getAttribute("data-coreui-theme") === "dark"
      );
    window.document.documentElement.addEventListener(
      "ColorSchemeChange",
      handler
    );
    return () =>
      window.document.documentElement.removeEventListener(
        "ColorSchemeChange",
        handler
      );
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
      className="role-status-dashboard-outer"
    >
      <Card
        className={`shadow-sm border-0 table-card ${
          isDarkMode ? "bg-dark text-light" : "bg-light"
        }`}
        data-theme={isDarkMode ? "dark" : "light"}
      >
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title className="mb-0">{title}</Card.Title>
            <Button
              className="add-btn"
              size="sm"
              onClick={() => setShowModal(true)}
              variant={isDarkMode ? "outline-light" : "--color-primary"}
            >
              Add {title === "Roles" ? "Role" : "Status"}
            </Button>
          </div>

          <div className="table-wrapper">
            <Table
              bordered
              hover
              size="sm"
              responsive
              className={`mb-0 text-center custom-table ${
                isDarkMode ? "table-dark" : "table-light"
              }`}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    {nameKey.charAt(0).toUpperCase() + nameKey.slice(1)}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) &&
                  data
                    .filter((item) => item && item.id)
                    .map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item[nameKey]}</td>
                        <td>
                          <Button
                            className="btn-delete-icon"
                            variant={isDarkMode ? "outline-danger" : "danger"}
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

          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            className="custom-modal"
          >
            <Modal.Header
              closeButton
              className={isDarkMode ? "bg-dark text-light" : ""}
            >
              <Modal.Title>Add {title === "Roles" ? "Role" : "Status"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={isDarkMode ? "bg-dark text-light" : ""}>
              <Form.Control
                type="text"
                placeholder={`Enter ${nameKey}`}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className={isDarkMode ? "bg-dark text-light" : ""}
              />
            </Modal.Body>
            <Modal.Footer
              className={isDarkMode ? "bg-dark text-light" : ""}
            >
              <Button
                variant={isDarkMode ? "outline-light" : "--color-primary"}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant={isDarkMode ? "outline-light" : " primary"}
                onClick={handleAdd}
              >
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
