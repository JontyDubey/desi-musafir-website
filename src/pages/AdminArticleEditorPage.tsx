import React, { useState, useEffect } from 'react';
import {
  Save,
  Send,
  Eye,
  ArrowLeft,
  Heading,
  Bold,
  Italic,
  List,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Upload,
  Loader2
} from 'lucide-react';
import { AdminLayout } from '../components/admin/AdminLayout';
import {
  getAllArticlesForAdmin,
  saveArticleToFirestore
} from '../services/firestoreService';
import { uploadImageToCloudinary } from '../services/cloudinaryClient';
import { TRAVEL_CATEGORIES } from '../data/categories';
import { INDIAN_STATES } from '../data/destinations';
import { Link, useRouter } from '../router';

interface AdminArticleEditorPageProps {
  id?: string;
  isNew?: boolean;
}

export function AdminArticleEditorPage({ id, isNew = false }: AdminArticleEditorPageProps) {
  const { navigate } = useRouter();

  const [loadingInitial, setLoadingInitial] = useState(!isNew && !!id);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverUploadProgress, setCoverUploadProgress] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80');
  const [coverImageAlt, setCoverImageAlt] = useState('');
  const [category, setCategory] = useState('spiritual-journeys');
  const [state, setState] = useState('uttarakhand');
  const [destination, setDestination] = useState('Rishikesh');
  const [authorName, setAuthorName] = useState('Jonty Dubey');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [content, setContent] = useState('');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Load article data if editing
  useEffect(() => {
    if (!isNew && id) {
      getAllArticlesForAdmin().then((all) => {
        const found = all.find((a) => a.id === id);
        if (found) {
          setTitle(found.title);
          setSlug(found.slug);
          setSubtitle(found.subtitle || '');
          setExcerpt(found.excerpt);
          setCoverImage(found.coverImage);
          setCoverImageAlt(found.coverImageAlt);
          setCategory(found.categorySlug);
          setState(found.stateSlug);
          setDestination(found.destination);
          setAuthorName(found.author.name);
          setStatus(found.status);
          setSeoTitle(found.seoTitle || '');
          setSeoDescription(found.seoDescription || '');

          const bodyContent = (found as any).content ||
            (found.sections
              ? found.sections.map((s) => `## ${s.heading}\n\n${s.body.join('\n\n')}${s.quote ? `\n\n> "${s.quote.text}" — ${s.quote.author || ''}` : ''}`).join('\n\n')
              : '');
          setContent(bodyContent);
        }
        setLoadingInitial(false);
      });
    } else {
      setContent(`## Journey Across the Riverbanks\n\nBefore dawn breaks over the northern plains, the sacred river flows in deep silence.\n\n> "India is more than a destination; it is an awakening of the senses." — Musafir Notes\n\nWalk slowly through the bazaar lanes, where cardamom tea warms the early morning mist.`);
    }
  }, [id, isNew]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew || !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
      );
    }
  };

  const insertSyntax = (prefix: string, suffix = '') => {
    setContent((prev) => `${prev}\n\n${prefix}Text${suffix}`);
  };

  // Upload cover image to Cloudinary
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingCover(true);
    setCoverUploadProgress(0);
    setErrorNotice(null);

    try {
      const res = await uploadImageToCloudinary(file, 'desi-musafir/articles', (percent) => {
        setCoverUploadProgress(percent);
      });
      setCoverImage(res.secureUrl);
      if (!coverImageAlt) setCoverImageAlt(title || file.name);
      setSavedNotice('Cover image uploaded to Cloudinary successfully!');
      setTimeout(() => setSavedNotice(null), 3000);
    } catch (err: any) {
      setErrorNotice(`Cloudinary upload note: ${err.message}. (You can also paste an image URL directly).`);
    } finally {
      setUploadingCover(false);
      setCoverUploadProgress(null);
    }
  };

  // Save to Firestore
  const handleSave = async (targetStatus: 'draft' | 'published') => {
    if (!title.trim()) {
      setErrorNotice('Please provide an article title before saving.');
      return;
    }
    setSaving(true);
    setErrorNotice(null);

    try {
      const matchedCategory = TRAVEL_CATEGORIES.find((c) => c.slug === category);
      const matchedState = INDIAN_STATES.find((s) => s.slug === state);

      // Parse markdown sections for compatibility with public renderer
      const rawSections = content.split(/\n(?=## )/);
      const parsedSections = rawSections.map((sec, idx) => {
        const lines = sec.trim().split('\n');
        const headingLine = lines[0].startsWith('## ') ? lines[0].replace('## ', '') : `Section ${idx + 1}`;
        const bodyLines = lines.slice(1).filter((l) => !l.startsWith('> ') && l.trim().length > 0);
        const quoteLine = lines.find((l) => l.startsWith('> '));
        const quoteText = quoteLine ? quoteLine.replace(/^> "?/, '').replace(/"? —.*$/, '') : undefined;
        const quoteAuthor = quoteLine && quoteLine.includes('—') ? quoteLine.split('—')[1].trim() : undefined;

        return {
          id: `sec-${idx + 1}`,
          heading: headingLine,
          level: 2 as const,
          body: bodyLines.length > 0 ? bodyLines : ['A journey through the soul of India.'],
          quote: quoteText ? { text: quoteText, author: quoteAuthor } : undefined,
        };
      });

      const articlePayload = {
        id: id || `art-${Date.now()}`,
        title,
        slug: slug || `chronicle-${Date.now()}`,
        subtitle,
        excerpt: excerpt || title,
        coverImage,
        coverImageAlt: coverImageAlt || title,
        category: matchedCategory?.name || 'General',
        categorySlug: category,
        destination,
        destinationSlug: destination.toLowerCase().replace(/\s+/g, '-'),
        state: matchedState?.name || 'India',
        stateSlug: state,
        country: 'India' as const,
        readTime: `${Math.max(3, Math.ceil(content.split(/\s+/).length / 200))} min read`,
        status: targetStatus,
        content,
        sections: parsedSections,
        tags: [destination, matchedState?.name || 'India', matchedCategory?.name || 'Travel'],
        author: {
          name: authorName,
          role: 'Travel Storyteller',
        },
        seoTitle: seoTitle || `${title} | Desi Musafir`,
        seoDescription: seoDescription || excerpt,
        publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      };

      const savedId = await saveArticleToFirestore(articlePayload);
      setStatus(targetStatus);
      setSavedNotice(`Article saved to Cloud Firestore as ${targetStatus.toUpperCase()}!`);
      setTimeout(() => setSavedNotice(null), 4000);

      if (isNew) {
        navigate(`/admin/articles/${savedId}/edit`);
      }
    } catch (err: any) {
      console.error('Save to Firestore error:', err);
      setErrorNotice(`Failed to save to Firestore: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loadingInitial) {
    return (
      <AdminLayout title="Loading Article...">
        <div className="py-20 text-center text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#244C3A] mb-2" />
          <p className="text-xs">Fetching article from Cloud Firestore...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isNew ? 'Create Travel Chronicle' : `Edit: ${title || 'Article'}`}
      subtitle="Craft editorial narratives with headings, quotes, and photography stored in Cloud Firestore"
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/articles"
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Articles</span>
          </Link>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 disabled:opacity-50 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="px-4 py-2 bg-[#244C3A] hover:bg-[#1E3B2E] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Publish to Firestore'}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {savedNotice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{savedNotice}</span>
          </div>
        )}

        {errorNotice && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Editing Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title & Slug */}
            <div className="bg-white p-6 rounded-xl border border-[#E8E5DE] space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. The Silent Bells of Varanasi: A Dawn Chronicle"
                  className="w-full px-4 py-2.5 text-base font-serif font-bold bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="silent-bells-of-varanasi"
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Cover Image URL or Cloudinary Upload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                    />
                    <label className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium cursor-pointer shrink-0 flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {uploadingCover && coverUploadProgress !== null && (
                    <div className="mt-1 text-[11px] text-[#244C3A] font-mono">
                      Uploading to Cloudinary: {coverUploadProgress}%
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Subtitle / Deck
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Supporting editorial subheadline..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Short Excerpt for Article Cards
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="2-line excerpt summarizing the journey..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                />
              </div>
            </div>

            {/* Rich Editor Toolbar & Textarea */}
            <div className="bg-white rounded-xl border border-[#E8E5DE] overflow-hidden shadow-xs">
              <div className="bg-[#FAF8F3] px-4 py-2 border-b border-[#E8E5DE] flex items-center flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => insertSyntax('## ')}
                  className="p-1.5 hover:bg-stone-200 text-stone-700 rounded text-xs flex items-center gap-1 font-semibold"
                  title="Heading 2"
                >
                  <Heading className="w-3.5 h-3.5" />
                  <span>H2</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertSyntax('### ')}
                  className="p-1.5 hover:bg-stone-200 text-stone-700 rounded text-xs flex items-center gap-1 font-semibold"
                  title="Heading 3"
                >
                  <Heading className="w-3 h-3" />
                  <span>H3</span>
                </button>
                <span className="w-px h-4 bg-stone-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertSyntax('**', '**')}
                  className="p-1.5 hover:bg-stone-200 text-stone-700 rounded"
                  title="Bold text"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertSyntax('*', '*')}
                  className="p-1.5 hover:bg-stone-200 text-stone-700 rounded"
                  title="Italic text"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <span className="w-px h-4 bg-stone-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertSyntax('- ')}
                  className="p-1.5 hover:bg-stone-200 text-stone-700 rounded"
                  title="Bullet List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertSyntax('> "')}
                  className="p-1.5 hover:bg-stone-200 text-stone-700 rounded"
                  title="Quote callout"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertSyntax('[Link Text](', ')')}
                  className="p-1.5 hover:bg-stone-200 text-stone-700 rounded"
                  title="Link"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertSyntax('![Caption](', ')')}
                  className="p-1.5 hover:bg-stone-200 text-stone-700 rounded"
                  title="Insert Indian Photo"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4">
                <textarea
                  rows={15}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-sm font-sans leading-relaxed text-stone-800 bg-transparent focus:outline-none resize-y"
                  placeholder="Write your story using markdown sections, headings, quotes, and descriptions..."
                />
              </div>
            </div>

            {/* SEO Metadata Card */}
            <div className="bg-white p-6 rounded-xl border border-[#E8E5DE] space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block">
                Technical SEO Configuration
              </span>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="The Silent Bells of Varanasi | Desi Musafir"
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Search snippet description under 160 characters..."
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Settings Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Classification Card */}
            <div className="bg-white p-6 rounded-xl border border-[#E8E5DE] space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-900 pb-2 border-b border-[#E8E5DE]">
                Classification
              </h3>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                >
                  {TRAVEL_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  State / UT (India Only)
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Destination Name
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Rishikesh"
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                >
                  <option value="draft">Draft (Private in Firestore)</option>
                  <option value="published">Published (Live to public)</option>
                </select>
              </div>
            </div>

            {/* Live Cover Preview */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E5DE] space-y-2">
              <span className="text-xs font-semibold text-stone-600 block">
                Cover Photo Preview
              </span>
              <div className="aspect-[16/10] rounded-lg overflow-hidden bg-stone-100">
                <img
                  src={coverImage}
                  alt={coverImageAlt || 'Cover preview'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
