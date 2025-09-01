import React, { useState } from 'react';
import { Table, Button, Modal, Form, Card } from 'react-bootstrap';
import { capitalizeFirst } from '../../helpers/capitalizeFirstLetter';

const RolesStatusesTable = ({ title, data, nameKey, onAdd, onDelete }) => {
    const [showModal, setShowModal] = useState(false);
    const [newValue, setNewValue] = useState('');

    const handleAdd = () => {
        if (newValue.trim()) {
            onAdd({ [nameKey]: newValue });
            setNewValue('');
            setShowModal(false);
        }
    };

    return (
        <Card className="shadow-sm border-0">
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                    Add {title === 'Roles' ? title.slice(0, -1) : title.slice(0, -2)}
                </Button>

                <div className="table-wrapper" style={{ marginTop: '1rem' }}>
                    <Table striped bordered hover size="sm" responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{capitalizeFirst(nameKey)}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(data) &&
                                data
                                    .filter(item => item && item.id)
                                    .map(item => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item[nameKey]}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => onDelete(item.id)}
                                                >
                                                    Delete
                                                </Button>
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