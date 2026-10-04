import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Server, MessageCircle, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 text-stone-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">سياسة الخصوصية وحماية البيانات</h2>
              <span className="text-xs text-stone-400">مطعم ليالي الباب - مدينة الباب</span>
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
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6 text-sm text-stone-300 leading-relaxed">
          
          {/* Privacy Score / Commitment Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>خصوصية تامة 100% وأمان للبيانات الشخصية</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/90">
              نلتزم في مطعم ليالي الباب بأعلى معايير حماية الخصوصية الرقمية. تطبيقنا مصمم بحيث لا يجمع أو يخزن أو يشارك أي بيانات شخصية خاصة بالزبائن على أي خوادم خارجية أو قواعد بيانات تتبّع.
            </p>
          </div>

          {/* Principle 1 */}
          <div className="space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
              <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>1. عدم تخزين البيانات الشخصية للزبائن</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              عند إدخال اسمك أو رقم هاتفك أو عنوان التوصيل داخل أحياء مدينة الباب لتجهيز طلبك، تُحفظ هذه البيانات بشكل مؤقت ولحظي فقط في ذاكرة الجلسة النشطة (Session) لتنسيق رسالة الطلب، ولا يتم حفظها في الذاكرة الدائمة للجهاز أو مشاركتها مع أي طرف ثالث.
            </p>
          </div>

          {/* Principle 2 */}
          <div className="space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>2. الإرسال المشفر طرفاً لطرف عبر واتساب</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              يتم نقل وتأكيد طلبك مباشرة من هاتفك أو متصفحك إلى هاتف المطعم عبر بروتوكول تطبيق واتساب المشفّر (End-to-End Encryption)، مما يضمن عدم اطلاع أي جهة خارجية أو وسيط على محتوى طلبك أو تفاصيل عنوانك.
            </p>
          </div>

          {/* Principle 3 */}
          <div className="space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
              <Server className="w-4 h-4 text-amber-400 shrink-0" />
              <span>3. عدم وجود ملفات تتبع إعلانية أو كوكيز تتبّع</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              الموقع لا يحتوي على أي برمجيات تتبع طرف ثالث أو إعلانات موجهة أو بكسلات رصد سلوك المستخدم. يتم استخدام التخزين المحلي فقط لحفظ التفضيلات العامة مثل العملة المفضلة (ليرة تركية، دولار، ليرة سورية) أو الوجبات التي تضع عليها إشارة إعجاب.
            </p>
          </div>

          {/* Principle 4 */}
          <div className="space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>4. الفصل الأمني الكامل لإدارة المطعم</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              نظام إدارة المطعم وتعديل الأسعار معزول تماماً ومحمٍ بنظام تسجيل دخول مستقل ومصادقة مشفرة للمالك، ولا يمكن للزبائن أو المتصفحين الوصول إلى صلاحيات التعديل.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-500">تم التحديث: 2026</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm cursor-pointer"
          >
            فهمت وموافق
          </button>
        </div>

      </div>
    </div>
  );
};
