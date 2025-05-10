
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import TableUsers from '@/components/TableUsers';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Definir la interfaz de usuario
interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

// Definir la interfaz para el objeto paginado de usuarios
interface UsersPaginated {
    data: User[];
    links: any;
    meta: any;
}

// Definir la interfaz para las props de la página
interface UsersProps {
    users: UsersPaginated;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

// Especificamos el tipo correcto para las props
export default function Users({ users }: UsersProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ThemeProvider theme={darkTheme}>
                    <TableUsers users={users} />
                </ThemeProvider>
            </div>
        </AppLayout>
    );
}