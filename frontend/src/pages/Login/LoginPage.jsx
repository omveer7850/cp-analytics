import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const AUTH_PROVIDERS = {
  google: { label: 'Google', icon: <GoogleIcon /> },
  github: { label: 'GitHub', icon: <GithubIcon /> },
};

export default function LoginPage() {
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);

  
  const authMethods = {
    google: signInWithGoogle,
    github: signInWithGithub,
  };

  const handleSignIn = async (provider) => {
    setError('');
    setBusy(provider);
    try {
      await authMethods[provider]();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(`${AUTH_PROVIDERS[provider].label} sign-in failed. Please try again.`);
      setBusy(null);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__brand">
          <div className="login-card__brand-icon">{'</>'}</div>
          <span className="login-card__brand-name">CP Tracker</span>
        </div>

        <h1 className="login-card__title">Welcome back</h1>
        <p className="login-card__subtitle">Sign in to sync your progress</p>

        {error && <div className="login-card__error">{error}</div>}

        {Object.entries(AUTH_PROVIDERS).map(([id, { label, icon }]) => (
          <button
            key={id}
            type="button"
            className={`login-btn login-btn--${id}`}
            onClick={() => handleSignIn(id)}
            disabled={!!busy}
          >
            {icon}
            {busy === id ? 'Signing in…' : `Continue with ${label}`}
          </button>
        ))}

        <p className="login-card__footnote">
          Your DSA progress stays tied to your account.
        </p>
      </div>
    </div>
  );
}


function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11A11.99 11.99 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.26A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.26 5.39l4.01-3.11z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.26 6.61l4.01 3.11C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.42.36.78 1.08.78 2.18 0 1.57-.02 2.84-.02 3.23 0 .3.22.66.8.55A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5z" />
    </svg>
  );
}