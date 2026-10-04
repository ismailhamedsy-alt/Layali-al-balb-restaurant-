import React from 'react';
import { MessageCircle, Clock, MapPin, Sparkles, Bike, ShieldCheck } from 'lucide-react';
import { heroImg } from '../data/menuData';
import { useMenu } from '../context/MenuContext';

interface HeroProps {
  onScrollToMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToMenu }) => {
  const { restaurantConfig } = useMenu();

  return (
    <section className="relative overflow-hidden border-b border-stone-800 bg-stone-950">
      {/* Background Hero Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="وجبات مطعم ليالي الباب"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-stone-950/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          
          {/* Top Live Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md shadow-lg shadow-black/40">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>نستقبل طلباتكم الآن في مدينة الباب</span>
            <span className="text-stone-500">|</span>
            <span className="flex items-center gap-1 text-stone-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              11:30 ص - 2:00 ليلاً
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none mb-6">
            أشهى الوجبات السريعة في <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              ليالي الباب
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-stone-300 mb-8 leading-relaxed font-medium">
            نكهات الشاورما الأصيلة بخبز الصاج المحمص، البروستد المقرمش الذهبي، البرغر الفاخر باللحم البلدي، والسندويشات الغربية بتتبيلتنا الخاصة في قلب مدينة الباب.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
            <button
              type="button"
              onClick={onScrollToMenu}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-base shadow-xl shadow-amber-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>تصفح المنيو واطلب</span>
              <span>👇</span>
            </button>

            <a
              href={`https://wa.me/${restaurantConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، أرغب بطلب وجبة من مطعم ليالي الباب')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-900/30 border border-emerald-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              <span>محادثة واتساب مباشرة</span>
            </a>
          </div>

          {/* Highlights Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-stone-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400">
                <Bike className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="block text-xs text-stone-400">توصيل سريع</span>
                <span className="text-xs sm:text-sm font-bold text-stone-200">لكافة أحياء الباب</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="block text-xs text-stone-400">لحوم ودجاج</span>
                <span className="text-xs sm:text-sm font-bold text-stone-200">طازج ومضمون 100%</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
              <div className="w-9 h-9 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="block text-xs text-stone-400">الموقع</span>
                <span className="text-xs sm:text-sm font-bold text-stone-200">قرب دوار السنتر</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
