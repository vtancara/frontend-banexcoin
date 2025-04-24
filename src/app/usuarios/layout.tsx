'use client'
import React, { Fragment, useEffect, useState } from 'react';
import { UserProvider } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
// Definir la interfaz para las props
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}
interface UsersLayoutProps {
  children: React.ReactNode;
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  
  const router = useRouter();
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const selectedUserId = localStorage.getItem('selectedUserId');

    if (!selectedUserId) {
      router.push('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Obtener información del usuario
        const userResponse = await api.get(`/usuarios/${selectedUserId}`);
        setUser(userResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [router]);
  
  const handleLogout = () => {
    localStorage.removeItem('selectedUserId');
    router.push('/');
  };
  return (
    <Fragment>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            SISTEMA DE REFERIDOS
          </h1>
          <div className="flex items-center">
            <span className="mr-4">{user?.nombre}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      <UserProvider>
        {children}
      </UserProvider>

      <footer className="mt-8 py-4 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          Sistema de referidos - {new Date().getFullYear()}
        </div>
      </footer>
    </Fragment>
  );
}