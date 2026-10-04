import React, { useState } from 'react';
import { Heart, Plus, Flame, Star, Check, MessageCircle } from 'lucide-react';
import { MenuItem } from '../types/menu';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import { formatPrice, resolveImageUrl } from '../utils/formatters';
import { broastedImg } from '../data/menuData';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { currency, restaurantConfig, isFavorite, toggleFavorite } = useMenu();
  const { addToCart, quickDirectOrder, setActiveItemForCustomization } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isFav = isFavorite(item.id);
  const isAvailable = item.available !== false;
  const hasOptions = (item.sizes && item.sizes.length > 0) || (item.extras && item.extras.length > 0);

  const handleCardAction = () => {
    if (!isAvailable) return;
    if (hasOptions) {
      setActiveItemForCustomization(item);
    } else {
      addToCart(item, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  const handleQuickWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    if (hasOptions) {
      setActiveItemForCustomization(item);
    } else {
      quickDirectOrder(item, 1);
    }
  };

  return (
    <article
      className={`group bg-stone-900/90 rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden shadow-lg shadow-black/20 ${
        isAvailable
          ? 'border-stone-800/80 hover:border-amber-500/50 hover:shadow-amber-500/5'
          : 'border-stone-800/40 opacity-75'
      }`}
    >
      {/* Image container with favorite button */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
        <img
          src={resolveImageUrl(item.image)}
          alt={item.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Graceful fallback to guaranteed public meal asset if any image fails
            const target = e.target as HTMLImageElement;
            const fallback = resolveImageUrl('/images/meals/escalope_meal.jpg');
            if (target.src !== fallback) {
              target.src = fallback;
            }
          }}
          className={`w-full h-full object-cover object-center transition-transform duration-500 ${
            isAvailable ? 'group-hover:scale-105' : 'grayscale contrast-75'
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-black/30" />

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          className="absolute top-3 left-3 p-2 rounded-xl bg-stone-950/70 backdrop-blur-md border border-stone-700/50 text-stone-300 hover:text-rose-500 hover:scale-110 transition-all cursor-pointer z-10"
          title={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
        </button>

        {/* Badge in top-right */}
        {item.badge && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-stone-950/85 backdrop-blur-md border border-amber-500/40 text-amber-400 text-xs font-bold shadow-md">
            {item.badge}
          </div>
        )}

        {/* Sold out overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-[2px] flex items-center justify-center p-4">
            <span className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs tracking-wider">
              غير متوفر حالياً
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line: clean, unboxed typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1.5">
            {item.isPopular && (
              <>
                <span className="text-amber-400 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400" />
                  الأكثر طلباً
                </span>
                <span aria-hidden="true" className="text-stone-600">·</span>
              </>
            )}
            {item.isSpicy && (
              <>
                <span className="text-rose-400 flex items-center gap-0.5">
                  <Flame className="w-3 h-3 fill-rose-400" />
                  حار 🌶️
                </span>
                <span aria-hidden="true" className="text-stone-600">·</span>
              </>
            )}
            {hasOptions && (
              <span>خيارات متعددة</span>
            )}
          </div>

          {/* Dish Title */}
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-2">
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-stone-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        </div>

        {/* Pricing & Customer Actions */}
        <div className="pt-3 border-t border-stone-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] text-stone-500 block">السعر</span>
              <div className="text-lg sm:text-xl font-black text-amber-400 font-mono">
                {formatPrice(item.priceTRY, currency, restaurantConfig)}
              </div>
            </div>

            {/* Add to Cart button */}
            <button
              type="button"
              disabled={!isAvailable}
              onClick={handleCardAction}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-95 shadow-md shadow-amber-500/10'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تمت الإضافة</span>
                </>
              ) : hasOptions ? (
                <>
                  <span>تخصيص</span>
                  <Plus className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>إضافة للسلة</span>
                  <Plus className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Direct WhatsApp Quick Order Button */}
          <button
            type="button"
            disabled={!isAvailable}
            onClick={handleQuickWhatsAppOrder}
            className="w-full py-2 px-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/30 hover:border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>طلب فوري مباشر عبر واتساب ⚡</span>
          </button>
        </div>
      </div>
    </article>
  );
};
