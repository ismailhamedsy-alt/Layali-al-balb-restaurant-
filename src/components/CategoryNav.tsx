import React from 'react';
import { Search, X, Flame } from 'lucide-react';
import { CATEGORIES } from '../data/menuData';
import { useMenu } from '../context/MenuContext';

export const CategoryNav: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    selectedDietFilter,
    setSelectedDietFilter,
  } = useMenu();

  return (
    <div className="sticky top-20 z-30 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 py-3 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Search bar and Dietary filter controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Instant Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن وجبة، شاورما، بروستد، برغر..."
              className="w-full pr-10 pl-10 py-2 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 focus:outline-none text-stone-100 text-sm placeholder:text-stone-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1"
                title="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Dietary / Highlight Filters (Functional Segmented Buttons) */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto p-1 bg-stone-900 rounded-xl border border-stone-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setSelectedDietFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedDietFilter === 'all'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              جميع الوجبات
            </button>
            <button
              type="button"
              onClick={() => setSelectedDietFilter('spicy')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                selectedDietFilter === 'spicy'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Flame className="w-3 h-3 fill-current" />
              <span>سبايسي وحار</span>
            </button>
          </div>

        </div>

        {/* Categories Horizontal Scroll Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (searchQuery) setSearchQuery('');
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                    : 'bg-stone-900/90 hover:bg-stone-800 text-stone-300 border border-stone-800/80 hover:border-stone-700'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
