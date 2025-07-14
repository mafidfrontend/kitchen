import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, DailyStats, FoodCategory } from '@/types';

export function useStats(date?: Date) {
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'orders'),
      where('createdAt', '>=', Timestamp.fromDate(startOfDay)),
      where('createdAt', '<=', Timestamp.fromDate(endOfDay)),
      where('status', '==', 'delivered')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        // Calculate stats
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = orders.length;
        
        const categoryStats: DailyStats['categoryStats'] = {
          main: { count: 0, revenue: 0 },
          drink: { count: 0, revenue: 0 },
          salad: { count: 0, revenue: 0 },
          bread: { count: 0, revenue: 0 },
        };

        orders.forEach(order => {
          order.items.forEach(item => {
            if (item.food) {
              const category = item.food.category;
              categoryStats[category].count += item.qty;
              categoryStats[category].revenue += item.qty * item.price;
            }
          });
        });

        const dailyStats: DailyStats = {
          date: targetDate.toISOString().split('T')[0],
          totalRevenue,
          totalOrders,
          categoryStats,
        };

        setStats(dailyStats);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [date]);

  return {
    stats,
    loading,
  };
}