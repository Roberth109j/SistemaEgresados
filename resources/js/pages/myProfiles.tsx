import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import {
    TextField,
    Button,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Box,
    Alert,
    Snackbar,
    CircularProgress,
    Tooltip,
    Divider,
    Card,
    CardContent,
    Avatar,
    Fade,
    Autocomplete,
    IconButton,
    LinearProgress,
} from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { Head, useForm } from '@inertiajs/react';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BadgeIcon from '@mui/icons-material/Badge';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Perfil de Usuario', href: '/myProfile' }, // Cambiado a /myProfile
];

const darkTheme = createTheme({
    palette: { 
        mode: 'dark',
        primary: {
            main: '#3f80ea',
        },
        secondary: {
            main: '#6f42c1',
        },
        background: {
            paper: '#1e1e2d',
            default: '#151521',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                outlined: {
                    borderRadius: 8,
                },
            },
        },
    },
});

// Interfaces para los tipos
interface UserData {
    name: string;
    email: string;
    role: string;
}

interface Profile {
    id?: number;
    full_name: string;
    identification_number: string | null;
    institutional_email: string;
    contact_phone: string | null;
    role: string;
    faculty_or_department: string | null;
    position_or_title: string | null;
    area_of_responsibility: string | null;
    profile_photo: string | null;
}

interface Props {
    userData: UserData;
    profile: Profile | null;
    facultiesDepartments: string[];
}

