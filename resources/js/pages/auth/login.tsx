import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle,Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

declare global {
    interface Window {
        particlesJS?: any;
    }
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
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
        post(route('login'), {
            onFinish: () => reset('password'),
        });
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
                        {/* Logos en fila */}
                        <div className="mb-6 flex flex-col items-center justify-center space-y-2">
                            <div className="flex items-center justify-center gap-4">
                                <img
                                    src="https://www.umariana.edu.co/images2022/portada/Logo-UniversidadMariana2022.png"
                                    alt="Universidad Mariana"
                                    className="h-20"
                                />
                            </div>
                            <h1 className="mt-10 text-2xl font-bold text-white text-center">
                                Inicia sesión en tu cuenta
                            </h1>
                            <p className="text-sm text-gray-300 text-center">
                                Ingresa tu correo institucional y contraseña para acceder
                            </p>
                        </div>

                        <Head title="Iniciar sesión" />

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
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        className="bg-gray-900 text-white placeholder:text-gray-400"
                                    />
                                    <InputError message={errors.email} className="text-red-500" />
                                </div>

                                {/* Campo de contraseña */}
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-white">
                                        Contraseña
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        className="bg-gray-900 text-white placeholder:text-gray-400"
                                    />
                                      
                                    <InputError message={errors.password} className="text-red-500" />
                                </div>

                                {/* Checkbox */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={data.remember}
                                        onClick={() => setData('remember', !data.remember)}
                                    />
                                    <Label htmlFor="remember" className="text-sm text-white">
                                        Recuérdame
                                    </Label>
                                </div>

                                {/* Enlace recuperar contraseña */}
                                {canResetPassword && (
                                    <div className="text-right">
                                        <TextLink href={route('password.request')} className="text-sm text-blue-400 hover:underline">
                                            ¿Olvidaste tu contraseña?
                                        </TextLink>
                                    </div>
                                )}

                                {/* Botón de enviar */}
                                <Button
                                    type="submit"
                                    className="mt-2 w-full bg-blue-700 text-white hover:bg-blue-800"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Iniciando...
                                        </span>
                                    ) : (
                                        'Iniciar Sesión'
                                    )}
                                </Button>

                                {/* Enlace de registro */}
                                <div className="text-center text-sm text-gray-400">
                                    ¿No tienes una cuenta?{' '}
                                    <TextLink href={route('register')} className="text-blue-400 hover:underline">
                                        Únete
                                    </TextLink>
                                </div>

                                {/* Estado */}
                                {status && (
                                    <div className="mt-2 text-center text-sm font-medium text-green-500">
                                        {status}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
