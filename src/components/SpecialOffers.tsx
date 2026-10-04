import React from 'react';
import { Sparkles, MessageCircle, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';
import { formatPrice, resolveImageUrl } from '../utils/formatters';

export const SpecialOffers: React.FC = () => {
  const { menuItems, currency, restaurantConfig } = useMenu();
  const { quickDirectOrder, addToCart } = useCart();

  // Find popular dishes or signature combos
  const featuredOffers = menuItems.filter((m) => m.badge || m.isPopular).slice(0, 3);

  if (featuredOffers.length === 0) return null;

  return (
    <section className="py-8 bg-gradient-to-b from-stone-900/50 to-stone-950 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                عروض وتواقيع مطعم ليالي الباب
              </h3>
              <p className="text-xs text-stone-400">
                الوجبات الأكثر طلباً وتميزاً بإمكانك طلبها مباشرة عبر واتساب
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {featuredOffers.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 p-4 flex flex-col justify-between overflow-hidden shadow-lg transition-all group"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={resolveImageUrl(item.image)}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover bg-stone-950 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  {item.badge && (
                    <span className="text-[10px] font-bold text-amber-400 block mb-1">
                      {item.badge}
                    </span>
                  )}
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                  <div className="mt-2 text-base font-black text-amber-400 font-mono">
                    {formatPrice(item.priceTRY, currency, restaurantConfig)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => addToCart(item, 1)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة للسلة</span>
                </button>
                <button
                  type="button"
                  onClick={() => quickDirectOrder(item, 1)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-emerald-950/50 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساب فوري</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
