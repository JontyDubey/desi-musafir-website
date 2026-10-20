import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { TravelArticle, GalleryPhoto, Destination, TravelCategory, BookingEnquiry } from '../types';
import { TRAVEL_ARTICLES } from '../data/articles';
import { GALLERY_PHOTOS } from '../data/gallery';
import { DESTINATIONS } from '../data/destinations';
import { TRAVEL_CATEGORIES } from '../data/categories';

// ================= ARTICLES =================
export async function getPublishedArticles(): Promise<TravelArticle[]> {
  try {
    const q = query(
      collection(db, 'articles'),
      where('status', '==', 'published')
    );
    const snap = await getDocs(q);
    const liveArticles: TravelArticle[] = [];
    snap.forEach((d) => {
      liveArticles.push({ id: d.id, ...d.data() } as TravelArticle);
    });

    if (liveArticles.length === 0) {
      // Fallback to initial verified sample data if database not seeded yet
      return TRAVEL_ARTICLES;
    }

    // Merge: live articles take precedence, fill with sample articles for items not yet in live DB
    const liveSlugs = new Set(liveArticles.map((a) => a.slug));
    const combined = [...liveArticles, ...TRAVEL_ARTICLES.filter((a) => !liveSlugs.has(a.slug))];
    return combined;
  } catch (err) {
    console.warn('Falling back to static articles due to fetch error:', err);
    return TRAVEL_ARTICLES;
  }
}

export async function getAllArticlesForAdmin(): Promise<TravelArticle[]> {
  const path = 'articles';
  try {
    const snap = await getDocs(collection(db, path));
    const liveArticles: TravelArticle[] = [];
    snap.forEach((d) => {
      liveArticles.push({ id: d.id, ...d.data() } as TravelArticle);
    });

    if (liveArticles.length === 0) {
      return TRAVEL_ARTICLES;
    }

    const liveSlugs = new Set(liveArticles.map((a) => a.slug));
    return [...liveArticles, ...TRAVEL_ARTICLES.filter((a) => !liveSlugs.has(a.slug))];
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return TRAVEL_ARTICLES;
  }
}

export async function getArticleBySlug(slug: string, isUserAdmin: boolean = false): Promise<TravelArticle | null> {
  try {
    const q = isUserAdmin
      ? query(collection(db, 'articles'), where('slug', '==', slug))
      : query(
          collection(db, 'articles'),
          where('slug', '==', slug),
          where('status', '==', 'published')
        );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...d.data() } as TravelArticle;
    }
  } catch (err) {
    console.warn('Could not query article from Firestore by slug:', err);
  }
  return TRAVEL_ARTICLES.find((a) => a.slug === slug) || null;
}

