'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Contactos from '@/components/contactos';
import TransferModal from '@/components/transferencias/ModalTransferencia';

interface Cuenta {
  id: number;
  numero_cuenta: string;
  saldo: number;
}

export default function Dashboard() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verModal, setVerModal] = useState(false);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<Cuenta>({} as Cuenta);
  const router = useRouter();

  useEffect(() => {
    const selectedUserId = localStorage.getItem('selectedUserId');

    if (!selectedUserId) {
      router.push('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Obtener cuentas del usuario
        const cuentasResponse = await api.get(`/cuentas/usuario/${selectedUserId}`);
        setCuentas(cuentasResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const showModalTransferencia = (cuenta: Cuenta) => { 
    setVerModal(!verModal)
    console.log('Cuenta seleccionada:', cuenta);
    setCuentaSeleccionada(cuenta)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TransferModal isOpen={verModal} onClose={() => setVerModal(false)} cuenta={cuentaSeleccionada} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Tus Cuentas</h2>
            {cuentas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cuentas.map(cuenta => (
                  <div key={cuenta.id} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      {cuenta.numero_cuenta}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      ${cuenta.saldo ? cuenta.saldo : '0.00'}
                    </p>
                    <div className="mt-4 space-x-2">
                      <button className="bg-blue-100 hover:bg-blue-400 hover:text-blue-600 cursor-pointer text-blue-600 px-3 py-1 rounded text-sm">
                        Ver Detalles
                      </button>
                      <button className="bg-green-100 hover:bg-green-400 hover:text-green-600 text-green-600 cursor-pointer px-3 py-1 rounded" onClick={() => showModalTransferencia(cuenta)}>
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
          <div className="mb-8">
            <Contactos></Contactos>
          </div>
        </div>
      </main>
    </div>
  );
}