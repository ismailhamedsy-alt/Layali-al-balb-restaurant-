import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Bike, Store, Utensils, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';
import { formatPrice, resolveImageUrl } from '../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotalTRY,
    orderDetails,
    updateOrderDetails,
    setIsCheckoutModalOpen,
  } = useCart();

  const { currency, restaurantConfig } = useMenu();

  if (!isCartOpen) return null;

  const isFreeDelivery = !!(
    restaurantConfig.freeDeliveryThresholdTRY &&
    restaurantConfig.freeDeliveryThresholdTRY > 0 &&
    subtotalTRY >= restaurantConfig.freeDeliveryThresholdTRY
  );

  const deliveryFee = orderDetails.orderType === 'delivery'
    ? (isFreeDelivery ? 0 : restaurantConfig.deliveryFeeTRY)
    : 0;

  const grandTotalTRY = subtotalTRY + deliveryFee;

  const handleProceedToWhatsApp = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/80 backdrop-blur-sm flex justify-start">
      <div className="relative w-full max-w-md bg-stone-900 h-full shadow-2xl border-l border-stone-800 flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">سلة الطلبات</h2>
              <span className="text-xs text-stone-400">
                {cart.length > 0 ? `${cart.length} أصناف في السلة` : 'السلة فارغة'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition-colors cursor-pointer"
            title="إغلاق السلة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-stone-800 flex items-center justify-center text-4xl text-stone-600">
                🍗
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-200">سلتك فارغة حالياً</h3>
                <p className="text-sm text-stone-400 max-w-xs mt-1">
                  اختر ما تشتهيه من قائمة طعام مطعم ليالي الباب وأضفه إلى طلبك!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                تصفح قائمة الطعام
              </button>
            </div>
          ) : (
            <>
              {/* Order Fulfillment Method Toggle */}
              <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
                <span className="text-xs font-bold text-stone-300 block">طريقة استلام الطلب:</span>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => updateOrderDetails({ orderType: 'delivery' })}
                    className={`py-2 px-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      orderDetails.orderType === 'delivery'
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                        : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>توصيل</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateOrderDetails({ orderType: 'pickup' })}
                    className={`py-2 px-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      orderDetails.orderType === 'pickup'
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                        : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>سفري بالمطعم</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateOrderDetails({ orderType: 'dinein' })}
                    className={`py-2 px-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      orderDetails.orderType === 'dinein'
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                        : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    <Utensils className="w-4 h-4" />
                    <span>داخل الصالة</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 flex gap-3 group"
                  >
                    {/* Item Thumbnail */}
                    <img
                      src={resolveImageUrl(item.menuItem.image)}
                      alt={item.menuItem.name}
                      className="w-16 h-16 rounded-xl object-cover bg-stone-900 shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-white truncate">
                            {item.menuItem.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-stone-500 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                            title="حذف الصنف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Size tag */}
                        {item.selectedSize && (
                          <span className="text-[11px] text-amber-400 block mt-0.5">
                            الحجم: {item.selectedSize.name}
                          </span>
                        )}

                        {/* Extras summary */}
                        {item.selectedExtras && item.selectedExtras.length > 0 && (
                          <span className="text-[11px] text-stone-400 block line-clamp-1">
                            + {item.selectedExtras.map((e) => e.name).join('، ')}
                          </span>
                        )}

                        {/* Special note */}
                        {item.notes && (
                          <span className="text-[10px] text-stone-500 italic block mt-0.5">
                            "{item.notes}"
                          </span>
                        )}
                      </div>

                      {/* Pricing and Stepper */}
                      <div className="flex items-center justify-between pt-2 mt-1 border-t border-stone-800/60">
                        <span className="text-xs sm:text-sm font-bold text-amber-400 font-mono">
                          {formatPrice(item.totalPriceTRY, currency, restaurantConfig)}
                        </span>

                        <div className="flex items-center gap-2 bg-stone-900 px-2 py-1 rounded-lg border border-stone-800">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear cart action */}
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-stone-500 hover:text-rose-400 flex items-center gap-1.5 mx-auto pt-2 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>تفريغ محتويات السلة</span>
              </button>
            </>
          )}

        </div>

        {/* Drawer Footer (Summary & Checkout) */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950 space-y-3">
            {/* Calculation summary */}
            <div className="space-y-1.5 text-xs text-stone-300">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-mono">{formatPrice(subtotalTRY, currency, restaurantConfig)}</span>
              </div>
              {orderDetails.orderType === 'delivery' && (
                <div className="flex justify-between text-stone-400 items-center">
                  <span>أجور التوصيل (مدينة الباب):</span>
                  {isFreeDelivery ? (
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      مجاناً 🎉
                    </span>
                  ) : (
                    <span className="font-mono">{formatPrice(deliveryFee, currency, restaurantConfig)}</span>
                  )}
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-black text-amber-400 pt-2 border-t border-stone-800">
                <span>الإجمالي الكلي:</span>
                <span className="font-mono">{formatPrice(grandTotalTRY, currency, restaurantConfig)}</span>
              </div>
            </div>

            {/* Big WhatsApp Checkout Button */}
            <button
              type="button"
              onClick={handleProceedToWhatsApp}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>متابعة إرسال الطلب عبر واتساب</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
