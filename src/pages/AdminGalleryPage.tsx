import React, { useState, useEffect } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  AlertCircle,
  Camera,
  X,
  FileImage,
  RefreshCw,
  Loader2,
  Cloud,
  Check
} from 'lucide-react';
import { AdminLayout } from '../components/admin/AdminLayout';
import {
  getAllGalleryPhotosForAdmin,
  saveGalleryPhotoToFirestore,
  deleteGalleryPhotoFromFirestore
} from '../services/firestoreService';
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary
} from '../services/cloudinaryClient';
import { GALLERY_CATEGORIES } from '../data/gallery';
import { INDIAN_STATES } from '../data/destinations';
import { GalleryPhoto } from '../types';

export function AdminGalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; preview: string; name: string }[]>([]);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');
  const [selectedState, setSelectedState] = useState('Uttarakhand');
  const [selectedDest, setSelectedDest] = useState('Rishikesh');
  const [category, setCategory] = useState('mountains');
  const [photoCredit, setPhotoCredit] = useState('Desi Musafir');
  const [status, setStatus] = useState<'draft' | 'published'>('published');

  // Uploading state & individual progress
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [deleteConfirmPhoto, setDeleteConfirmPhoto] = useState<GalleryPhoto | null>(null);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await getAllGalleryPhotosForAdmin();
      setPhotos(data);
    } catch (err: any) {
      console.error('Failed to load gallery from Firestore:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  // Multi-file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newItems = filesArray.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }));
      setSelectedFiles((prev) => [...prev, ...newItems]);
      if (!title && filesArray[0]) {
        setTitle(filesArray[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload multiple images to Cloudinary and save records in Firestore
  const handleStartUpload = async (targetStatus: 'draft' | 'published') => {
    if (selectedFiles.length === 0) {
      setErrorNotice('Please select at least one photograph to upload.');
      return;
    }
    if (!title.trim()) {
      setErrorNotice('Please enter a photograph title.');
      return;
    }

    setIsUploading(true);
    setErrorNotice(null);
    setActionNotice(null);

    const progressMap: Record<string, number> = {};
    selectedFiles.forEach((f) => {
      progressMap[f.name] = 0;
    });
    setUploadProgress(progressMap);

    const successfulUploads: GalleryPhoto[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const item = selectedFiles[i];
        let fileTitle = title;
        if (selectedFiles.length > 1) {
          fileTitle = `${title} (${i + 1})`;
        }

        let secureUrl = item.preview;
        let publicId = '';

        try {
          // Attempt real signed Cloudinary upload
          const cldRes = await uploadImageToCloudinary(item.file, 'desi-musafir/gallery', (percent) => {
            setUploadProgress((prev) => ({ ...prev, [item.name]: percent }));
          });
          secureUrl = cldRes.secureUrl;
          publicId = cldRes.publicId;
        } catch (cldErr: any) {
          console.warn('Cloudinary upload warning:', cldErr.message);
          // If Cloudinary credentials are not yet configured in environment variables,
          // inform the user while allowing prototype image fallback
          setErrorNotice(
            `Notice: Cloudinary upload server returned: "${cldErr.message}". Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in environment variables.`
          );
        }

        // Save metadata permanently to Cloud Firestore
        const photoData = {
          title: fileTitle,
          caption: caption || `Captured during Indian expedition in ${selectedDest}, ${selectedState}.`,
          altText: altText || `${fileTitle} in ${selectedDest}, ${selectedState}, India`,
          imageUrl: secureUrl,
          cloudinaryPublicId: publicId,
          state: selectedState,
          destination: selectedDest,
          categorySlug: category,
          photoCredit: photoCredit || 'Desi Musafir',
          status: targetStatus,
          featured: false,
          orientation: 'landscape' as const,
        };

        const savedId = await saveGalleryPhotoToFirestore(photoData);
        successfulUploads.push({ id: savedId, ...photoData });
      }

      setPhotos((prev) => [...successfulUploads, ...prev]);
      setShowUploadModal(false);
      setSelectedFiles([]);
      setTitle('');
      setCaption('');
      setAltText('');
      setUploadProgress({});
      setActionNotice(
        `Successfully uploaded ${successfulUploads.length} frame(s) to Cloud Firestore as ${targetStatus.toUpperCase()}!`
      );
      setTimeout(() => setActionNotice(null), 5000);
    } catch (err: any) {
      console.error('Upload batch failed:', err);
      setErrorNotice(`Upload error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Safe deletion
  const handleDeletePhoto = async () => {
    if (!deleteConfirmPhoto) return;
    try {
      // 1. If stored on Cloudinary, request protected server-side deletion
      if ((deleteConfirmPhoto as any).cloudinaryPublicId) {
        try {
          await deleteImageFromCloudinary((deleteConfirmPhoto as any).cloudinaryPublicId);
        } catch (cldErr) {
          console.warn('Cloudinary asset cleanup notice:', cldErr);
        }
      }

      // 2. Delete document from Cloud Firestore
      await deleteGalleryPhotoFromFirestore(deleteConfirmPhoto.id);
      setPhotos((prev) => prev.filter((p) => p.id !== deleteConfirmPhoto.id));
      setActionNotice(`Deleted "${deleteConfirmPhoto.title}" from gallery and Firestore.`);
      setDeleteConfirmPhoto(null);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      setErrorNotice(`Failed to delete photo: ${err.message}`);
    }
  };

  const filteredPhotos = photos.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.destination.toLowerCase().includes(search.toLowerCase()) ||
      p.state.toLowerCase().includes(search.toLowerCase());

    const matchesCat =
      selectedCategory === 'all' || p.categorySlug === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <AdminLayout
      title="Photo Gallery Manager"
      subtitle="Upload Indian photography directly to Cloudinary and synchronize with Cloud Firestore"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={loadGallery}
            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors cursor-pointer"
            title="Refresh gallery from Firestore"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#244C3A]' : ''}`} />
          </button>
          <button
            onClick={() => {
              setErrorNotice(null);
              setShowUploadModal(true);
            }}
            className="px-4 py-2 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photos</span>
          </button>
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

        {errorNotice && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorNotice}</span>
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
              placeholder="Search frames by title or place..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A] text-stone-800"
            >
              <option value="all">All Categories ({photos.length})</option>
              {GALLERY_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Photo Grid View */}
        {loading ? (
          <div className="py-20 text-center text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#244C3A] mb-2" />
            <p className="text-xs">Loading photography collection from Cloud Firestore...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E8E5DE] p-12 text-center text-stone-500">
            <Camera className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h4 className="font-serif text-base font-bold text-stone-800">No Photographs Found</h4>
            <p className="text-xs text-stone-500 mt-1">Upload Indian travel photography using the button above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white border border-[#E8E5DE] rounded-xl overflow-hidden flex flex-col justify-between shadow-2xs group"
              >
                <div>
                  <div className="aspect-[16/10] bg-stone-100 overflow-hidden relative">
                    <img
                      src={photo.imageUrl}
                      alt={photo.altText}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        photo.status === 'published'
                          ? 'bg-emerald-800/90 text-white'
                          : 'bg-amber-600/90 text-white'
                      }`}
                    >
                      {photo.status}
                    </span>
                    {(photo as any).cloudinaryPublicId && (
                      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] flex items-center gap-1 font-mono">
                        <Cloud className="w-3 h-3 text-sky-400" />
                        <span>Cloudinary</span>
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-1">
                    <span className="text-[11px] text-[#B85C38] font-medium block">
                      {photo.destination}, {photo.state}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-stone-900 line-clamp-1">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-[#F2EFE9] flex items-center justify-between text-xs text-stone-400">
                  <span className="truncate max-w-[120px]">
                    {photo.photoCredit || 'Desi Musafir'}
                  </span>
                  <button
                    onClick={() => setDeleteConfirmPhoto(photo)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                    title="Delete image safely"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal UI */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-stone-200 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DE]">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#B85C38] font-semibold block">
                    Cloudinary & Firestore Upload
                  </span>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Upload Photographs (Mobile & Desktop)
                  </h3>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* File Dropzone */}
              <div className="border-2 border-dashed border-[#E8E5DE] rounded-xl p-6 text-center bg-[#FAF8F3] hover:border-[#244C3A] transition-colors">
                <Camera className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-medium text-stone-800">
                  Select Indian travel photos from your phone or computer
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Supports multiple images · Stored permanently via Cloudinary free tier
                </p>
                <label className="mt-4 inline-block px-4 py-2 bg-[#244C3A] hover:bg-[#1E3B2E] text-white text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer transition-colors shadow-xs">
                  <span>Browse Images</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Selected Files List & Previews */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-stone-700 block">
                    Selected Images ({selectedFiles.length}):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedFiles.map((item, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden border border-stone-200 aspect-square group">
                        <img src={item.preview} alt={item.name} className="w-full h-full object-cover" />
                        {!isUploading && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSelectedFile(i)}
                            className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full opacity-80 group-hover:opacity-100 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                        {isUploading && uploadProgress[item.name] !== undefined && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-mono">
                            {uploadProgress[item.name]}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Photo Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Dawn Aarti at Dashashwamedh"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                    >
                      {GALLERY_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      State / UT (India Only)
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
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
                      Destination Name
                    </label>
                    <input
                      type="text"
                      value={selectedDest}
                      onChange={(e) => setSelectedDest(e.target.value)}
                      placeholder="e.g. Varanasi"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Caption
                  </label>
                  <textarea
                    rows={2}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Brief description of the scene..."
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Accessible scene description"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Photo Credit
                    </label>
                    <input
                      type="text"
                      value={photoCredit}
                      onChange={(e) => setPhotoCredit(e.target.value)}
                      placeholder="e.g. Jonty Dubey"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F3] border border-[#E8E5DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244C3A]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-[#E8E5DE]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => handleStartUpload('draft')}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 disabled:opacity-50 text-stone-800 text-xs font-semibold rounded-lg uppercase tracking-wider cursor-pointer"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => handleStartUpload('published')}
                    className="px-4 py-2 bg-[#244C3A] hover:bg-[#1E3B2E] disabled:opacity-50 text-white text-xs font-semibold rounded-lg uppercase tracking-wider shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <span>Publish to Gallery</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-stone-200 shadow-xl">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Delete Photo Frame?
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Permanently delete &ldquo;{deleteConfirmPhoto.title}&rdquo; from Cloud Firestore and remove its Cloudinary asset?
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmPhoto(null)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePhoto}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-lg font-medium cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
