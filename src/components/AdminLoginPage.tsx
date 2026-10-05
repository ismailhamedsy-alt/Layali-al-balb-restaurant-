import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertCircle, ArrowRight, Clock, ShieldAlert } from 'lucide-react';
import { useMenu } from '../context/MenuContext';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onBackToCustomerSite: () => void;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 180; // 3 minutes

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onBackToCustomerSite }) => {
  const { loginAdmin } = useMenu();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [failedCount, setFailedCount] = useState<number>(() => {
    try {
      const stored = sessionStorage.getItem('layali_admin_failed_count');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [lockoutUntil, setLockoutUntil] = useState<number>(() => {
    try {
      const stored = sessionStorage.getItem('layali_admin_lockout_until');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  // Lockout countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      if (lockoutUntil > now) {
        setSecondsRemaining(Math.ceil((lockoutUntil - now) / 1000));
      } else {
        setSecondsRemaining(0);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (secondsRemaining > 0) {
      setError(`النموذج مقفل مؤقتاً لحماية الأمان. يرجى الانتظار ${secondsRemaining} ثانية.`);
      return;
    }

    if (!password.trim()) {
      setError('يرجى إدخال رمز المرور السري');
      return;
    }

    const success = loginAdmin(password.trim());
    if (success) {
      // Clear lockout states on success
      setError(null);
      setPassword('');
      setFailedCount(0);
      try {
        sessionStorage.removeItem('layali_admin_failed_count');
        sessionStorage.removeItem('layali_admin_lockout_until');
      } catch (e) {
        console.error(e);
      }
      onSuccess();
    } else {
      const newCount = failedCount + 1;
      setFailedCount(newCount);
      try {
        sessionStorage.setItem('layali_admin_failed_count', newCount.toString());
      } catch (e) {
        console.error(e);
      }

      if (newCount >= MAX_FAILED_ATTEMPTS) {
        const lockTime = Date.now() + LOCKOUT_DURATION_SECONDS * 1000;
        setLockoutUntil(lockTime);
        try {
          sessionStorage.setItem('layali_admin_lockout_until', lockTime.toString());
        } catch (e) {
          console.error(e);
        }
        setError(`تم قفل الدخول مؤقتاً لمدة 3 دقائق بعد ${MAX_FAILED_ATTEMPTS} محاولات خاطئة لمنع التخمين والتلاعب.`);
      } else {
        const remaining = MAX_FAILED_ATTEMPTS - newCount;
        setError(`رمز المرور غير صحيح. (تبقى لك ${remaining} ${remaining === 1 ? 'محاولة واحدة' : 'محاولات'} قبل القفل الأمني)`);
      }
    }
  };

  const isLocked = secondsRemaining > 0;
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedCountdown = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

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

        {/* Lockout Warning Banner */}
        {isLocked && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 text-rose-200 text-xs flex items-center gap-3 animate-in fade-in">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 animate-pulse" />
            <div className="space-y-1">
              <p className="font-bold text-rose-300">النموذج مقفل مؤقتاً لحماية النظام من التخمين</p>
              <p className="flex items-center gap-1.5 text-stone-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>إعادة فتح الإمكانية بعد: <strong className="text-amber-400 font-mono text-sm">{formattedCountdown}</strong></span>
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && !isLocked && (
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
                disabled={isLocked}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder={isLocked ? 'النموذج مقفل مؤقتاً...' : '••••••'}
                autoFocus={!isLocked}
                className={`w-full px-4 py-3 rounded-xl bg-stone-950 border text-stone-100 placeholder:text-stone-600 focus:outline-none text-center tracking-widest font-mono text-base font-bold transition-all ${
                  isLocked ? 'border-rose-500/40 opacity-50 cursor-not-allowed' : 'border-stone-800 focus:border-amber-500'
                }`}
              />
              <button
                type="button"
                disabled={isLocked}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {showPassword ? 'إخفاء' : 'إظهار'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className={`w-full py-3.5 rounded-xl text-stone-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isLocked
                ? 'bg-stone-700 text-stone-400 cursor-not-allowed shadow-none opacity-60'
                : 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/25 cursor-pointer'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{isLocked ? `يرجى الانتظار (${formattedCountdown})` : 'تسجيل الدخول إلى لوحة التحكم'}</span>
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
