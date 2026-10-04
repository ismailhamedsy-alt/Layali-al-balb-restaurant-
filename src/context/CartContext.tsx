import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, ExtraOption, MenuItem, OrderDetails, SizeOption } from '../types/menu';

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity?: number,
    selectedSize?: SizeOption,
    selectedExtras?: ExtraOption[],
    notes?: string
  ) => void;
  quickDirectOrder: (
    item: MenuItem,
    quantity?: number,
    selectedSize?: SizeOption,
    selectedExtras?: ExtraOption[],
    notes?: string
  ) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotalTRY: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  orderDetails: OrderDetails;
  updateOrderDetails: (details: Partial<OrderDetails>) => void;
  resetOrderDetails: () => void;
  activeItemForCustomization: MenuItem | null;
  setActiveItemForCustomization: (item: MenuItem | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const INITIAL_ORDER_DETAILS: OrderDetails = {
  customerName: '',
  customerPhone: '',
  orderType: 'delivery',
  deliveryArea: 'دوار السنتر / وسط المدينة',
  deliveryAddress: '',
  notes: '',
  paymentMethod: 'cash',
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart items are stored temporarily during session
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = sessionStorage.getItem('layali_albab_cart_temp');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [activeItemForCustomization, setActiveItemForCustomization] = useState<MenuItem | null>(null);

  // PRIVACY FIRST: Customer details (Name, Phone, Address) are NOT stored in persistent localStorage.
  // They are strictly transient in memory for the active order session.
  const [orderDetails, setOrderDetails] = useState<OrderDetails>(INITIAL_ORDER_DETAILS);

  useEffect(() => {
    try {
      sessionStorage.setItem('layali_albab_cart_temp', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const updateOrderDetails = (details: Partial<OrderDetails>) => {
    setOrderDetails((prev) => ({ ...prev, ...details }));
  };

  const resetOrderDetails = () => {
    setOrderDetails(INITIAL_ORDER_DETAILS);
  };

  const addToCart = (
    item: MenuItem,
    quantity = 1,
    selectedSize?: SizeOption,
    selectedExtras: ExtraOption[] = [],
    notes = ''
  ) => {
    const basePrice = selectedSize ? selectedSize.priceTRY : item.priceTRY;
    const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.priceTRY, 0);
    const unitPriceTRY = basePrice + extrasTotal;
    const totalPriceTRY = unitPriceTRY * quantity;

    const extraIds = selectedExtras.map((e) => e.id).sort().join('-');
    const sizeId = selectedSize ? selectedSize.id : 'default';
    const cleanNotes = notes.trim();
    const cartItemId = `${item.id}_${sizeId}_${extraIds}_${cleanNotes}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        const existing = next[existingIndex];
        const newQty = existing.quantity + quantity;
        next[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPriceTRY: existing.unitPriceTRY * newQty,
        };
        return next;
      }
      return [
        ...prev,
        {
          cartItemId,
          menuItem: item,
          quantity,
          selectedSize,
          selectedExtras,
          notes: cleanNotes,
          unitPriceTRY,
          totalPriceTRY,
        },
      ];
    });
  };

  const quickDirectOrder = (
    item: MenuItem,
    quantity = 1,
    selectedSize?: SizeOption,
    selectedExtras: ExtraOption[] = [],
    notes = ''
  ) => {
    addToCart(item, quantity, selectedSize, selectedExtras, notes);
    setIsCheckoutModalOpen(true);
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => {
        if (ci.cartItemId === cartItemId) {
          return {
            ...ci,
            quantity: newQty,
            totalPriceTRY: ci.unitPriceTRY * newQty,
          };
        }
        return ci;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    try {
      sessionStorage.removeItem('layali_albab_cart_temp');
    } catch {
      // ignore
    }
  };

  const cartCount = cart.reduce((acc, ci) => acc + ci.quantity, 0);
  const subtotalTRY = cart.reduce((acc, ci) => acc + ci.totalPriceTRY, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        quickDirectOrder,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotalTRY,
        isCartOpen,
        setIsCartOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        orderDetails,
        updateOrderDetails,
        resetOrderDetails,
        activeItemForCustomization,
        setActiveItemForCustomization,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
