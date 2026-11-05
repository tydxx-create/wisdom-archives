import { Navigate, useLocation } from 'react-router-dom';
import { isStaff, useAuth } from '../context/AuthContext.jsx';

// <ProtectedRoute>            -> any logged-in user
// <ProtectedRoute staffOnly>  -> admin or librarian
export default function ProtectedRoute({ staffOnly = false, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="state-msg">Loading…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (staffOnly && !isStaff(user)) {
    return (
      <section className="view">
        <div className="panel-card">
          <h2 className="login-title">Staff access only</h2>
          <p>Your account doesn't have permission to open this page.</p>
        </div>
      </section>
    );
  }
  return children;
}
