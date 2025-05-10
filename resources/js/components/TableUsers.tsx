import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from "material-react-table";
import {
    Button,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    Box,
    Typography,
    Avatar,
    Grow,
    Slide,
    Chip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import { router } from "@inertiajs/react";
import UserFormModal from "./UserFormModal";

// Definir la interfaz para un usuario
interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    role?: string;
}

// Definir la interfaz para la prop users que será un objeto paginado
interface UsersPaginated {
    data: User[];
    links: any;
    meta: any;
}

// Tipo para las alertas
interface AlertState {
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
}

// Modificamos para recibir los datos como props con su tipo
const TableUsers = ({ users }: { users: UsersPaginated }) => {
    const [loading, setLoading] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        severity: 'info'
    });
    const [tableData, setTableData] = useState<User[]>([]);

    // Inicializar los datos de la tabla cuando cambian los usuarios
    useEffect(() => {
        if (users && users.data) {
            setTableData(users.data);
        }
    }, [users]);

    // Manejador para cerrar las alertas
    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    // Función para mostrar alertas
    const showAlert = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
        setAlert({
            open: true,
            message,
            severity
        });
    };

    // Manejadores de eventos para las acciones
    const handleEdit = (user: User) => {
        setCurrentUser(user);
        setOpenEditModal(true);
    };

    const handleDelete = (userId: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            setLoading(true);
            
            // Usamos axios para la petición DELETE
            axios.delete(`/users/${userId}`)
                .then(response => {
                    // Mostrar alerta de éxito
                    showAlert('Usuario eliminado con éxito', 'success');
                    
                    // Recargar los datos para asegurar que la tabla se actualice correctamente
                    router.reload({ only: ['users'] });
                })
                .catch(error => {
                    // Mostrar alerta de error
                    const errorMessage = error.response?.data?.message || 'Error desconocido al eliminar el usuario';
                    showAlert(errorMessage, 'error');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const handleCreate = () => {
        setOpenCreateModal(true);
    };

    // Manejador para cerrar el modal de creación
    const handleCloseCreateModal = (success?: boolean) => {
        setOpenCreateModal(false);
        if (success) {
            showAlert('Usuario creado con éxito', 'success');
            // Recargar los datos
            router.reload({ only: ['users'] });
        }
    };

    // Manejador para cerrar el modal de edición
    const handleCloseEditModal = (success?: boolean) => {
        setOpenEditModal(false);
        setCurrentUser(null); // Limpiar usuario actual
        if (success) {
            showAlert('Usuario actualizado con éxito', 'success');
            // Recargar los datos
            router.reload({ only: ['users'] });
        }
    };

    // Definir colores para los diferentes roles
    const getRoleColor = (role: string | undefined) => {
        switch (role) {
            case 'Administrador':
                return 'error';
            case 'Coordinador':
                return 'warning';
            case 'Egresado':
                return 'success';
            default:
                return 'default';
        }
    };

    // Configurar columnas de la tabla
    const columns = useMemo<MRT_ColumnDef<User>[]>(
        () => [
            {
                accessorKey: "id",
                header: "ID",
                size: 80,
            },
            {
                accessorKey: "name",
                header: "Nombre",
                size: 200,
            },
            {
                accessorKey: "email",
                header: "Email",
                size: 250,
            },
            {
                accessorKey: "role",
                header: "Rol",
                size: 150,
                Cell: ({ row }) => {
                    const role = row.original.role || 'Egresado';
                    return (
                        <Chip
                            label={role}
                            color={getRoleColor(role) as "error" | "warning" | "success" | "default"}
                            size="small"
                            variant="filled"
                        />
                    );
                },
            },
            {
                accessorKey: "created_at",
                header: "Fecha de creación",
                size: 150,
                Cell: ({ cell }) => {
                    const value = cell.getValue() as string;
                    if (!value) return '';
                    try {
                        const date = new Date(value);
                        return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
                    } catch (e) {
                        return '';
                    }
                },
            },
            {
                id: 'actions',
                header: 'Acciones',
                size: 150,
                Cell: ({ row }) => (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Tooltip title="Editar">
                            <IconButton
                                color="primary"
                                onClick={() => handleEdit(row.original)}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <IconButton
                                color="error"
                                onClick={() => handleDelete(row.original.id)}
                                disabled={loading}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                ),
            },
        ],
        [loading]
    );

    // Configurar la tabla
    const table = useMaterialReactTable({
        columns,
        data: tableData, // Usar el estado local en lugar de users.data directamente
        state: { isLoading: loading },
        renderTopToolbarCustomActions: () => {
            return (
                <Button
                    color="primary"
                    onClick={handleCreate}
                    variant="contained"
                    startIcon={<AddIcon />}
                >
                    Nuevo Usuario
                </Button>
            );
        },
    });

    // Función para obtener icono y color según la severidad
    const getAlertIconAndColor = (severity: 'success' | 'info' | 'warning' | 'error') => {
        switch (severity) {
            case 'success':
                return {
                    icon: <CheckCircleIcon fontSize="large" />,
                    backgroundColor: 'rgba(46, 125, 50, 0.95)',
                    borderColor: '#1b5e20',
                    pulseColor: 'rgba(76, 175, 80, 0.6)',
                    emoji: '✅',
                    gradient: 'linear-gradient(135deg, #2e7d32 0%, #81c784 100%)'
                };
            case 'error':
                return {
                    icon: <ErrorIcon fontSize="large" />,
                    backgroundColor: 'rgba(211, 47, 47, 0.95)',
                    borderColor: '#b71c1c',
                    pulseColor: 'rgba(244, 67, 54, 0.6)',
                    emoji: '❌',
                    gradient: 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)'
                };
            case 'warning':
                return {
                    icon: <WarningIcon fontSize="large" />,
                    backgroundColor: 'rgba(237, 108, 2, 0.95)',
                    borderColor: '#e65100',
                    pulseColor: 'rgba(255, 152, 0, 0.6)',
                    emoji: '⚠️',
                    gradient: 'linear-gradient(135deg, #ed6c02 0%, #ffb74d 100%)'
                };
            case 'info':
            default:
                return {
                    icon: <InfoIcon fontSize="large" />,
                    backgroundColor: 'rgba(2, 136, 209, 0.95)',
                    borderColor: '#01579b',
                    pulseColor: 'rgba(33, 150, 243, 0.6)',
                    emoji: 'ℹ️',
                    gradient: 'linear-gradient(135deg, #0288d1 0%, #4fc3f7 100%)'
                };
        }
    };

    const { icon, backgroundColor, borderColor, pulseColor, emoji, gradient } = getAlertIconAndColor(alert.severity);

    // Función para obtener título según la severidad
    const getAlertTitle = (severity: 'success' | 'info' | 'warning' | 'error') => {
        switch (severity) {
            case 'success':
                return '¡Éxito!';
            case 'error':
                return '¡Error!';
            case 'warning':
                return '¡Advertencia!';
            case 'info':
            default:
                return 'Información';
        }
    };

    return (
        <>
            <MaterialReactTable table={table} />

            {/* Modal para crear usuario */}
            <UserFormModal
                open={openCreateModal}
                handleClose={(success) => handleCloseCreateModal(success)}
                isEdit={false}
                showAlert={showAlert}
            />

            {/* Modal para editar usuario */}
            {currentUser && (
                <UserFormModal
                    open={openEditModal}
                    handleClose={(success) => handleCloseEditModal(success)}
                    isEdit={true}
                    user={currentUser}
                    showAlert={showAlert}
                />
            )}

            {/* Sistema de alertas mejorado y más impactante */}
            <Snackbar
                open={alert.open}
                autoHideDuration={5000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={Slide}
                sx={{
                    mt: 4,
                    '& .MuiAlert-root': {
                        border: `2px solid ${borderColor}`,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }
                }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity={alert.severity}
                    variant="filled"
                    icon={false}
                    sx={{
                        width: '100%',
                        minWidth: '360px',
                        background: gradient,
                        backdropFilter: 'blur(10px)',
                        animation: 'pulse 2s infinite ease-in-out',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            background: 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateX(-100%)'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                mr: 2,
                                transform: 'scale(1)',
                                transition: 'transform 0.2s ease'
                            }}
                        >
                            {icon}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography
                                variant="subtitle1"
                                component="div"
                                sx={{
                                    fontWeight: '600',
                                    letterSpacing: '0.5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <span>{getAlertTitle(alert.severity)}</span>
                                <span style={{ fontSize: '1.2rem' }}>
                                    {emoji}
                                </span>
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    opacity: 0.95,
                                    mt: 0.5,
                                    fontWeight: '400',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}
                            >
                                {alert.message}
                            </Typography>
                        </Box>
                    </Box>
                </Alert>
            </Snackbar>
        </>
    );
};

export default TableUsers;