export async function saveArticleToFirestore(article: Partial<TravelArticle> & { id?: string }): Promise<string> {
  const path = 'articles';
  try {
    const articleId = article.id && !article.id.startsWith('art-')
      ? article.id
      : `art-${Date.now()}`;

    const docRef = doc(db, path, articleId);
    const payload = {
      title: article.title || 'Untitled Chronicle',
      slug: article.slug || `story-${Date.now()}`,
      subtitle: article.subtitle || '',
      excerpt: article.excerpt || '',
      coverImage: article.coverImage || '',
      coverImageAlt: article.coverImageAlt || article.title || '',
      category: article.category || 'General',
      categorySlug: article.categorySlug || 'general',
      destination: article.destination || 'India',
      destinationSlug: article.destinationSlug || 'india',
      state: article.state || 'India',
      stateSlug: article.stateSlug || 'india',
      country: 'India',
      readTime: article.readTime || '5 min read',
      status: article.status || 'draft',
      isFeatured: !!article.isFeatured,
      content: (article as any).content || '',
      sections: article.sections || [],
      tags: article.tags || ['India'],
      author: article.author || {
        name: auth.currentUser?.displayName || 'Desi Musafir Editor',
        role: 'Travel Storyteller',
      },
      authorUid: auth.currentUser?.uid || 'admin',
      seoTitle: article.seoTitle || `${article.title} | Desi Musafir`,
      seoDescription: article.seoDescription || article.excerpt || '',
      publishedAt: article.publishedAt || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      updatedAt: new Date().toISOString(),
      createdAt: (article as any).createdAt || new Date().toISOString(),
    };

    await setDoc(docRef, payload, { merge: true });
    return articleId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function deleteArticleFromFirestore(id: string): Promise<void> {
  const path = `articles/${id}`;
  try {
    await deleteDoc(doc(db, 'articles', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ================= GALLERY =================
export async function getPublishedGalleryPhotos(): Promise<GalleryPhoto[]> {
  try {
    const q = query(
      collection(db, 'gallery'),
      where('status', '==', 'published')
    );
    const snap = await getDocs(q);
    const livePhotos: GalleryPhoto[] = [];
    snap.forEach((d) => {
      livePhotos.push({ id: d.id, ...d.data() } as GalleryPhoto);
    });

    if (livePhotos.length === 0) {
      return GALLERY_PHOTOS;
    }

    const liveIds = new Set(livePhotos.map((p) => p.id));
    return [...livePhotos, ...GALLERY_PHOTOS.filter((p) => !liveIds.has(p.id))];
  } catch (err) {
    console.warn('Falling back to static gallery photos:', err);
    return GALLERY_PHOTOS;
  }
}

export async function getAllGalleryPhotosForAdmin(): Promise<GalleryPhoto[]> {
  const path = 'gallery';
  try {
    const snap = await getDocs(collection(db, path));
    const livePhotos: GalleryPhoto[] = [];
    snap.forEach((d) => {
      livePhotos.push({ id: d.id, ...d.data() } as GalleryPhoto);
    });

    if (livePhotos.length === 0) {
      return GALLERY_PHOTOS;
    }

    const liveIds = new Set(livePhotos.map((p) => p.id));
    return [...livePhotos, ...GALLERY_PHOTOS.filter((p) => !liveIds.has(p.id))];
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return GALLERY_PHOTOS;
  }
}

export async function saveGalleryPhotoToFirestore(photo: Partial<GalleryPhoto> & { id?: string; cloudinaryPublicId?: string }): Promise<string> {
  const path = 'gallery';
  try {
    const photoId = photo.id && !photo.id.startsWith('ph-local-')
      ? photo.id
      : `ph-${Date.now()}`;

    const docRef = doc(db, path, photoId);
    const payload = {
      title: photo.title || 'Incredible India Frame',
      caption: photo.caption || '',
      altText: photo.altText || photo.title || '',
      imageUrl: photo.imageUrl || '',
      cloudinaryPublicId: photo.cloudinaryPublicId || '',
      state: photo.state || 'India',
      destination: photo.destination || 'India',
      categorySlug: photo.categorySlug || 'all',
      photoCredit: photo.photoCredit || 'Desi Musafir',
      status: photo.status || 'published',
      featured: !!photo.featured,
      orientation: photo.orientation || 'landscape',
      uploaderUid: auth.currentUser?.uid || 'admin',
      updatedAt: new Date().toISOString(),
      createdAt: (photo as any).createdAt || new Date().toISOString(),
    };

    await setDoc(docRef, payload, { merge: true });
    return photoId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function deleteGalleryPhotoFromFirestore(id: string): Promise<void> {
  const path = `gallery/${id}`;
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ================= DESTINATIONS =================
export async function getLiveDestinations(): Promise<Destination[]> {
  try {
    const snap = await getDocs(collection(db, 'destinations'));
    const live: Destination[] = [];
    snap.forEach((d) => {
      live.push({ id: d.id, ...d.data() } as Destination);
    });

    if (live.length === 0) {
      return DESTINATIONS;
    }

    const liveSlugs = new Set(live.map((d) => d.slug));
    return [...live, ...DESTINATIONS.filter((d) => !liveSlugs.has(d.slug))];
  } catch (err) {
    console.warn('Falling back to static destinations:', err);
    return DESTINATIONS;
  }
}

export async function saveDestinationToFirestore(dest: Partial<Destination> & { id?: string }): Promise<string> {
  const path = 'destinations';
  try {
    const destId = dest.id && !dest.id.startsWith('dest-local-')
      ? dest.id
      : `dest-${Date.now()}`;

    const docRef = doc(db, path, destId);
    const payload = {
      title: dest.title,
      slug: dest.slug,
      state: dest.state,
      stateSlug: dest.stateSlug || dest.state?.toLowerCase().replace(/\s+/g, '-'),
      country: 'India',
      categorySlugs: dest.categorySlugs || ['mountains-and-hill-stations'],
      heroImage: dest.heroImage,
      heroImageAlt: dest.heroImageAlt || `${dest.title}, ${dest.state}, India`,
      excerpt: dest.excerpt || '',
      description: dest.description || '',
      duration: dest.duration || '3 to 4 Days',
      budgetRange: dest.budgetRange || '₹4,000 – ₹10,000',
      isFeatured: !!dest.isFeatured,
      bestTimeToVisit: dest.bestTimeToVisit || { idealMonths: 'October – April', peakSeason: 'October to March' },
      howToReach: dest.howToReach || { byAir: 'Nearest airport', byTrain: 'Nearest junction', byRoad: 'National highway' },
      localTransport: dest.localTransport || 'Taxis and autos',
      attractions: dest.attractions || [],
      itinerary: dest.itinerary || [],
      practicalTips: dest.practicalTips || [],
      updatedAt: new Date().toISOString(),
      createdAt: (dest as any).createdAt || new Date().toISOString(),
    };

    await setDoc(docRef, payload, { merge: true });
    return destId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function deleteDestinationFromFirestore(id: string): Promise<void> {
  const path = `destinations/${id}`;
  try {
    await deleteDoc(doc(db, 'destinations', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ================= BOOKING ENQUIRIES =================
export async function submitEnquiryToFirestore(enquiry: BookingEnquiry): Promise<string> {
  const path = 'enquiries';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...enquiry,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    console.error('Error submitting enquiry to Firestore:', err);
    throw err;
  }
}

// ================= NEWSLETTER =================
export async function submitNewsletterToFirestore(email: string): Promise<string> {
  const path = 'newsletter';
  try {
    const docRef = await addDoc(collection(db, path), {
      email,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    console.error('Error saving newsletter subscriber:', err);
    throw err;
  }
}
