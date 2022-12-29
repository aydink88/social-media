import create from 'zustand';
import API from '../api/api';
import cogoToast from '../components/cogo-toast';

const defaultState = {
  isLoading: false,
  isLogged: false,
  token: null,
  username: null,
  profilePic: null,
  description: null,
  openProfile: null,
  error: null,
};

export const useAuthStore = create(() => defaultState);

export const setLoginLoad = (value) => {
  useAuthStore.setState((state) => ({
    ...state,
    isLoading: value,
  }));
};

export const reconnect = (last_session) => {
  useAuthStore.setState((state) => ({
    ...state,
    isLoading: true,
  }));
  useAuthStore.setState((state) => ({
    ...state,
    ...last_session,
    isLoading: false,
    isLogged: true,
    // profilePic: last_session.profilePic,
  }));
};

export const logout = () => {
  localStorage.removeItem('last_session');
  useAuthStore.setState((state) => ({
    ...state,
    isLoading: true,
  }));
  useAuthStore.setState(defaultState);
  window.location.href = '/';
};

export const signUp = async ({ username, password }) => {
  useAuthStore.setState((state) => ({
    ...state,
    isLoading: true,
  }));

  const res = await API.post('auth/sign-up', { username, password });
  if (res.code == 200) {
    cogoToast.success(`Welcome aboard @${res.response.username}!`, {
      position: 'bottom-right',
    });
    localStorage.setItem('last_session', JSON.stringify({ ...res.response }));
    useAuthStore.setState((state) => ({
      ...state,
      isLoading: false,
      isLogged: true,
      ...res.response,
    }));
  }
  useAuthStore.setState((state) => ({
    ...state,
    isLoading: false,
  }));
};

export const signIn = async ({ username, password }) => {
  useAuthStore.setState((state) => ({
    ...state,
    isLoading: true,
  }));

  const res = await API.post('auth/sign-in', { username, password });
  if (res.code == 200) {
    cogoToast.success(`Welcome back @${res.response.username}!`, {
      position: 'bottom-right',
    });
    localStorage.setItem('last_session', JSON.stringify({ ...res.response }));
    useAuthStore.setState((state) => ({
      ...state,
      isLoading: false,
      isLogged: true,
      ...res.response,
    }));
  }
  useAuthStore.setState((state) => ({
    ...state,
    isLoading: false,
  }));
};

export const setProfilePic = (url) => {
  cogoToast.success(`Profile picture updated!`, {
    position: 'bottom-right',
  });
  useAuthStore.setState((state) => ({
    ...state,
    profilePic: url,
  }));

  localStorage.setItem('last_session', JSON.stringify(useAuthStore.getState()));
};

export const setDescription = (description) => {
  cogoToast.success(`Description updated!`, {
    position: 'bottom-right',
  });
  useAuthStore.setState((state) => ({
    ...state,
    description,
  }));

  localStorage.setItem('last_session', JSON.stringify(useAuthStore.getState()));
};
