import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { reconnect } from "../stores/auth";

const Home = lazy(() => import("../pages/Home"));
const Profile = lazy(() => import("../pages/Profile"));
const Error = lazy(() => import("../pages/Error"));
const Explore = lazy(() => import("../pages/Explore"));

function AppRouter() {
  useEffect(() => {
    const last_session = localStorage.getItem("last_session");

    if (last_session) {
      reconnect(JSON.parse(last_session));
    }
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div></div>}>
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/explore" element={<Explore />} />
          <Route path="/u/:id" element={<Profile />} />
          <Route path="/*" element={<Error />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
