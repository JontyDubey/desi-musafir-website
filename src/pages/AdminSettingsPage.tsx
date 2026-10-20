import React, { useState } from 'react';
import { Save, CheckCircle2, Shield, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { CONTACT_CONFIG } from '../config/contact';
import { SITE_CONFIG } from '../config/site';

export function AdminSettingsPage() {
  const [brandName, setBrandName] = useState(CONTACT_CONFIG.brandName);
  const [tagline, setTagline] = useState(CONTACT_CONFIG.tagline);
  const [phone, setPhone] = useState(CONTACT_CONFIG.phone);
  const [email, setEmail] = useState(CONTACT_CONFIG.email);
  const [insta1, setInsta1] = useState(CONTACT_CONFIG.social.instagramProfile1.url);
  const [insta2, setInsta2] = useState(CONTACT_CONFIG.social.instagramProfile2.url);
  const [fb, setFb] = useState(CONTACT_CONFIG.social.facebook.url);
  const [seoTitle, setSeoTitle] = useState('Desi Musafir — Discover India, One Journey at a Time');
  const [seoDesc, setSeoDesc] = useState(SITE_CONFIG.description);
  const [galleryColumns, setGalleryColumns] = useState('3');
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('Settings saved successfully in local prototype memory.');
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <AdminLayout
      title="Platform Settings"
      subtitle="Configure brand metadata, official contact routes, and SEO headers"
      actions={
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {notice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Brand Details */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E5DE] space-y-4">
          <h3 className="font-serif text-base font-bold text-stone-900 pb-2 border-b border-[#E8E5DE]">
            Brand Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Official Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
              />
            </div>
          </div>
        </div>

        {/* Contact Configuration */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E5DE] space-y-4">
          <h3 className="font-serif text-base font-bold text-stone-900 pb-2 border-b border-[#E8E5DE]">
            Official Channels (Section 15 Specification)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Phone & WhatsApp Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Instagram Profile 1 (Founder: Jonty Dubey)
              </label>
              <input
                type="text"
                value={insta1}
                onChange={(e) => setInsta1(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Instagram Profile 2 (Official: Desi Musafir India)
              </label>
              <input
                type="text"
                value={insta2}
                onChange={(e) => setInsta2(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Facebook Official Link
              </label>
              <input
                type="text"
                value={fb}
                onChange={(e) => setFb(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
              />
            </div>
          </div>
        </div>

        {/* Global SEO Settings */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E5DE] space-y-4">
          <h3 className="font-serif text-base font-bold text-stone-900 pb-2 border-b border-[#E8E5DE]">
            Search Engine Optimization (Frontend Defaults)
          </h3>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Global Default Meta Title
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Global Meta Description
            </label>
            <textarea
              rows={2}
              value={seoDesc}
              onChange={(e) => setSeoDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
            />
          </div>
        </div>

        {/* Cloud Infrastructure & Production Deployment Guide */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E5DE] space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8E5DE]">
            <Shield className="w-5 h-5 text-[#244C3A]" />
            <h3 className="font-serif text-base font-bold text-stone-900">
              Cloud Setup & Production Credentials Guide
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Firebase Console */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
              <span className="inline-block px-2 py-0.5 bg-[#244C3A] text-white text-[10px] font-semibold uppercase rounded tracking-wider">
                1. Firebase Console
              </span>
              <h4 className="text-xs font-bold text-stone-900">Spark Plan Auth & Firestore</h4>
              <ul className="text-[11px] text-stone-600 space-y-1.5 list-disc pl-3.5 leading-relaxed">
                <li>
                  <strong>Project ID:</strong> <code className="text-[10px] bg-stone-200 px-1 py-0.5 rounded">desi-musafir</code>
                </li>
                <li>
                  Go to <strong>Authentication &rarr; Sign-in method</strong>, enable <strong>Email/Password</strong>.
                </li>
                <li>
                  Go to <strong>Authentication &rarr; Users &rarr; Add user</strong>. Enter <code className="text-[10px] bg-stone-200 px-1 py-0.5 rounded">dubeyjonty0@gmail.com</code> and choose an admin password.
                </li>
                <li>
                  Public registration is disabled. Security rules enforce admin-only edits.
                </li>
              </ul>
            </div>

            {/* 2. Cloudinary */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
              <span className="inline-block px-2 py-0.5 bg-[#B85C38] text-white text-[10px] font-semibold uppercase rounded tracking-wider">
                2. Cloudinary Free Plan
              </span>
              <h4 className="text-xs font-bold text-stone-900">Permanent Image Storage</h4>
              <ul className="text-[11px] text-stone-600 space-y-1.5 list-disc pl-3.5 leading-relaxed">
                <li>
                  Sign up at <strong>cloudinary.com</strong> (Free tier offers 25 credits/month, permanent storage).
                </li>
                <li>
                  Copy your <strong>Cloud Name</strong>, <strong>API Key</strong>, and <strong>API Secret</strong> from the Dashboard.
                </li>
                <li>
                  Uploads are cryptographically signed on the server via <code className="text-[10px] bg-stone-200 px-1 py-0.5 rounded">/api/cloudinary/sign</code>.
                </li>
                <li>
                  Secret key is never exposed to the client.
                </li>
              </ul>
            </div>

            {/* 3. Vercel */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
              <span className="inline-block px-2 py-0.5 bg-stone-800 text-white text-[10px] font-semibold uppercase rounded tracking-wider">
                3. Vercel Hosting
              </span>
              <h4 className="text-xs font-bold text-stone-900">Environment Variables</h4>
              <ul className="text-[11px] text-stone-600 space-y-1.5 list-disc pl-3.5 leading-relaxed">
                <li>
                  In Vercel project, go to <strong>Settings &rarr; Environment Variables</strong>:
                </li>
                <li><code className="text-[10px] bg-stone-200 px-1 py-0.5 rounded">CLOUDINARY_CLOUD_NAME</code></li>
                <li><code className="text-[10px] bg-stone-200 px-1 py-0.5 rounded">CLOUDINARY_API_KEY</code></li>
                <li><code className="text-[10px] bg-stone-200 px-1 py-0.5 rounded">CLOUDINARY_API_SECRET</code></li>
                <li><code className="text-[10px] bg-stone-200 px-1 py-0.5 rounded">FIREBASE_PROJECT_ID</code></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-xs cursor-pointer"
          >
            Save All Preferences
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
