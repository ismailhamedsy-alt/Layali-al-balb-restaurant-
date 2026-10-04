import React from 'react';
import { MapPin, Phone, Clock, Bike, CheckCircle2, MessageCircle } from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { AL_BAB_AREAS } from '../data/menuData';

export const RestaurantInfo: React.FC = () => {
  const { restaurantConfig } = useMenu();

  const areas = restaurantConfig.deliveryAreas && restaurantConfig.deliveryAreas.length > 0
    ? restaurantConfig.deliveryAreas
    : AL_BAB_AREAS;

  return (
    <section className="py-12 sm:py-16 border-t border-stone-800 bg-stone-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-400 tracking-wider block mb-2">
            خدمة سريعة وجودة عالية
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            معلومات مطعم ليالي الباب والتوصيل
          </h2>
          <p className="text-stone-400 text-sm mt-2">
            نحرص على وصول وجباتكم ساخنة وطازجة بأسرع وقت في مدينة الباب وريفها
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Address & Location */}
          <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">موقع المطعم</h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              {restaurantConfig.address}
            </p>
            <div className="pt-2 text-xs text-stone-500">
              صالة عائلية ومجهزة لاستقبالكم بأفضل أجواء
            </div>
          </div>

          {/* Card 2: Hours & Schedule */}
          <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">أوقات العمل</h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              {restaurantConfig.openingHours}
            </p>
            <div className="pt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>متاح طيلة أيام الأسبوع</span>
            </div>
          </div>

          {/* Card 3: WhatsApp & Orders */}
          <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">الطلب المباشر</h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              خدمة الطلب والتوصيل الفوري عبر الواتساب مع تجهيز دقيق للطلبات.
            </p>
            <div className="pt-1">
              <a
                href={`https://wa.me/${restaurantConfig.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300"
              >
                <span>مراسلة واتساب:</span>
                <span className="font-mono" dir="ltr">{restaurantConfig.whatsappNumber}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Delivery Coverage Areas in Al-Bab */}
        <div className="p-6 rounded-3xl bg-stone-900/70 border border-stone-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <Bike className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                مناطق وأحياء التوصيل في مدينة الباب:
              </h3>
            </div>
            <span className="text-xs text-amber-400/90 font-semibold">
              أجرة توصيل موحدة ورمزية ({restaurantConfig.deliveryFeeTRY} ل.ت) لكافة الأحياء
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {areas.map((area) => (
              <div key={area} className="flex items-center gap-2 text-xs text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{area}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
