import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import FormField from '../components/FormField.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const submit = async e => {
    e.preventDefault();
    const found = {};
    if (!username.trim()) found.username = 'Enter your username.';
    if (!password) found.password = 'Enter your password.';
    setErrors(found);
    setServerError('');
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      const u = await login(username.trim(), password);
      toast(`Welcome back, ${u.name.split(' ')[0]}.`);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <section className="view">
      <div className="login-wrap">
        <div className="panel-card login-card">
          <p className="hero-eyebrow">Staff Member Access</p>
          <h2 className="login-title">Sign in to Wisdom Archives</h2>
          <form onSubmit={submit} noValidate>
            <FormField id="loginUsername" label="Username" error={errors.username}>
              <input id="loginUsername" type="text" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} />
            </FormField>
            <FormField id="loginPassword" label="Password" error={errors.password}>
              <input id="loginPassword" type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </FormField>
            {serverError && <p className="form-error">{serverError}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
