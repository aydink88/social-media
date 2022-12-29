import create from "zustand";
import API from "../api/api";

const defaultState = {
  loading: false,
  items: [],
};

export const useUsersStore = create(() => defaultState);

export async function discoverUsers() {
  useUsersStore.setState((state) => ({ ...state, loading: true }));
  try {
    const res = await API.get("discover/users");
    if (res.code == 200) {
      useUsersStore.setState((state) => ({
        ...state,
        items: res.response.map((user) => ({
          ...user,
          profilePic: user.profilePic,
        })),
      }));
    }
  } catch (e) {
    console.log(e);
  } finally {
    useUsersStore.setState((state) => ({ ...state, loading: false }));
  }
}

export const restartState = () => {
  useUsersStore.setState(defaultState);
};
