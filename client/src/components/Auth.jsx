import { useAuthStore } from "../stores/auth";

function Auth({ whenLogged = true, children }) {
  const isLogged = useAuthStore((state) => state.isLogged);

  const shouldDisplay = whenLogged == isLogged;

  return <>{shouldDisplay && children}</>;
}

export default Auth;
