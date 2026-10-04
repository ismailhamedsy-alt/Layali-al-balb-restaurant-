export type Currency = 'TRY' | 'USD' | 'SYP';

export interface ExtraOption {
  id: string;
  name: string;
  priceTRY: number;
}

export interface SizeOption {
  id: string;
  name: string;
  priceTRY: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  priceTRY: number;
  image: string;
  badge?: string;
  isSpicy?: boolean;
  isPopular?: boolean;
  sizes?: SizeOption[];
  extras?: ExtraOption[];
  available?: boolean;
}

export interface CartItemOption {
  size?: SizeOption;
  selectedExtras: ExtraOption[];
  notes?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedSize?: SizeOption;
  selectedExtras: ExtraOption[];
  notes: string;
  unitPriceTRY: number;
  totalPriceTRY: number;
}

export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup' | 'dinein';
  deliveryArea?: string;
  deliveryAddress?: string;
  notes?: string;
  paymentMethod: 'cash' | 'transfer';
}

export interface RestaurantConfig {
  name: string;
  subtitle: string;
  city: string;
  whatsappNumber: string;
  secondaryPhone: string;
  address: string;
  openingHours: string;
  usdRate: number; // 1 USD = ? TRY
  sypRate: number; // 1 TRY = ? SYP
  deliveryFeeTRY: number;
  // Enhanced admin editable options
  isRestaurantOpen?: boolean;
  closedMessage?: string;
  freeDeliveryThresholdTRY?: number; // 0 = disabled
  minOrderAmountTRY?: number;
  deliveryAreas?: string[];
  announcementText?: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  oldPriceTRY: number;
  newPriceTRY: number;
  image: string;
  tag: string;
}
