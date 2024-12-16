import { Modal, Button } from 'react-bootstrap';
import { FaUserClock } from 'react-icons/fa';

function PendingApprovalModal({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Account Pending Approval</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center py-4">
        <FaUserClock className="text-warning mb-3" size={50} />
        <h4>Thank you for registering!</h4>
        <p className="text-muted">
          Your account is currently pending administrator approval. You will be 
          notified via email once your account has been activated.
        </p>
        <p className="text-muted small">
          This usually takes 1-2 business days.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Understood
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PendingApprovalModal; 