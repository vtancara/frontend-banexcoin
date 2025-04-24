// components/ContactList/ContactItem.tsx
import { useState } from 'react';
import styles from './Contacto.module.css';

interface ContactItemProps {
  id: number;
  nombre: string;
  numeroCuenta: string;
}

export default function Contacto({ id, nombre, numeroCuenta }: ContactItemProps) {
  const [showAccount, setShowAccount] = useState(false);

  const formatNumeroCuenta = (numeroCuenta: string) => {
    if (!numeroCuenta) return '';
    if (showAccount) {
      return numeroCuenta;
    }
    const lastFour = numeroCuenta.slice(-4);
    return `xxxx-xxxx-xxxx-${lastFour}`;
  };
  console.log('Account Number:', numeroCuenta, id, nombre);

  return (
    <div className={styles.contactItem}>
      <p className={styles.contactName}>{nombre}</p>
        <span>Número de cuenta: </span>
      {formatNumeroCuenta(numeroCuenta)}
      
        <button
          className={styles.toggleButton}
          onClick={() => setShowAccount(!showAccount)}
        >
          {showAccount ? 'Ocultar' : 'Mostrar'}
        </button>
      
    </div>
  );
}