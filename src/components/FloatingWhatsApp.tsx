import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { cleanPhoneNumber } from '../utils/formatters';

export const FloatingWhatsApp: React.FC = () => {
  const { restaurantConfig } = useMenu();
  const phone = cleanPhoneNumber(restaurantConfig.whatsappNumber);

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-center gap-2.5">
      {/* WhatsApp pulse button */}
      <a
        href={`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent('السلام عليكم ورحمة الله، مطعم ليالي الباب أود الاستفسار والطلب')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all transform hover:scale-110 active:scale-95"
        title="تواصل مباشر عبر واتساب مطعم ليالي الباب"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25 group-hover:opacity-40" />
        <MessageCircle className="w-7 h-7 relative z-10 fill-current" />
        <span className="sr-only">واتساب</span>
        
        {/* Tooltip on hover */}
        <span className="hidden md:group-hover:inline-block absolute right-16 bg-stone-900 text-stone-100 text-xs font-bold py-1.5 px-3 rounded-xl shadow-lg border border-stone-800 whitespace-nowrap">
          راسلنا مباشرة عبر واتساب 💬
        </span>
      </a>
    </div>
  );
};
