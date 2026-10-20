import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  MapPin,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Facebook,
  MessageSquare,
  BookOpen,
  Compass
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SearchModal } from '../components/common/SearchModal';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { ArticleCard } from '../components/blog/ArticleCard';
import { TRAVEL_ARTICLES } from '../data/articles';
import { TravelArticle } from '../types';
import { getArticleBySlug } from '../services/firestoreService';
import { Link } from '../router';

interface ArticlePageProps {
  slug: string;
}

export function ArticlePage({ slug }: ArticlePageProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [article, setArticle] = useState<TravelArticle>(
    () => TRAVEL_ARTICLES.find((a) => a.slug === slug) || TRAVEL_ARTICLES[0]
  );

  useEffect(() => {
    let mounted = true;
    getArticleBySlug(slug).then((live) => {
      if (mounted && live) {
        setArticle(live);
      }
    });
    return () => { mounted = false; };
  }, [slug]);

  const related = TRAVEL_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://desimusafir.in/blog/${article.slug}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${article.title} — Desi Musafir: ${currentUrl}`)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3]">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-[#E8E5DE] py-3">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-stone-900 transition-colors">Travel Stories</Link>
            <span aria-hidden="true">/</span>
            <span className="text-stone-900 font-medium truncate max-w-xs">{article.title}</span>
          </div>
        </div>

        {/* Article Header & Typography */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#244C3A] hover:underline mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Stories</span>
          </Link>

          {/* Zero-Pill Metadata Header */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
            <span className="text-[#B85C38] font-semibold">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {article.destination}, {article.state}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {article.readTime}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#202522] leading-tight mb-4 text-balance">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-base sm:text-xl text-stone-600 font-light leading-relaxed mb-8">
              {article.subtitle}
            </p>
          )}

          {/* Author Attribution & Social Share Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-[#E8E5DE] mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#244C3A] text-white flex items-center justify-center font-serif font-bold text-sm">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-semibold text-stone-900 block">
                  {article.author.name}
                </span>
                <span className="text-[11px] text-stone-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  Published {article.publishedAt}
                </span>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-medium mr-1">Share:</span>
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on WhatsApp"
                className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Facebook"
                className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <button
                onClick={handleCopyLink}
                title="Copy Article Link"
                className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors relative"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              {copied && (
                <span className="text-xs text-emerald-700 font-medium animate-in fade-in">
                  Link copied!
                </span>
              )}
            </div>
          </div>

          {/* Large Editorial Cover Image */}
          <div className="mb-10 rounded-2xl overflow-hidden border border-[#E8E5DE] shadow-xs">
            <ImageWithFallback
              src={article.coverImage}
              alt={article.coverImageAlt}
              aspectRatioClass="aspect-[16/10]"
              className="w-full object-cover"
            />
            {article.coverImageAlt && (
              <p className="p-3 bg-[#FAF8F3] text-xs text-stone-500 italic text-center border-t border-[#E8E5DE]">
                {article.coverImageAlt}
              </p>
            )}
          </div>

          {/* Table of Contents */}
          {article.sections.length > 1 && (
            <div className="p-5 bg-white border border-[#E8E5DE] rounded-xl mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B85C38] block mb-2">
                In This Chronicle
              </span>
              <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700">
                {article.sections.map((sec, idx) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className="hover:text-[#244C3A] hover:underline"
                    >
                      {idx + 1}. {sec.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rich Article Prose Sections */}
          <div className="space-y-10 text-stone-800 leading-relaxed font-light">
            {article.sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#202522] pt-4">
                  {sec.heading}
                </h2>

                {sec.body.map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-base sm:text-lg leading-relaxed text-stone-700">
                    {paragraph}
                  </p>
                ))}

                {/* Blockquote */}
                {sec.quote && (
                  <blockquote className="my-6 p-6 bg-white border border-stone-200 rounded-xl shadow-2xs">
                    <p className="font-serif italic text-lg sm:text-xl text-stone-800 mb-2 leading-relaxed">
                      &ldquo;{sec.quote.text}&rdquo;
                    </p>
                    {sec.quote.author && (
                      <cite className="text-xs font-semibold uppercase tracking-wider text-[#B85C38] not-italic block">
                        — {sec.quote.author}
                      </cite>
                    )}
                  </blockquote>
                )}

                {/* Section Embedded Image */}
                {sec.image && (
                  <div className="my-6 rounded-xl overflow-hidden border border-[#E8E5DE]">
                    <ImageWithFallback
                      src={sec.image.url}
                      alt={sec.image.alt}
                      aspectRatioClass="aspect-[16/9]"
                      className="w-full object-cover"
                    />
                    {sec.image.caption && (
                      <p className="p-3 bg-white text-xs text-stone-500 italic text-center border-t border-[#E8E5DE]">
                        {sec.image.caption}
                      </p>
                    )}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Article Footer & Tags */}
          <div className="mt-12 pt-6 border-t border-[#E8E5DE] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span className="font-semibold text-stone-700">Tags:</span>
              {article.tags.map((tag) => (
                <span key={tag} className="text-stone-600">
                  #{tag}
                </span>
              ))}
            </div>

            <Link
              href={`/places/${article.destinationSlug}`}
              className="text-xs font-semibold text-[#244C3A] hover:underline"
            >
              Explore {article.destination} Destination Guide &rarr;
            </Link>
          </div>
        </article>

        {/* Related Stories */}
        {related.length > 0 && (
          <section className="py-16 bg-white border-t border-[#E8E5DE]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-1">
                  Further Reading
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#202522]">
                  More Stories from Desi Musafir
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((art) => (
                  <ArticleCard key={art.id} article={art} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
