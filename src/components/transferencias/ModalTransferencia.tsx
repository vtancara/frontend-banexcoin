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
interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  cuenta: Cuenta
}

export default function TransferModal({ isOpen, onClose, cuenta }: TransferModalProps) {
  const [contactos, setContactos] = useState<Array<Contacto>>([])
  const [idCuentaDestino, setIdCuentaDestino] = useState<number | null>(null);
  const [monto, setMonto] = useState("");

  const [form, setForm] = useState({
    idCuentaOrigen: '',
    idCuentaDestino: '',
    monto: '',
  });

  const fetchData = async () => {
    try {
      const selectedUserId = localStorage.getItem('selectedUserId');
      // Obtener cuentas del usuario
      const contactosResponse = await api.get(`/contactos/usuario/${selectedUserId}`);
      setContactos(contactosResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos enviados:', form);
    onClose();
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;

    // Regex: solo números positivos con hasta 2 decimales
    const regex = /^\d*\.?\d{0,2}$/;

    if (regex.test(valor)) {
      setMonto(valor);
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
          </div>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            onChange={(e) => setIdCuentaDestino(Number(e.target.value))}
          >
            <option value="">Selecciona una cuenta</option>
            {contactos.map((contacto) => (
              <option key={contacto.contacto.id} value={contacto.cuenta.id}>
                {contacto.contacto.nombre} - {contacto.cuenta.id} - {contacto.cuenta.numero_cuenta}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={monto}
            onChange={handleMontoChange}
            placeholder="Ej: 100.00"
            className="w-full border border-gray-300 p-2 rounded"
            required
          />

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Enviar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}