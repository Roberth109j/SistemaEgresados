import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    CircularProgress,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import { router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    role?: string;
}

interface UserFormModalProps {
    open: boolean;
    handleClose: (success?: boolean) => void;
    isEdit: boolean;
    user?: User;
    showAlert?: (message: string, severity: 'success' | 'info' | 'warning' | 'error') => void;
}

// Forma inicial del formulario para reutilizar
const initialFormData = {
    name: '',
    surname: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'Egresado'
};

const UserFormModal: React.FC<UserFormModalProps> = ({ open, handleClose, isEdit, user, showAlert }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Estado para el formulario
    const [formData, setFormData] = useState({ ...initialFormData });

    // Reiniciar formulario cuando cambia el estado de 'open' o 'isEdit' o 'user'
    useEffect(() => {
        if (open) {
            if (isEdit && user) {
                // Si es edición, extraer nombre y apellido
                const nameParts = user.name.split(' ');
                const surname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
                const firstName = nameParts[0];

                setFormData({
                    name: firstName,
                    surname: surname,
                    email: user.email,
                    password: '',
                    password_confirmation: '',
                    role: user.role || 'Egresado'
                });
            } else {
                // Si es creación, resetear el formulario usando la forma inicial
                setFormData({ ...initialFormData });
            }
            // Limpiar errores al abrir el modal
            setErrors({});
        }
    }, [open, isEdit, user]);

    // Manejar cambios en los inputs de texto
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Eliminar el error si el usuario corrige el campo
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Manejar cambios en el select
    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Eliminar el error si el usuario corrige el campo
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const resetForm = () => {
        setFormData({ ...initialFormData });
        setErrors({});
    };

    const handleSubmit = () => {
        setLoading(true);

        // Validar formulario antes de enviar
        const validationErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            validationErrors.name = 'El nombre es obligatorio';
        }

        if (!formData.surname.trim()) {
            validationErrors.surname = 'Los apellidos son obligatorios';
        }

        if (!formData.email.trim()) {
            validationErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            validationErrors.email = 'El correo electrónico no es válido';
        }

        if (!isEdit && !formData.password) {
            validationErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password && formData.password.length < 8) {
            validationErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (formData.password && formData.password !== formData.password_confirmation) {
            validationErrors.password_confirmation = 'Las contraseñas no coinciden';
        }

        if (!formData.role) {
            validationErrors.role = 'El rol es obligatorio';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        if (isEdit && user) {
            // Actualizar usuario
            router.put(`/users/${user.id}`, formData, {
                onSuccess: () => {
                    setLoading(false);
                    resetForm(); // Resetear el formulario después de éxito
                    if (showAlert) {
                        showAlert('Usuario actualizado con éxito', 'success');
                    }
                    handleClose(true);

                    // Recargar la página para actualizar la lista
                    router.get('/users', {}, { preserveState: true, preserveScroll: true });
                },
                onError: (errors) => {
                    setLoading(false);
                    setErrors(errors);
                    if (showAlert) {
                        showAlert('Error al actualizar el usuario', 'error');
                    }
                }
            });
        } else {
            // Crear nuevo usuario
            router.post('/users', formData, {
                onSuccess: () => {
                    setLoading(false);
                    resetForm(); // Resetear el formulario después de éxito
                    if (showAlert) {
                        showAlert('Usuario creado con éxito', 'success');
                    }
                    handleClose(true);

                    // Recargar la página para actualizar la lista
                    router.visit('/users', { preserveScroll: true });
                },
                onError: (errors) => {
                    setLoading(false);
                    setErrors(errors);
                    if (showAlert) {
                        showAlert('Error al crear el usuario', 'error');
                    }
                }
            });
        }
    };

    // Función para cerrar el modal y limpiar el formulario
    const handleModalClose = () => {
        resetForm();
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleModalClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
            </DialogTitle>
            <DialogContent>
                {Object.keys(errors).length > 0 && (
                    <Box sx={{ mb: 2, mt: 1, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
                        <Typography color="error" variant="body2">
                            Por favor, corrige los errores señalados para continuar.
                        </Typography>
                    </Box>
                )}

                <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Nombre"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    <TextField
                        label="Apellidos"
                        name="surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!errors.surname}
                        helperText={errors.surname}
                    />

                    <TextField
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                    />

                    <FormControl fullWidth required error={!!errors.role}>
                        <InputLabel id="role-label">Rol</InputLabel>
                        <Select
                            labelId="role-label"
                            name="role"
                            value={formData.role}
                            label="Rol"
                            onChange={handleSelectChange}
                        >
                            <MenuItem value="Administrador">Administrador</MenuItem>
                            <MenuItem value="Coordinador">Coordinador</MenuItem>
                            <MenuItem value="Egresado">Egresado</MenuItem>
                        </Select>
                        {errors.role && (
                            <Typography color="error" variant="caption">
                                {errors.role}
                            </Typography>
                        )}
                    </FormControl>

                    <TextField
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        fullWidth
                        required={!isEdit}
                        error={!!errors.password}
                        helperText={isEdit ? "Dejar en blanco para mantener la contraseña actual" : errors.password}
                    />

                    <TextField
                        label="Confirmar contraseña"
                        name="password_confirmation"
                        type="password"
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        fullWidth
                        required={!isEdit || !!formData.password}
                        error={!!errors.password_confirmation}
                        helperText={errors.password_confirmation}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleModalClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : (isEdit ? 'Actualizar' : 'Crear')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserFormModal;

