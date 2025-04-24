// components/ContactList/index.tsx
'use client';

import { useEffect, useState } from 'react';
import Contacto from './Contacto';
import styles from './Contacto.module.css';
import api from '../../lib/api';

type Cuenta = {
  id: number;
  numero_cuenta: string;
};

type Usuario = {
  id: number;
  nombre: string;
};

type Contacto = {
  id: number
  contacto: Usuario
  cuenta: Cuenta
};

interface ContactListProps {
  title?: string;
}

export default function Contactos({ 
  title = "Lista de Contactos" 
}: ContactListProps) {
  const [contactos, setContactos] = useState<Array<Contacto>>([]);

  const fetchUserData = async () => {
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
    fetchUserData();
  }, []);

  // Usar los contactos iniciales si se proporcionan, de lo contrario usar los predeterminados
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar contactos según el término de búsqueda
  const filteredContacts = contactos.filter(contacto => 
    contacto.contacto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      
      {/* Búsqueda */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar contactos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      
      {/* Lista de contactos */}
      {filteredContacts.length > 0 ? (
        <div className={styles.contactList}>
          {filteredContacts.map(contacto => (
            <Contacto key={contacto.id} id={contacto.contacto.id} nombre={contacto.contacto.nombre} numeroCuenta={contacto.cuenta.numero_cuenta} />
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>No se encontraron contactos.</p>
      )}
    </div>
  );
}