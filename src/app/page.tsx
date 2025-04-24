'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '../lib/api';

interface User {
  id: number;
  nombre: string;
  correo: string;
  imagenUrl?: string;
}

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/usuarios');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (userId: number) => {
    // Guardar el usuario seleccionado en localStorage o en un estado global
    localStorage.setItem('selectedUserId', userId.toString());
    // Navegar a la página del dashboard
    router.push('/usuarios');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Banner del sistema de referidos */}
      <div className="relative h-80 bg-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-opacity-30 bg-blue-900 z-10"></div>
        <Image
          src="/images/referral-banner.jpg"
          alt="Sistema de Referidos"
          width={1920}
          height={500}
          className="object-cover w-full h-full opacity-80"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white p-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Sistema de Referidos
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-2xl">
            Cada transacción genera comisiones para quien te recomendó. ¡Únete y comienza a ganar!
          </p>
        </div>
      </div>

      {/* Selector de usuarios */}
      <div className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800">
          Selecciona un usuario para continuar
        </h2>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user.id)}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer hover:shadow-lg"
              >
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  {user.imagenUrl ? (
                    <Image
                      src={user.imagenUrl}
                      alt={user.nombre}
                      width={150}
                      height={150}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                      {user.nombre.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800">{user.nombre}</h3>
                  <p className="text-gray-600 text-sm mt-1">{user.correo}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Información sobre el sistema */}
      <div className="bg-gray-100 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            ¿Cómo funciona nuestro sistema de referidos?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">1. Invita amigos</h3>
              <p className="text-gray-600">Comparte tu enlace único de referido con tus amigos y conocidos.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">2. Ellos realizan transacciones</h3>
              <p className="text-gray-600">Cuando tus referidos hacen transferencias o pagos, se genera una comisión.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">3. Tú ganas comisiones</h3>
              <p className="text-gray-600">Recibes el 50% de la comisión del 1% de cada transacción realizada.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}