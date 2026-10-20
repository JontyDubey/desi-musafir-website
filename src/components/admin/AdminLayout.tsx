import React, { useState } from 'react';
import {
  Compass,
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  MapPin,
  FolderTree,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { Link, useRouter } from '../../router';
import { useAuth } from '../../contexts/AuthContext';
import { EmailVerificationCard } from './EmailVerificationCard';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const { path, navigate } = useRouter();
  const { user, isAdmin, loading, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Articles', href: '/admin/articles', icon: <FileText className="w-4 h-4" /> },
    { label: 'Photo Gallery', href: '/admin/gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { label: 'Destinations', href: '/admin/destinations', icon: <MapPin className="w-4 h-4" /> },
    { label: 'Categories', href: '/admin/categories', icon: <FolderTree className="w-4 h-4" /> },
    { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // If loading authentication state, show clean loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#244C3A] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-medium text-stone-600">Verifying administrator authorization...</p>
        </div>
      </div>
    );
  }

  // Security Gate: User must be authenticated and authorized as admin
  if (!user || !isAdmin) {
    if (user && !user.emailVerified) {
      return (
        <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center p-4">
          <EmailVerificationCard showBackToHome={true} />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#E8E5DE] rounded-2xl p-8 text-center space-y-5 shadow-lg">
          <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B85C38] block mb-1">
              Restricted Area
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Administrator Access Required
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            You must be signed in with an authorized Desi Musafir administrator account to view or modify platform content.
          </p>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/admin/login"
              className="w-full py-2.5 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors inline-block"
            >
              Sign In with Admin Credentials
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors inline-block"
            >
              Back to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-stone-900 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#202522] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-stone-800">
        <Link href="/admin" className="flex items-center gap-2 font-serif font-bold text-lg">
          <Compass className="w-5 h-5 text-[#C5A46D]" />
          <span>Desi Musafir Admin</span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 text-stone-300 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-[#202522] text-[#FAF8F3] flex flex-col justify-between p-5 border-r border-[#313834] z-50 transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Branding */}
          <div className="pb-6 border-b border-stone-800">
            <Link href="/" className="flex items-center gap-2.5 font-serif font-bold text-xl text-white">
              <span className="w-8 h-8 rounded-full bg-[#C5A46D] text-[#202522] flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </span>
              <span>Desi Musafir</span>
            </Link>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#C5A46D] mt-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Verified · Live Firestore</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="mt-6 space-y-1">
            {navLinks.map((link) => {
              const isActive =
                path === link.href || (link.href !== '/admin' && path.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#244C3A] text-white font-semibold'
                      : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-[#C5A46D]' : 'text-stone-400'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Authenticated User & Actions */}
        <div className="pt-4 border-t border-stone-800 space-y-3">
          <div className="p-3 bg-stone-800/80 rounded-xl text-[11px] text-stone-300 space-y-1">
            <span className="text-stone-400 block truncate">Active Session:</span>
            <span className="font-semibold text-white block truncate">{user.email}</span>
            <span className="text-[10px] text-emerald-400 font-mono">Role: Authorized Administrator</span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-white transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-stone-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Strip */}
        <header className="bg-white border-b border-[#E8E5DE] px-6 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>

            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 sm:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
