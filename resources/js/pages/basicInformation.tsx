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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import EmailIcon from '@mui/icons-material/Email';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Información Básica', href: '/basicInformation' },
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
// Definición de las interfaces para los tipos
interface UserData {
    first_name: string;
    last_name: string;
    email: string;
}

interface BasicInfo {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    document_type: string;
    document_number: string;
    gender: string; // Campo de sexo
    profile_photo: string | null;
    graduation_date: string | null;
    institution: string | null;
    career: string | null;
    address: string;
    phone: string;
    city: string;
    department: string;
    country: string;
    additional_info: string;
}

interface Props {
    userData: UserData;
    basicInfo: BasicInfo | null;
    cities: string[];
    departments: string[];
    institutions: string[];
}
export default function BasicInformation({ userData, basicInfo, cities, departments, institutions }: Props) {
    // Usar los datos proporcionados desde el servidor
    const initialFirstName = basicInfo?.first_name || userData?.first_name || '';
    const initialLastName = basicInfo?.last_name || userData?.last_name || '';
    const initialEmail = basicInfo?.email || userData?.email || '';
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        basicInfo?.profile_photo 
            ? `/storage/profile_photos/${basicInfo.profile_photo}` 
            : null
    );
    
    // Definimos correctamente la interfaz que satisface FormDataType
    interface BasicInfoForm {
        first_name: string;
        last_name: string;
        email?: string | null; // Opcional solo para mostrar en la UI
        document_type: string;
        document_number: string;
        gender: string; // Campo de sexo
        profile_photo: File | null;
        profile_photo_path: string | null; // Para mantener la referencia a la foto existente
        graduation_date: string | null;
        institution: string | null;
        career: string | null;
        address: string | null;
        phone: string | null;
        city: string | null;
        department: string | null;
        country: string | null;
        additional_info: string | null;
        [key: string]: any; // Esta línea permite campos adicionales
    }
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm<BasicInfoForm>({
        first_name: initialFirstName,
        last_name: initialLastName,
        email: initialEmail, // Solo para mostrar
        document_type: basicInfo?.document_type || '',
        document_number: basicInfo?.document_number || '',
        gender: basicInfo?.gender || '', // Inicialización del campo de sexo
        profile_photo: null,
        profile_photo_path: basicInfo?.profile_photo || null, // Guardamos la ruta de la foto actual
        graduation_date: basicInfo?.graduation_date || null,
        institution: basicInfo?.institution || '',
        career: basicInfo?.career || '',
        address: basicInfo?.address || '',
        phone: basicInfo?.phone || '',
        city: basicInfo?.city || '',
        department: basicInfo?.department || '',
        country: basicInfo?.country || 'Colombia', // Predeterminado a Colombia
        additional_info: basicInfo?.additional_info || '',
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');
    // Actualizamos el estado cuando cambian las props
    useEffect(() => {
        if (userData || basicInfo) {
            // Usamos los datos proporcionados por el controlador
            setData('first_name', initialFirstName);
            setData('last_name', initialLastName);
            // Solo guardamos el email en el estado para mostrarlo en la UI
            setData('email', initialEmail);
        }
        
        if (basicInfo) {
            setData(prevData => ({
                ...prevData,
                document_type: basicInfo.document_type || '',
                document_number: basicInfo.document_number || '',
                gender: basicInfo.gender || '', // Asignamos el valor del campo de sexo
                graduation_date: basicInfo.graduation_date || null,
                institution: basicInfo.institution || '',
                career: basicInfo.career || '',
                // Asegúrate de usar strings vacíos, no null
                address: basicInfo.address || '',
                phone: basicInfo.phone || '',
                city: basicInfo.city || '',
                department: basicInfo.department || '',
                country: basicInfo.country || 'Colombia',
                additional_info: basicInfo.additional_info || '',
                profile_photo_path: basicInfo.profile_photo || null, // Guardamos la ruta de la foto
            }));
            
            if (basicInfo.profile_photo) {
                setPhotoPreview(`/storage/profile_photos/${basicInfo.profile_photo}`);
            }
        }
    }, [userData, basicInfo, initialFirstName, initialLastName, initialEmail]);

    // Mostrar snackbar cuando el formulario se envía exitosamente
    useEffect(() => {
        if (wasSuccessful) {
            setSuccessMessage("La información básica ha sido guardada correctamente");
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
                // Encontrar el primer error
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
        
        // Registrar valores para depuración
        console.log("Enviando datos:", {
            institution: data.institution,
            career: data.career,
            gender: data.gender,
            profile_photo_path: data.profile_photo_path
        });
        
        // Usar FormData para enviar archivos
        post('/basicInformation', {
            forceFormData: true,
            onSuccess: () => {
                setSuccessMessage("La información básica ha sido guardada correctamente");
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
            // Asignar directamente el archivo
            setData('profile_photo', file);
            
            // Crear preview
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
        const firstName = data.first_name || '';
        const lastName = data.last_name || '';
        
        if (firstName && lastName) {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        } else if (firstName) {
            return firstName.charAt(0).toUpperCase();
        } else if (lastName) {
            return lastName.charAt(0).toUpperCase();
        }
        
        return 'U';
    };

    // Calcular el progreso del formulario (modificado para que llegue al 100%)
    const calculateProgress = () => {
        // Campos requeridos (tienen mayor peso en el progreso)
        const requiredFields = [
            'first_name', 
            'last_name', 
            'document_type', 
            'document_number',
            'gender' // Añadimos el campo de sexo a los requeridos
        ];
        
        // Campos opcionales (tienen menor peso en el progreso)
        const optionalFields = [
            'address',
            'phone',
            'city',
            'department',
            'country',
            'institution',
            'career',
            'graduation_date',
            'additional_info'
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
        
        // CORRECCIÓN: Si todos los campos requeridos están completos, dar el 100% de ese peso
        const requiredProgress = requiredCompleted === requiredFields.length 
            ? requiredWeight 
            : (requiredCompleted / requiredFields.length) * requiredWeight;
        
        // CORRECCIÓN: Ajustar la ponderación de campos opcionales
        // Si todos los opcionales están completos, dar el 100% de ese peso
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
            <Head title="Información Básica" />
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
                                        {data.first_name} {data.last_name}
                                    </Typography>
                                    {data.document_type && data.document_number && (
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            {data.document_type}: {data.document_number}
                                        </Typography>
                                    )}
                                    
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
                                        variant={activeSection === 'location' ? "contained" : "text"}
                                        startIcon={<HomeIcon />}
                                        fullWidth
                                        sx={{ 
                                            justifyContent: 'flex-start', 
                                            py: 1.5,
                                            bgcolor: activeSection === 'location' ? alpha('#3f80ea', 0.1) : 'transparent',
                                            '&:hover': {
                                                bgcolor: activeSection === 'location' ? alpha('#3f80ea', 0.2) : alpha('#fff', 0.05)
                                            }
                                        }}
                                        onClick={() => setActiveSection('location')}
                                    >
                                        Ubicación
                                    </Button>
                                    <Button
                                        variant={activeSection === 'education' ? "contained" : "text"}
                                        startIcon={<SchoolIcon />}
                                        fullWidth
                                        sx={{ 
                                            justifyContent: 'flex-start', 
                                            py: 1.5,
                                            bgcolor: activeSection === 'education' ? alpha('#3f80ea', 0.1) : 'transparent',
                                            '&:hover': {
                                                bgcolor: activeSection === 'education' ? alpha('#3f80ea', 0.2) : alpha('#fff', 0.05)
                                            }
                                        }}
                                        onClick={() => setActiveSection('education')}
                                    >
                                        Educación
                                    </Button>
                                    <Button
                                        variant={activeSection === 'additional' ? "contained" : "text"}
                                        startIcon={<InfoIcon />}
                                        fullWidth
                                        sx={{ 
                                            justifyContent: 'flex-start', 
                                            py: 1.5,
                                            bgcolor: activeSection === 'additional' ? alpha('#3f80ea', 0.1) : 'transparent',
                                            '&:hover': {
                                                bgcolor: activeSection === 'additional' ? alpha('#3f80ea', 0.2) : alpha('#fff', 0.05)
                                            }
                                        }}
                                        onClick={() => setActiveSection('additional')}
                                    >
                                        Información Adicional
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
                                        {activeSection === 'location' && 'Ubicación'}
                                        {activeSection === 'education' && 'Información Educativa'}
                                        {activeSection === 'additional' && 'Información Adicional'}
                                    </Typography>
                                </Box>
                                
                                <form onSubmit={handleSubmit}>
                                    {/* Sección: Información Personal */}
                                    <Fade in={activeSection === 'personal'} timeout={500}>
                                        <Box sx={{ display: activeSection === 'personal' ? 'block' : 'none' }}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Nombres"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={data.first_name}
                                                        onChange={(e) => setData('first_name', e.target.value)}
                                                        error={!!errors.first_name}
                                                        helperText={errors.first_name}
                                                        required
                                                        sx={{ mb: 2 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Apellidos"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={data.last_name}
                                                        onChange={(e) => setData('last_name', e.target.value)}
                                                        error={!!errors.last_name}
                                                        helperText={errors.last_name}
                                                        required
                                                        sx={{ mb: 2 }}
                                                    />
                                                </Grid>
                                                
                                                {/* Campo de correo predefinido */}
                                                <Grid item xs={12} sm={12}>
                                                    <TextField
                                                        label="Correo electrónico"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        error={!!errors.email}
                                                        helperText={errors.email}
                                                        InputProps={{
                                                            startAdornment: <EmailIcon sx={{ color: 'action.active', mr: 1 }} />,
                                                            readOnly: true, // Readonly para que no se pueda modificar
                                                        }}
                                                        sx={{ mb: 2 }}
                                                    />
                                                </Grid>
                                                
                                                <Grid item xs={12} sm={6}>
                                                    <FormControl fullWidth variant="outlined" error={!!errors.document_type} required>
                                                        <InputLabel id="document-type-label">Tipo de Documento</InputLabel>
                                                        <Select
                                                            labelId="document-type-label"
                                                            value={data.document_type}
                                                            onChange={(e) => setData('document_type', e.target.value)}
                                                            label="Tipo de Documento"
                                                        >
                                                            <MenuItem value=""><em>Seleccionar</em></MenuItem>
                                                            <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                                                            <MenuItem value="TI">Tarjeta de Identidad</MenuItem>
                                                            <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                                                            <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                                                        </Select>
                                                        {errors.document_type && (
                                                            <Typography variant="caption" color="error">
                                                                {errors.document_type}
                                                            </Typography>
                                                        )}
                                                    </FormControl>
                                                </Grid>
                                                
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Número de Documento"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={data.document_number}
                                                        onChange={(e) => setData('document_number', e.target.value)}
                                                        error={!!errors.document_number}
                                                        helperText={errors.document_number}
                                                        required
                                                    />
                                                </Grid>
                                                
                                                {/* Campo de sexo */}
                                                <Grid item xs={12} sm={6}>
                                                    <FormControl fullWidth variant="outlined" error={!!errors.gender} required>
                                                        <InputLabel id="gender-label">Sexo</InputLabel>
                                                        <Select
                                                            labelId="gender-label"
                                                            value={data.gender}
                                                            onChange={(e) => setData('gender', e.target.value)}
                                                            label="Sexo"
                                                        >
                                                            <MenuItem value=""><em>Seleccionar</em></MenuItem>
                                                            <MenuItem value="Masculino">Masculino</MenuItem>
                                                            <MenuItem value="Femenino">Femenino</MenuItem>
                                                            <MenuItem value="No especificar">Prefiero no contestar</MenuItem>
                                                        </Select>
                                                        {errors.gender && (
                                                            <Typography variant="caption" color="error">
                                                                {errors.gender}
                                                            </Typography>
                                                        )}
                                                    </FormControl>
                                                </Grid>
                                                
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Teléfono"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={data.phone}
                                                        onChange={(e) => setData('phone', e.target.value)}
                                                        error={!!errors.phone}
                                                        helperText={errors.phone}
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
                                    
                                    {/* Sección: Ubicación */}
                                    <Fade in={activeSection === 'location'} timeout={500}>
                                        <Box sx={{ display: activeSection === 'location' ? 'block' : 'none' }}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        label="Dirección de Residencia"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={data.address}
                                                        onChange={(e) => setData('address', e.target.value)}
                                                        error={!!errors.address}
                                                        helperText={errors.address}
                                                        sx={{ mb: 2 }}
                                                    />
                                                </Grid>
                                                
                                                <Grid item xs={12} sm={4}>
                                                    <Autocomplete
                                                        options={cities}
                                                        value={data.city || ''}
                                                        onChange={(_, newValue) => setData('city', newValue || '')}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Ciudad"
                                                                variant="outlined"
                                                                error={!!errors.city}
                                                                helperText={errors.city}
                                                                fullWidth
                                                            />
                                                        )}
                                                        freeSolo
                                                        sx={{ mb: 2 }}
                                                    />
                                                </Grid>
                                                
                                                <Grid item xs={12} sm={4}>
                                                    <Autocomplete
                                                        options={departments}
                                                        value={data.department || ''}
                                                        onChange={(_, newValue) => setData('department', newValue || '')}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Departamento"
                                                                variant="outlined"
                                                                error={!!errors.department}
                                                                helperText={errors.department}
                                                                fullWidth
                                                            />
                                                        )}
                                                        freeSolo
                                                        sx={{ mb: 2 }}
                                                    />
                                                </Grid>
                                                
                                                <Grid item xs={12} sm={4}>
                                                    <TextField
                                                        label="País"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={data.country}
                                                        onChange={(e) => setData('country', e.target.value)}
                                                        error={!!errors.country}
                                                        helperText={errors.country}
                                                        defaultValue="Colombia"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Fade>
                                    
                                    {/* Sección: Educación */}
                                    <Fade in={activeSection === 'education'} timeout={500}>
                                        <Box sx={{ display: activeSection === 'education' ? 'block' : 'none' }}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <Autocomplete
                                                        options={institutions}
                                                        value={data.institution || ''}
                                                        onChange={(_, newValue) => {
                                                            console.log("Institución seleccionada:", newValue);
                                                            setData('institution', newValue || '');
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Institución Educativa"
                                                                variant="outlined"
                                                                error={!!errors.institution}
                                                                helperText={errors.institution}
                                                                fullWidth
                                                            />
                                                        )}
                                                        freeSolo
                                                        sx={{ mb: 2 }}
                                                    />
                                                </Grid>
                                                
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Carrera/Programa"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={data.career || ''}
                                                        onChange={(e) => {
                                                            // Usar una función de registro para verificar el valor
                                                            console.log("Valor de carrera cambiado a:", e.target.value);
                                                            setData('career', e.target.value);
                                                        }}
                                                        error={!!errors.career}
                                                        helperText={errors.career}
                                                        sx={{ mb: 2 }}
                                                        InputProps={{
                                                            // Esta propiedad puede ayudar si el campo se borra inesperadamente
                                                            spellCheck: false,
                                                        }}
                                                    />
                                                </Grid>
                                                
                                                <Grid item xs={12} sm={6}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label="Fecha de Graduación"
                                                            value={data.graduation_date ? dayjs(data.graduation_date) : null}
                                                            onChange={(date) => setData('graduation_date', date ? date.format('YYYY-MM-DD') : null)}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    variant: 'outlined',
                                                                    error: !!errors.graduation_date,
                                                                    helperText: errors.graduation_date
                                                                }
                                                            }}
                                                        />
                                                    </LocalizationProvider>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Fade>
                                    
                                    {/* Sección: Información Adicional */}
                                    <Fade in={activeSection === 'additional'} timeout={500}>
                                        <Box sx={{ display: activeSection === 'additional' ? 'block' : 'none' }}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        label="Información Adicional"
                                                        variant="outlined"
                                                        fullWidth
                                                        multiline
                                                        rows={6}
                                                        value={data.additional_info}
                                                        onChange={(e) => setData('additional_info', e.target.value)}
                                                        error={!!errors.additional_info}
                                                        helperText={errors.additional_info}
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