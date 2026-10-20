import React, { useState } from 'react';
import { Plus, FolderTree, Edit2, CheckCircle2, ArrowRight } from 'lucide-react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { TRAVEL_CATEGORIES } from '../data/categories';
import { TravelCategory } from '../types';
import { Link } from '../router';

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<TravelCategory[]>(TRAVEL_CATEGORIES);
  const [editingCat, setEditingCat] = useState<TravelCategory | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');

  const handleEdit = (cat: TravelCategory) => {
    setEditingCat(cat);
    setName(cat.name);
    setTagline(cat.tagline);
    setDescription(cat.description);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;

    setCategories((prev) =>
      prev.map((c) =>
        c.id === editingCat.id
          ? { ...c, name, tagline, description }
          : c
      )
    );
    setNotice(`Updated category "${name}" in local prototype state.`);
    setEditingCat(null);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <AdminLayout
      title="Travel Themes & Categories"
      subtitle="Organize Indian travel experiences across 12 distinct style pillars"
    >
      <div className="space-y-6">
        {notice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-[#E8E5DE] rounded-xl p-5 flex flex-col justify-between shadow-2xs hover:border-stone-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] text-stone-400 uppercase tracking-widest">
                    #{cat.slug}
                  </span>
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-1 text-stone-500 hover:text-[#244C3A] rounded hover:bg-stone-100"
                    title="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#B85C38] font-medium mb-2">
                  {cat.tagline}
                </p>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-xs">
                <span className="text-stone-400">
                  {cat.featuredCount || 8}+ Indian spots
                </span>
                <Link
                  href={`/category/${cat.slug}`}
                  className="font-medium text-[#244C3A] hover:underline inline-flex items-center gap-1"
                >
                  <span>Preview Circuit</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingCat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-xl">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Edit Travel Theme
              </h3>
              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Theme Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                </div>
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E8E5DE]">
                  <button
                    type="button"
                    onClick={() => setEditingCat(null)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold rounded-lg uppercase tracking-wider"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
