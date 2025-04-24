'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

interface User {
  id: number;
  nombre: string;
  correo: string;
}

interface Account {
  id: number;
  saldo: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

        // Obtener cuentas del usuario
        const accountsResponse = await api.get(`/cuentas/usuario/${selectedUserId}`);
        setAccounts(accountsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('selectedUserId');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Tus Cuentas</h2>
            {accounts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map(account => (
                  <div key={account.id} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Cuenta #{account.id}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      ${account.saldo ? account.saldo.toFixed(2) : '0.00'}
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm">
                        Ver Detalles
                      </button>
                      <button className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm">
                        Transferir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No tienes cuentas registradas.</p>
            )}
          </div>

          {/* Aquí puedes añadir más secciones como lista de referidos, 
              historial de comisiones, etc. */}
        </div>
      </main>
    </div>
  );
}