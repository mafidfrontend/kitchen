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
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Food, CreateFood, FoodCategory } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useFoods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'foods'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const foodsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Food[];
        
        setFoods(foodsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching foods:', error);
        toast({
          title: "Error",
          description: "Failed to fetch menu items.",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addFood = async (foodData: CreateFood): Promise<void> => {
    try {
      await addDoc(collection(db, 'foods'), foodData);
      toast({
        title: "Success",
        description: "Menu item added successfully.",
      });
    } catch (error) {
      console.error('Error adding food:', error);
      toast({
        title: "Error",
        description: "Failed to add menu item.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateFood = async (id: string, updates: Partial<Food>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'foods', id), updates);
      toast({
        title: "Success",
        description: "Menu item updated successfully.",
      });
    } catch (error) {
      console.error('Error updating food:', error);
      toast({
        title: "Error",
        description: "Failed to update menu item.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteFood = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'foods', id));
      toast({
        title: "Success",
        description: "Menu item deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting food:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getFoodsByCategory = (category: FoodCategory) => {
    return foods.filter(food => food.category === category);
  };

  const getAvailableFoods = () => {
    return foods.filter(food => food.isAvailable);
  };

  return {
    foods,
    loading,
    addFood,
    updateFood,
    deleteFood,
    getFoodsByCategory,
    getAvailableFoods,
  };
}