import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

interface User {
  id: string;
  phone: string;
  createdAt?: any;
  lastLogin?: any;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved session on mount
  useEffect(() => {
    const checkSession = async () => {
      const savedPhone = localStorage.getItem('metrix_user_phone');
      if (savedPhone) {
        try {
          await login(savedPhone);
        } catch (error) {
          console.error("Session restoration failed:", error);
          localStorage.removeItem('metrix_user_phone');
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (phone: string) => {
    // Robust normalization
    let userId = phone.replace(/\D/g, ''); 
    
    // Normalize KZ/RU numbers (8777... -> 7777...)
    if (userId.length === 11 && userId.startsWith('8')) {
      userId = '7' + userId.substring(1);
    }
    
    // If user enters local format without code (e.g. 7071234567), assume 7 prefix
    if (userId.length === 10) {
      userId = '7' + userId;
    }

    const userRef = doc(db, 'users', userId);
    
    try {
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Update last login
        await updateDoc(userRef, {
          lastLogin: serverTimestamp()
        });
        const userData = userSnap.data() as User;
        setUser({ ...userData, id: userId });
      } else {
        // Create new user
        const newUser: User = {
          id: userId,
          phone: phone,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          isAdmin: false
        };
        await setDoc(userRef, newUser);
        setUser(newUser);
      }

      // Persist session
      localStorage.setItem('metrix_user_phone', phone);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('metrix_user_phone');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
