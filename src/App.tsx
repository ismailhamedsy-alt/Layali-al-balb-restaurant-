import React, { useEffect, useRef, useState } from 'react';
import { MenuProvider, useMenu } from './context/MenuContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SpecialOffers } from './components/SpecialOffers';
import { CategoryNav } from './components/CategoryNav';
import { MenuItemCard } from './components/MenuItemCard';
import { ItemCustomizerModal } from './components/ItemCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppOrderModal } from './components/WhatsAppOrderModal';
import { FavoritesModal } from './components/FavoritesModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { RestaurantInfo } from './components/RestaurantInfo';
import { Footer } from './components/Footer';
import { formatPrice } from './utils/formatters';

// Detect whether the current address corresponds to the dedicated Admin portal (/admin, #admin, ?admin)
function checkIsAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    path.endsWith('/admin') ||
    path.endsWith('/admin/') ||
    path.includes('/admin') ||
    hash.includes('admin') ||
    search.includes('admin')
  );
}

const AppRouter: React.FC = () => {
  const {
    menuItems,
    activeCategory,
    searchQuery,
    selectedDietFilter,
    currency,
    restaurantConfig,
    isAdminAuthenticated,
  } = useMenu();

  const { cartCount, subtotalTRY, setIsCartOpen } = useCart();

  // Route state
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => checkIsAdminRoute());
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Sync with browser URL navigation and history
  useEffect(() => {
    const handleUrlChange = () => {
      setIsAdminRoute(checkIsAdminRoute());
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateTo = (target: string) => {
    if (target === '/') {
      const base = import.meta.env.BASE_URL || './';
      window.history.pushState({}, '', base);
    } else {
      window.history.pushState({}, '', target);
    }
    setIsAdminRoute(checkIsAdminRoute());
  };

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // =========================================================================
  // DEDICATED ADMIN ADDRESS (/admin)
  // Completely isolated from the customer page. Zero customer UI elements.
  // =========================================================================
  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLoginPage
          onSuccess={() => setIsAdminRoute(true)}
          onBackToCustomerSite={() => navigateTo('/')}
        />
      );
    }
    return (
      <AdminDashboard onBackToCustomerSite={() => navigateTo('/')} />
    );
  }

  // =========================================================================
  // CUSTOMER SITE (/)
  // 100% Customer Facing: Pure fast food menu & direct WhatsApp ordering.
  // ZERO admin buttons, ZERO lock icons, ZERO admin references.
  // =========================================================================

  const filteredItems = menuItems.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    if (selectedDietFilter === 'popular' && !item.isPopular) {
      return false;
    }
    if (selectedDietFilter === 'spicy' && !item.isSpicy) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      
      {/* Customer Navigation Bar */}
      <Navbar
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Hero Banner */}
      <Hero onScrollToMenu={scrollToMenu} />

      {/* Featured Special Offers & Combos */}
      <SpecialOffers />

      {/* Menu Anchor & Sticky Category Tabs */}
      <div ref={menuRef}>
        <CategoryNav />
      </div>

      {/* Main Dishes Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-800/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              قائمة طعام ليالي الباب
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              اختر وجبتك المفضلة، خصص الحجم والإضافات، أو اضغط على "طلب فوري" للإرسال المباشر عبر واتساب
            </p>
          </div>

          <div className="text-xs font-semibold text-stone-400">
            <span>{filteredItems.length} وجبة متوفرة</span>
          </div>
        </div>

        {/* Empty Search State */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-stone-900/40 rounded-3xl border border-stone-800/60 p-8 my-6">
            <div className="w-16 h-16 rounded-full bg-stone-800 mx-auto flex items-center justify-center text-amber-400 text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-white">لا توجد نتائج مطابقة لبحثك</h3>
            <p className="text-sm text-stone-400 max-w-md mx-auto">
              جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً مثل الشاورما أو البروستد أو البرغر.
            </p>
          </div>
        ) : (
          /* Dishes Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </main>

      {/* Restaurant Address & Delivery Zones in Al-Bab */}
      <RestaurantInfo />

      {/* Customer Footer with Privacy Policy Link */}
      <Footer onOpenPrivacy={() => setIsPrivacyOpen(true)} />

      {/* Floating Direct WhatsApp Support */}
      <FloatingWhatsApp />

      {/* Customer Modals */}
      <ItemCustomizerModal />
      <CartDrawer />
      <WhatsAppOrderModal />
      <FavoritesModal isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />

      {/* Mobile Floating Cart Summary Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden animate-in slide-in-from-bottom duration-300">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-2xl shadow-amber-500/30 flex items-center justify-between cursor-pointer border border-amber-400/50"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-stone-950 text-amber-400 flex items-center justify-center font-bold text-sm">
                {cartCount}
              </div>
              <span className="text-sm">معاينة الطلب والسلة</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base font-mono">
                {formatPrice(subtotalTRY, currency, restaurantConfig)}
              </span>
              <span className="text-xs bg-stone-950/20 px-2 py-0.5 rounded-md">عرض</span>
            </div>
          </button>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <MenuProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </MenuProvider>
  );
}
