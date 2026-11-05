import { Link, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BookManagement from './pages/BookManagement.jsx';
import Transactions from './pages/Transactions.jsx';
import UserManagement from './pages/UserManagement.jsx';
import Account from './pages/Account.jsx';
import Login from './pages/Login.jsx';

function NotFound() {
  return (
    <section className="view">
      <div className="panel-card">
        <h2 className="login-title">Page not found</h2>
        <p><Link to="/">Back to the dashboard</Link></p>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main id="app">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/books" element={<ProtectedRoute staffOnly><BookManagement /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute staffOnly><UserManagement /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>Enjoy your stay here at Wisdom Archives an abundant abyss of intellect and a safe space·</p>
      </footer>
    </>
  );
}
