// src/contexts/UserContext.tsx
'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../lib/api';

interface User {
  id: number;
  nombre: string;
  correo: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

// Crear el contexto con un valor predeterminado undefined
const UserContext = createContext<UserContextType | undefined>(undefined);

// Exportar el Provider
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selectedUserId = localStorage.getItem('selectedUserId');
    
    if (selectedUserId) {
      api.get(`/usuarios/${selectedUserId}`)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          localStorage.removeItem('selectedUserId');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Crear el objeto de valor que se pasará al Provider
  const value = { user, setUser, loading };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}