// components/TransaccionesHistorialModal.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Cuenta {
  id: number;
  numero_cuenta: string;
  saldo: number;
}

interface Comision {
  monto: number;
  fechaHora: string;
}

interface Transferencia {
  id: number;
  monto: number;
  fechaHora: string;
  cuentaOrigen: Cuenta;
  cuentaDestino: Cuenta;
  comision: Array<Comision>;
}

interface TransaccionesHistorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  idCuenta: number;
}

export default function TransaccionesHistorialModal({
  isOpen,
  onClose,
  idCuenta
}: TransaccionesHistorialModalProps) {
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && idCuenta) {
      fetchTransferencias();
    }
  }, [isOpen, idCuenta]);

  const fetchTransferencias = async () => {
    try {
      setLoading(true);
      setError('');

      // Obtener transferencias enviadas y recibidas
      const [enviadas, recibidas] = await Promise.all([
        api.get(`/transacciones/enviadas/${idCuenta}`),
        api.get(`/transacciones/recibidas/${idCuenta}`)
      ]);

      // Combinar y ordenar por fecha (más reciente primero)
      const todasTransferencias = [
        ...enviadas.data,
        ...recibidas.data
      ].sort((a, b) =>
        new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
      );

      setTransferencias(todasTransferencias);
    } catch (error) {
      console.error('Error al obtener transferencias:', error);
      setError('No se pudieron cargar las transferencias');
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear la fecha
  const formatearFecha = (fechaStr: string) => {
    try {
      const fecha = new Date(fechaStr);
      return format(fecha, 'dd MMM yyyy, HH:mm', { locale: es });
    } catch (e) {
      return fechaStr;
    }
  };

  // Determinar si la transacción es entrada o salida respecto a esta cuenta
  const getTipoTransaccion = (transferencia: Transferencia) => {
    return transferencia.cuentaOrigen.id === idCuenta ? 'salida' : 'entrada';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Historial de Transacciones</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : transferencias.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No hay transacciones para mostrar</div>
          ) : (
            <div className="space-y-4">
              {transferencias.map((transferencia) => {
                const tipoTransaccion = getTipoTransaccion(transferencia);
                const esEntrada = tipoTransaccion === 'entrada';

                return (
                  <div
                    key={transferencia.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">
                          {esEntrada
                            ? `Recibido de: ${transferencia.cuentaOrigen.numero_cuenta}`
                            : `Enviado a: ${transferencia.cuentaDestino.numero_cuenta}`
                          }
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatearFecha(transferencia.fechaHora)}
                        </div>
                      </div>

                      <div className={`font-semibold ${esEntrada ? 'text-green-600' : 'text-red-600'}`}>
                        {esEntrada ? '+' : '-'}${Number(transferencia.monto).toFixed(2)}
                      </div>
                    </div>

                    {!esEntrada && transferencia && transferencia.comision && (
                      <div className="mt-2 text-sm text-gray-500">
                        Comisión: ${transferencia.comision[0].monto}
                      </div>
                    )}

                    <div className="mt-2 text-sm">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold mr-2 
                        ${esEntrada ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        {esEntrada ? 'Entrante' : 'Saliente'}
                      </span>
                      <span className="text-gray-500">ID: {transferencia.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 pt-2 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}