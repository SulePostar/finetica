import React, { useState } from "react";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";

const RolesStatusesTable = ({ title, data, nameKey, onAdd, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    if (newValue.trim()) {
      onAdd({ [nameKey]: newValue });
      setNewValue("");
      setShowModal(false);
    }
  };

  return (
    <Card className="shadow-sm border-0 table-card">
      <Card.Body>
        <div className="card-title-button">
          <Card.Title>{title}</Card.Title>
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            Add {title.slice(0, -1)}
          </Button>
        </div>

        <div className="table-wrapper">
          <Table striped bordered hover size="sm" responsive className="mb-0">
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
                      <button
                        className="btn-delete-icon"
                        onClick={() => onDelete(item.id)}
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add {title.slice(0, -1)}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              type="text"
              placeholder={`Enter ${nameKey}`}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
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
  );
};

export default RolesStatusesTable;
