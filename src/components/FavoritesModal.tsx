import React from 'react';
import { X, Heart, ShoppingBag, Plus } from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({ isOpen, onClose }) => {
  const { menuItems, favorites, toggleFavorite, currency, restaurantConfig } = useMenu();
  const { addToCart, setActiveItemForCustomization } = useCart();

  if (!isOpen) return null;

  const favoriteItems = menuItems.filter((item) => favorites.includes(item.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">الوجبات المفضلة</h2>
              <span className="text-xs text-stone-400">
                {favoriteItems.length} وجبة محفوظة
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[65vh] overflow-y-auto space-y-3">
          {favoriteItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-800 mx-auto flex items-center justify-center text-rose-400">
                <Heart className="w-8 h-8" />
              </div>
              <p className="text-stone-300 font-bold">لم تقم بإضافة أي وجبة للمفضلة بعد</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                اضغط على أيقونة القلب الموجودة على وجبات الشاورما والبروستد والبرغر لحفظها هنا!
              </p>
            </div>
          ) : (
            favoriteItems.map((item) => {
              const hasOptions = (item.sizes && item.sizes.length > 0) || (item.extras && item.extras.length > 0);
              return (
                <div
                  key={item.id}
                  className="p-3 bg-stone-950/80 rounded-2xl border border-stone-800 flex items-center justify-between gap-3 group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-stone-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">
                      {item.name}
                    </h4>
                    <span className="text-xs font-mono font-bold text-amber-400 mt-1 block">
                      {formatPrice(item.priceTRY, currency, restaurantConfig)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (hasOptions) {
                          onClose();
                          setActiveItemForCustomization(item);
                        } else {
                          addToCart(item, 1);
                        }
                      }}
                      className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                      title="إضافة إلى السلة"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">طلب</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(item.id)}
                      className="p-2 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="حذف من المفضلة"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
