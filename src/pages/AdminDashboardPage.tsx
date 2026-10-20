import React, { useState, useEffect } from 'react';
import {
  FileText,
  Image as ImageIcon,
  MapPin,
  FolderTree,
  Plus,
  Eye,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Database,
  ShieldCheck
} from 'lucide-react';
import { AdminLayout } from '../components/admin/AdminLayout';
import {
  getAllArticlesForAdmin,
  getAllGalleryPhotosForAdmin,
  getLiveDestinations
} from '../services/firestoreService';
import { TRAVEL_CATEGORIES } from '../data/categories';
import { TravelArticle, GalleryPhoto, Destination } from '../types';
import { Link } from '../router';

export function AdminDashboardPage() {
  const [articles, setArticles] = useState<TravelArticle[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [arts, gals, dests] = await Promise.all([
        getAllArticlesForAdmin(),
        getAllGalleryPhotosForAdmin(),
        getLiveDestinations(),
      ]);
      setArticles(arts);
      setGallery(gals);
      setDestinations(dests);
    } catch (err) {
      console.error('Error fetching admin overview metrics:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalArticles = articles.length;
  const publishedArticles = articles.filter((a) => a.status === 'published').length;
  const draftArticles = articles.filter((a) => a.status === 'draft').length;
  const galleryCount = gallery.length;
  const destinationsCount = destinations.length;

  return (
    <AdminLayout
      title="Platform Overview"
      subtitle="Live Cloud Firestore operational metrics & content management"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isRefreshing}
            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors cursor-pointer"
            title="Refresh live Firestore data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#244C3A]' : ''}`} />
          </button>
          <Link
            href="/admin/articles/new"
            className="px-4 py-2 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Story</span>
          </Link>
          <Link
            href="/admin/gallery"
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Photo</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Firestore Connection Badge */}
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-3">
          <Database className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block text-emerald-950 flex items-center gap-1.5">
              <span>Cloud Firestore Active (Firebase Spark Plan)</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </span>
            <p className="leading-relaxed text-emerald-800">
              The platform is bound to real Cloud Firestore database instances. All metrics below are read directly from Firestore collections and retain persistence across refreshes.
            </p>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 bg-white border border-[#E8E5DE] rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-medium">Total Articles</span>
              <FileText className="w-4 h-4 text-[#244C3A]" />
            </div>
            <div className="font-serif text-3xl font-bold text-stone-900 tabular-nums">
              {loading ? '...' : totalArticles}
            </div>
            <div className="text-[11px] text-stone-400">
              <span className="text-emerald-700 font-medium">{publishedArticles} published</span> · {draftArticles} drafts
            </div>
          </div>

          <div className="p-6 bg-white border border-[#E8E5DE] rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-medium">Gallery Photos</span>
              <ImageIcon className="w-4 h-4 text-[#B85C38]" />
            </div>
            <div className="font-serif text-3xl font-bold text-stone-900 tabular-nums">
              {loading ? '...' : galleryCount}
            </div>
            <div className="text-[11px] text-stone-400">
              Permanent Cloudinary storage ready
            </div>
          </div>

          <div className="p-6 bg-white border border-[#E8E5DE] rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-medium">Curated Destinations</span>
              <MapPin className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="font-serif text-3xl font-bold text-stone-900 tabular-nums">
              {loading ? '...' : destinationsCount}
            </div>
            <div className="text-[11px] text-stone-400">
              100% Indian States & Places
            </div>
          </div>

          <div className="p-6 bg-white border border-[#E8E5DE] rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-medium">Travel Categories</span>
              <FolderTree className="w-4 h-4 text-[#C5A46D]" />
            </div>
            <div className="font-serif text-3xl font-bold text-stone-900 tabular-nums">
              {TRAVEL_CATEGORIES.length}
            </div>
            <div className="text-[11px] text-stone-400">
              Curated travel themes
            </div>
          </div>
        </div>

        {/* Recent Articles Table & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Articles List (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-[#E8E5DE] rounded-xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DE]">
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Recent Travel Chronicles (Firestore)
              </h2>
              <Link
                href="/admin/articles"
                className="text-xs font-semibold text-[#244C3A] hover:underline"
              >
                View All Articles &rarr;
              </Link>
            </div>

            <div className="divide-y divide-[#E8E5DE]">
              {articles.slice(0, 5).map((art) => (
                <div key={art.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-stone-900 truncate">
                        {art.title}
                      </h4>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold shrink-0 ${
                          art.status === 'published'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {art.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                      <span className="text-[#B85C38]">{art.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{art.destination}</span>
                      <span aria-hidden="true">·</span>
                      <span>{art.publishedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/blog/${art.slug}`}
                      className="p-1.5 text-stone-400 hover:text-stone-800 rounded-md hover:bg-stone-100"
                      title="View on site"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/articles/${art.id}/edit`}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-md transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-[#E8E5DE] rounded-xl p-6 space-y-4 shadow-2xs">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Quick Editorial Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href="/admin/articles/new"
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FAF8F3] hover:bg-stone-100 border border-[#E8E5DE] text-xs font-medium text-stone-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#244C3A]" />
                    <span>Create New Travel Story</span>
                  </span>
                  <Plus className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/admin/gallery"
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FAF8F3] hover:bg-stone-100 border border-[#E8E5DE] text-xs font-medium text-stone-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#B85C38]" />
                    <span>Upload to Indian Gallery</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/admin/destinations"
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FAF8F3] hover:bg-stone-100 border border-[#E8E5DE] text-xs font-medium text-stone-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Manage Indian Destinations</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/admin/settings"
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FAF8F3] hover:bg-stone-100 border border-[#E8E5DE] text-xs font-medium text-stone-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-stone-500" />
                    <span>Configure Brand & Social Links</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Public Quick Link */}
            <div className="p-4 bg-[#244C3A] text-white rounded-xl space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#E0C99E] font-semibold block">
                Public Live View
              </span>
              <p className="text-xs text-stone-200">
                View changes as readers see them on the frontend.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white underline pt-1"
              >
                <span>Open Desi Musafir Homepage</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
