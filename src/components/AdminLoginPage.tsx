import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertCircle, ArrowLeft, ArrowRight, Store } from 'lucide-react';
import { useMenu } from '../context/MenuContext';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onBackToCustomerSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onBackToCustomerSite }) => {
  const { loginAdmin } = useMenu();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('يرجى إدخال رمز المرور السري');
      return;
    }

    const success = loginAdmin(password.trim());
    if (success) {
      setError(null);
      setPassword('');
      onSuccess();
    } else {
      setError('كلمة المرور غير صحيحة، يرجى التحقق وإعادة المحاولة.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans text-stone-100">
      
      {/* Background Subtle Gradient & Accents */}
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 via-transparent to-stone-950 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Admin Gateway Card */}
      <div className="relative w-full max-w-md bg-stone-900/90 backdrop-blur-xl rounded-3xl border border-stone-800 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
        
        {/* Top Logo & Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-xl shadow-amber-500/20 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center text-3xl font-black text-amber-400">
              🍗
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>عنوان الإدارة المحمي والمستقل</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              بوابة إدارة مطعم ليالي الباب
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              منطقة مخصصة للمالك والإدارة لتعديل وجبات المنيو والأسعار والإعدادات
            </p>
          </div>
        </div>

        {/* Security Alert Note */}
        <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800 text-xs text-stone-400 leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            هذا العنوان منفصل تماماً عن صفحة الزبائن لضمان الأمان والخصوصية. يرجى إدخال رمز المرور للمتابعة.
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>رمز مرور الإدارة (Admin PIN / Password):</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 text-center tracking-widest font-mono text-base font-bold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs font-semibold cursor-pointer"
              >
                {showPassword ? 'إخفاء' : 'إظهار'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Lock className="w-4 h-4" />
            <span>تسجيل الدخول إلى لوحة التحكم</span>
          </button>
        </form>

        {/* Back to Public Customer Site link */}
        <div className="pt-2 border-t border-stone-800 text-center">
          <button
            type="button"
            onClick={onBackToCustomerSite}
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة إلى موقع وقائمة الزبائن العامة</span>
          </button>
        </div>

      </div>

      {/* Footer copyright */}
      <div className="mt-8 text-center text-xs text-stone-600">
        مطعم ليالي الباب - نظام إدارة المطعم المستقل © {new Date().getFullYear()}
      </div>

    </div>
  );
};
