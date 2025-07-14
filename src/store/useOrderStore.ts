import { create } from 'zustand';
import { Order, OrderItem, Food } from '@/types';

interface OrderState {
  currentOrder: OrderItem[];
  addToOrder: (food: Food, quantity?: number) => void;
  removeFromOrder: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearOrder: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  currentOrder: [],
  
  addToOrder: (food, quantity = 1) => {
    const { currentOrder } = get();
    const existingItem = currentOrder.find(item => item.foodId === food.id);
    
    if (existingItem) {
      set({
        currentOrder: currentOrder.map(item =>
          item.foodId === food.id
            ? { ...item, qty: item.qty + quantity }
            : item
        )
      });
    } else {
      set({
        currentOrder: [...currentOrder, {
          foodId: food.id,
          food,
          qty: quantity,
          price: food.price
        }]
      });
    }
  },
  
  removeFromOrder: (foodId) => {
    set({
      currentOrder: get().currentOrder.filter(item => item.foodId !== foodId)
    });
  },
  
  updateQuantity: (foodId, quantity) => {
    if (quantity <= 0) {
      get().removeFromOrder(foodId);
      return;
    }
    
    set({
      currentOrder: get().currentOrder.map(item =>
        item.foodId === foodId
          ? { ...item, qty: quantity }
          : item
      )
    });
  },
  
  clearOrder: () => set({ currentOrder: [] }),
  
  getTotalAmount: () => {
    return get().currentOrder.reduce((total, item) => total + (item.price * item.qty), 0);
  },
  
  getTotalItems: () => {
    return get().currentOrder.reduce((total, item) => total + item.qty, 0);
  }
}));