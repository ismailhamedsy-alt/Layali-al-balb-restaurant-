import React, { useState } from 'react';
import {
  Store,
  LogOut,
  Eye,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Check,
  Phone,
  DollarSign,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  EyeOff,
  Image as ImageIcon,
  KeyRound,
  ArrowRight,
  MapPin,
  Clock,
  Bike,
  Upload,
  Camera,
  Megaphone,
  Power,
  Gift,
  Coins,
  Building,
  CheckCircle2,
  Download,
  Code,
  FileJson,
  Globe,
} from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { MenuItem, SizeOption, ExtraOption } from '../types/menu';
import {
  CATEGORIES,
  AL_BAB_AREAS,
  REAL_AL_DEMASHKI_IMAGES,
} from '../data/menuData';
import { formatPrice, compressImageFile, resolveImageUrl } from '../utils/formatters';

interface AdminDashboardProps {
  onBackToCustomerSite: () => void;
}

const IMAGE_PRESETS = [
  { name: 'وجبة سكلوب الركن الدمشقي ⭐', url: REAL_AL_DEMASHKI_IMAGES.escalopeMeal },
  { name: 'وجبة كرسبي الركن الدمشقي 🍗', url: REAL_AL_DEMASHKI_IMAGES.crispyMeal },
  { name: 'نصف وجبة كريسبي 🍗', url: REAL_AL_DEMASHKI_IMAGES.crispyHalf },
  { name: 'وجبة زنجر حار 💥', url: REAL_AL_DEMASHKI_IMAGES.zingerMeal },
  { name: 'سندويش زنجر عادي 🥪', url: REAL_AL_DEMASHKI_IMAGES.zingerSandwich },
  { name: 'زنجر صمون فرنسي 🥖', url: REAL_AL_DEMASHKI_IMAGES.zingerSamoon },
  { name: 'نصف وجبة سبايسي 🌶️', url: REAL_AL_DEMASHKI_IMAGES.spicyHalf },
  { name: 'سوبريم صمون فاخر ✨', url: REAL_AL_DEMASHKI_IMAGES.supremeSamoon },
  { name: 'صمون برغر 🍔', url: REAL_AL_DEMASHKI_IMAGES.burger },
  { name: 'شاورما عادي 🌯', url: REAL_AL_DEMASHKI_IMAGES.shawarmaSandwich },
  { name: 'شاورما صمون 🌯', url: REAL_AL_DEMASHKI_IMAGES.shawarmaSamoon },
  { name: 'كتوبية شاورما 🌯', url: REAL_AL_DEMASHKI_IMAGES.katubiyaShawarma },
  { name: 'شاورما فرط نصف كيلو 🍗', url: REAL_AL_DEMASHKI_IMAGES.shawarmaHalfKg },
  { name: 'شاورما فرط ربع كيلو 🍗', url: REAL_AL_DEMASHKI_IMAGES.shawarmaQuarterKg },
  { name: 'سندويش بطاطا عادي 🌯', url: REAL_AL_DEMASHKI_IMAGES.potatoSandwich },
  { name: 'سندويش بطاطا صمون 🥖', url: REAL_AL_DEMASHKI_IMAGES.potatoSamoon },
  { name: 'بطاطا اكسترا صمون 🍟', url: REAL_AL_DEMASHKI_IMAGES.potatoExtraSamoon },
  { name: 'وجبة بطاطا فريت 🍟', url: REAL_AL_DEMASHKI_IMAGES.friesMeal },
  { name: 'وجبة بطاطا حجم كبير 🍟', url: REAL_AL_DEMASHKI_IMAGES.friesLarge },
  { name: 'تشكن فرايز عادي 🍟', url: REAL_AL_DEMASHKI_IMAGES.chickenFries },
  { name: 'تشكن فرايز كبير 🚀', url: REAL_AL_DEMASHKI_IMAGES.chickenFriesLarge },
  { name: 'كبة مقلية بالدجاج 🧆', url: REAL_AL_DEMASHKI_IMAGES.friedKibbeh },
  { name: 'كولا لتر عائلي 🥤', url: REAL_AL_DEMASHKI_IMAGES.colaLiter },
  { name: 'كينزا تنك كانز 🥤', url: REAL_AL_DEMASHKI_IMAGES.kinzaCan },
  { name: 'لبن عيران بارد 🥛', url: REAL_AL_DEMASHKI_IMAGES.ayran },
  { name: 'صمون فارغ طازج 🥖', url: REAL_AL_DEMASHKI_IMAGES.breadSamoon },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToCustomerSite }) => {
  const {
    menuItems,
    restaurantConfig,
    currency,
    updateRestaurantConfig,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    updateItemPrice,
    duplicateMenuItem,
    resetMenuToDefault,
    logoutAdmin,
    changeAdminPassword,
    isCloudConnected,
  } = useMenu();

  const [activeTab, setActiveTab] = useState<'items' | 'delivery' | 'new-item' | 'settings' | 'export'>('items');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Currently editing item in dashboard
  const [activeEditingItem, setActiveEditingItem] = useState<MenuItem | null>(null);

  // Delivery settings form state
  const [deliveryFee, setDeliveryFee] = useState(restaurantConfig.deliveryFeeTRY.toString());
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState((restaurantConfig.freeDeliveryThresholdTRY ?? 350).toString());
  const [minOrderAmount, setMinOrderAmount] = useState((restaurantConfig.minOrderAmountTRY ?? 50).toString());
  const [areas, setAreas] = useState<string[]>(
    restaurantConfig.deliveryAreas && restaurantConfig.deliveryAreas.length > 0
      ? [...restaurantConfig.deliveryAreas]
      : [...AL_BAB_AREAS]
  );
  const [newAreaInput, setNewAreaInput] = useState('');

  // Restaurant settings form state
  const [restName, setRestName] = useState(restaurantConfig.name);
  const [restSubtitle, setRestSubtitle] = useState(restaurantConfig.subtitle);
  const [phone, setPhone] = useState(restaurantConfig.whatsappNumber);
  const [secondaryPhone, setSecondaryPhone] = useState(restaurantConfig.secondaryPhone || '');
  const [address, setAddress] = useState(restaurantConfig.address);
  const [hours, setHours] = useState(restaurantConfig.openingHours);
  const [usdRate, setUsdRate] = useState(restaurantConfig.usdRate.toString());
  const [sypRate, setSypRate] = useState(restaurantConfig.sypRate.toString());
  const [isOpen, setIsOpen] = useState(restaurantConfig.isRestaurantOpen !== false);
  const [closedMsg, setClosedMsg] = useState(restaurantConfig.closedMessage || 'المطعم مغلق حالياً، نستقبل طلباتكم في أوقات العمل الرسمية');
  const [announcement, setAnnouncement] = useState(restaurantConfig.announcementText || '');

  // Generate menuData.ts content for 1-click export to GitHub & Vercel
  const generateMenuDataTsCode = () => {
    return `import { MenuItem, RestaurantConfig } from '../types/menu';

export const DEFAULT_RESTAURANT_CONFIG: RestaurantConfig = ${JSON.stringify(restaurantConfig, null, 2)};

export const AL_BAB_AREAS = ${JSON.stringify(restaurantConfig.deliveryAreas || AL_BAB_AREAS, null, 2)};

export const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};

export const INITIAL_MENU_ITEMS: MenuItem[] = ${JSON.stringify(menuItems, null, 2)};
`;
  };

  const handleDownloadMenuDataTs = () => {
    const code = generateMenuDataTsCode();
    const blob = new Blob([code], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menuData.ts';
    a.click();
    URL.revokeObjectURL(url);
    setSaveSuccessMsg('تم تنزيل ملف menuData.ts المحدث بنجاح! 📥 احفظه في مسار src/data/menuData.ts في GitHub');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleCopyMenuDataTs = () => {
    const code = generateMenuDataTsCode();
    navigator.clipboard.writeText(code);
    setSaveSuccessMsg('تم نسخ كود menuData.ts بالكامل إلى الحافظة! 📋');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleDownloadJson = () => {
    const data = {
      restaurantConfig,
      menuItems,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `layali-albab-menu-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSaveSuccessMsg('تم تنزيل ملف النسخة الاحتياطية JSON بنجاح! 💾');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.restaurantConfig) updateRestaurantConfig(parsed.restaurantConfig);
        if (Array.isArray(parsed.menuItems)) {
          // Replace menu items
          localStorage.setItem('layali_albab_menu_v8', JSON.stringify(parsed.menuItems));
          window.location.reload();
        }
        setSaveSuccessMsg('تم استيراد بيانات المنيو بنجاح! ✅');
      } catch (err) {
        alert('ملف غير صالح، يرجى اختيار ملف JSON صحيح');
      }
    };
    reader.readAsText(file);
  };

  // Security: change password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passSuccessMsg, setPassSuccessMsg] = useState<string | null>(null);
  const [passErrorMsg, setPassErrorMsg] = useState<string | null>(null);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState('western');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemBadge, setNewItemBadge] = useState('');
  const [newItemImage, setNewItemImage] = useState(REAL_AL_DEMASHKI_IMAGES.escalopeMeal);

  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Handler for saving delivery settings
  const handleSaveDeliverySettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const feeNum = parseFloat(deliveryFee) || 0;
    const freeThreshNum = parseFloat(freeDeliveryThreshold) || 0;
    const minOrderNum = parseFloat(minOrderAmount) || 0;

    updateRestaurantConfig({
      deliveryFeeTRY: feeNum,
      freeDeliveryThresholdTRY: freeThreshNum,
      minOrderAmountTRY: minOrderNum,
      deliveryAreas: areas,
    });
    setSaveSuccessMsg(`تم حفظ وتحديث سعر التوصيل (${feeNum} ₺) وأحياء مدينة الباب بنجاح! 🛵✅`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Add new area to delivery list
  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaInput.trim()) return;
    if (areas.includes(newAreaInput.trim())) {
      alert('هذه المنطقة موجودة مسبقاً في القائمة');
      return;
    }
    const updated = [...areas, newAreaInput.trim()];
    setAreas(updated);
    setNewAreaInput('');
    updateRestaurantConfig({ deliveryAreas: updated });
    setSaveSuccessMsg(`تمت إضافة "${newAreaInput.trim()}" إلى مناطق التوصيل! ✅`);
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  // Remove area from delivery list
  const handleRemoveArea = (areaToRemove: string) => {
    const updated = areas.filter((a) => a !== areaToRemove);
    setAreas(updated);
    updateRestaurantConfig({ deliveryAreas: updated });
    setSaveSuccessMsg(`تم حذف منطقة "${areaToRemove}"`);
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  // Reset areas to default
  const handleResetAreas = () => {
    if (confirm('هل تريد استعادة قائمة أحياء الباب الافتراضية؟')) {
      setAreas([...AL_BAB_AREAS]);
      updateRestaurantConfig({ deliveryAreas: [...AL_BAB_AREAS] });
      setSaveSuccessMsg('تمت استعادة قائمة أحياء مدينة الباب الافتراضية بنجاح!');
      setTimeout(() => setSaveSuccessMsg(null), 2500);
    }
  };

  // Save General Restaurant Settings
  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantConfig({
      name: restName.trim(),
      subtitle: restSubtitle.trim(),
      whatsappNumber: phone.trim(),
      secondaryPhone: secondaryPhone.trim(),
      address: address.trim(),
      openingHours: hours.trim(),
      usdRate: parseFloat(usdRate) || 35,
      sypRate: parseFloat(sypRate) || 420,
      isRestaurantOpen: isOpen,
      closedMessage: closedMsg.trim(),
      announcementText: announcement.trim(),
    });
    setSaveSuccessMsg('تم حفظ وتحديث بيانات المطعم وحالة المتجر بنجاح! 💾✅');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;
    const ok = changeAdminPassword(oldPassword, newPassword);
    if (ok) {
      setPassSuccessMsg('تم تغيير كلمة مرور الإدارة بنجاح!');
      setPassErrorMsg(null);
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => setPassSuccessMsg(null), 4000);
    } else {
      setPassErrorMsg('كلمة المرور الحالية غير صحيحة!');
      setPassSuccessMsg(null);
    }
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    const created: MenuItem = {
      id: `dish-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCat,
      priceTRY: parseFloat(newItemPrice) || 0,
      description: newItemDesc.trim(),
      badge: newItemBadge.trim() || undefined,
      image: newItemImage,
      available: true,
    };

    addMenuItem(created);
    setSaveSuccessMsg(`تمت إضافة الوجبة "${newItemName}" بنجاح!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);

    // Reset new item form
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
    setNewItemBadge('');
    setActiveTab('items');
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col antialiased selection:bg-amber-500 selection:text-stone-950">
      
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-stone-900 border-b border-stone-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center text-2xl font-black shadow-lg shadow-amber-500/20">
                👨‍🍳
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-black text-white">
                    لوحة إدارة مطعم ليالي الباب
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    مزامنة سحابية مباشرة لجميع الزبائن ☁️
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  أي تعديل تحفظه هنا ينعكس فوراً وتلقائياً على هواتف جميع الزبائن دون إعادة نشر
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onBackToCustomerSite}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-stone-700"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>معاينة صفحة الزبائن</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  logoutAdmin();
                  onBackToCustomerSite();
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-rose-500/20"
                title="تسجيل الخروج وإنهاء الجلسة"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">تسجيل خروج</span>
              </button>
            </div>

          </div>
        </div>

        {/* Global Toast Notification */}
        {saveSuccessMsg && (
          <div className="bg-emerald-600 text-white font-bold py-2 px-4 text-center text-xs sm:text-sm animate-in fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="border-t border-stone-800/80 bg-stone-950/60 px-4 sm:px-8 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('items');
              setActiveEditingItem(null);
            }}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'items' && !activeEditingItem
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>إدارة وتعديل الأصناف والأسعار ({menuItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('delivery');
              setActiveEditingItem(null);
            }}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'delivery'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>إدارة التوصيل والمناطق ({restaurantConfig.deliveryFeeTRY} ₺)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('new-item');
              setActiveEditingItem(null);
            }}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'new-item'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>إضافة وجبة جديدة</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('settings');
              setActiveEditingItem(null);
            }}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>بيانات المطعم والإعلانات والأمان</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('export');
              setActiveEditingItem(null);
            }}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'export'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>نشر التعديلات لـ GitHub و Vercel 🚀</span>
          </button>

          {activeEditingItem && (
            <span className="py-3.5 px-4 text-xs font-bold text-amber-400 border-b-2 border-amber-400 flex items-center gap-1.5 whitespace-nowrap">
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل الوجبة والصورة: {activeEditingItem.name}</span>
            </span>
          )}
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* STATS OVERVIEW CARDS WITH QUICK INLINE DELIVERY EDITOR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
            <span className="text-xs text-stone-400 block">إجمالي أصناف المنيو</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">
              {menuItems.length}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
            <span className="text-xs text-stone-400 block">الوجبات المتوفرة حالياً</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
              {menuItems.filter((m) => m.available !== false).length}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
            <span className="text-xs text-stone-400 block">واتساب الطلبات الفعلي</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-amber-400 mt-2 block truncate" dir="ltr">
              {restaurantConfig.whatsappNumber}
            </span>
          </div>

          {/* Quick Delivery Fee Card with Live Inline Editor */}
          <div className="p-4 rounded-2xl bg-stone-900 border border-amber-500/30 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-400 font-bold block flex items-center gap-1">
                <Bike className="w-3.5 h-3.5" />
                سعر التوصيل في الباب
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                تعديل فوري
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => {
                  const val = e.target.value;
                  setDeliveryFee(val);
                  const num = parseFloat(val);
                  if (!isNaN(num)) {
                    updateRestaurantConfig({ deliveryFeeTRY: num });
                  }
                }}
                className="w-20 px-2.5 py-1 rounded-xl bg-stone-950 border border-amber-500/60 text-amber-400 font-mono font-black text-xl text-center focus:outline-none focus:ring-1 focus:ring-amber-500"
                title="عدّل السعر وسيحفظ تلقائياً"
              />
              <span className="text-base font-bold text-amber-400">₺</span>
              <button
                type="button"
                onClick={() => handleSaveDeliverySettings()}
                className="mr-auto px-2 py-1 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 cursor-pointer shadow"
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: MENU ITEMS LIST */}
        {activeTab === 'items' && !activeEditingItem && (
          <div className="space-y-6">
            
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900 p-4 rounded-2xl border border-stone-800">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="ابحث بالاسم أو المكونات لتعديل وجبة أو صورتها أو سعرها..."
                  className="w-full pr-10 pl-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs font-semibold text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">جميع الأقسام</option>
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setActiveTab('new-item')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>وجبة جديدة</span>
                </button>
              </div>
            </div>

            {/* Items Table / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, index) => {
                const isAvail = item.available !== false;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border bg-stone-900/90 p-4 flex flex-col justify-between transition-all ${
                      isAvail ? 'border-stone-800 hover:border-amber-500/40' : 'border-rose-950/60 opacity-60 bg-stone-950'
                    }`}
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={resolveImageUrl(item.image)}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-18 h-18 rounded-xl object-cover bg-stone-950 border border-stone-800"
                          />
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-stone-800 border border-stone-700 text-[10px] font-bold text-stone-300 flex items-center justify-center font-mono">
                            {index + 1}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-white truncate">
                              {item.name}
                            </h3>
                            {item.badge && (
                              <span className="text-[10px] text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Fast Inline Price Editor & Availability switch */}
                      <div className="mt-3 pt-3 border-t border-stone-800/60 flex items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-1.5 bg-stone-950 px-2.5 py-1 rounded-xl border border-stone-800">
                          <span className="text-[11px] text-stone-400 font-bold">السعر:</span>
                          <input
                            type="number"
                            value={item.priceTRY}
                            onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                            className="w-16 bg-transparent text-amber-400 font-black font-mono text-sm text-center focus:outline-none"
                            title="تعديل السعر المباشر"
                          />
                          <span className="text-xs font-bold text-amber-400">₺</span>
                        </div>

                        {/* Availability switch */}
                        <button
                          type="button"
                          onClick={() => toggleItemAvailability(item.id)}
                          className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                            isAvail
                              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                              : 'bg-rose-950/80 border border-rose-500/40 text-rose-400'
                          }`}
                        >
                          {isAvail ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{isAvail ? 'متوفر' : 'غير متوفر'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 pt-3 border-t border-stone-800/60 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveEditingItem(item)}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل الصنف والصورة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => duplicateMenuItem(item.id)}
                        className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs cursor-pointer"
                        title="نسخ الوجبة"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`حذف وجبة "${item.name}" نهائياً؟`)) {
                            deleteMenuItem(item.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs cursor-pointer"
                        title="حذف الوجبة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 2: DEDICATED DELIVERY & AREAS MANAGEMENT */}
        {activeTab === 'delivery' && !activeEditingItem && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Delivery Price & Threshold Card */}
            <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 space-y-6 shadow-xl">
              <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">إدارة وتعديل سعر التوصيل</h2>
                  <p className="text-xs text-stone-400">تحكم كامل بسعر التوصيل لكافة أحياء مدينة الباب وشروط التوصيل المجاني</p>
                </div>
              </div>

              <form onSubmit={handleSaveDeliverySettings} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Delivery Fee Input */}
                  <div className="p-4 rounded-2xl bg-stone-950 border border-amber-500/40 space-y-2">
                    <label className="text-xs font-black text-amber-400 block">
                      🛵 سعر التوصيل الأساسي (₺):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        required
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(e.target.value)}
                        placeholder="25"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-base font-black text-amber-400 font-mono focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-sm font-bold text-amber-400">ل.ت</span>
                    </div>
                    <span className="text-[11px] text-stone-400 block">
                      يُضاف هذا المبلغ تلقائياً على فاتورة الزبون عند اختيار خدمة التوصيل.
                    </span>
                  </div>

                  {/* Free Delivery Threshold */}
                  <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                    <label className="text-xs font-bold text-stone-200 block flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-emerald-400" />
                      توصيل مجاني للطلبات فوق (₺):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={freeDeliveryThreshold}
                        onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                        placeholder="350"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-base font-bold text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-sm font-bold text-stone-400">ل.ت</span>
                    </div>
                    <span className="text-[11px] text-stone-400 block">
                      إذا وصل طلب الزبون لهذا المبلغ يصبح التوصيل مجاناً (اكتب 0 لتعطيل العرض).
                    </span>
                  </div>

                  {/* Minimum Order Amount */}
                  <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                    <label className="text-xs font-bold text-stone-200 block">
                      الحد الأدنى لقيمة الطلب (₺):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={minOrderAmount}
                        onChange={(e) => setMinOrderAmount(e.target.value)}
                        placeholder="50"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-base font-bold text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-sm font-bold text-stone-400">ل.ت</span>
                    </div>
                    <span className="text-[11px] text-stone-400 block">
                      أقل قيمة للطلب قبل احتساب التوصيل.
                    </span>
                  </div>

                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/20 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ وتطبيق أسعار التوصيل فوراً</span>
                </button>
              </form>
            </div>

            {/* Delivery Areas & Neighborhoods Management in Al-Bab */}
            <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">أحياء ومناطق التوصيل في مدينة الباب</h2>
                    <p className="text-xs text-stone-400">يمكنك إضافة أحياء جديدة، حذف أي منطقة، أو تعديل نطاق التوصيل</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetAreas}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto border border-stone-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة الأحياء الافتراضية</span>
                </button>
              </div>

              {/* Add New Area Input */}
              <form onSubmit={handleAddArea} className="flex gap-2">
                <input
                  type="text"
                  value={newAreaInput}
                  onChange={(e) => setNewAreaInput(e.target.value)}
                  placeholder="اكتب اسم الحي أو المنطقة (مثال: حي الكواشف، طريق بزاعة، شارع زمزم...)"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ إضافة حي جديد</span>
                </button>
              </form>

              {/* Current Areas Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-400 block">
                  الأحياء المتاحة للزبائن حالياً ({areas.length} منطقة):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {areas.map((area, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-2 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-stone-200 truncate">{area}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveArea(area)}
                        className="p-1 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors shrink-0"
                        title="حذف الحي من التوصيل"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB: EDITING ACTIVE ITEM */}
        {activeEditingItem && (
          <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white">
                  تعديل الوجبة: {activeEditingItem.name}
                </h2>
                <p className="text-xs text-stone-400">تعديل الاسم والأسعار والأحجام والإضافات وتغيير الصورة أو رفع صورة جديدة</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveEditingItem(null)}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-300"
              >
                إلغاء والرجوع
              </button>
            </div>

            <ItemEditorForm
              item={activeEditingItem}
              onSave={(updated) => {
                updateMenuItem(updated);
                setActiveEditingItem(null);
                setSaveSuccessMsg('تم حفظ تعديل الوجبة وتحديث الصورة بنجاح! ✅');
                setTimeout(() => setSaveSuccessMsg(null), 3000);
              }}
              onCancel={() => setActiveEditingItem(null)}
            />
          </div>
        )}

        {/* TAB 3: CREATE NEW ITEM */}
        {activeTab === 'new-item' && !activeEditingItem && (
          <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 max-w-2xl mx-auto space-y-6">
            <div className="border-b border-stone-800 pb-4">
              <h2 className="text-xl font-black text-white">إضافة صنف وجبة جديد إلى المنيو</h2>
              <p className="text-xs text-stone-400">أدخل تفاصيل الوجبة وسعرها وصورتها لتظهر فوراً للزبائن</p>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-400 block">اسم الوجبة:</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="مثال: سكلوب عربي دبل، برغر دجاج مشوي..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-400 block">السعر الأساسي (₺):</label>
                  <input
                    type="number"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="120"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-400 block">القسم:</label>
                  <select
                    value={newItemCat}
                    onChange={(e) => setNewItemCat(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300 block">الوصف والمحتويات:</label>
                <textarea
                  rows={2}
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="مكونات الوجبة، طريقة التقديم، الإضافات..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300 block">شارة مميزة (اختياري):</label>
                <input
                  type="text"
                  value={newItemBadge}
                  onChange={(e) => setNewItemBadge(e.target.value)}
                  placeholder="مثال: جديد 🔥 / الأكثر طلباً / وجبة عائلية"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Dedicated Image Picker with upload from phone / presets */}
              <ImagePickerField
                label="صورة الوجبة (رفع من الجهاز أو اختيار من المعرض):"
                image={newItemImage}
                onChange={setNewItemImage}
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
              >
                إضافة الوجبة إلى المنيو فوراً
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: GENERAL RESTAURANT SETTINGS & SECURITY */}
        {activeTab === 'settings' && !activeEditingItem && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Store Status & Announcement Bar */}
            <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-stone-800 pb-3">
                <Power className="w-5 h-5 text-amber-400" />
                <span>حالة استقبال الطلبات وشريط الإعلانات</span>
              </h3>

              {/* Open / Closed Switch */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-200 block">حالة المطعم الآن:</span>
                  <span className="text-[11px] text-stone-400">
                    {isOpen ? 'المطعم مفتوح ويستقبل طلبات الزبائن' : 'المطعم مغلق مؤقتاً ولا يستقبل طلبات'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                    isOpen
                      ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
                      : 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isOpen ? 'مفتوح للطلب' : 'مغلق مؤقتاً'}</span>
                </button>
              </div>

              {/* Closed Message */}
              {!isOpen && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="text-xs font-bold text-rose-400 block">رسالة تظهر للزبائن عند الإغلاق:</label>
                  <input
                    type="text"
                    value={closedMsg}
                    onChange={(e) => setClosedMsg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-rose-950 text-xs text-rose-200 focus:outline-none"
                  />
                </div>
              )}

              {/* Announcement Banner */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-400 block flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>شريط إعلاني علوي يظهر لجميع الزبائن (اختياري):</span>
                </label>
                <textarea
                  rows={2}
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="مثال: خصم 10% اليوم على وجبات الشاورما العربي بمناسبة الافتتاح!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Currency & Rates */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-400 block">سعر $ مقابل ₺:</label>
                  <input
                    type="number"
                    value={usdRate}
                    onChange={(e) => setUsdRate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono text-stone-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-400 block">سعر ₺ مقابل ل.س:</label>
                  <input
                    type="number"
                    value={sypRate}
                    onChange={(e) => setSypRate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono text-stone-100"
                  />
                </div>
              </div>
            </div>

            {/* Restaurant Info & Contacts */}
            <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-stone-800 pb-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span>معلومات المطعم والتواصل في مدينة الباب</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-400 block">
                  رقم واتساب المطعم (تصل إليه جميع طلبات الزبائن):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+963991094644"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 font-mono text-right focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300 block">رقم هاتف إضافي (اتصال مباشر):</label>
                <input
                  type="text"
                  dir="ltr"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  placeholder="+963991094644"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 font-mono text-right focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300 block">عنوان المطعم في مدينة الباب:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مدينة الباب - مقابل الجامع الكبير، عند تقاطع شارع عصفور"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300 block">أوقات العمل اليومية:</label>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveGeneralSettings}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <Save className="w-4 h-4" />
                <span>حفظ بيانات المطعم والإعلانات</span>
              </button>
            </div>

            {/* Change Password Card & Reset */}
            <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 space-y-4 md:col-span-2">
              <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-stone-800 pb-3">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <span>أمان لوحة التحكم واستعادة البيانات</span>
              </h3>

              {passSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  {passSuccessMsg}
                </div>
              )}
              {passErrorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {passErrorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-stone-300 block mb-1">كلمة المرور الحالية:</label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور الحالية"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-300 block mb-1">كلمة المرور الجديدة:</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور الجديدة"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs cursor-pointer"
                  >
                    تحديث كلمة المرور
                  </button>
                </form>

                {/* Reset Menu Data */}
                <div className="space-y-3 p-4 bg-stone-950 rounded-2xl border border-stone-800 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">استعادة القائمة الافتراضية الأصلية</h4>
                    <p className="text-[11px] text-stone-400 leading-relaxed mt-1">
                      إذا رغبت في إعادة تعيين كافة الأصناف والأسعار إلى منيو مطعم ليالي الباب النموذجي الأصلي.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('هل أنت متأكد من استعادة بيانات المنيو الأصلية بالكامل؟')) {
                        resetMenuToDefault();
                        alert('تمت استعادة المنيو الأصلي بنجاح!');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-rose-500/20"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>استعادة المنيو الافتراضي</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: GITHUB & VERCEL PUBLISHING & EXPORT */}
        {activeTab === 'export' && !activeEditingItem && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Guide Card: Why changes weren't appearing on Vercel */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-3xl border border-amber-500/30 p-6 space-y-5 shadow-xl">
              <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-2xl">
                  🚀
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    نشر ومزامنة التعديلات إلى موقعك على Vercel و GitHub
                  </h2>
                  <p className="text-xs text-stone-400">
                    طريقة نشر التعديلات والأسعار وصور الوجبات لتظهر فوراً لجميع الزبائن على هواتفهم
                  </p>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-200 leading-relaxed space-y-2">
                <p className="font-bold flex items-center gap-1.5 text-amber-400 text-sm">
                  💡 لماذا لا تظهر التعديلات مباشرة على موقع Vercel بدون هذه الخطوة؟
                </p>
                <p>
                  عندما يتم نشر الموقع عبر <strong>GitHub وموقع Vercel</strong>، فإن سيرفر Vercel يقرأ قائمة الطعام والأسعار من ملف الكود البرمجي <code className="bg-stone-950 px-2 py-0.5 rounded text-amber-300 font-mono">src/data/menuData.ts</code> في مستودعك على GitHub.
                </p>
                <p>
                  التعديلات التي تجريها في لوحة الإدارة تُحفظ في متصفح جهازك. لكي يراها <strong>جميع الزبائن على أجهزتهم وهواتفهم</strong>، يمكنك تحميل ملف الكود المحدث بالزر أدناه واستبداله في مستودع GitHub، وسيقوم Vercel بنشره تلقائياً لجميع الزبائن خلال 20 ثانية مجاناً!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* Download menuData.ts */}
                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Download className="w-5 h-5 text-amber-400" />
                      <h3 className="text-sm font-bold text-white">تحميل ملف الكود (menuData.ts)</h3>
                    </div>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      ملف كود TypeScript جاهز يحتوي على جميع الوجبات والأسعار الحالية وتكلفة التوصيل، قم بتحميله ورفعه إلى GitHub.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadMenuDataTs}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>📥 تحميل ملف menuData.ts المحدث</span>
                  </button>
                </div>

                {/* Copy menuData.ts code */}
                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-sm font-bold text-white">نسخ الكود البرمجي بالكامل</h3>
                    </div>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      انسخ الكود ولصقه مباشرة داخل ملف <code className="text-amber-300 font-mono">src/data/menuData.ts</code> في موقع GitHub من المتصفح دون الحاجة لتنزيل أي برامج.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyMenuDataTs}
                    className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer border border-stone-700 active:scale-95 transition-all"
                  >
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>📋 نسخ الكود كاملاً إلى الحافظة</span>
                  </button>
                </div>

              </div>

              {/* Step by Step GitHub & Vercel Publishing Guide */}
              <div className="mt-4 p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>خطوات نشر التعديل لجميع الزبائن على Vercel بثوانٍ معدودة:</span>
                </h3>

                <ol className="space-y-3 text-xs text-stone-300 list-decimal list-inside pr-2">
                  <li className="leading-relaxed">
                    اضغط زر <span className="text-amber-400 font-bold">"تحميل ملف menuData.ts المحدث"</span> أعلاه.
                  </li>
                  <li className="leading-relaxed">
                    افتح مشروعك على موقع <strong>GitHub</strong> وادخل إلى المجلد: <code className="bg-stone-900 px-2 py-0.5 rounded text-amber-300 font-mono">src / data / menuData.ts</code>.
                  </li>
                  <li className="leading-relaxed">
                    اضغط على أيقونة القلم ✏️ للتعديل أو اختر <strong>Upload files</strong> واسحب الملف الذي قمت بتحميله.
                  </li>
                  <li className="leading-relaxed">
                    اضغط الزر الأخضر بالأسفل: <strong>Commit changes</strong>.
                  </li>
                  <li className="leading-relaxed text-emerald-300 font-bold">
                    🚀 تلقائياً يقوم موقع Vercel بإعادة بناء الموقع خلال 20 ثانية ونشر الأسعار والتعديلات لجميع الزبائن في العالم!
                  </li>
                </ol>
              </div>

              {/* JSON Backup & Restore */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-stone-200 block">نسخة احتياطية أو نقل البيانات بين الأجهزة:</span>
                  <span className="text-[11px] text-stone-400">يمكنك حفظ نسخة احتياطية من المنيو بصيغة JSON واستيرادها على أي هاتف آخر</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-stone-800"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير JSON</span>
                  </button>
                  <label className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-stone-800">
                    <Upload className="w-3.5 h-3.5" />
                    <span>استيراد JSON</span>
                    <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                  </label>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
};

// Reusable Image Picker Component (Upload from device / select preset / custom URL)
const ImagePickerField: React.FC<{
  label: string;
  image: string;
  onChange: (imgUrl: string) => void;
}> = ({ label, image, onChange }) => {
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImageFile(file, 800, 0.76);
      onChange(compressedDataUrl);
    } catch (err) {
      console.error('Image compression failed:', err);
      alert('حدث خطأ أثناء معالجة الصورة، يرجى المحاولة بصورة أخرى');
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="space-y-3 p-4 bg-stone-950 rounded-2xl border border-stone-800">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-amber-400 block">{label}</label>
        <span className="text-[11px] text-stone-400">يمكنك رفع صورة من هاتفك أو اختيار من النماذج</span>
      </div>

      {/* Preview current selected image */}
      <div className="flex items-center gap-4 bg-stone-900/90 p-3 rounded-xl border border-stone-800">
        <img
          src={resolveImageUrl(image)}
          alt="معاينة الصورة"
          referrerPolicy="no-referrer"
          className="w-20 h-20 object-cover rounded-xl border-2 border-amber-500/40 shrink-0 bg-stone-950"
          onError={(e) => {
            (e.target as HTMLImageElement).src = resolveImageUrl(REAL_AL_DEMASHKI_IMAGES.escalopeMeal);
          }}
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-200">الصورة الحالية للوجبة</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              معتمدة
            </span>
          </div>
          
          {/* Upload Button */}
          <div className="flex flex-wrap items-center gap-2">
            <label className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 ${
              isCompressing
                ? 'bg-amber-500/50 text-stone-900 pointer-events-none animate-pulse'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
            }`}>
              <Upload className="w-4 h-4" />
              <span>{isCompressing ? 'جاري ضغط وتحسين الصورة... ⏳' : '📁 رفع صورة من جهازك / الكاميرا'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isCompressing}
                onChange={handleFileUpload}
              />
            </label>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
            >
              {showUrlInput ? 'إخفاء الرابط' : 'أو إدخال رابط خارجي'}
            </button>
          </div>
        </div>
      </div>

      {/* Optional Custom URL input */}
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="الصق رابط صورة مباشر (https://...)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              if (customUrl.trim()) {
                onChange(customUrl.trim());
                setCustomUrl('');
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
          >
            تطبيق
          </button>
        </div>
      )}

      {/* Preset image selector */}
      <div>
        <span className="text-[11px] font-bold text-stone-400 block mb-2">
          أو اختر من صور الوجبات الجاهزة بالمطعم:
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2 max-h-56 overflow-y-auto p-1">
          {IMAGE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(p.url)}
              className={`p-1 rounded-xl border text-center transition-all cursor-pointer ${
                image === p.url
                  ? 'border-amber-500 bg-amber-500/10 shadow-sm ring-1 ring-amber-500'
                  : 'border-stone-800 hover:border-stone-700 bg-stone-900'
              }`}
            >
              <img
                src={p.url}
                alt={p.name}
                referrerPolicy="no-referrer"
                className="w-full h-12 object-cover rounded-lg mb-1 bg-stone-950"
              />
              <span className="text-[10px] text-stone-300 block truncate">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sub-component for editing an existing item within the dashboard
const ItemEditorForm: React.FC<{
  item: MenuItem;
  onSave: (updated: MenuItem) => void;
  onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [priceTRY, setPriceTRY] = useState(item.priceTRY.toString());
  const [description, setDescription] = useState(item.description);
  const [badge, setBadge] = useState(item.badge || '');
  const [image, setImage] = useState(item.image);
  const [available, setAvailable] = useState(item.available !== false);
  const [isSpicy, setIsSpicy] = useState(!!item.isSpicy);
  const [isPopular, setIsPopular] = useState(!!item.isPopular);

  const [sizes, setSizes] = useState<SizeOption[]>(item.sizes ? [...item.sizes] : []);
  const [extras, setExtras] = useState<ExtraOption[]>(item.extras ? [...item.extras] : []);

  // Size temp inputs
  const [newSizeName, setNewSizeName] = useState('');
  const [newSizePrice, setNewSizePrice] = useState('');

  // Extra temp inputs
  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState('');

  const handleAddSize = () => {
    if (!newSizeName.trim() || !newSizePrice) return;
    setSizes((prev) => [
      ...prev,
      { id: `sz-${Date.now()}`, name: newSizeName.trim(), priceTRY: parseFloat(newSizePrice) || 0 }
    ]);
    setNewSizeName('');
    setNewSizePrice('');
  };

  const handleAddExtra = () => {
    if (!newExtraName.trim() || !newExtraPrice) return;
    setExtras((prev) => [
      ...prev,
      { id: `ex-${Date.now()}`, name: newExtraName.trim(), priceTRY: parseFloat(newExtraPrice) || 0 }
    ]);
    setNewExtraName('');
    setNewExtraPrice('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      name: name.trim(),
      category,
      priceTRY: parseFloat(priceTRY) || 0,
      description: description.trim(),
      badge: badge.trim() || undefined,
      image: image.trim() || item.image,
      available,
      isSpicy,
      isPopular,
      sizes: sizes.length > 0 ? sizes : undefined,
      extras: extras.length > 0 ? extras : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-bold text-amber-400 block">اسم الوجبة:</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-amber-400 block">السعر الأساسي (₺):</label>
          <input
            type="number"
            required
            value={priceTRY}
            onChange={(e) => setPriceTRY(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-amber-400 block">القسم:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100"
          >
            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-stone-300 block">الوصف:</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100"
        />
      </div>

      {/* Available / Spicy / Popular */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-stone-950 rounded-2xl border border-stone-800 text-xs">
        <button
          type="button"
          onClick={() => setAvailable(!available)}
          className={`p-2 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer ${
            available ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}
        >
          {available ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{available ? 'متوفر' : 'غير متوفر'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSpicy(!isSpicy)}
          className={`p-2 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer ${
            isSpicy ? 'bg-rose-500/10 text-rose-400' : 'bg-stone-900 text-stone-400'
          }`}
        >
          <span>{isSpicy ? '🌶️ حار' : 'عادي'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsPopular(!isPopular)}
          className={`p-2 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer ${
            isPopular ? 'bg-amber-500/10 text-amber-400' : 'bg-stone-900 text-stone-400'
          }`}
        >
          <span>{isPopular ? '⭐ الأكثر طلباً' : 'عادي'}</span>
        </button>
      </div>

      {/* Full Image Management for existing item */}
      <ImagePickerField
        label="تعديل صورة الوجبة (رفع صورة من الهاتف / الكمبيوتر أو اختيار من المعرض):"
        image={image}
        onChange={setImage}
      />

      {/* Sizes Section */}
      <div className="space-y-2 p-3.5 bg-stone-950 rounded-2xl border border-stone-800">
        <label className="text-xs font-bold text-amber-400 block">الأحجام (اختياري):</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="اسم الحجم (مثال: دبل)"
            value={newSizeName}
            onChange={(e) => setNewSizeName(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100"
          />
          <input
            type="number"
            placeholder="السعر (₺)"
            value={newSizePrice}
            onChange={(e) => setNewSizePrice(e.target.value)}
            className="w-24 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 font-mono"
          />
          <button
            type="button"
            onClick={handleAddSize}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
          >
            + إضافة
          </button>
        </div>
        {sizes.map((s) => (
          <div key={s.id} className="flex justify-between items-center bg-stone-900 p-2 rounded-lg text-xs">
            <span>{s.name} - {s.priceTRY} ₺</span>
            <button
              type="button"
              onClick={() => setSizes((prev) => prev.filter((x) => x.id !== s.id))}
              className="text-rose-400 hover:text-rose-300"
            >
              حذف
            </button>
          </div>
        ))}
      </div>

      {/* Extras Section */}
      <div className="space-y-2 p-3.5 bg-stone-950 rounded-2xl border border-stone-800">
        <label className="text-xs font-bold text-amber-400 block">الإضافات المتاحة (اختياري):</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="اسم الإضافة (مثال: تومية إضافية)"
            value={newExtraName}
            onChange={(e) => setNewExtraName(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100"
          />
          <input
            type="number"
            placeholder="السعر (₺)"
            value={newExtraPrice}
            onChange={(e) => setNewExtraPrice(e.target.value)}
            className="w-24 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 font-mono"
          />
          <button
            type="button"
            onClick={handleAddExtra}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
          >
            + إضافة
          </button>
        </div>
        {extras.map((ex) => (
          <div key={ex.id} className="flex justify-between items-center bg-stone-900 p-2 rounded-lg text-xs">
            <span>{ex.name} - +{ex.priceTRY} ₺</span>
            <button
              type="button"
              onClick={() => setExtras((prev) => prev.filter((x) => x.id !== ex.id))}
              className="text-rose-400 hover:text-rose-300"
            >
              حذف
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-stone-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-bold text-xs"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          حفظ التعديلات والصورة
        </button>
      </div>
    </form>
  );
};
