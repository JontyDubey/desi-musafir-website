import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import { AdminLayout } from '../components/admin/AdminLayout';
import {
  getAllArticlesForAdmin,
  saveArticleToFirestore,
  deleteArticleFromFirestore
} from '../services/firestoreService';
import { TravelArticle } from '../types';
import { Link } from '../router';

export function AdminArticlesPage() {
  const [articles, setArticles] = useState<TravelArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteConfirmArticle, setDeleteConfirmArticle] = useState<TravelArticle | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getAllArticlesForAdmin();
      setArticles(data);
    } catch (err) {
      console.error('Failed to load articles from Firestore:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const filtered = articles.filter((a) => {
    const matchesSearch =
      search === '' ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.destination.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTogglePublish = async (art: TravelArticle) => {
    setProcessingId(art.id);
    const newStatus = art.status === 'published' ? 'draft' : 'published';
    try {
      await saveArticleToFirestore({ ...art, status: newStatus });
      setArticles((prev) =>
        prev.map((a) => (a.id === art.id ? { ...a, status: newStatus } : a))
      );
      setActionNotice(`Article "${art.title}" updated to ${newStatus} in Cloud Firestore.`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      setActionNotice(`Failed to update status: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmArticle) return;
    try {
      await deleteArticleFromFirestore(deleteConfirmArticle.id);
      setArticles((prev) => prev.filter((a) => a.id !== deleteConfirmArticle.id));
      setActionNotice(`Article "${deleteConfirmArticle.title}" deleted from Cloud Firestore.`);
      setDeleteConfirmArticle(null);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      setActionNotice(`Failed to delete: ${err.message}`);
    }
  };

  return (
    <AdminLayout
      title="Articles & Chronicles"
      subtitle="Manage, draft, and publish editorial travel stories stored in Cloud Firestore"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={loadArticles}
            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors cursor-pointer"
            title="Refresh articles from Firestore"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#244C3A]' : ''}`} />
          </button>
          <Link
            href="/admin/articles/new"
            className="px-4 py-2 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {actionNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-xl border border-[#E8E5DE] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or destination..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A] text-stone-800"
            >
              <option value="all">All Statuses ({articles.length})</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        {/* Table of Articles */}
        <div className="bg-white border border-[#E8E5DE] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-stone-600 border-b border-[#E8E5DE]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Title & Excerpt</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Destination</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Published</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DE]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-400">
                      Loading articles from Firestore...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-400">
                      No matching articles found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((art) => (
                    <tr key={art.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <Link
                          href={`/admin/articles/${art.id}/edit`}
                          className="font-medium text-stone-900 hover:text-[#244C3A] block truncate"
                        >
                          {art.title}
                        </Link>
                        <span className="text-[11px] text-stone-400 block truncate mt-0.5">
                          {art.excerpt}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                        {art.category}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                        {art.destination}, {art.state}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            art.status === 'published'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                        {art.publishedAt}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/blog/${art.slug}`}
                            className="p-1 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded"
                            title="Preview public story"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/articles/${art.id}/edit`}
                            className="p-1 text-stone-600 hover:text-[#244C3A] hover:bg-stone-100 rounded"
                            title="Edit article"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleTogglePublish(art)}
                            disabled={processingId === art.id}
                            className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium rounded transition-colors cursor-pointer"
                            title={art.status === 'published' ? 'Unpublish to draft' : 'Publish story'}
                          >
                            {processingId === art.id
                              ? '...'
                              : art.status === 'published'
                              ? 'Unpublish'
                              : 'Publish'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirmArticle(art)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                            title="Delete article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-stone-200 shadow-xl">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Delete Article?
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Are you sure you want to delete &ldquo;{deleteConfirmArticle.title}&rdquo;? This will permanently delete the document from Cloud Firestore.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmArticle(null)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-lg font-medium cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
