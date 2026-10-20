import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '../../router';
import { TRAVEL_ARTICLES } from '../../data/articles';
import { ArticleCard } from '../blog/ArticleCard';

export function FeaturedStories() {
  const featuredArticle = TRAVEL_ARTICLES[0];
  const supportingArticles = TRAVEL_ARTICLES.slice(1, 4);

  return (
    <section className="py-20 bg-[#FAF8F3] border-t border-[#E8E5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-2">
              Dispatches from the Road
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#202522]">
              Featured Travel Stories
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#244C3A] hover:text-[#B85C38] transition-colors group"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Large featured story (horizontal banner) */}
        {featuredArticle && (
          <div className="mb-8">
            <ArticleCard article={featuredArticle} layout="horizontal" />
          </div>
        )}

        {/* Supporting articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {supportingArticles.map((art) => (
            <ArticleCard key={art.id} article={art} layout="standard" />
          ))}
        </div>
      </div>
    </section>
  );
}
