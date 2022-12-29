import { useState, useEffect } from 'react';
import AuthForm from '../components/AuthForm';
import Logo from '../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { signIn, signUp, useAuthStore } from '../stores/auth';

const initialState = {
  signMode: 'menu',
  phrases: [
    {
      extra: "William Shakespeare - All's Well That Ends Well",
      quote: 'What is a friend?\nA single soul dwelling in two bodies.',
    },
    {
      extra: 'Aristotle',
      quote: 'Love all, trust a few, do wrong to none.',
    },
    {
      extra: 'Marcus Aurelius - Meditations',
      quote: 'The soul becomes dyed\nwith the colour of its thoughts.',
    },
    {
      extra: 'Marcus Aurelius - Meditations',
      quote: 'The happiness of your life depends\nupon the quality of your thoughts.',
    },
    {
      extra: 'Marcus Aurelius - Meditations',
      quote: 'The best revenge is to be\nunlike him who performed the injury',
    },
  ],
  selectedPhrase: {},
};

export default function Home() {
  const { isLogged, username } = useAuthStore();
  const [signMode, setSignMode] = useState(initialState.signMode);
  const [phrases] = useState(initialState.phrases);
  const [selectedPhrase, setSelectedPhrase] = useState(initialState.selectedPhrase);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogged) {
      navigate(`/u/${username}`);
    }
    const randomNumber = Math.floor(Math.random() * phrases.length);
    setSelectedPhrase(phrases[randomNumber]);
  }, [isLogged]);

  const setLoginMode = () => {
    setSignMode('login');
  };
  const setMenuMode = () => {
    setSignMode('menu');
  };
  const setSignupMode = () => {
    setSignMode('signup');
  };

  const getAuthComponent = () => {
    switch (signMode) {
      case 'signup':
        return <AuthForm type="signup" backMethod={setMenuMode} onSuccess={signUp} />;
      case 'login':
        return (
          <AuthForm type="login" backMethod={setMenuMode} onSuccess={(creds) => signIn(creds)} />
        );
    }
  };

  return (
    <div className="home">
      <div className="row h-100">
        <div className="col-8 d-none d-md-flex flex-column justify-content-end pl-5 home__left">
          <h1 className="display-7 text-light home__left__text">{selectedPhrase.quote}</h1>
          {!!selectedPhrase.extra && (
            <p className="text-light lead home__left__tex">{selectedPhrase.extra}</p>
          )}
        </div>
        <div className="col-12 col-md-4 bg-white home__right d-flex flex-column justify-content-center">
          <div className="row">
            <div className="col-6 px-4">
              <img src={Logo} className="mx-auto d-block img-fluid" />
            </div>
          </div>
          <div className="row pr-md-3">
            <div className="col-12 px-4">
              <div className="card border-0 rounded-0">
                <div className="card-body">
                  {signMode == 'menu' && (
                    <div>
                      <button
                        className="btn btn-outline-brand btn-block rounded-pill m-1"
                        onClick={setSignupMode}
                      >
                        Sign Up
                      </button>
                      <button
                        className="btn btn-brand btn-block text-light rounded-pill m-1"
                        onClick={setLoginMode}
                      >
                        Log In
                      </button>
                      <hr />
                      <Link
                        to="/explore"
                        className="btn btn-brand-secondary btn-block text-white rounded-pill"
                      >
                        I&apos;d like to explore first 🧭
                      </Link>
                    </div>
                  )}
                  {signMode != 'menu' && <>{getAuthComponent()}</>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
