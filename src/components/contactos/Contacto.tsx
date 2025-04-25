// components/ContactList/ContactItem.tsx
import styles from './Contacto.module.css';

interface ContactItemProps {
  id: number;
  nombre: string;
  numeroCuenta: string;
}

export default function Contacto({ id, nombre, numeroCuenta }: ContactItemProps) {

  const formatNumeroCuenta = (numeroCuenta: string) => {
    if (!numeroCuenta) return '';
    return numeroCuenta;
    const lastFour = numeroCuenta.slice(-4);
    return `xxxx-xxxx-xxxx-${lastFour}`;
  };
  console.log('Account Number:', numeroCuenta, id, nombre);

  return (
    <div className={styles.contactItem}>
      <div className="flex gap-4">
        <div className="w-1/2  p-4"> <p>{ nombre}</p></div>
        <div className="w-1/2 p-4">Número de cuenta: {formatNumeroCuenta(numeroCuenta)}</div>
      </div>
    </div>
  );
}