import { Navigate, Route, Routes, Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CycleTracker from './pages/CycleTracker.jsx';
import Screening from './pages/Screening.jsx';
import Specialists from './pages/Specialists.jsx';
import Bookings from './pages/Bookings.jsx';
import HerSignalBrand from './pages/HerSignalBrand.jsx';
import MaternalJourney from './pages/MaternalJourney.jsx';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="auth-page">
        <p className="greeting-date">Loading workspace…</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/welcome" replace />;
  return children;
}

function NavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`nav-link${active ? ' active' : ''}`}>
      {children}
    </Link>
  );
}

function Topbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-brand">HerSignal</div>
        <nav className="nav-links">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/tracker">Tracker</NavLink>
          <NavLink to="/maternal">Maternal Journey</NavLink>
          <NavLink to="/screening">Screening</NavLink>
          <NavLink to="/specialists">Specialists</NavLink>
          <NavLink to="/bookings">My Consults</NavLink>
        </nav>
        <div className="nav-actions">
          <button className="nav-logout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Topbar />
      <main className="app-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Public Welcome/Brand Landing Page before login */}
          <Route 
            path="/welcome" 
            element={user ? <Navigate to="/" replace /> : <HerSignalBrand />} 
          />

          {/* Root route directs to Dashboard if logged in, or Welcome page if logged out */}
          <Route 
            path="/" 
            element={
              user ? (
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } 
          />

          <Route
            path="/tracker"
            element={
              <PrivateRoute>
                <CycleTracker />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/maternal"
            element={
              <PrivateRoute>
                <MaternalJourney />
              </PrivateRoute>
            }
          />

          <Route
            path="/screening"
            element={
              <PrivateRoute>
                <Screening />
              </PrivateRoute>
            }
          />
          <Route
            path="/specialists"
            element={
              <PrivateRoute>
                <Specialists />
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <Bookings />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}