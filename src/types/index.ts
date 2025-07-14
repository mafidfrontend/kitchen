import { Timestamp } from 'firebase/firestore';

// Food categories
export type FoodCategory = 'main' | 'drink' | 'salad' | 'bread';

// Order status
export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'delivered';

// User interface
export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

// Food interface
export interface Food {
  id: string;
  title: string;
  price: number;
  category: FoodCategory;
  isAvailable: boolean;
  description?: string;
  imageUrl?: string;
}

// Order item interface
export interface OrderItem {
  foodId: string;
  food?: Food; // Populated for display
  qty: number;
  price: number;
}

// Order interface
export interface Order {
  id: string;
  userId: string;
  user?: User; // Populated for display
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Timestamp;
  createdBy?: string;
  totalAmount: number;
  customerNotes?: string;
}

// Stats interface
export interface DailyStats {
  date: string;
  totalRevenue: number;
  totalOrders: number;
  categoryStats: {
    [key in FoodCategory]: {
      count: number;
      revenue: number;
    };
  };
}

// Create food interface (without id)
export type CreateFood = Omit<Food, 'id'>;

// Create order interface (without id and timestamps)
export type CreateOrder = Omit<Order, 'id' | 'createdAt' | 'user'>;