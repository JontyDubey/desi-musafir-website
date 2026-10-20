import React from 'react';
import { BookOpen, Compass, ShieldCheck, Calendar, Luggage, Fuel } from 'lucide-react';
import { Link } from '../../router';

export function TravelGuidesSection() {
  const guides = [
    {
      icon: <Compass className="w-5 h-5 text-[#244C3A]" />,
      title: 'Planning an Indian Journey',
      slug: 'planning-an-indian-trip',
      excerpt: 'Practical advice on rail bookings, internal flights, navigating seasons, and respectful local etiquette.',
    },
    {
      icon: <Fuel className="w-5 h-5 text-[#B85C38]" />,
      title: 'Road Trip Essentials',
      slug: 'road-trip-preparation',
      excerpt: 'Preparing your vehicle for Himalayan mountain passes, state permit checkpoints, and desert highways.',
    },
    {
      icon: <Calendar className="w-5 h-5 text-[#C5A46D]" />,
      title: 'Choosing the Right Season',
      slug: 'choosing-the-best-season',
      excerpt: 'Understanding winter snow in the north, tropical monsoon coastal magic, and mild southern winters.',
    },
    {
      icon: <Luggage className="w-5 h-5 text-stone-700" />,
      title: 'Packing for Diverse Terrains',
      slug: 'packing-essentials',
      excerpt: 'From thermal base layers for high altitude valleys to breathable linen for temple towns and beaches.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
      title: 'Responsible & Mindful Travel',
      slug: 'responsible-travel',
      excerpt: 'Minimizing plastic footprint in fragile mountain valleys, supporting local community homestays, and honoring shrines.',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-amber-800" />,
      title: 'Budget Travel via Indian Railways',
      slug: 'budget-travel-guide',
      excerpt: 'How to traverse thousands of kilometers safely, affordably, and immersively on India’s historic rail network.',
    },
  ];

  return (
    <section className="py-20 bg-[#FAF8F3] border-t border-[#E8E5DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B85C38] block mb-2">
            Field Wisdom & Tips
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#202522]">
            Practical Travel Guides
          </h2>
          <p className="mt-3 text-sm text-stone-600">
            Real-world advice tailored for journeys across the diverse geographies, cultures, and seasons of India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <div
              key={guide.slug}
              className="p-6 bg-white border border-[#E8E5DE] rounded-xl flex flex-col justify-between hover:border-stone-300 transition-colors"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mb-4">
                  {guide.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#202522] mb-2">
                  {guide.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {guide.excerpt}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100">
                <Link
                  href="/blog"
                  className="text-xs font-semibold text-[#244C3A] hover:text-[#B85C38] transition-colors"
                >
                  Read Editorial Advice &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
