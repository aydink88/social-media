import NewPostForm from './NewPostForm';
import { useAuthStore } from '../stores/auth';
import { Modal } from 'react-bootstrap';

export default function NewPostModal({ showNewPostModal, toggleNewPostModal }) {
  const profileId = useAuthStore((state) => state.username);

  return (
    <Modal show={showNewPostModal} onHide={toggleNewPostModal}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NewPostForm profileId={profileId} onSuccess={toggleNewPostModal} />
      </Modal.Body>
    </Modal>
  );
}
