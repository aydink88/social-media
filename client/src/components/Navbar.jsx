import { logout, useAuthStore } from '../stores/auth';
import { NavLink } from 'react-router-dom';
import Auth from './Auth';
import SmallLogo from '../assets/images/small_logo.png';
import WithOverlay from './WithOverlay';

export default function Navbar({ toggleNewPostModal, toggleSettingsModal }) {
  const auth = useAuthStore();

  return (
    <div className="navbar-cs bg-light d-flex flex-column justify-content-between">
      <div className="d-flex flex-row flex-md-column">
        <Auth>
          <WithOverlay tooltip="Profile">
            <NavLink to={'/u/' + auth.username} className="navbar-cs__button" aria-label="Profile">
              <img
                src={auth.profilePic}
                style={{ width: '35px', height: '35px' }}
                className="img-fluid d-block mx-auto rounded-circle"
              />
            </NavLink>
          </WithOverlay>
          <WithOverlay tooltip="Settings">
            <div className="navbar-cs__button" onClick={toggleSettingsModal} aria-label="Settings">
              <p className="text-center my-0">
                <i className="fas fa-cog fa-2x"></i>
              </p>
            </div>
          </WithOverlay>
          <WithOverlay tooltip="Submit a post">
            <div
              className="navbar-cs__button"
              onClick={toggleNewPostModal}
              aria-label="Submit a post"
            >
              <p className="text-center my-0">
                <i className="fas fa-plus-circle fa-2x"></i>
              </p>
            </div>
          </WithOverlay>
        </Auth>
        <WithOverlay tooltip="Explore">
          <NavLink
            to={'/explore'}
            className={({ isActive }) => (isActive ? 'bg-brand text-white' : 'navbar-cs__button')}
            aria-label="Explore"
          >
            <p className="text-center my-0">
              <i className="fas fa-compass fa-2x"></i>
            </p>
          </NavLink>
        </WithOverlay>
        <WithOverlay tooltip="Source code">
          <a
            href="https://www.github.com/fliotta/reactsocial"
            className="navbar-cs__button"
            target="_blank"
            aria-label="Source code"
            rel="noreferrer"
          >
            <p className="text-center my-0">
              <i className="fab fa-github fa-2x"></i>
            </p>
          </a>
        </WithOverlay>

        <Auth>
          <WithOverlay tooltip="Logout">
            <div className="navbar-cs__button" onClick={logout} aria-label="Logout">
              <p className="text-center my-0">
                <i className="fas fa-sign-out-alt fa-2x"></i>
              </p>
            </div>
          </WithOverlay>
        </Auth>
        <Auth whenLogged={false}>
          <WithOverlay tooltip="Login">
            <NavLink to="/" className="navbar-cs__button" onClick={logout} aria-label="Login">
              <p className="text-center my-0">
                <i className="fas fa-sign-in-alt fa-2x"></i>
              </p>
            </NavLink>
          </WithOverlay>
        </Auth>
      </div>
      <div className="d-none d-md-block">
        <img src={SmallLogo} className="d-block mx-auto img-fluid" />
      </div>
    </div>
  );
}
