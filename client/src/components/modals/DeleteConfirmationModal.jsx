import { Modal, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

function DeleteConfirmationModal({ show, onHide, onConfirm, userName }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <FaTrash className="me-2" />
          Delete User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete the user <strong>{userName}</strong>?</p>
        <p className="text-danger mb-0">This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete User
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmationModal; 