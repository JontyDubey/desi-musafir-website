export type ArticleStatus = 'draft' | 'published';
export type GalleryPhotoStatus = 'draft' | 'published';

export interface DestinationAttraction {
  name: string;
  description: string;
  image?: string;
  tag?: string;
}

export interface DestinationItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface Destination {
  id: string;
  title: string;
  slug: string;
  state: string;
  stateSlug: string;
  country: "India";
  categorySlugs: string[];
  heroImage: string;
  heroImageAlt: string;
  excerpt: string;
  description: string;
  bestTimeToVisit: {
    peakSeason: string;
    shoulderSeason?: string;
    monsoonNote?: string;
    idealMonths: string;
  };
  howToReach: {
    byAir: string;
    byTrain: string;
    byRoad: string;
  };
  localTransport: string;
  duration: string;
  budgetRange: string;
  attractions: DestinationAttraction[];
  itinerary: DestinationItineraryDay[];
  practicalTips: string[];
  isFeatured?: boolean;
}

export interface ArticleSection {
  id: string;
  heading: string;
  level: 2 | 3;
  body: string[];
  quote?: {
    text: string;
    author?: string;
  };
  image?: {
    url: string;
    caption: string;
    alt: string;
  };
}

export interface TravelArticle {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  category: string;
  categorySlug: string;
  destination: string;
  destinationSlug: string;
  state: string;
  stateSlug: string;
  country: "India";
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  readTime: string;
  publishedAt: string;
  updatedAt?: string;
  status: ArticleStatus;
  sections: ArticleSection[];
  tags: string[];
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  altText: string;
  imageUrl: string;
  state: string;
  destination: string;
  categorySlug: string;
  photoCredit?: string;
  status: GalleryPhotoStatus;
  featured?: boolean;
  orientation?: 'landscape' | 'portrait' | 'square';
}

export interface TravelCategory {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  featuredCount?: number;
}

export interface BookingEnquiry {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  destination: string;
  travelDate: string;
  travellersCount: number | string;
  duration: string;
  budgetRange: string;
  message?: string;
  createdAt?: string;
}

export interface StateRegion {
  name: string;
  slug: string;
  zone: 'North' | 'South' | 'West' | 'East' | 'Central' | 'Northeast';
  heroImage: string;
  description: string;
  capital: string;
  destinationsCount?: number;
}
