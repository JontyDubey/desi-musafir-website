import React, { useState, useEffect } from 'react';
import { Compass, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useRouter } from '../router';
import { useAuth } from '../contexts/AuthContext';
import { EmailVerificationCard } from '../components/admin/EmailVerificationCard';

export function AdminLoginPage() {
  const { navigate } = useRouter();
  const { login, user, isAdmin } = useAuth();

  const [email, setEmail] = useState('dubeyjonty0@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in as admin with verified email, redirect to admin overview
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide your admin email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const loggedInUser = await login(email.trim(), password);
      // Ensure latest verification state from Firebase Auth
      await loggedInUser.reload();

      if (!loggedInUser.emailVerified) {
        // User logged in, but email is not verified.
        // Component will display the EmailVerificationCard automatically.
        setLoading(false);
        return;
      }

      // Check admin authorization
      if (loggedInUser.email !== 'dubeyjonty0@gmail.com' && !isAdmin) {
        setError('Access Denied: This account is not authorized as an administrator.');
        setLoading(false);
        return;
      }
      navigate('/admin');
    } catch (err: any) {
      console.error('Firebase login error:', err);
      let message = 'Failed to sign in. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password.';
      } else if (err.code === 'auth/user-not-found') {
        message = 'No administrator account found for this email in Firebase.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Access temporarily blocked due to many failed attempts. Try again later.';
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isSignedUpUnverified = Boolean(user && !user.emailVerified);

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 font-serif text-3xl font-bold text-[#202522]">
          <span className="w-10 h-10 rounded-full bg-[#244C3A] text-[#C5A46D] flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </span>
          <span>Desi Musafir</span>
        </Link>
        <span className="text-xs uppercase tracking-widest text-[#B85C38] block mt-2 font-semibold">
          Editorial & Content Administration
        </span>
        <h2 className="mt-4 text-xl font-bold text-stone-900">
          Admin Authentication
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {isSignedUpUnverified ? (
          <EmailVerificationCard
            onVerified={() => navigate('/admin')}
            showBackToHome={true}
          />
        ) : (
          <div className="bg-white py-8 px-6 sm:px-10 border border-[#E8E5DE] rounded-2xl shadow-sm space-y-6">
            {/* Security Policy Badge */}
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                <ShieldCheck className="w-4 h-4 text-[#244C3A] shrink-0" />
                <span>Admin-Only Security Enforced</span>
              </div>
              <p className="leading-relaxed text-stone-600">
                Public self-registration is permanently disabled. Only authorized administrators can authenticate and access platform controls.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dubeyjonty0@gmail.com"
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full pl-9 pr-10 py-2 text-sm bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#244C3A] hover:bg-[#1E3B2E] disabled:bg-stone-400 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Setup notice for the administrator */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 space-y-1">
            <span className="font-semibold block text-amber-800">
              Admin Account Setup Note:
            </span>
            <p className="leading-relaxed">
              If this is your first time logging in, create this user in Firebase Console: <strong>Authentication &rarr; Users &rarr; Add user</strong> with email <code>dubeyjonty0@gmail.com</code> and your chosen password.
            </p>
          </div>

          <div className="pt-2 border-t border-[#E8E5DE] text-center text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-900 underline">
              Return to Public Travel Magazine
            </Link>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
