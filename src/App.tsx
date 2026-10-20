import React from 'react';
import { RouterProvider, useRouter, matchRoute, normalizePath } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { DestinationsPage } from './pages/DestinationsPage';
import { StatePage } from './pages/StatePage';
import { DestinationPage } from './pages/DestinationPage';
import { BlogPage } from './pages/BlogPage';
import { ArticlePage } from './pages/ArticlePage';
import { CategoryPage } from './pages/CategoryPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminArticlesPage } from './pages/AdminArticlesPage';
import { AdminArticleEditorPage } from './pages/AdminArticleEditorPage';
import { AdminGalleryPage } from './pages/AdminGalleryPage';
import { AdminDestinationsPage } from './pages/AdminDestinationsPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

function AppRoutes() {
  const { path } = useRouter();
  const cleanPath = normalizePath(path);
  const lowerPath = cleanPath.toLowerCase();

  // 1. Exact Match Routes
  if (lowerPath === '/' || lowerPath === '') {
    return <HomePage />;
  }
  if (lowerPath === '/destinations') {
    return <DestinationsPage />;
  }
  if (lowerPath === '/blog') {
    return <BlogPage />;
  }
  if (lowerPath === '/gallery') {
    return <GalleryPage />;
  }
  if (lowerPath === '/about') {
    return <AboutPage />;
  }
  if (lowerPath === '/contact') {
    return <ContactPage />;
  }

  // 2. Admin Routes
  if (lowerPath === '/admin') {
    return <AdminDashboardPage />;
  }
  if (lowerPath === '/admin/login') {
    return <AdminLoginPage />;
  }
  if (lowerPath === '/admin/articles') {
    return <AdminArticlesPage />;
  }
  if (lowerPath === '/admin/articles/new') {
    return <AdminArticleEditorPage isNew={true} />;
  }
  if (lowerPath === '/admin/gallery') {
    return <AdminGalleryPage />;
  }
  if (lowerPath === '/admin/destinations') {
    return <AdminDestinationsPage />;
  }
  if (lowerPath === '/admin/categories') {
    return <AdminCategoriesPage />;
  }
  if (lowerPath === '/admin/settings') {
    return <AdminSettingsPage />;
  }

  // Dynamic admin edit route: /admin/articles/:id/edit
  const adminEditMatch = matchRoute('/admin/articles/:id/edit', cleanPath);
  if (adminEditMatch.match) {
    return <AdminArticleEditorPage id={adminEditMatch.params.id} isNew={false} />;
  }

  // 3. Dynamic Public Routes
  // Destination by state: /destinations/:stateSlug
  const stateMatch = matchRoute('/destinations/:stateSlug', cleanPath);
  if (stateMatch.match) {
    return <StatePage stateSlug={stateMatch.params.stateSlug} />;
  }

  // Individual Destination: /places/:slug
  const placeMatch = matchRoute('/places/:slug', cleanPath);
  if (placeMatch.match) {
    return <DestinationPage slug={placeMatch.params.slug} />;
  }

  // Blog Article: /blog/:slug
  const articleMatch = matchRoute('/blog/:slug', cleanPath);
  if (articleMatch.match) {
    return <ArticlePage slug={articleMatch.params.slug} />;
  }

  // Category: /category/:slug
  const categoryMatch = matchRoute('/category/:slug', cleanPath);
  if (categoryMatch.match) {
    return <CategoryPage slug={categoryMatch.params.slug} />;
  }

  // 4. Fallback 404
  return <NotFoundPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppRoutes />
      </RouterProvider>
    </AuthProvider>
  );
}
