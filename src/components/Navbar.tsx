import React, { useState } from 'react';
import { ShoppingBag, Heart, MessageCircle, MapPin, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';
import { formatPrice } from '../utils/formatters';
import { Currency } from '../types/menu';

interface NavbarProps {
  onOpenFavorites: () => void;
  onOpenPrivacy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenFavorites, onOpenPrivacy }) => {
  const { cartCount, subtotalTRY, setIsCartOpen } = useCart();
  const { restaurantConfig, currency, setCurrency, favorites } = useMenu();
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const currencies: { code: Currency; label: string; symbol: string }[] = [
    { code: 'TRY', label: 'ليرة تركية', symbol: '₺' },
    { code: 'USD', label: 'دولار أمريكي', symbol: '$' },
    { code: 'SYP', label: 'ليرة سورية', symbol: 'ل.س' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all">
      {/* Top Announcement Banner (editable by admin) */}
      {restaurantConfig.announcementText && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-bold text-xs py-1.5 px-4 text-center shadow-inner flex items-center justify-center gap-2">
          <span>📢</span>
          <span>{restaurantConfig.announcementText}</span>
        </div>
      )}

      {/* Closed Status Banner */}
      {restaurantConfig.isRestaurantOpen === false && (
        <div className="bg-rose-900/90 text-rose-200 border-b border-rose-800 text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          <span>{restaurantConfig.closedMessage || 'المطعم مغلق حالياً، لا نستقبل طلبات جديدة في الوقت الحالي.'}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center text-2xl font-black text-amber-400">
                🍗
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  {restaurantConfig.name}
                </h1>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  مدينة الباب
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                أشهى الوجبات السريعة والشاورما والبروستد والبرغر
              </p>
            </div>
          </div>

          {/* Customer Tools: Currency, Privacy Badge, Favorites, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Currency Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="px-2.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700/60 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="تغيير العملة"
              >
                <span className="text-amber-400 font-bold">{currency}</span>
                <span className="text-stone-400 text-xs">▼</span>
              </button>

              {showCurrencyDropdown && (
                <div className="absolute left-0 mt-2 w-36 rounded-xl bg-stone-900 border border-stone-700 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-400 border-b border-stone-800">
                    اختر العملة
                  </div>
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setShowCurrencyDropdown(false);
                      }}
                      className={`w-full text-right px-3 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-stone-800 cursor-pointer ${
                        currency === c.code ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-stone-300'
                      }`}
                    >
                      <span>{c.label}</span>
                      <span className="text-xs text-stone-400 font-mono">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Badge */}
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-emerald-400 border border-stone-700/50 text-xs font-semibold cursor-pointer transition-colors"
              title="سياسة الخصوصية وحماية بيانات الزبائن"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>خصوصية آمنة</span>
            </button>

            {/* Favorites Button */}
            <button
              type="button"
              onClick={onOpenFavorites}
              className="p-2 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 border border-stone-700/50 flex items-center gap-1.5 transition-colors relative cursor-pointer"
              title="الوجبات المفضلة"
            >
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-stone-400'}`} />
              <span className="hidden md:inline">المفضلة</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Direct WhatsApp Call Quick Link */}
            <a
              href={`https://api.whatsapp.com/send?phone=${restaurantConfig.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-700/40 transition-colors"
              title="تواصل مباشر عبر واتساب"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>واتساب المطعم</span>
            </a>

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-3.5 sm:px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-stone-950 text-amber-400 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-amber-400">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-[11px] block text-stone-900 leading-tight">السلة</span>
                <span className="text-xs sm:text-sm font-black text-stone-950 leading-none font-mono">
                  {cartCount > 0 ? formatPrice(subtotalTRY, currency, restaurantConfig) : '0 ₺'}
                </span>
              </div>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
