import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

declare global {
    interface Window {
        particlesJS?: any;
    }
}

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });
    
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        if (typeof window !== 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js';
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                if (window.particlesJS) {
                    window.particlesJS('particles-js', {
                        particles: {
                            number: { value: 80, density: { enable: true, value_area: 800 } },
                            color: { value: '#ffffff' },
                            shape: { type: 'circle' },
                            opacity: { value: 0.3 },
                            size: { value: 3, random: true },
                            line_linked: {
                                enable: true,
                                distance: 150,
                                color: '#0080ff',
                                opacity: 0.4,
                                width: 1,
                            },
                            move: {
                                enable: true,
                                speed: 2,
                                direction: 'none',
                                random: false,
                                straight: false,
                                out_mode: 'out',
                                bounce: false,
                            },
                        },
                        interactivity: {
                            detect_on: 'canvas',
                            events: {
                                onhover: { enable: true, mode: 'repulse' },
                                onclick: { enable: true, mode: 'push' },
                                resize: true,
                            },
                        },
                    });
                }
            };

            return () => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            };
        }
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]">
            <div id="particles-js" className="absolute inset-0 z-0"></div>

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
                <div
                    className={`w-full max-w-md overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                        }`}
                    style={{
                        background: 'rgba(20, 20, 20, 0.9)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <div className="p-8">
                        {/* Logo */}
                        <div className="mb-6 flex flex-col items-center justify-center space-y-2">
                            <div className="flex items-center justify-center gap-4">
                                <img
                                    src="https://www.umariana.edu.co/images2022/portada/Logo-UniversidadMariana2022.png"
                                    alt="Universidad Mariana"
                                    className="h-20"
                                />
                            </div>
                            <h1 className="mt-10 text-2xl font-bold text-white text-center">
                                Recupera tu contraseña
                            </h1>
                            <p className="text-sm text-gray-300 text-left">
                                Ingresa tu correo para recibir un enlace de restablecimiento
                            </p>
                        </div>

                        <Head title="Recuperar contraseña" />

                        {status && <div className="mb-4 text-center text-sm font-medium text-green-500">{status}</div>}

                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-4">
                                {/* Campo de correo */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-white">
                                        Correo electrónico
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="off"
                                        value={data.email}
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="micorreo@gmail.com"
                                        className="bg-gray-900 text-white placeholder:text-gray-400"
                                    />
                                    <InputError message={errors.email} className="text-red-500" />
                                </div>

                                {/* Botón de enviar */}
                                <Button
                                    type="submit"
                                    className="mt-2 w-full bg-blue-700 text-white hover:bg-blue-800"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Enviando...
                                        </span>
                                    ) : (
                                        'Enviar enlace de recuperación'
                                    )}
                                </Button>

                                {/* Enlace de login */}
                                <div className="text-center text-sm text-gray-400">
                                    ¿Recordaste tu contraseña?{' '}
                                    <TextLink href={route('login')} className="text-blue-400 hover:underline">
                                        Iniciar sesión
                                    </TextLink>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}