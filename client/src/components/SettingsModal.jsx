import Loading from '../components/Loading';
import { useAuthStore } from '../stores/auth';
import { Modal } from 'react-bootstrap';

export default function SettingsModal({ settingsModal, toggleSettingsModal, togglePrivacy }) {
  const { loading, isVisible } = settingsModal;
  const profilePrivacy = useAuthStore((state) => state.openProfile);
  const toggleProfilePrivacy = () => {
    if (!loading) {
      togglePrivacy();
    }
  };

  return (
    <Modal show={isVisible} onHide={toggleSettingsModal}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Loading />
        ) : (
          <div className="custom-control custom-switch" onClick={toggleProfilePrivacy}>
            <input
              type="checkbox"
              className="custom-control-input"
              id="customSwitch1"
              defaultChecked={profilePrivacy}
            />
            <label className="custom-control-label" htmlFor="customSwitch1">
              Allow people to post on my profile.
            </label>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
