import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function AccessDenied({ message = 'Solo Administradores pueden acceder a esta sección.' }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <Head title="Acceso Denegado" />
            
            <div className="relative bg-gray-900 bg-opacity-80 p-8 rounded-2xl shadow-xl max-w-md text-center border border-gray-700 animate-fade-in">
                {/* Icono con efecto de brillo */}
                <div className="flex justify-center">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg animate-pulse">
                        <ShieldAlert className="text-white w-10 h-10" />
                    </div>
                </div>

                <h1 className="text-3xl font-extrabold text-white mt-4 animate-fade-in">Acceso Denegado</h1>
                <p className="text-gray-300 mt-2 animate-fade-in-delayed">{message}</p>
                
                <Link href="/dashboard" className="mt-6 inline-block animate-fade-in-delayed">
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300">
                        🚀 Volver al Dashboard
                    </Button>
                </Link>
            </div>

            {/* Animaciones con Tailwind */}
            <style>
                {`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                .animate-fade-in-delayed {
                    animation: fade-in 0.8s ease-out;
                }
                `}
            </style>
        </div>
    );
}