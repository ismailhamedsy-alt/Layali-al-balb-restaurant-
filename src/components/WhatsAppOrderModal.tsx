import React, { useState } from 'react';
import { X, MessageCircle, Send, Check, Copy, Phone, MapPin, User, Bike, Store, Utensils, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';
import { AL_BAB_AREAS } from '../data/menuData';
import { generateWhatsAppMessage, formatPrice, cleanPhoneNumber } from '../utils/formatters';

export const WhatsAppOrderModal: React.FC = () => {
  const {
    cart,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    orderDetails,
    updateOrderDetails,
    subtotalTRY,
    clearCart,
  } = useCart();

  const { restaurantConfig, currency } = useMenu();
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [orderSentSuccess, setOrderSentSuccess] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const isFreeDelivery = !!(
    restaurantConfig.freeDeliveryThresholdTRY &&
    restaurantConfig.freeDeliveryThresholdTRY > 0 &&
    subtotalTRY >= restaurantConfig.freeDeliveryThresholdTRY
  );

  const deliveryFee = orderDetails.orderType === 'delivery'
    ? (isFreeDelivery ? 0 : restaurantConfig.deliveryFeeTRY)
    : 0;

  const grandTotalTRY = subtotalTRY + deliveryFee;
  const availableAreas = restaurantConfig.deliveryAreas && restaurantConfig.deliveryAreas.length > 0
    ? restaurantConfig.deliveryAreas
    : AL_BAB_AREAS;

  const messageText = generateWhatsAppMessage(cart, orderDetails, restaurantConfig, currency);
  const targetPhone = cleanPhoneNumber(restaurantConfig.whatsappNumber);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(messageText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendViaWhatsApp = () => {
    if (!orderDetails.customerName.trim()) {
      setValidationError('يرجى إدخال اسمك الكريم لتأكيد الطلب');
      return;
    }

    if (orderDetails.orderType === 'delivery' && !orderDetails.deliveryAddress?.trim()) {
      setValidationError('يرجى كتابة العنوان التفصيلي لتوصيل الطلب في مدينة الباب');
      return;
    }

    setValidationError(null);
    setOrderSentSuccess(true);

    // Open WhatsApp in new tab / app
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                إرسال الطلب عبر واتساب
              </h2>
              <p className="text-xs text-stone-400">
                مطعم ليالي الباب - مدينة الباب
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCheckoutModalOpen(false)}
            className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Order Sent Success Prompt */}
          {orderSentSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm space-y-2.5 animate-in fade-in">
              <div className="flex items-center gap-2 font-black text-white text-sm sm:text-base">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>تم إرسال الطلب وحفظه بنجاح!</span>
              </div>
              <p className="text-emerald-300/90 text-xs leading-relaxed">
                تم تجهيز نص الطلب لواتساب. إذا لم يفتح واتساب تلقائياً يمكنك الضغط على الزر أدناه أو الاتصال بالمطعم فوراً.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>فتح واتساب الآن</span>
                </a>
                <a
                  href={`tel:${cleanPhoneNumber(restaurantConfig.whatsappNumber)}`}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs inline-flex items-center gap-1.5 border border-stone-700"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>اتصال هاتفي مباشر</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    setIsCheckoutModalOpen(false);
                    setOrderSentSuccess(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 hover:text-white font-bold text-xs"
                >
                  إتمام وإفراغ السلة
                </button>
              </div>
            </div>
          )}

          {/* Validation Alert */}
          {validationError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Customer Details Form */}
          <div className="space-y-4 bg-stone-950/70 p-4 sm:p-5 rounded-2xl border border-stone-800/80">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>معلومات المستلم والتوصيل</span>
            </h3>

            {/* Order Type Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs text-stone-400 block font-medium">نوع الطلب:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateOrderDetails({ orderType: 'delivery' })}
                  className={`p-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    orderDetails.orderType === 'delivery'
                      ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-sm'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>توصيل للمنزل</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateOrderDetails({ orderType: 'pickup' })}
                  className={`p-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    orderDetails.orderType === 'pickup'
                      ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-sm'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>استلام سفري</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateOrderDetails({ orderType: 'dinein' })}
                  className={`p-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    orderDetails.orderType === 'dinein'
                      ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-sm'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>داخل الصالة</span>
                </button>
              </div>
            </div>

            {/* Customer Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-stone-400 block font-medium">
                  الاسم الكريم <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={orderDetails.customerName}
                  onChange={(e) => updateOrderDetails({ customerName: e.target.value })}
                  placeholder="مثال: أبو محمد"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-stone-400 block font-medium">رقم الهاتف للتواصل:</label>
                <input
                  type="tel"
                  dir="ltr"
                  value={orderDetails.customerPhone}
                  onChange={(e) => updateOrderDetails({ customerPhone: e.target.value })}
                  placeholder="0539XXXXXXX / 0988XXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 text-right"
                />
              </div>
            </div>

            {/* Delivery Area & Address (if delivery) */}
            {orderDetails.orderType === 'delivery' && (
              <div className="space-y-3 pt-2 border-t border-stone-800/80">
                <div className="space-y-1.5">
                  <label className="text-xs text-stone-400 block font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>المنطقة / الحي في مدينة الباب:</span>
                  </label>
                  <select
                    value={orderDetails.deliveryArea}
                    onChange={(e) => updateOrderDetails({ deliveryArea: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    {availableAreas.map((area) => (
                      <option key={area} value={area} className="bg-stone-900">
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-stone-400 block font-medium">
                    العنوان بالتفصيل (الشارع، البناء، علامة مميزة) <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={orderDetails.deliveryAddress}
                    onChange={(e) => updateOrderDetails({ deliveryAddress: e.target.value })}
                    placeholder="مثال: بالقرب من جامع الإيمان، مقابل سوبرماركت النور، الطابق 2"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs text-stone-400 block font-medium">ملاحظات عامة على الطلب (اختياري):</label>
              <input
                type="text"
                value={orderDetails.notes}
                onChange={(e) => updateOrderDetails({ notes: e.target.value })}
                placeholder="مثال: يرجى إحضار فكة 500 ليرة، أو الاتصال قبل الوصول بـ 5 دقائق"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Order Summary & Live WhatsApp Message Bubble */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-bold text-stone-300">معاينة الرسالة المجهزة للواتساب:</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">تم النسخ بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ نص الرسالة</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0b141a] border border-[#202c33] text-stone-200 text-xs sm:text-sm font-sans whitespace-pre-line leading-relaxed shadow-inner max-h-48 overflow-y-auto selection:bg-emerald-600 selection:text-white">
              {messageText}
            </div>
          </div>

          {/* Quick contact and restaurant info banner */}
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>واتساب المطعم:</span>
              <span className="font-mono text-stone-200 font-bold" dir="ltr">
                {restaurantConfig.whatsappNumber}
              </span>
            </div>
            <span className="text-amber-400 font-semibold">تأكيد فوري خلال دقيقة</span>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-auto text-right">
            <span className="text-[11px] text-stone-400 block">المبلغ المطلوب:</span>
            <span className="text-xl font-black text-amber-400 font-mono">
              {formatPrice(grandTotalTRY, currency, restaurantConfig)}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>نسخ الرسالة</span>
            </button>

            <button
              type="button"
              onClick={handleSendViaWhatsApp}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4 rotate-180" />
              <span>إرسال الطلب عبر واتساب 📲</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
