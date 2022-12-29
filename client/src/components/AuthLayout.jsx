import NewPostModal from '../components/NewPostModal';
import SettingsModal from '../components/SettingsModal';
import Navbar from '../components/Navbar';
import { useState, useCallback } from 'react';
import { useAuthStore } from '../stores/auth';
import api from '../api/api';

export default function Explore({ children }) {
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState({ loading: false, isVisible: false });

  const toggleSettingsModal = useCallback(() => {
    setSettingsModal((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  }, []);

  const setSettingsModalLoad = useCallback((value) => {
    setSettingsModal((prev) => ({ ...prev, loading: value }));
  }, []);

  const toggleProfilePrivacy = () => {
    setSettingsModalLoad(true);

    api
      .patch('user/settings/privacy')
      .then((res) => {
        useAuthStore.setState((state) => ({
          ...state,
          openProfile: res.response.openProfile,
        }));
      })
      .catch((e) => console.log(e))
      .then(() => {
        localStorage.setItem('last_session', JSON.stringify(useAuthStore.getState()));
        setSettingsModalLoad(false);
      });
  };

  const togglePrivacy = useCallback(toggleProfilePrivacy, []);

  const toggleNewPostModal = useCallback(() => {
    setShowNewPostModal((prev) => !prev);
  }, []);
  return (
    <div className="d-flex page">
      <NewPostModal showNewPostModal={showNewPostModal} toggleNewPostModal={toggleNewPostModal} />
      <SettingsModal
        settingsModal={settingsModal}
        toggleSettingsModal={toggleSettingsModal}
        togglePrivacy={togglePrivacy}
      />
      {children}
      <Navbar toggleNewPostModal={toggleNewPostModal} toggleSettingsModal={toggleSettingsModal} />
    </div>
  );
}
