import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { onAuthStateChange, getUserData } from '../services/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

// Create auth context
const AuthContext = createContext();

// Auth Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is admin
  const checkAdmin = useCallback(async () => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
    
    try {
      const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
      setIsAdmin(adminDoc.exists());
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  }, [currentUser]);
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      setLoading(true);
      
      if (user) {
        try {
          // Get additional user data
          const data = await getUserData(user.uid);
          setUserData(data);
          
          // Check admin status
          await checkAdmin();
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });
    
    // Cleanup subscription
    return unsubscribe;
  }, [checkAdmin]);
  
  // Update user data in context
  const updateUserData = async () => {
    if (!currentUser) return;
    
    try {
      const data = await getUserData(currentUser.uid);
      setUserData(data);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  
  // Context value
  const value = {
    currentUser,
    userData,
    loading,
    isAdmin,
    checkAdmin,
    updateUserData
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
