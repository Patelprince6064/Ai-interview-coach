import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BrainCircuit, LayoutDashboard, BarChart3, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-lg">
          <BrainCircuit className="w-5 h-5 text-accent" />
          InterviewAI
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {user && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-surface text-accent' : 'text-text2 hover:text-text hover:bg-surface'}`}>
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </NavLink>
              <NavLink to="/analytics" className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-surface text-accent' : 'text-text2 hover:text-text hover:bg-surface'}`}>
                <BarChart3 className="w-4 h-4" /> Analytics
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2 text-sm text-text2">
                <User className="w-4 h-4" />
                <span>{user.name}</span>
              </div>
              <Link to="/roles" className="btn-primary text-sm px-4 py-2 rounded-lg font-semibold">
                Practice →
              </Link>
              <button onClick={handleLogout} className="btn-ghost p-2 rounded-lg" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm px-4 py-2">Log in</Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2 rounded-lg font-semibold">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
