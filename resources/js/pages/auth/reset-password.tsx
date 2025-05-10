import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

declare global {
    interface Window {
        particlesJS?: any;
    }
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [mounted, setMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
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
                        {/* Logo y título */}
                        <div className="mb-6 flex flex-col items-center justify-center space-y-2">
                            <div className="flex items-center justify-center gap-4">
                                <img
                                    src="https://www.umariana.edu.co/images2022/portada/Logo-UniversidadMariana2022.png"
                                    alt="Universidad Mariana"
                                    className="h-20"
                                />
                            </div>
                            <h1 className="mt-10 text-2xl font-bold text-white text-center">
                                Restablecer contraseña
                            </h1>
                            <p className="text-sm text-gray-300 text-center">
                                Por favor ingresa tu nueva contraseña
                            </p>
                        </div>

                        <Head title="Restablecer contraseña" />

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
                                        autoComplete="email"
                                        value={data.email}
                                        readOnly
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="bg-gray-900 text-white placeholder:text-gray-400"
                                    />
                                    <InputError message={errors.email} className="text-red-500" />
                                </div>

                                {/* Campo de contraseña */}
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-white">
                                        Nueva contraseña
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            autoComplete="new-password"
                                            value={data.password}
                                            autoFocus
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            className="bg-gray-900 text-white placeholder:text-gray-400 pr-10"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                                            onClick={() => setShowPassword(!showPassword)}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="text-red-500" />
                                </div>

                                {/* Campo de confirmación */}
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation" className="text-white">
                                        Confirmar contraseña
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="password_confirmation"
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="••••••••"
                                            className="bg-gray-900 text-white placeholder:text-gray-400 pr-10"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password_confirmation} className="text-red-500" />
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
                                            Actualizando...
                                        </span>
                                    ) : (
                                        'Restablecer contraseña'
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