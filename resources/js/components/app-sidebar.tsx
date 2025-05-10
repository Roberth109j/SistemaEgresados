// Archivo: resources/js/components/LocationNotification.tsx
// (Mantener el código de LocationNotification que te proporcioné anteriormente)

// Archivo: resources/js/Layouts/AppSidebar.tsx (modificación)
import { usePage } from '@inertiajs/react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { FileStack,UserRound, Building2, BookMarked, GraduationCap, UsersRound, Folder, LayoutDashboard, Newspaper, MapPinned } from 'lucide-react';

import AppLogo from './app-logo';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import LocationNotification from './LocationNotification';

// Extender de Inertia.PageProps para evitar el error
interface PageProps extends InertiaPageProps {
    auth?: {
        user?: {
            roles?: string[];
        };
    };
}

export function AppSidebar() {
    // Obtener datos del usuario desde Inertia.js
    const { props } = usePage<PageProps>();
    
    const userRoles = props.auth?.user?.roles ?? []; // Garantiza que siempre sea un array
    
    // Función para determinar el rol principal (el primer rol)
    const userRole = userRoles.length > 0 ? userRoles[0] : 'Egresado';
    
    // Determinar si estamos en la página de dashboard
    const isDashboard = window.location.pathname === '/dashboard';
    
    // Configuración del sidebar según el rol
    const navItemsByRole: Record<string, NavItem[]> = {
        Administrador: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'My Profile', href: '/myProfile', icon: UserRound },
            { title: 'Users', href: '/users', icon: UsersRound },
            { title: 'Graduate Reports', href: '/graduateReports', icon: FileStack},
        ],
        Coordinador: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'My Profile', href: '/myProfile', icon: UserRound },
            { title: 'News', href: '/news', icon: Newspaper },
            { title: 'Ubications', href: '/map', icon: MapPinned },
            { title: 'Graduate Reports', href: '/graduateReports', icon: FileStack},
            


        ],
        Egresado: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { title: 'Basic Information', href: '/basicInformation', icon: BookMarked },
            { title: 'Academic information', href: '/academicInformation', icon: GraduationCap },
            { title: 'Employment information', href: '/employmentInformation', icon: Building2 },
        ],
    };
    
    const mainNavItems = navItemsByRole[userRole] || navItemsByRole['Egresado'];
    
    // Determinar si debemos mostrar la notificación de ubicación
    const showLocationNotification = userRole === 'Egresado' && isDashboard;
    
    return (
        <>
            {/* Mostrar la notificación de ubicación solo para egresados en el dashboard */}
            {showLocationNotification && <LocationNotification />}
            
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/dashboard" prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                
                <SidebarContent>
                    <NavMain items={mainNavItems} />
                </SidebarContent>
                
                <SidebarFooter>
                    <NavFooter items={[]} className="mt-auto" />
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
        </>
    );
}