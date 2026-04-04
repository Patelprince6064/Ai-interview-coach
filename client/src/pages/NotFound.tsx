import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4 pt-16">
      <p className="font-display text-8xl font-extrabold text-surface2">404</p>
      <div>
        <h1 className="font-display text-2xl font-bold">Page not found</h1>
        <p className="text-text2 mt-2 text-sm">The page you're looking for doesn't exist or has been moved.</p>
      </div>
      <Link to="/" className="btn-primary rounded-xl flex items-center gap-2 px-6 py-3">
        <Home className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );
}