export default function myProfiles({ userData, profile, facultiesDepartments }: Props) { // Cambiado el nombre a myProfiles
    // Usar los datos proporcionados desde el servidor
    const initialFullName = profile?.full_name || userData?.name || '';
    const initialEmail = profile?.institutional_email || userData?.email || '';
    const initialRole = profile?.role || userData?.role || '';
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        profile?.profile_photo 
            ? `/storage/profile_photos/${profile.profile_photo}` 
            : null
    );
    
    // Interfaz del formulario
    interface ProfileForm {
        full_name: string;
        identification_number: string | null;
        institutional_email: string;
        contact_phone: string | null;
        role: string;
        faculty_or_department: string | null;
        position_or_title: string | null;
        area_of_responsibility: string | null;
        profile_photo: File | null;
        profile_photo_path: string | null;
        [key: string]: any;
    }

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm<ProfileForm>({
        full_name: initialFullName,
        identification_number: profile?.identification_number || '',
        institutional_email: initialEmail,
        contact_phone: profile?.contact_phone || '',
        role: initialRole,
        faculty_or_department: profile?.faculty_or_department || '',
        position_or_title: profile?.position_or_title || '',
        area_of_responsibility: profile?.area_of_responsibility || '',
        profile_photo: null,
        profile_photo_path: profile?.profile_photo || null,
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');

    // Actualizamos el estado cuando cambian las props
    useEffect(() => {
        if (userData || profile) {
            setData('full_name', initialFullName);
            setData('institutional_email', initialEmail);
            setData('role', initialRole);
        }
        
        if (profile) {
            setData(prevData => ({
                ...prevData,
                identification_number: profile.identification_number || '',
                contact_phone: profile.contact_phone || '',
                faculty_or_department: profile.faculty_or_department || '',
                position_or_title: profile.position_or_title || '',
                area_of_responsibility: profile.area_of_responsibility || '',
                profile_photo_path: profile.profile_photo || null,
            }));
            
            if (profile.profile_photo) {
                setPhotoPreview(`/storage/profile_photos/${profile.profile_photo}`);
            }
        }
    }, [userData, profile, initialFullName, initialEmail, initialRole]);

    // Mostrar snackbar cuando el formulario se envía exitosamente
    useEffect(() => {
        if (wasSuccessful) {
            setSuccessMessage("La información del perfil ha sido guardada correctamente");
            setAlertSeverity('success');
            setOpenSnackbar(true);
            setIsLoading(false);
        }
    }, [wasSuccessful]);

    // Mostrar snackbar cuando hay errores
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            let errorMsg = '';
            
            if (errors.general) {
                errorMsg = errors.general as string;
            } else {
                const firstErrorKey = Object.keys(errors)[0];
                errorMsg = (errors[firstErrorKey] as string) || 'Por favor corrija los errores para continuar';
            }
            
            setErrorMessage(errorMsg);
            setAlertSeverity('error');
            setOpenSnackbar(true);
            setIsLoading(false);
        }
    }, [errors]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Cambiado de /profile a /myProfile
        post('/myProfile', {
            forceFormData: true,
            onSuccess: () => {
                setSuccessMessage("La información del perfil ha sido guardada correctamente");
                setAlertSeverity('success');
                setOpenSnackbar(true);
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
            }
        });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    
    const handlePhotoClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('profile_photo', file);
            
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setPhotoPreview(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Obtener las iniciales para el avatar
    const getInitials = () => {
        const fullName = data.full_name || '';
        
        if (fullName) {
            const nameParts = fullName.split(' ');
            if (nameParts.length >= 2) {
                return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
            } else if (nameParts.length === 1) {
                return fullName.charAt(0).toUpperCase();
            }
        }
        
        return 'U';
    };

    // Calcular el progreso del formulario
    const calculateProgress = () => {
        // Campos requeridos
        const requiredFields = [
            'full_name', 
            'institutional_email', 
            'role'
        ];
        
        // Campos opcionales
        const optionalFields = [
            'identification_number',
            'contact_phone',
            'faculty_or_department',
            'position_or_title',
            'area_of_responsibility'
        ];
        
        // Calcular campos requeridos completados
        const requiredCompleted = requiredFields.filter(field => 
            data[field] && String(data[field]).trim() !== ''
        ).length;
        
        // Calcular campos opcionales completados
        const optionalCompleted = optionalFields.filter(field => 
            data[field] && String(data[field]).trim() !== ''
        ).length;
        
        // Añadir la foto de perfil al cálculo si existe
        const hasPhoto = photoPreview !== null;
        const optionalTotal = optionalFields.length + 1; // +1 por la foto
        const optionalCompletedTotal = optionalCompleted + (hasPhoto ? 1 : 0);
        
        // Calcular progreso ponderado (70% requeridos, 30% opcionales)
        const requiredWeight = 70;
        const optionalWeight = 30;
        
        const requiredProgress = requiredCompleted === requiredFields.length 
            ? requiredWeight 
            : (requiredCompleted / requiredFields.length) * requiredWeight;
        
        const optionalProgress = optionalCompletedTotal === optionalTotal
            ? optionalWeight
            : (optionalCompletedTotal / optionalTotal) * optionalWeight;
        
        // Si todos los requeridos y al menos 2/3 de los opcionales están completos, dar el 100%
        if (requiredCompleted === requiredFields.length && 
            optionalCompletedTotal >= Math.ceil(optionalTotal * 0.66)) {
            return 100;
        }
        
        return Math.round(requiredProgress + optionalProgress);
    };

    // Función para obtener color degradado basado en progreso
    const getProgressGradient = (progress: number) => {
        if (progress < 30) {
            return 'linear-gradient(90deg, #ff5f6d 0%, #ffc371 100%)';
        } else if (progress < 70) {
            return 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)';
        } else {
            return 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfil de Usuario" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ThemeProvider theme={darkTheme}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                        {/* Panel lateral */}
                        <Box sx={{ width: { xs: '100%', md: 280 } }}>
                            {/* Card con información básica */}
                            <Card 
                                sx={{ 
                                    mb: 3, 
                                    p: 2, 
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #1e1e2d 0%, #2d2d44 100%)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                                }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
                                    {/* Avatar con foto o iniciales */}
                                    <Box sx={{ position: 'relative' }}>
                                        <Avatar 
                                            src={photoPreview || undefined}
                                            sx={{ 
                                                width: 90, 
                                                height: 90, 
                                                mb: 2, 
                                                bgcolor: 'primary.main',
                                                fontSize: 32,
                                                fontWeight: 'bold',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                                            }}
                                        >
                                            {!photoPreview && getInitials()}
                                        </Avatar>
                                        {/* Botón para cambiar foto */}
                                        <IconButton 
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                bottom: 10,
                                                right: -5,
                                                bgcolor: alpha(darkTheme.palette.primary.main, 0.9),
                                                color: '#fff',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                                '&:hover': {
                                                    bgcolor: darkTheme.palette.primary.main
                                                }
                                            }}
                                            onClick={handlePhotoClick}
                                        >
                                            <PhotoCameraIcon fontSize="small" />
                                        </IconButton>
                                        <input 
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handlePhotoChange}
                                        />
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" align="center">
                                        {data.full_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        {data.role}
                                    </Typography>
                                    
                                    {/* Barra de progreso mejorada */}
                                    <Box sx={{ width: '100%', mt: 3, mb: 1 }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center', 
                                            mb: 1.5 
                                        }}>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: alpha('#fff', 0.7),
                                                    fontWeight: 500 
                                                }}
                                            >
                                                Progreso del perfil
                                            </Typography>
                                            <Box 
                                                sx={{ 
                                                    bgcolor: alpha('#3f80ea', 0.15), 
                                                    px: 1.5, 
                                                    py: 0.5, 
                                                    borderRadius: 10,
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                <Typography 
                                                    variant="body2" 
                                                    fontWeight="bold" 
                                                    sx={{ 
                                                        color: getProgressGradient(calculateProgress()).includes('43e97b') 
                                                            ? '#4eff91' 
                                                            : getProgressGradient(calculateProgress()).includes('4facfe') 
                                                                ? '#4facfe' 
                                                                : '#ffc371' 
                                                    }}
                                                >
                                                    {calculateProgress()}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Tooltip title={`${calculateProgress()}% completado`}>
                                            <Box sx={{ 
                                                height: 10, 
                                                width: '100%', 
                                                borderRadius: 5,
                                                bgcolor: alpha('#fff', 0.1),
                                                position: 'relative',
                                                overflow: 'hidden',
                                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                                            }}>
                                                <Box sx={{ 
                                                    height: '100%', 
                                                    width: `${calculateProgress()}%`, 
                                                    background: getProgressGradient(calculateProgress()),
                                                    borderRadius: 5,
                                                    transition: 'width 0.5s ease-in-out',
                                                    position: 'relative',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                                }} />
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                    
                                    <Divider sx={{ my: 2 }} />
                                    
                                    {/* Navegación por secciones */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Button
                                            variant={activeSection === 'personal' ? "contained" : "text"}
                                            startIcon={<PersonIcon />}
                                            fullWidth
                                            sx={{ 
                                                justifyContent: 'flex-start', 
                                                py: 1.5,
                                                bgcolor: activeSection === 'personal' ? alpha('#3f80ea', 0.1) : 'transparent',
                                                '&:hover': {
                                                    bgcolor: activeSection === 'personal' ? alpha('#3f80ea', 0.2) : alpha('#fff', 0.05)
                                                }
                                            }}
                                            onClick={() => setActiveSection('personal')}
                                        >
                                            Información Personal
                                        </Button>
                                        <Button
                                            variant={activeSection === 'role' ? "contained" : "text"}
                                            startIcon={<WorkIcon />}
                                            fullWidth
                                            sx={{ 
                                                justifyContent: 'flex-start', 
                                                py: 1.5,
                                                bgcolor: activeSection === 'role' ? alpha('#3f80ea', 0.1) : 'transparent',
                                                '&:hover': {
                                                    bgcolor: activeSection === 'role' ? alpha('#3f80ea', 0.2) : alpha('#fff', 0.05)
                                                }
                                            }}
                                            onClick={() => setActiveSection('role')}
                                        >
                                            Información de Rol
                                        </Button>
                                    </Box>
                                </Card>
                            </Box>
                            {/* Contenido principal */}
                            <Box sx={{ flex: 1 }}>
                                <Paper 
                                    elevation={3} 
                                    sx={{ 
                                        p: 3, 
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #1e1e2d 0%, #252537 100%)',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.12)'
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        mb: 4
                                    }}>
                                        <Typography variant="h5" fontWeight="bold">
                                            {activeSection === 'personal' && 'Información Personal'}
                                            {activeSection === 'role' && 'Información de Rol'}
                                        </Typography>
                                    </Box>
                                    
                                    <form onSubmit={handleSubmit}>
                                        {/* Sección: Información Personal */}
                                        <Fade in={activeSection === 'personal'} timeout={500}>
                                            <Box sx={{ display: activeSection === 'personal' ? 'block' : 'none' }}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            label="Nombre Completo"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={data.full_name}
                                                            onChange={(e) => setData('full_name', e.target.value)}
                                                            error={!!errors.full_name}
                                                            helperText={errors.full_name}
                                                            required
                                                            InputProps={{
                                                                startAdornment: <PersonIcon sx={{ color: 'action.active', mr: 1 }} />,
                                                            }}
                                                            sx={{ mb: 2 }}
                                                        />
                                                    </Grid>
                                                    
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Número de Identificación"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={data.identification_number}
                                                            onChange={(e) => setData('identification_number', e.target.value)}
                                                            error={!!errors.identification_number}
                                                            helperText={errors.identification_number}
                                                            InputProps={{
                                                                startAdornment: <BadgeIcon sx={{ color: 'action.active', mr: 1 }} />,
                                                            }}
                                                            sx={{ mb: 2 }}
                                                        />
                                                    </Grid>
                                                    
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Teléfono de Contacto"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={data.contact_phone}
                                                            onChange={(e) => setData('contact_phone', e.target.value)}
                                                            error={!!errors.contact_phone}
                                                            helperText={errors.contact_phone}
                                                            InputProps={{
                                                                startAdornment: <PhoneIcon sx={{ color: 'action.active', mr: 1 }} />,
                                                            }}
                                                        />
                                                    </Grid>
                                                    
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            label="Correo Electrónico Institucional"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={data.institutional_email}
                                                            onChange={(e) => setData('institutional_email', e.target.value)}
                                                            error={!!errors.institutional_email}
                                                            helperText={errors.institutional_email}
                                                            required
                                                            InputProps={{
                                                                startAdornment: <EmailIcon sx={{ color: 'action.active', mr: 1 }} />,
                                                            }}
                                                            sx={{ mb: 2 }}
                                                        />
                                                    </Grid>
                                                    
                                                    {/* Campo oculto para mantener la ruta de la foto actual */}
                                                    <input 
                                                        type="hidden" 
                                                        name="profile_photo_path" 
                                                        value={data.profile_photo_path || ''}
                                                    />
                                                </Grid>
                                            </Box>
                                        </Fade>
                                        
                                        {/* Sección: Información de Rol */}
                                        <Fade in={activeSection === 'role'} timeout={500}>
                                            <Box sx={{ display: activeSection === 'role' ? 'block' : 'none' }}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6}>
                                                        <FormControl fullWidth variant="outlined" error={!!errors.role} required>
                                                            <InputLabel id="role-label">Rol</InputLabel>
                                                            <Select
                                                                labelId="role-label"
                                                                value={data.role}
                                                                onChange={(e) => setData('role', e.target.value)}
                                                                label="Rol"
                                                            >
                                                                <MenuItem value=""><em>Seleccionar</em></MenuItem>
                                                                <MenuItem value="Administrador">Administrador</MenuItem>
                                                                <MenuItem value="Coordinador">Coordinador</MenuItem>
                                                            </Select>
                                                            {errors.role && (
                                                                <Typography variant="caption" color="error">
                                                                    {errors.role}
                                                                </Typography>
                                                            )}
                                                        </FormControl>
                                                    </Grid>
                                                    
                                                    <Grid item xs={12} sm={6}>
                                                        <Autocomplete
                                                            options={facultiesDepartments}
                                                            value={data.faculty_or_department || ''}
                                                            onChange={(_, newValue) => setData('faculty_or_department', newValue || '')}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Facultad o Dependencia"
                                                                    variant="outlined"
                                                                    error={!!errors.faculty_or_department}
                                                                    helperText={errors.faculty_or_department}
                                                                    fullWidth
                                                                    InputProps={{
                                                                        ...params.InputProps,
                                                                        startAdornment: (
                                                                            <>
                                                                                <BusinessIcon sx={{ color: 'action.active', mr: 1 }} />
                                                                                {params.InputProps.startAdornment}
                                                                            </>
                                                                        ),
                                                                    }}
                                                                />
                                                            )}
                                                            freeSolo
                                                            sx={{ mb: 2 }}
                                                        />
                                                    </Grid>
                                                    
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Cargo o Título"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={data.position_or_title || ''}
                                                            onChange={(e) => setData('position_or_title', e.target.value)}
                                                            error={!!errors.position_or_title}
                                                            helperText={errors.position_or_title}
                                                            InputProps={{
                                                                startAdornment: <SchoolIcon sx={{ color: 'action.active', mr: 1 }} />,
                                                            }}
                                                            sx={{ mb: 2 }}
                                                        />
                                                    </Grid>
                                                    
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label="Área de Responsabilidad"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={data.area_of_responsibility || ''}
                                                            onChange={(e) => setData('area_of_responsibility', e.target.value)}
                                                            error={!!errors.area_of_responsibility}
                                                            helperText={errors.area_of_responsibility}
                                                            InputProps={{
                                                                startAdornment: <BusinessIcon sx={{ color: 'action.active', mr: 1 }} />,
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Fade>
                                        
                                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button 
                                                type="submit" 
                                                variant="contained" 
                                                color="primary" 
                                                size="large"
                                                disabled={processing || isLoading}
                                                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                                sx={{ 
                                                    minWidth: '180px',
                                                    textTransform: 'none', 
                                                    fontWeight: 'bold',
                                                    py: 1.5,
                                                    borderRadius: 12,
                                                    boxShadow: '0 4px 12px rgba(63, 128, 234, 0.4)',
                                                    background: 'linear-gradient(90deg, #3f80ea 0%, #4facfe 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(90deg, #3571d6 0%, #3a8fd9 100%)',
                                                        boxShadow: '0 6px 15px rgba(63, 128, 234, 0.6)',
                                                    }
                                                }}
                                            >
                                                {isLoading ? 'Guardando...' : 'Guardar Información'}
                                            </Button>
                                        </Box>
                                    </form>
                                </Paper>
                            </Box>
                        </Box>
                        
                        {/* Snackbar para mensajes de éxito y error */}
                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={6000}
                            onClose={handleCloseSnackbar}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            TransitionComponent={Fade}
                        >
                            <Alert 
                                onClose={handleCloseSnackbar} 
                                severity={alertSeverity}
                                sx={{ 
                                    width: '100%',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    fontSize: '0.95rem',
                                    borderRadius: 2,
                                    '& .MuiAlert-icon': {
                                        fontSize: '1.5rem'
                                    }
                                }}
                                variant="filled"
                                elevation={6}
                            >
                                {alertSeverity === 'success' ? successMessage : errorMessage}
                            </Alert>
                        </Snackbar>
                    </ThemeProvider>
                </div>
            </AppLayout>
        );
    }