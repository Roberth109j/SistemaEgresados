import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [scrolled, setScrolled] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Detectar scroll para efectos de navegación
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        
        // Verificar preferencia de tema del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
        
        setMounted(true);

        // Cargar y configurar particles.js
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
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    // Cambiar entre modo claro y oscuro
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div 
                className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]"
            >
                <div id="particles-js" className="absolute inset-0 z-0"></div>
                
                <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-sm' : 'bg-transparent'}`}>
                    <div className="container mx-auto px-4 py-3">
                        <nav className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img 
                                    src="https://www.umariana.edu.co/dependencias/Contabilidad-Presupuesto/images/logo.png" 
                                    alt="Logo UNIMAR" 
                                    className="h-16 w-auto mr-2" 
                                    style={{maxWidth: "200px"}}
                                />
                            </div>
                            <div className="flex items-center">
                                {/* Botón Toggle Dark Mode */}
                                <button 
                                    onClick={toggleDarkMode} 
                                    className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
                                    aria-label="Toggle dark mode"
                                >
                                    {darkMode ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5M17.6859 17.69L18.5 18.5M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7553 2.29085L12.531 3.57467C11.9001 3.92206 11.2056 3.75 12 3.75V2.75ZM21.7092 12.2447C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 12.7944 22.5779 13.0999 21.0672 11.8568L21.7092 12.2447Z" fill="#fff"/>
                                        </svg>
                                    )}
                                </button>
                                
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-block rounded-md border border-[#3E3E3A] px-5 py-1.5 text-sm font-medium transition-all hover:bg-[#0057b7] hover:text-white hover:border-[#0057b7] text-[#EDEDEC] hover:border-[#2196f3] hover:bg-[#2196f3]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="inline-block rounded-md border border-transparent px-4 py-1.5 text-sm font-medium transition-all text-white hover:bg-[#161615] mr-2"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-block rounded-md border border-[#ff5252] bg-[#ff5252] px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-[#e53935] hover:border-[#e53935] border-[#ff5252] bg-[#ff5252] hover:bg-[#e53935] hover:border-[#e53935]"
                                        >
                                            Registrar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                </header>
                
                <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 mt-8">
                    <div 
                        className={`w-full max-w-4xl overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                        style={{
                            background: 'rgba(20, 20, 20, 0.9)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <main className="flex w-full flex-col-reverse lg:flex-row overflow-hidden">
                            <div className="flex-1 p-5 pb-6 text-[14px] leading-[20px] relative bg-gradient-to-br from-[#161615] to-[#0d2548]/70">
                                {/* Elemento decorativo - esquina */}
                                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#ff5252] rounded-tl-lg"></div>
                                
                                <div className="relative z-10 mt-3 ml-3">
                                    <div className="relative mb-2">
                                    <h1 className="font-semibold text-3xl lg:text-4xl bg-gradient-to-r from-[#2196f3] to-[#64b5f6] bg-clip-text text-transparent relative z-10">
                                            Programa de Ingeniería<br />de Sistemas UNIMAR
                                        </h1>
                                        <div className="absolute -right-2 -top-2 w-10 h-10 bg-[#0d47a1]/30 rounded-full blur-xl -z-10"></div>
                                    </div>
                                    <div className="flex items-center mb-4 px-3 py-1.5 bg-[#0d47a1]/30 rounded-md max-w-max">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#2196f3] mr-2">
                                            <path d="M18.364 18.364C21.8787 14.8492 21.8787 9.15076 18.364 5.63604C14.8492 2.12132 9.15076 2.12132 5.63604 5.63604M18.364 18.364C14.8492 21.8787 9.15076 21.8787 5.63604 18.364C2.12132 14.8492 2.12132 9.15076 5.63604 5.63604M18.364 18.364L5.63604 5.63604" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    <p className="text-[#bbdefb] text-base font-medium">
                                            ¡Egresado estamos contigo!
                                        </p>
                                    </div>
                                    
                                    <div className="bg-[#0d2548]/30 p-3 rounded-lg shadow-sm mb-4 hover:shadow-md transition-all transform hover:-translate-y-0.5 border border-[#1a4b91]">
                                        <div className="flex items-start">
                                            <div className="mr-2 flex-shrink-0 mt-1">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 12L11 14L15 10M12 3L4 10V20H20V10L12 3Z" stroke="#2196f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <p className="text-sm mb-0 text-white">
                                                La Universidad Mariana forma profesionales competentes en tecnología, combinando conocimientos técnicos con valores éticos para desarrollar soluciones innovadoras.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Destacados - callout */}
                                    <div className="mt-3 mb-4 bg-gradient-to-r from-[#0d2548]/70 to-[#0d2548]/40 p-2.5 rounded-lg border-l-3 border-[#2196f3] shadow-sm">
                                        <p className="text-sm font-medium text-[#bbdefb]">
                                            Somos líderes en formación de ingenieros con valores franciscanos y compromiso social.
                                        </p>
                                    </div>
                                    
                                    <div className="my-4 flex flex-wrap gap-3">
                                        <a
                                            href="https://www.umariana.edu.co/index.html"
                                            target="_blank"
                                            className="group flex items-center gap-2 bg-[#161615]/60 px-4 py-2 rounded-md border border-[#1a4b91] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#2196f3]">
                                                <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span className="font-medium text-sm text-white">Nuestra universidad</span>
                                        </a>
                                        <a
                                            href="https://www.umariana.edu.co/ingenieria-sistemas.html"
                                            target="_blank"
                                            className="group flex items-center gap-2 bg-[#161615]/60 px-4 py-2 rounded-md border border-[#1a4b91] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#2196f3]">
                                                <path d="M9 3H4C3.44772 3 3 3.44772 3 4V9C3 9.55228 3.44772 10 4 10H9C9.55228 10 10 9.55228 10 9V4C10 3.44772 9.55228 3 9 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M20 3H15C14.4477 3 14 3.44772 14 4V9C14 9.55228 14.4477 10 15 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M9 14H4C3.44772 14 3 14.4477 3 15V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V15C10 14.4477 9.55228 14 9 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M20 14H15C14.4477 14 14 14.4477 14 15V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V15C21 14.4477 20.5523 14 20 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span className="font-medium text-sm text-white">Nuestro programa</span>
                                        </a>
                                    </div>
                                    
                                    {/* Tarjeta de programa */}
                                    <div className="mt-4 p-4 bg-[#161615]/70 rounded-lg border border-[#1a4b91] shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-center mb-3">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#ff5252]">
                                                <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span className="ml-2 font-medium text-sm text-white">Información del Programa</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-[#90caf9]">Duración</span>
                                                <span className="font-medium text-white">9 semestres</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[#90caf9]">Modalidad</span>
                                                <span className="font-medium text-white">Presencial</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[#90caf9]">Código SNIES</span>
                                                <span className="font-medium text-white">1887</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[#90caf9]">Título</span>
                                                <span className="font-medium text-white">Ingeniero de Sistemas</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative w-full shrink-0 overflow-hidden bg-[#1D0002] group lg:w-[438px]">
                                {/* Imagen principal con efecto de hover */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00000080] opacity-50 z-10"></div>
                                <div className="relative w-full h-full image-container overflow-hidden">
                                    <img
                                        src="https://www.umariana.edu.co/images2023/programas/ingenieria-sistemas/img-1.jpg"
                                        alt="Ingeniería de Sistemas UNIMAR"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 parallax-image"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0000007a] via-transparent to-transparent z-10"></div>
                                </div>
                                
                                {/* Badge flotante */}
                                <div className="absolute top-4 right-4 bg-[#1D0002] text-[#2196f3] px-3 py-1 rounded-md shadow-md z-20 font-medium text-xs">
                                    SNIES 1887
                                </div>
                                
                                {/* Texto flotante con efecto de aparición */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <p className="text-white text-xs font-medium bg-[#00000080] bg-opacity-75 p-2 rounded-md backdrop-blur-sm inline-block">
                                        Formando ingenieros para el futuro digital
                                    </p>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                
                {/* Efecto de parallax para la imagen */}
                <script dangerouslySetInnerHTML={{
                    __html: `
                        document.addEventListener('DOMContentLoaded', () => {
                            const image = document.querySelector('.parallax-image');
                            const container = document.querySelector('.image-container');
                            
                            if (image && container) {
                                window.addEventListener('scroll', () => {
                                    const scrollTop = window.pageYOffset;
                                    const containerTop = container.getBoundingClientRect().top + scrollTop;
                                    const offset = (scrollTop - containerTop) * 0.2;
                                    
                                    if (scrollTop > containerTop - window.innerHeight && 
                                        scrollTop < containerTop + container.offsetHeight) {
                                        image.style.transform = \`translate3d(0, \${offset}px, 0)\`;
                                    }
                                });
                            }
                        });
                    `
                }} />
            </div>
        </>
    );
}

// Agregar la definición para particlesJS en el global
declare global {
    interface Window {
        particlesJS?: any;
    }
}