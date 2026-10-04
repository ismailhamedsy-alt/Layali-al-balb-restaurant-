import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Sparkles, MessageCircle } from 'lucide-react';
import { ExtraOption, SizeOption } from '../types/menu';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';
import { formatPrice, resolveImageUrl } from '../utils/formatters';
import { broastedImg } from '../data/menuData';

export const ItemCustomizerModal: React.FC = () => {
  const { activeItemForCustomization, setActiveItemForCustomization, addToCart, setIsCartOpen, setIsCheckoutModalOpen } = useCart();
  const { currency, restaurantConfig } = useMenu();

  const item = activeItemForCustomization;

  const [selectedSize, setSelectedSize] = useState<SizeOption | undefined>(undefined);
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (item) {
      // Default to first size if exists
      if (item.sizes && item.sizes.length > 0) {
        setSelectedSize(item.sizes[0]);
      } else {
        setSelectedSize(undefined);
      }
      setSelectedExtras([]);
      setNotes('');
      setQuantity(1);
    }
  }, [item]);

  if (!item) return null;

  const basePriceTRY = selectedSize ? selectedSize.priceTRY : item.priceTRY;
  const extrasTotalTRY = selectedExtras.reduce((sum, e) => sum + e.priceTRY, 0);
  const unitPriceTRY = basePriceTRY + extrasTotalTRY;
  const totalPriceTRY = unitPriceTRY * quantity;

  const handleToggleExtra = (extra: ExtraOption) => {
    setSelectedExtras((prev) =>
      prev.some((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const handleConfirm = () => {
    addToCart(item, quantity, selectedSize, selectedExtras, notes);
    setActiveItemForCustomization(null);
  };

  const handleConfirmAndOpenCart = () => {
    addToCart(item, quantity, selectedSize, selectedExtras, notes);
    setActiveItemForCustomization(null);
    setIsCartOpen(true);
  };

  const handleConfirmAndDirectWhatsApp = () => {
    addToCart(item, quantity, selectedSize, selectedExtras, notes);
    setActiveItemForCustomization(null);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Header Image with close button */}
        <div className="relative h-48 sm:h-56 w-full bg-stone-950">
          <img
            src={resolveImageUrl(item.image)}
            alt={item.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = resolveImageUrl('/images/meals/escalope_meal.jpg');
              if (target.src !== fallback) {
                target.src = fallback;
              }
            }}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-black/60" />
          
          <button
            type="button"
            onClick={() => setActiveItemForCustomization(null)}
            className="absolute top-4 left-4 p-2 rounded-full bg-stone-950/70 border border-stone-700/60 text-stone-200 hover:text-white transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 right-4 left-4">
            <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Description */}
          <p className="text-sm text-stone-300 leading-relaxed">
            {item.description}
          </p>

          {/* Size Options (if available) */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-amber-400 tracking-wider block">
                اختر الحجم أو نوع الوجبة:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {item.sizes.map((s) => {
                  const isSelected = selectedSize?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`w-full p-3 rounded-xl border text-right flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                          : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-amber-400 bg-amber-400' : 'border-stone-600'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-stone-950" />}
                        </div>
                        <span>{s.name}</span>
                      </div>
                      <span className="font-mono text-amber-400 text-sm">
                        {formatPrice(s.priceTRY, currency, restaurantConfig)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extras / Add-ons (if available) */}
          {item.extras && item.extras.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-amber-400 tracking-wider block">
                إضافات اختيارية:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {item.extras.map((extra) => {
                  const isChecked = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => handleToggleExtra(extra)}
                      className={`w-full p-3 rounded-xl border text-right flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-amber-500/10 border-amber-500/80 text-white'
                          : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-amber-500 border-amber-500 text-stone-950' : 'border-stone-600'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span>{extra.name}</span>
                      </div>
                      <span className="font-mono text-stone-400 text-xs">
                        +{formatPrice(extra.priceTRY, currency, restaurantConfig)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Kitchen Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-400 tracking-wider block">
              ملاحظات خاصة للشيف (اختياري):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: بدون بصل، ثوم زيادة، تحميص إضافي..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between p-3.5 bg-stone-950 rounded-2xl border border-stone-800">
            <span className="text-sm font-semibold text-stone-200">الكمية المطلوبة:</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold cursor-pointer disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-black text-amber-400 text-lg">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800/90 flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:w-auto text-right sm:text-right flex-1">
            <span className="text-[11px] text-stone-400 block">الإجمالي:</span>
            <span className="text-xl font-black text-amber-400 font-mono">
              {formatPrice(totalPriceTRY, currency, restaurantConfig)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              إضافة للسلة
            </button>
            <button
              type="button"
              onClick={handleConfirmAndOpenCart}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              عرض السلة
            </button>
            <button
              type="button"
              onClick={handleConfirmAndDirectWhatsApp}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>طلب مباشر واتساب ⚡</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
