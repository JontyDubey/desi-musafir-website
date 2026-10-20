import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Edit2, Trash2, CheckCircle2, Star, RefreshCw } from 'lucide-react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { DESTINATIONS, INDIAN_STATES } from '../data/destinations';
import { TRAVEL_CATEGORIES } from '../data/categories';
import { Destination } from '../types';
import {
  getLiveDestinations,
  saveDestinationToFirestore,
  deleteDestinationFromFirestore
} from '../services/firestoreService';
import { Link } from '../router';

export function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>(DESTINATIONS);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getLiveDestinations();
      setDestinations(data);
    } catch (err) {
      console.warn('Using static destinations fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Form State
  const [title, setTitle] = useState('');
  const [stateName, setStateName] = useState('Uttarakhand');
  const [duration, setDuration] = useState('3 to 4 Days');
  const [budgetRange, setBudgetRange] = useState('₹4,000 – ₹10,000');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80');
  const [excerpt, setExcerpt] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const filtered = destinations.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.state.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingDest(null);
    setTitle('');
    setStateName('Uttarakhand');
    setDuration('3 to 4 Days');
    setBudgetRange('₹4,000 – ₹10,000');
    setHeroImage('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80');
    setExcerpt('');
    setIsFeatured(false);
    setShowAddModal(true);
  };

  const handleOpenEdit = (dest: Destination) => {
    setEditingDest(dest);
    setTitle(dest.title);
    setStateName(dest.state);
    setDuration(dest.duration);
    setBudgetRange(dest.budgetRange);
    setHeroImage(dest.heroImage);
    setExcerpt(dest.excerpt);
    setIsFeatured(!!dest.isFeatured);
    setShowAddModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingDest) {
      const updated: Destination = {
        ...editingDest,
        title,
        state: stateName,
        duration,
        budgetRange,
        heroImage,
        excerpt,
        isFeatured,
      };

      setDestinations((prev) =>
        prev.map((d) => (d.id === editingDest.id ? updated : d))
      );
      setNotice(`Updated "${title}" successfully.`);
      try {
        await saveDestinationToFirestore(updated);
      } catch (err) {
        console.warn('Destination update queued locally:', err);
      }
    } else {
      const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      const newDest: Destination = {
        id: `dest-${Date.now()}`,
        title,
        slug,
        state: stateName,
        stateSlug: stateName.toLowerCase().replace(/\s+/g, '-'),
        country: 'India',
        categorySlugs: ['mountains-and-hill-stations'],
        heroImage,
        heroImageAlt: `${title}, ${stateName}, India`,
        excerpt: excerpt || `Experience the sights and serenity of ${title}, ${stateName}.`,
        description: `${title} is a renowned destination in ${stateName}, India celebrated for its scenic beauty, local warmth, and cultural roots.`,
        bestTimeToVisit: {
          peakSeason: 'October to March',
          idealMonths: 'October – April',
        },
        howToReach: {
          byAir: 'Nearest regional or metro airport connected by taxi.',
          byTrain: 'Nearest major Indian railway junction.',
          byRoad: 'Accessible by national and state highway network.',
        },
        localTransport: 'Autos, local taxis, and walking.',
        duration,
        budgetRange,
        attractions: [
          { name: `${title} Main Market`, description: 'Local cultural and shopping hub.' }
        ],
        itinerary: [
          { day: 1, title: 'Arrival & Sightseeing', activities: ['Check-in', 'Explore town center'] }
        ],
        practicalTips: ['Book transit in advance during festive periods.'],
        isFeatured,
      };
      setDestinations([newDest, ...destinations]);
      setNotice(`Saved "${title}" to destinations.`);
      try {
        await saveDestinationToFirestore(newDest);
      } catch (err) {
        console.warn('Destination creation saved locally:', err);
      }
    }

    setShowAddModal(false);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
    setNotice(`Removed destination "${name}".`);
    try {
      await deleteDestinationFromFirestore(id);
    } catch (err) {
      console.warn('Destination deletion saved locally:', err);
    }
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <AdminLayout
      title="Indian Destinations Management"
      subtitle="Curate Indian destinations, state associations, and itineraries"
      actions={
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Destination</span>
        </button>
      }
    >
      <div className="space-y-6">
        {notice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-[#E8E5DE] flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Indian destinations..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
            />
          </div>
          <span className="text-xs text-stone-400 hidden sm:inline">
            Total: {destinations.length} places
          </span>
        </div>

        {/* Table / Grid */}
        <div className="bg-white border border-[#E8E5DE] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-stone-600 border-b border-[#E8E5DE]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Destination</th>
                  <th className="py-3 px-4 font-semibold">State / UT</th>
                  <th className="py-3 px-4 font-semibold">Duration</th>
                  <th className="py-3 px-4 font-semibold">Budget Range</th>
                  <th className="py-3 px-4 font-semibold">Featured</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DE]">
                {filtered.map((dest) => (
                  <tr key={dest.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                          <img src={dest.heroImage} alt={dest.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <Link href={`/places/${dest.slug}`} className="font-bold text-stone-900 hover:text-[#244C3A]">
                            {dest.title}
                          </Link>
                          <span className="text-[11px] text-stone-400 block truncate max-w-xs">
                            {dest.excerpt}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-700 whitespace-nowrap">
                      {dest.state}
                    </td>
                    <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                      {dest.duration}
                    </td>
                    <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                      {dest.budgetRange}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {dest.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-500" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(dest)}
                          className="p-1 text-stone-600 hover:text-[#244C3A] hover:bg-stone-100 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dest.id, dest.title)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-stone-200 shadow-xl">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {editingDest ? `Edit ${editingDest.title}` : 'Add Indian Destination'}
              </h3>

              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Kedarnath"
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      State / UT
                    </label>
                    <select
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 3 to 4 Days"
                      className="w-full px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Estimated Budget Range (Sample)
                  </label>
                  <input
                    type="text"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    placeholder="₹4,000 – ₹10,000"
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Hero Photo URL (India Only)
                  </label>
                  <input
                    type="text"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Short Excerpt
                  </label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief highlight description..."
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="feat"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-stone-300 text-[#244C3A] focus:ring-[#244C3A]"
                  />
                  <label htmlFor="feat" className="text-xs text-stone-700 font-medium">
                    Feature on Homepage
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E8E5DE]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-xs"
                  >
                    Save Destination
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
