import { useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/hooks/use-toast';

export function useAuth() {
  const { user, firebaseUser, loading, setUser, setFirebaseUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = {
          id: firebaseUser.uid,
          displayName: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || undefined,
        };
        setUser(user);
        setFirebaseUser(firebaseUser);
      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setFirebaseUser, setLoading]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "Welcome!",
        description: "Successfully signed in with Google.",
      });
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      logout();
      toast({
        title: "Goodbye!",
        description: "Successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    firebaseUser,
    loading,
    signInWithGoogle,
    signOut: signOutUser,
    isAuthenticated: !!user,
  };
}