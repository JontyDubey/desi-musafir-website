import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, Link } from '../../router';

interface EmailVerificationCardProps {
  onVerified?: () => void;
  showBackToHome?: boolean;
}

export function EmailVerificationCard({ onVerified, showBackToHome = true }: EmailVerificationCardProps) {
  const { user, isAdmin, sendVerificationEmail, reloadUser, logout } = useAuth();
  const { navigate } = useRouter();

  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendEmail = async () => {
    if (cooldown > 0 || isSending) return;
    setIsSending(true);
    setFeedbackError(null);
    setFeedbackSuccess(null);

    try {
      await sendVerificationEmail();
      setFeedbackSuccess(
        `Verification email successfully sent to ${user?.email}. Please check your inbox and spam folder, click the link, and then return here to check status.`
      );
      setCooldown(60);
    } catch (err: any) {
      console.error('Failed to dispatch verification email:', err);
      if (err.code === 'auth/too-many-requests') {
        setFeedbackError('Too many verification requests sent recently. Please wait a few minutes before trying again.');
      } else {
        setFeedbackError(err.message || 'Failed to send verification email. Please verify your internet connection.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleCheckStatus = async () => {
    if (isChecking) return;
    setIsChecking(true);
    setFeedbackError(null);
    setFeedbackSuccess(null);

    try {
      const { user: refreshedUser, isAdmin: refreshedAdmin } = await reloadUser();
      if (refreshedUser?.emailVerified) {
        if (refreshedAdmin) {
          setFeedbackSuccess('Email verified successfully! Administrator privileges unlocked.');
          if (onVerified) {
            onVerified();
          } else {
            setTimeout(() => {
              navigate('/admin');
            }, 800);
          }
        } else {
          setFeedbackError('Email verified, but this account is not registered as an authorized administrator.');
        }
      } else {
        setFeedbackError('Your email is still marked as unverified. Make sure you opened the link sent by Firebase, then click "Check Verification Status" again.');
      }
    } catch (err: any) {
      console.error('Error refreshing verification status:', err);
      setFeedbackError('Unable to refresh verification status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 max-w-md w-full mx-auto">
      {/* Header Badge */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto border border-amber-200/60">
          <Mail className="w-7 h-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Email Verification Required</span>
        </div>
        <h3 className="font-serif text-xl font-bold text-stone-900">
          Verify Administrator Account
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed font-light">
          Administrator privileges for <strong className="font-semibold text-stone-900">{user?.email || 'this account'}</strong> require confirmed email ownership before content controls are unlocked.
        </p>
      </div>

      {/* Account Status Card */}
      <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-stone-500 font-medium">Account:</span>
          <span className="font-mono font-semibold text-stone-900">{user?.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-stone-500 font-medium">Email Status:</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
            Unverified
          </span>
        </div>
      </div>

      {/* Feedback Messages */}
      {feedbackSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{feedbackSuccess}</span>
        </div>
      )}

      {feedbackError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{feedbackError}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleSendEmail}
          disabled={isSending || cooldown > 0}
          className="w-full py-2.5 px-4 bg-[#244C3A] hover:bg-[#1E3B2E] disabled:bg-stone-300 disabled:text-stone-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSending ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Sending Verification Email...</span>
            </>
          ) : cooldown > 0 ? (
            <>
              <Mail className="w-4 h-4" />
              <span>Resend in {cooldown}s</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Verification Email</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleCheckStatus}
          disabled={isChecking}
          className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors border border-stone-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Checking Status...' : 'I Have Verified My Email / Check Status'}</span>
        </button>
      </div>

      {/* Instructions & Secondary Actions */}
      <div className="pt-2 border-t border-[#E8E5DE] space-y-2 text-center text-xs">
        <div className="text-[11px] text-stone-500 leading-relaxed">
          Tip: Once you click the link in your email, click <strong>Check Status</strong> above to activate administrator access immediately.
        </div>

        <div className="pt-2 flex items-center justify-center gap-4 text-stone-600">
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 hover:text-stone-900 underline text-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign in as another user</span>
          </button>

          {showBackToHome && (
            <>
              <span className="text-stone-300">•</span>
              <Link href="/" className="hover:text-stone-900 underline text-xs">
                Back to Website
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
