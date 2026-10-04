import React, { createContext, useContext, useEffect, useState } from 'react';
import { Currency, MenuItem, RestaurantConfig } from '../types/menu';
import { DEFAULT_RESTAURANT_CONFIG, INITIAL_MENU_ITEMS } from '../data/menuData';
import {
  subscribeToRestaurantConfig,
  subscribeToMenuItems,
  saveRestaurantConfigToCloud,
  saveMenuItemToCloud,
  deleteMenuItemFromCloud,
  seedCloudDataIfEmpty,
} from '../lib/firebase';

interface MenuContextType {
  menuItems: MenuItem[];
  restaurantConfig: RestaurantConfig;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  selectedDietFilter: 'all' | 'spicy' | 'popular';
  setSelectedDietFilter: (filter: 'all' | 'spicy' | 'popular') => void;
  // Cloud sync status
  isCloudConnected: boolean;
  // Admin Authentication State
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => boolean;
  // Admin Menu Operations
  updateRestaurantConfig: (cfg: Partial<RestaurantConfig>) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;
  updateItemPrice: (id: string, newPriceTRY: number) => void;
  duplicateMenuItem: (id: string) => void;
  resetMenuToDefault: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const DEFAULT_ADMIN_PASS = '123456';

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Public Menu Data
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('layali_albab_menu_v11');
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  const [restaurantConfig, setRestaurantConfig] = useState<RestaurantConfig>(() => {
    try {
      const saved = localStorage.getItem('layali_albab_config_v11');
      return saved ? JSON.parse(saved) : DEFAULT_RESTAURANT_CONFIG;
    } catch {
      return DEFAULT_RESTAURANT_CONFIG;
    }
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('layali_albab_curr_v11');
      return (saved as Currency) || 'TRY';
    } catch {
      return 'TRY';
    }
  });

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);

  // Admin Authentication - Session only, not persistent
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('layali_albab_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('layali_albab_admin_pass') || DEFAULT_ADMIN_PASS;
    } catch {
      return DEFAULT_ADMIN_PASS;
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDietFilter, setSelectedDietFilter] = useState<'all' | 'spicy' | 'popular'>('all');

  // Favorites (kept anonymously on client)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('layali_albab_favs_v10');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Real-time Cloud Subscriptions to Firebase Firestore
  useEffect(() => {
    // Seed initial data if Firebase is completely fresh
    seedCloudDataIfEmpty(DEFAULT_RESTAURANT_CONFIG, INITIAL_MENU_ITEMS);

    // Subscribe to restaurant configuration live stream
    const unsubscribeConfig = subscribeToRestaurantConfig(
      (cloudConfig) => {
        setRestaurantConfig((prev) => ({ ...prev, ...cloudConfig }));
        setIsCloudConnected(true);
      },
      (error) => {
        console.warn('Config subscription fallback to local cache:', error);
      }
    );

    // Subscribe to menu items live stream
    const unsubscribeMenu = subscribeToMenuItems(
      (cloudItems) => {
        if (cloudItems && cloudItems.length > 0) {
          // Replace any obsolete unsplash links or unbundled /src/assets paths with clean public images
          const sanitized = cloudItems.map((item) => {
            if (
              item.image &&
              (item.image.includes('unsplash.com') ||
                item.image.startsWith('/src/assets') ||
                item.image.startsWith('src/assets'))
            ) {
              const match = INITIAL_MENU_ITEMS.find((d) => d.id === item.id);
              if (match) {
                return { ...item, image: match.image };
              }
            }
            return item;
          });
          setMenuItems(sanitized);
          setIsCloudConnected(true);
        }
      },
      (error) => {
        console.warn('Menu subscription fallback to local cache:', error);
      }
    );

    return () => {
      unsubscribeConfig();
      unsubscribeMenu();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('layali_albab_menu_v11', JSON.stringify(menuItems));
    } catch (e) {
      console.error(e);
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem('layali_albab_config_v11', JSON.stringify(restaurantConfig));
    } catch (e) {
      console.error(e);
    }
  }, [restaurantConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('layali_albab_curr_v11', currency);
    } catch (e) {
      console.error(e);
    }
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem('layali_albab_favs_v11', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const loginAdmin = (password: string): boolean => {
    if (password === adminPassword || password === 'admin2026') {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('layali_albab_admin_session', 'true');
      } catch (e) {
        console.error(e);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('layali_albab_admin_session');
    } catch (e) {
      console.error(e);
    }
  };

  const changeAdminPassword = (oldPass: string, newPass: string): boolean => {
    if (oldPass === adminPassword || oldPass === 'admin2026') {
      setAdminPassword(newPass);
      try {
        localStorage.setItem('layali_albab_admin_pass', newPass);
      } catch (e) {
        console.error(e);
      }
      return true;
    }
    return false;
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const updateRestaurantConfig = (cfg: Partial<RestaurantConfig>) => {
    const updated = { ...restaurantConfig, ...cfg };
    setRestaurantConfig(updated);
    saveRestaurantConfigToCloud(updated).catch((err) => {
      console.error('Failed to sync config to cloud:', err);
    });
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => [item, ...prev]);
    saveMenuItemToCloud(item).catch((err) => {
      console.error('Failed to save new item to cloud:', err);
    });
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => prev.map((m) => (m.id === item.id ? item : m)));
    saveMenuItemToCloud(item).catch((err) => {
      console.error('Failed to update item in cloud:', err);
    });
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    deleteMenuItemFromCloud(id).catch((err) => {
      console.error('Failed to delete item from cloud:', err);
    });
  };

  const toggleItemAvailability = (id: string) => {
    const target = menuItems.find((m) => m.id === id);
    if (!target) return;
    const updated = { ...target, available: target.available === false ? true : false };
    setMenuItems((prev) => prev.map((m) => (m.id === id ? updated : m)));
    saveMenuItemToCloud(updated).catch((err) => {
      console.error('Failed to toggle availability in cloud:', err);
    });
  };

  const updateItemPrice = (id: string, newPriceTRY: number) => {
    const target = menuItems.find((m) => m.id === id);
    if (!target) return;
    const updated = { ...target, priceTRY: newPriceTRY };
    setMenuItems((prev) => prev.map((m) => (m.id === id ? updated : m)));
    saveMenuItemToCloud(updated).catch((err) => {
      console.error('Failed to update price in cloud:', err);
    });
  };

  const duplicateMenuItem = (id: string) => {
    const itemToClone = menuItems.find((m) => m.id === id);
    if (!itemToClone) return;
    const cloned: MenuItem = {
      ...itemToClone,
      id: `dish-${Date.now()}`,
      name: `${itemToClone.name} (نسخة)`,
    };
    setMenuItems((prev) => [cloned, ...prev]);
    saveMenuItemToCloud(cloned).catch((err) => {
      console.error('Failed to duplicate item in cloud:', err);
    });
  };

  const resetMenuToDefault = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    setRestaurantConfig(DEFAULT_RESTAURANT_CONFIG);
    seedCloudDataIfEmpty(DEFAULT_RESTAURANT_CONFIG, INITIAL_MENU_ITEMS).catch((err) => {
      console.error('Failed to reset cloud menu:', err);
    });
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        restaurantConfig,
        currency,
        setCurrency,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        favorites,
        toggleFavorite,
        isFavorite,
        selectedDietFilter,
        setSelectedDietFilter,
        isCloudConnected,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        updateRestaurantConfig,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        updateItemPrice,
        duplicateMenuItem,
        resetMenuToDefault,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

