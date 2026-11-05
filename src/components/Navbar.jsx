import { Link, NavLink, useNavigate } from 'react-router-dom';
import { isStaff, useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const LINKS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/books', label: 'Manage Books', access: 'staff' },
  { to: '/transactions', label: 'Transactions', access: 'loggedin' },
  { to: '/users', label: 'Members', access: 'staff' }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const visible = link => {
    if (link.access === 'staff') return isStaff(user);
    if (link.access === 'loggedin') return !!user;
    return true;
  };

  const handleLogout = () => {
    logout();
    toast('Logged out. Browsing as guest.');
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <span className="brand-mark">WA</span>
          <span className="brand-name">Wisdom Archives</span>
        </Link>

        <nav className="nav-links">
          {LINKS.filter(visible).map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-access">
          {!user ? (
            <>
              <span className="guest-pill">Browsing as guest</span>
              <button className="btn-login" onClick={() => navigate('/login')}>Log In</button>
            </>
          ) : (
            <div className="account-chip">
              <Link to="/account" className="who" title="View my account">
                <b>{user.name}</b>
                <span className="role-badge">{user.role}</span>
              </Link>
              <button className="btn-logout" onClick={handleLogout}>Log Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
