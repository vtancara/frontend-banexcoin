import React from 'react';
import Link from 'next/link';
import { UserProvider } from '@/contexts/UserContext';

// Definir la interfaz para las props
interface UsersLayoutProps {
  children: React.ReactNode;
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  return (
    <div className="py-6">
      <header className="mb-6 border-b pb-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link
                    href="/"
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contactos"
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    Contactos
                  </Link>
                </li>
                {/* Podrías agregar más enlaces de navegación relacionados con usuarios */}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <UserProvider>
        {children}
      </UserProvider>

      <footer className="mt-8 py-4 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          User Management Module - {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}