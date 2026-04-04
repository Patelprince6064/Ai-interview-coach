import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const { register, googleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleGoogle = async (credential: string) => {
    setError('');
    try {
      await googleLogin(credential);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
            <BrainCircuit className="w-6 h-6 text-accent" />
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Create your account</h1>
          <p className="text-text2 mt-2 text-sm">Start practicing interviews for free</p>
        </div>

        <div className="card p-8 space-y-5">
          {error && (
            <div className="bg-accent3/10 border border-accent3/30 text-accent3 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          {/* Google Sign-Up */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(res) => res.credential && handleGoogle(res.credential)}
              onError={() => setError('Google sign-in failed. Please try again.')}
              theme="filled_black"
              shape="rectangular"
              size="large"
              text="signup_with"
              width="368"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text3 font-medium">or sign up with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text2 mb-1.5">Full Name</label>
              <input type="text" required className="input" placeholder="Jane Doe"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text2 mb-1.5">Email</label>
              <input type="email" required className="input" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text2 mb-1.5">Password</label>
              <input type="password" required className="input" placeholder="Min 6 characters"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full rounded-xl py-3 flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin-slow" />Creating account…</> : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-text2 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
