import { useState } from "react";
import api from "../api/api";
import cogoToast from "../components/cogo-toast";

const defaultState = {
  loading: true,
  visibleSidenav: true,
  editingDescription: false,
  username: null,
  description: null,
  profilePic: null,
};

export default function useProfile(authUsername) {
  const [profileState, setProfileState] = useState(defaultState);

  const restartState = () => {
    setProfileState(defaultState);
  };

  const setLoading = (isLoading) => {
    setProfileState((prev) => ({ ...prev, loading: isLoading }));
  };

  const fetchProfile = async (username) => {
    setLoading(true);
    try {
      const res = await api.get(`user/${username}`);
      if (res.code == 200) {
        setProfileState((state) => ({
          ...state,
          ...res.response,
          ownProfile: authUsername == res.response.username,
          //profilePic: res.response.profilePic,
        }));
      }
    } catch (e) {
      switch (e.response.status) {
        case 404:
          cogoToast.error("404: User not found", {
            position: "bottom-right",
          });
          break;
        default:
          cogoToast.error("Unexpected error", {
            position: "bottom-right",
          });
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSidenav = () => {
    setProfileState((state) => ({
      ...state,
      visibleSidenav: !state.visibleSidenav,
    }));
  };

  const setDescription = (description) => {
    cogoToast.success(`Description updated!`, {
      position: "bottom-right",
    });
    setProfileState((state) => ({
      ...state,
      description,
    }));
    //localStorage.setItem("last_session", JSON.stringify(useAuthStore.getState()));
  };

  const toggleEditingDescription = () => {
    setProfileState((state) => ({
      ...state,
      editingDescription: !state.editingDescription,
    }));
  };

  const updateProfilePicture = (url) => {
    setProfileState((state) => ({
      ...state,
      profilePic: url,
    }));
  };

  return {
    restartState,
    fetchProfile,
    profileState,
    updateProfilePicture,
    toggleEditingDescription,
    setDescription,
    toggleSidenav,
  };
}
