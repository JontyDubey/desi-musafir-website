import React from 'react';
import { Clock, Calendar, ArrowRight, MapPin } from 'lucide-react';
import { TravelArticle } from '../../types';
import { Link } from '../../router';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ArticleCardProps {
  article: TravelArticle;
  layout?: 'standard' | 'horizontal';
}

export function ArticleCard({ article, layout = 'standard' }: ArticleCardProps) {
  if (layout === 'horizontal') {
    return (
      <article className="group bg-white rounded-2xl border border-[#E8E5DE] overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 transition-all duration-300 hover:shadow-lg hover:border-stone-300">
        <Link href={`/blog/${article.slug}`} className="md:col-span-5 relative overflow-hidden block">
          <ImageWithFallback
            src={article.coverImage}
            alt={article.coverImageAlt}
            aspectRatioClass="aspect-[4/3] md:h-full md:aspect-auto"
            className="group-hover:scale-105 transition-transform duration-500 ease-out h-full"
          />
        </Link>
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Zero-pill metadata line */}
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
              <span className="text-[#B85C38] font-semibold">{article.category}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {article.destination}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {article.readTime}
              </span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#202522] group-hover:text-[#244C3A] transition-colors mb-3 leading-snug">
              <Link href={`/blog/${article.slug}`}>
                {article.title}
              </Link>
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed mb-4">
              {article.excerpt}
            </p>
          </div>

          <div className="pt-4 border-t border-[#F2EFE9] flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              {article.publishedAt}
            </span>
            <Link
              href={`/blog/${article.slug}`}
              className="inline-flex items-center gap-1.5 font-semibold text-[#244C3A] hover:text-[#B85C38] transition-colors"
            >
              <span>Read Story</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-white rounded-2xl border border-[#E8E5DE] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-stone-300">
      <div>
        <Link href={`/blog/${article.slug}`} className="block relative overflow-hidden">
          <ImageWithFallback
            src={article.coverImage}
            alt={article.coverImageAlt}
            aspectRatioClass="aspect-[16/10]"
            className="group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>
        <div className="p-6">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span className="text-[#B85C38] font-semibold">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {article.destination}
            </span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#202522] group-hover:text-[#244C3A] transition-colors mb-2 line-clamp-2 leading-snug">
            <Link href={`/blog/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-xs text-stone-500">
        <span>{article.publishedAt}</span>
        <Link
          href={`/blog/${article.slug}`}
          className="inline-flex items-center gap-1.5 font-semibold text-[#244C3A] hover:text-[#B85C38] transition-colors"
        >
          <span>Read Story</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
