import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  orderBy,
  Timestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, CreateOrder, OrderStatus, User, Food } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useOrders(userId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q;
    
    if (userId) {
      // User-specific orders
      q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    } else {
      // All orders (for chef dashboard)
      q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      );
    }
    
    const unsubscribe = onSnapshot(q, 
      async (snapshot) => {
        const ordersData = await Promise.all(
          snapshot.docs.map(async (orderDoc) => {
            const orderData = { id: orderDoc.id, ...orderDoc.data() } as Order;
            
            // Populate user data
            if (orderData.userId) {
              try {
                const userDoc = await getDoc(doc(db, 'users', orderData.userId));
                if (userDoc.exists()) {
                  orderData.user = { id: userDoc.id, ...userDoc.data() } as User;
                }
              } catch (error) {
                console.error('Error fetching user:', error);
              }
            }
            
            // Populate food data for items
            orderData.items = await Promise.all(
              orderData.items.map(async (item) => {
                try {
                  const foodDoc = await getDoc(doc(db, 'foods', item.foodId));
                  if (foodDoc.exists()) {
                    item.food = { id: foodDoc.id, ...foodDoc.data() } as Food;
                  }
                } catch (error) {
                  console.error('Error fetching food:', error);
                }
                return item;
              })
            );
            
            return orderData;
          })
        );
        
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to fetch orders.",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const createOrder = async (orderData: CreateOrder): Promise<void> => {
    try {
      const newOrder = {
        ...orderData,
        createdAt: Timestamp.now(),
      };
      
      await addDoc(collection(db, 'orders'), newOrder);
      toast({
        title: "Success",
        description: "Order placed successfully!",
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to place order.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      
      let message = '';
      switch (status) {
        case 'cooking':
          message = 'Order is now being prepared!';
          break;
        case 'ready':
          message = 'Order is ready for pickup!';
          break;
        case 'delivered':
          message = 'Order has been delivered!';
          break;
        default:
          message = 'Order status updated.';
      }
      
      toast({
        title: "Status Updated",
        description: message,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteOrder = async (orderId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      toast({
        title: "Success",
        description: "Order deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  };

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getOrdersByStatus,
  };
}