// components/TransferModal.tsx
'use client';

import api from '@/lib/api';
import { useEffect, useState } from 'react';

interface Cuenta {
  id: number;
  numero_cuenta: string;
  saldo: number;
}
interface Contacto {
  id: number;
  nombre: string;
  numeroCuenta: string;
}
interface CuentaContacto {
  id: number;
  contacto: Contacto;
  cuenta: Cuenta;
}
interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  cuenta: Cuenta
}

export default function TransferModal({ isOpen, onClose, cuenta }: TransferModalProps) {
  const [contactos, setContactos] = useState<Array<CuentaContacto>>([])
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    idCuentaOrigen: '',
    idCuentaDestino: '',
    monto: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const selectedUserId = localStorage.getItem('selectedUserId');
      // Obtener cuentas del usuario
      const contactosResponse = await api.get(`/contactos/usuario/${selectedUserId}`);
      setContactos(contactosResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
      // Inicializar el formulario con la cuenta de origen
      setForm({
        idCuentaOrigen: cuenta.id.toString(),
        idCuentaDestino: '',
        monto: '',
      });
    }
  }, [isOpen, cuenta]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;

    // Regex: solo números positivos con hasta 2 decimales
    const regex = /^\d*\.?\d{0,2}$/;

    if (regex.test(valor)) {
      setForm({ ...form, monto: valor });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Aquí puedes enviar los datos a tu API
      const transferData = {
        idCuentaOrigen: form.idCuentaOrigen,
        idCuentaDestino: form.idCuentaDestino,
        monto: parseFloat(form.monto)
      };

      console.log('Datos a enviar:', transferData);

      await api.post('/transacciones', transferData);
      // Cerrar el modal después de enviar
      onClose();
    } catch (error) {
      console.error('Error al realizar la transferencia:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Transferencia</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Cuenta de Origen</p>
            <p className="mt-1 text-base text-gray-900">{cuenta.numero_cuenta}</p>
            <p className="text-sm text-gray-500">Saldo disponible: ${cuenta.saldo}</p>
          </div>

          <div>
            <label htmlFor="idCuentaDestino" className="block text-sm font-medium text-gray-700">
              Cuenta de Destino
            </label>
            <select
              id="idCuentaDestino"
              name="idCuentaDestino"
              className="mt-1 w-full border border-gray-300 p-2 rounded"
              value={form.idCuentaDestino}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una cuenta</option>
              {contactos.map((contacto) => (
                <option key={contacto.contacto.id} value={contacto.cuenta.id}>
                  {contacto.contacto.nombre} - {contacto.cuenta.numero_cuenta}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="monto" className="block text-sm font-medium text-gray-700">
              Monto a transferir
            </label>
            <input
              type="text"
              id="monto"
              name="monto"
              value={form.monto}
              onChange={handleMontoChange}
              placeholder="Ej: 100.00"
              className="mt-1 w-full border border-gray-300 p-2 rounded"
              required
            />
            {parseFloat(form.monto) > cuenta.saldo && (
              <p className="text-red-500 text-sm mt-1">
                ¡El monto excede tu saldo disponible!
              </p>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-white px-4 py-2 rounded bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading || !form.idCuentaDestino || !form.monto || parseFloat(form.monto) > cuenta.saldo}
            >
              {loading ? 'Procesando...' : 'Transferir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}