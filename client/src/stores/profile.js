import create from "zustand";
import API from "../api/api";
import cogoToast from "../components/cogo-toast";
import { useAuthStore } from "./auth";

const defaultState = {
  loading: true,
  visibleSidenav: true,
  editingDescription: false,
  username: null,
  description: null,
  profilePic: null,
};

export const useProfileStore = create(() => defaultState);

export const toggleSidenav = () => {
  useProfileStore.setState((state) => ({
    ...state,
    visibleSidenav: !state.visibleSidenav,
  }));
};

export const setDescription = (description) => {
  cogoToast.success(`Description updated!`, {
    position: "bottom-right",
  });
  useProfileStore.setState((state) => ({
    ...state,
    description,
  }));
  localStorage.setItem("last_session", JSON.stringify(useAuthStore.getState()));
};

export const toggleEditingDescription = () => {
  useProfileStore.setState((state) => ({
    ...state,
    editingDescription: !state.editingDescription,
  }));
};

export const updateProfilePicture = (url) => {
  useProfileStore.setState((state) => ({
    ...state,
    profilePic: url,
  }));
};

export const fetchProfile = (username) => {
  const authState = useAuthStore.getState();
  useProfileStore.setState((state) => ({
    ...state,
    loading: true,
  }));

  API.get(`user/${username}`)
    .then((res) => {
      if (res.code == 200) {
        useProfileStore.setState((state) => ({
          ...state,
          ...res.response,
          ownProfile: authState.username == res.response.username,
          //profilePic: res.response.profilePic,
        }));
      }
    })
    .catch((e) => {
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
    })
    .then(() => {
      useProfileStore.setState((state) => ({
        ...state,
        loading: false,
      }));
    });
};

export const restartState = () => {
  useProfileStore.setState(defaultState);
};
