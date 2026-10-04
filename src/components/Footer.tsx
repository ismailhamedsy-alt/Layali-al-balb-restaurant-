import React from 'react';
import { MapPin, Phone, MessageCircle, ArrowUp, ShieldCheck } from 'lucide-react';
import { useMenu } from '../context/MenuContext';

interface FooterProps {
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy }) => {
  const { restaurantConfig } = useMenu();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800/80">
          
          {/* Logo & Slogan */}
          <div className="text-center md:text-right space-y-1.5">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-2xl">🍗</span>
              <h2 className="text-lg font-black text-white">{restaurantConfig.name}</h2>
            </div>
            <p className="text-stone-400 text-xs">
              {restaurantConfig.subtitle}
            </p>
          </div>

          {/* Quick Contacts & Privacy Link */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a
              href={`https://api.whatsapp.com/send?phone=${restaurantConfig.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-stone-300 hover:text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>واتساب: {restaurantConfig.whatsappNumber}</span>
            </a>
            <span className="text-stone-700 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 text-stone-300">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{restaurantConfig.city}</span>
            </div>
            <span className="text-stone-700 hidden sm:inline">|</span>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>سياسة الخصوصية وحماية البيانات</span>
            </button>
          </div>

          {/* Back to top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="العودة للأعلى"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-xs font-semibold">للأعلى</span>
          </button>
        </div>

        {/* Bottom Bar: Privacy guarantee */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {restaurantConfig.name} - مدينة الباب.</span>
          </div>

          <div className="text-emerald-500/90 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>خصوصية تامة 100%: لا نقوم بتسجيل أو تتبع بيانات الزبائن الشخصية</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
