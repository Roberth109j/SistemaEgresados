// BLOQUE 1: IMPORTACIONES Y DEFINICIONES
import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Grid,
    Box,
    Alert,
    Snackbar,
    CircularProgress,
    Tooltip,
    Divider,
    Card,
    CardContent,
    Fade,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Autocomplete,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    LinearProgress,
} from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { Head, router } from '@inertiajs/react';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import WomanIcon from '@mui/icons-material/Woman';
import ManIcon from '@mui/icons-material/Man';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PhoneIcon from '@mui/icons-material/Phone';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BuildIcon from '@mui/icons-material/Build';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import MapIcon from '@mui/icons-material/Map';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

// Definición de los breadcrumbs
const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reportes de Egresados', href: '/graduateReports' },
];

// Tema oscuro (consistente con componentes existentes)
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
        success: {
            main: '#4caf50',
        },
        warning: {
            main: '#ff9800',
        },
        error: {
            main: '#f44336',
        },
        info: {
            main: '#2196f3',
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

// Colores para gráficos
const CHART_COLORS = [
    '#3f80ea',  // Primary
    '#6f42c1',  // Secondary
    '#4caf50',  // Success
    '#ff9800',  // Warning
    '#f44336',  // Error
    '#2196f3',  // Info
    '#9c27b0',  // Purple
    '#e91e63',  // Pink
    '#009688',  // Teal
    '#cddc39',  // Lime
];

// BLOQUE 2: INTERFACES Y TIPOS DE DATOS
interface GraduateBasicInfo {
    id: number;
    name: string;
    email: string;
    career: string;
    gender: string;
    city: string;
    department: string;
    graduation_date: string | null;
    profile_completion: number;
    additional_info?: string | null;
    has_basic_info?: boolean;
    has_academic_info?: boolean;
    has_employment_info?: boolean;
}

interface GenderDistribution {
    name: string;
    value: number;
    color: string;
}

interface LocationDistribution {
    name: string;
    value: number;
}

interface AcademicDistribution {
    institution: string;
    career: string;
    count: number;
}

interface GraduationYearDistribution {
    year: string;
    count: number;
}

interface AcademicLevelDistribution {
    level: string;
    count: number;
    color: string;
}

interface ContactStatusDistribution {
    status: string;
    count: number;
    color: string;
}

interface ProfileCompletionDistribution {
    range: string;
    count: number;
    color: string;
}

interface EmploymentSectorDistribution {
    sector: string;
    count: number;
}

interface SkillDistribution {
    name: string;
    count: number;
}

interface TopEmployerDistribution {
    company: string;
    count: number;
}

interface ReportStats {
    totalGraduates: number;
    recentlyRegistered: number;
    withEmployment: number;
    withHigherEducation: number;
    withCompleteProfiles: number;
    mostPopularCity: string;
    mostPopularCareer: string;
}

interface FilterOptions {
    institutions: string[];
    careers: string[];
    cities: string[];
    departments: string[];
    years: string[];
}

interface Props {
    stats: ReportStats;
    basicInfo: GraduateBasicInfo[];
    genderDistribution: GenderDistribution[];
    locationDistribution: LocationDistribution[];
    academicDistribution: AcademicDistribution[];
    graduationYearDistribution: GraduationYearDistribution[];
    academicLevelDistribution: AcademicLevelDistribution[];
    contactStatusDistribution: ContactStatusDistribution[];
    profileCompletionDistribution: ProfileCompletionDistribution[];
    employmentSectorDistribution: EmploymentSectorDistribution[];
    skillsDistribution: {
        softSkills: SkillDistribution[];
        hardSkills: SkillDistribution[];
    };
    topEmployers: TopEmployerDistribution[];
    filters: FilterOptions;
    error?: string;
}

// BLOQUE 3: COMPONENTE PRINCIPAL Y HOOKS
export default function GraduateReports({
    stats,
    basicInfo,
    genderDistribution,
    locationDistribution,
    academicDistribution,
    graduationYearDistribution,
    academicLevelDistribution,
    contactStatusDistribution,
    profileCompletionDistribution,
    employmentSectorDistribution,
    skillsDistribution,
    topEmployers,
    filters,
    error
}: Props) {
    // Estados
    const [activeTab, setActiveTab] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const [isExporting, setIsExporting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Estados para filtros
    const [filterInstitution, setFilterInstitution] = useState<string>('');
    const [filterCareer, setFilterCareer] = useState<string>('');
    const [filterCity, setFilterCity] = useState<string>('');
    const [filterDepartment, setFilterDepartment] = useState<string>('');
    const [filterYear, setFilterYear] = useState<string>('');

    // Si hay error, mostramos mensaje
    useEffect(() => {
        if (error) {
            showMessage(error, 'error');
        }
    }, [error]);

    // Inicialización de datos y manejo de errores
    const initializedBasicInfo = Array.isArray(basicInfo) ? basicInfo : [];
    const initializedGenderDistribution = Array.isArray(genderDistribution) ? genderDistribution : [];
    const initializedLocationDistribution = Array.isArray(locationDistribution) ? locationDistribution : [];
    const initializedAcademicDistribution = Array.isArray(academicDistribution) ? academicDistribution : [];
    const initializedGraduationYearDistribution = Array.isArray(graduationYearDistribution) ? graduationYearDistribution : [];
    const initializedAcademicLevelDistribution = Array.isArray(academicLevelDistribution) ? academicLevelDistribution : [];
    const initializedContactStatusDistribution = Array.isArray(contactStatusDistribution) ? contactStatusDistribution : [];
    const initializedProfileCompletionDistribution = Array.isArray(profileCompletionDistribution) ? profileCompletionDistribution : [];
    const initializedEmploymentSectorDistribution = Array.isArray(employmentSectorDistribution) ? employmentSectorDistribution : [];
    const initializedTopEmployers = Array.isArray(topEmployers) ? topEmployers : [];
    
    const initializedSoftSkills = Array.isArray(skillsDistribution?.softSkills) ? skillsDistribution.softSkills : [];
    const initializedHardSkills = Array.isArray(skillsDistribution?.hardSkills) ? skillsDistribution.hardSkills : [];
    
    const initializedStats = stats || {
        totalGraduates: 0,
        recentlyRegistered: 0,
        withEmployment: 0,
        withHigherEducation: 0,
        withCompleteProfiles: 0,
        mostPopularCity: 'No disponible',
        mostPopularCareer: 'No disponible',
    };
    
    const initializedFilters = filters || {
        institutions: [],
        careers: [],
        cities: [],
        departments: [],
        years: [],
    };

// BLOQUE 4: FUNCIONES AUXILIARES Y MANEJADORES
    // Cambiar entre tabs
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    // Cerrar Snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    // Mostrar mensaje de éxito/error
    const showMessage = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    // Abrir/cerrar diálogo de filtros
    const handleToggleFilterDialog = () => {
        setOpenFilterDialog(!openFilterDialog);
    };

    // Aplicar filtros
    const handleApplyFilters = () => {
        setIsLoading(true);
        
        // Crear objeto con los filtros activos
        const activeFilters: Record<string, string> = {};
        
        if (filterInstitution) activeFilters.institution = filterInstitution;
        if (filterCareer) activeFilters.career = filterCareer;
        if (filterCity) activeFilters.city = filterCity;
        if (filterDepartment) activeFilters.department = filterDepartment;
        if (filterYear) activeFilters.year = filterYear;
        
        // Enviar solicitud a través de Inertia
        router.get('/graduateReports', activeFilters, {
            onSuccess: () => {
                setIsLoading(false);
                setOpenFilterDialog(false);
                showMessage('Filtros aplicados correctamente', 'success');
            },
            onError: (errors) => {
                setIsLoading(false);
                showMessage('Error al aplicar los filtros: ' + (errors.message || 'Error desconocido'), 'error');
            },
            preserveState: true
        });
    };

    // Restablecer filtros
    const handleResetFilters = () => {
        // Limpiar filtros en el estado
        setFilterInstitution('');
        setFilterCareer('');
        setFilterCity('');
        setFilterDepartment('');
        setFilterYear('');
        
        // Enviar solicitud sin filtros
        router.get('/graduateReports', {}, {
            onSuccess: () => {
                setIsLoading(false);
                setOpenFilterDialog(false);
                showMessage('Filtros restablecidos', 'info');
            },
            onError: (errors) => {
                setIsLoading(false);
                showMessage('Error al restablecer los filtros: ' + (errors.message || 'Error desconocido'), 'error');
            },
            preserveState: true
        });
    };

    // Exportar a PDF
    const handleExportToPDF = (reportType: string) => {
        setIsExporting(true);
        
        // Construir consulta con filtros activos
        const queryParams: Record<string, string> = {
            report: reportType,
        };
        
        if (filterInstitution) queryParams.institution = filterInstitution;
        if (filterCareer) queryParams.career = filterCareer;
        if (filterCity) queryParams.city = filterCity;
        if (filterDepartment) queryParams.department = filterDepartment;
        if (filterYear) queryParams.year = filterYear;
        
        // Construir URL para la descarga
        const queryString = Object.keys(queryParams)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
            .join('&');
            
        const downloadUrl = `/graduateReports/export?${queryString}`;
        
        // Abrir en nueva pestaña
        window.open(downloadUrl, '_blank');
        
        setTimeout(() => {
            setIsExporting(false);
            showMessage('Reporte exportado correctamente', 'success');
        }, 1000);
    };

    // Componente para mostrar barra de progreso con porcentaje
    const LinearProgressWithLabel = (props: { value: number }) => {
        let color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'primary';
        
        if (props.value < 30) color = 'error';
        else if (props.value < 70) color = 'warning';
        else if (props.value >= 70) color = 'success';
        
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                        variant="determinate" 
                        value={props.value} 
                        color={color}
                        sx={{ height: 6, borderRadius: 3 }}
                    />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">
                        {`${Math.round(props.value)}%`}
                    </Typography>
                </Box>
            </Box>
        );
    };

// BLOQUE 5: COMPONENTE DE RESUMEN DE ESTADÍSTICAS
    const renderStatsSummary = () => (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
                <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DashboardIcon />
                    Estadísticas Generales
                </Typography>
                <Grid container spacing={2}>
                    {/* Total de Egresados */}
                    <Grid item xs={12} sm={6} lg={3}>
                        <Card sx={{ 
                            height: '100%', 
                            background: 'linear-gradient(135deg, rgba(63, 128, 234, 0.9) 0%, rgba(90, 140, 250, 0.8) 100%)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                                        Total Egresados
                                    </Typography>
                                    <PeopleAltIcon sx={{ color: 'white', opacity: 0.9 }} />
                                </Box>
                                <Typography variant="h4" color="white" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                                    {initializedStats.totalGraduates}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography variant="caption" color="white" sx={{ opacity: 0.9 }}>
                                        Registrados en el sistema
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    {/* Egresados con Empleo */}
                    <Grid item xs={12} sm={6} lg={3}>
                        <Card sx={{ 
                            height: '100%', 
                            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(105, 190, 120, 0.8) 100%)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                                        Con Empleo
                                    </Typography>
                                    <WorkIcon sx={{ color: 'white', opacity: 0.9 }} />
                                </Box>
                                <Typography variant="h4" color="white" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                                    {initializedStats.withEmployment}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography variant="caption" color="white" sx={{ opacity: 0.9 }}>
                                        {initializedStats.totalGraduates > 0 
                                            ? ((initializedStats.withEmployment / initializedStats.totalGraduates) * 100).toFixed(1) 
                                            : "0"}% del total
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    {/* Egresados con Educación Superior */}
                    <Grid item xs={12} sm={6} lg={3}>
                        <Card sx={{ 
                            height: '100%', 
                            background: 'linear-gradient(135deg, rgba(111, 66, 193, 0.9) 0%, rgba(130, 80, 210, 0.8) 100%)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                                        Educación Superior
                                    </Typography>
                                    <SchoolIcon sx={{ color: 'white', opacity: 0.9 }} />
                                </Box>
                                <Typography variant="h4" color="white" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                                    {initializedStats.withHigherEducation}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography variant="caption" color="white" sx={{ opacity: 0.9 }}>
                                        {initializedStats.totalGraduates > 0 
                                            ? ((initializedStats.withHigherEducation / initializedStats.totalGraduates) * 100).toFixed(1) 
                                            : "0"}% del total
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    {/* Perfiles Completos */}
                    <Grid item xs={12} sm={6} lg={3}>
                        <Card sx={{ 
                            height: '100%', 
                            background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.9) 0%, rgba(255, 183, 77, 0.8) 100%)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                                        Perfiles Completos
                                    </Typography>
                                    <VerifiedUserIcon sx={{ color: 'white', opacity: 0.9 }} />
                                </Box>
                                <Typography variant="h4" color="white" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                                    {initializedStats.withCompleteProfiles}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography variant="caption" color="white" sx={{ opacity: 0.9 }}>
                                        {initializedStats.totalGraduates > 0 
                                            ? ((initializedStats.withCompleteProfiles / initializedStats.totalGraduates) * 100).toFixed(1) 
                                            : "0"}% completados
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
            
            <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InfoIcon />
                            Destacados
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemIcon>
                                    <PersonPinCircleIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Ciudad más popular" 
                                    secondary={initializedStats.mostPopularCity || 'No disponible'} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <SchoolIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Carrera más común" 
                                    secondary={initializedStats.mostPopularCareer || 'No disponible'} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <DateRangeIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Egresados registrados recientemente" 
                                    secondary={`${initializedStats.recentlyRegistered} en los últimos 30 días`} 
                                />
                            </ListItem>
                        </List>
                        <Box sx={{ mt: 2 }}>
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                onClick={() => handleExportToPDF('general')}
                                startIcon={<PictureAsPdfIcon />}
                                disabled={isExporting}
                            >
                                Exportar Resumen General
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

// BLOQUE 6: COMPONENTE DISTRIBUCIÓN POR GÉNERO
    const renderGenderDistribution = () => (
        <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonPinIcon />
                            Distribución por Género
                        </Typography>
                        <IconButton 
                            size="small" 
                            onClick={() => handleExportToPDF('gender')}
                            disabled={isExporting}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
                        {initializedGenderDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={initializedGenderDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                    >
                                        {initializedGenderDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                    <RechartsTooltip 
                                        formatter={(value: number) => [
                                            `${value} (${initializedStats.totalGraduates > 0 ? ((value / initializedStats.totalGraduates) * 100).toFixed(1) : 0}%)`, 
                                            'Cantidad'
                                        ]} 
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%',
                                color: 'text.secondary'
                            }}>
                                No hay datos disponibles
                            </Box>
                        )}
                    </Box>
                    <Box sx={{ mt: 1 }}>
                        <Grid container spacing={1}>
                            {initializedGenderDistribution.map((item, index) => (
                                <Grid item xs={6} key={index}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1,
                                        p: 1, 
                                        borderRadius: 1,
                                        bgcolor: alpha(item.color || CHART_COLORS[index % CHART_COLORS.length], 0.1)
                                    }}>
                                        {item.name === 'Masculino' ? (
                                            <ManIcon sx={{ color: item.color || CHART_COLORS[index % CHART_COLORS.length] }} />
                                        ) : item.name === 'Femenino' ? (
                                            <WomanIcon sx={{ color: item.color || CHART_COLORS[index % CHART_COLORS.length] }} />
                                        ) : (
                                            <PersonPinIcon sx={{ color: item.color || CHART_COLORS[index % CHART_COLORS.length] }} />
                                        )}
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">
                                                {item.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {item.value} egresados
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );

// BLOQUE 7: COMPONENTE DISTRIBUCIÓN POR UBICACIÓN
    const renderLocationDistribution = () => (
        <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon />
                            Distribución por Ubicación
                        </Typography>
                        <IconButton 
                            size="small" 
                            onClick={() => handleExportToPDF('location')}
                            disabled={isExporting}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ height: 250 }}>
                        {initializedLocationDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={initializedLocationDistribution.slice(0, 8)} // Mostrar solo los primeros 8 para mejor visualización
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={100} />
                                    <RechartsTooltip formatter={(value) => [`${value} egresados`, 'Cantidad']} />
                                    <Bar dataKey="value" fill="#3f80ea" name="Egresados">
                                        {initializedLocationDistribution.slice(0, 8).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%',
                                color: 'text.secondary'
                            }}>
                                No hay datos disponibles
                            </Box>
                        )}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            * Se muestran las 8 ubicaciones con mayor cantidad de egresados
                        </Typography>
                        {initializedLocationDistribution.length > 8 && (
                            <Button 
                                fullWidth 
                                variant="text" 
                                size="small" 
                                onClick={() => handleExportToPDF('location')}
                                sx={{ mt: 1 }}
                            >
                                Ver lista completa
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );

// BLOQUE 8: COMPONENTE DISTRIBUCIÓN POR INSTITUCIÓN Y CARRERA
    const renderAcademicDistribution = () => (
        <Grid item xs={12}>
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon />
                            Distribución por Institución y Carrera
                        </Typography>
                        <IconButton 
                            size="small" 
                            onClick={() => handleExportToPDF('academic')}
                            disabled={isExporting}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Box>
                    <TableContainer sx={{ maxHeight: 350 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Institución</TableCell>
                                    <TableCell>Carrera</TableCell>
                                    <TableCell align="center">Egresados</TableCell>
                                    <TableCell align="right">Porcentaje</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {initializedAcademicDistribution.map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>{row.institution}</TableCell>
                                        <TableCell>{row.career}</TableCell>
                                        <TableCell align="center">{row.count}</TableCell>
                                        <TableCell align="right">
                                            {initializedStats.totalGraduates > 0 
                                                ? ((row.count / initializedStats.totalGraduates) * 100).toFixed(1) 
                                                : "0"}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {initializedAcademicDistribution.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No hay datos disponibles
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Grid>
    );

// BLOQUE 9: COMPONENTE DISTRIBUCIÓN POR AÑO DE GRADUACIÓN
    const renderGraduationYearDistribution = () => (
        <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DateRangeIcon />
                            Distribución por Año de Graduación
                        </Typography>
                        <IconButton 
                            size="small" 
                            onClick={() => handleExportToPDF('graduationYear')}
                            disabled={isExporting}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ height: 250 }}>
                        {initializedGraduationYearDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={initializedGraduationYearDistribution}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" />
                                    <YAxis />
                                    <RechartsTooltip formatter={(value) => [`${value} egresados`, 'Cantidad']} />
                                    <Bar dataKey="count" fill="#3f80ea" name="Egresados">
                                        {initializedGraduationYearDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%',
                                color: 'text.secondary'
                            }}>
                                No hay datos disponibles
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );

    const renderAcademicLevelDistribution = () => (
        <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon />
                            Niveles Académicos Alcanzados
                        </Typography>
                        <IconButton 
                            size="small" 
                            onClick={() => handleExportToPDF('academicLevel')}
                            disabled={isExporting}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
                        {initializedAcademicLevelDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={initializedAcademicLevelDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                    >
                                        {initializedAcademicLevelDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                    <RechartsTooltip formatter={(value, name) => [`${value} egresados`, name]} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%',
                                color: 'text.secondary'
                            }}>
                                No hay datos disponibles
                            </Box>
                        )}
                    </Box>
                    <Box sx={{ mt: 1 }}>
                        <Grid container spacing={1}>
                            {initializedAcademicLevelDistribution.map((item, index) => (
                                <Grid item xs={6} key={index}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1,
                                        p: 1, 
                                        borderRadius: 1,
                                        bgcolor: alpha(item.color || CHART_COLORS[index % CHART_COLORS.length], 0.1)
                                    }}>
                                        <SchoolIcon sx={{ color: item.color || CHART_COLORS[index % CHART_COLORS.length] }} />
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">
                                                {item.level}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {item.count} egresados
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
    
// BLOQUE 11: COMPONENTE PROGRESO DE PERFILES
    const renderProfileCompletion = () => (
        <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AssessmentIcon />
                            Porcentaje de Perfiles Completados
                        </Typography>
                        <IconButton 
                            size="small" 
                            onClick={() => handleExportToPDF('profileCompletion')}
                            disabled={isExporting}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ height: 250 }}>
                        {initializedProfileCompletionDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={initializedProfileCompletionDistribution}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="range" />
                                    <YAxis />
                                    <RechartsTooltip formatter={(value) => [`${value} egresados`, 'Cantidad']} />
                                    <Bar dataKey="count" name="Egresados">
                                        {initializedProfileCompletionDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%',
                                color: 'text.secondary'
                            }}>
                                No hay datos disponibles
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );

    const renderAdditionalInfo = () => (
        <Grid item xs={12}>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InfoIcon />
                            Observaciones y Comentarios Personalizados
                        </Typography>
                        <IconButton 
                            size="small" 
                            onClick={() => handleExportToPDF('additionalInfo')}
                            disabled={isExporting}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Box>
                    <TableContainer sx={{ maxHeight: 400 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Correo Electrónico</TableCell>
                                    <TableCell>Información Adicional</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {initializedBasicInfo
                                    .filter(graduate => graduate.additional_info)
                                    .map((graduate) => (
                                        <TableRow key={graduate.id} hover>
                                            <TableCell>{graduate.name}</TableCell>
                                            <TableCell>{graduate.email}</TableCell>
                                            <TableCell>{graduate.additional_info || 'No disponible'}</TableCell>
                                        </TableRow>
                                    ))}
                                {initializedBasicInfo.filter(graduate => graduate.additional_info).length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            No hay datos adicionales registrados para los egresados
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Grid>
    );

// BLOQUE 13: COMPONENTE DETALLE DE COMPLETITUD DE PERFILES
    const renderProfileDetail = () => (
        <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VerifiedUserIcon />
                            Detalle de Completitud de Perfiles
                        </Typography>
                        <IconButton 
                            size="small" 
                            onClick={() => handleExportToPDF('profileDetail')}
                            disabled={isExporting}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Box>
                    <TableContainer sx={{ maxHeight: 250 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Datos Básicos</TableCell>
                                    <TableCell>Datos Académicos</TableCell>
                                    <TableCell>Datos Laborales</TableCell>
                                    <TableCell align="right">Progreso Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {initializedBasicInfo
                                    .slice(0, 10) // Mostrar solo los primeros 10 para simplicidad
                                    .sort((a, b) => a.profile_completion - b.profile_completion) // Ordenar por progreso ascendente
                                    .map((graduate) => (
                                        <TableRow key={graduate.id} hover>
                                            <TableCell>{graduate.name}</TableCell>
                                            <TableCell align="center">
                                                <Chip 
                                                    label={graduate.has_basic_info ? "Completo" : "Incompleto"}
                                                    size="small"
                                                    color={graduate.has_basic_info ? "success" : "error"}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip 
                                                    label={graduate.has_academic_info ? "Completo" : "Incompleto"}
                                                    size="small"
                                                    color={graduate.has_academic_info ? "success" : "error"}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip 
                                                    label={graduate.has_employment_info ? "Completo" : "Incompleto"}
                                                    size="small"
                                                    color={graduate.has_employment_info ? "success" : "error"}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <LinearProgressWithLabel value={graduate.profile_completion} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                {initializedBasicInfo.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No hay datos disponibles
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            * Se muestran los 10 perfiles con menor progreso
                        </Typography>
                        <Button 
                            size="small"
                            variant="text"
                            onClick={() => handleExportToPDF('profileDetail')}
                            sx={{ mt: 1 }}
                        >
                            Ver listado completo
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
    
    // Componente sector de empleo
    const renderEmploymentSectorDistribution = () => (
        <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon />
                            Distribución por Sector de Empleo
                        </Typography>
                        <IconButton 
                            size="small" 
                            onClick={() => handleExportToPDF('employmentSector')}
                            disabled={isExporting}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ height: 250 }}>
                        {initializedEmploymentSectorDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={initializedEmploymentSectorDistribution}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="sector" type="category" width={100} />
                                    <RechartsTooltip formatter={(value) => [`${value} egresados`, 'Cantidad']} />
                                    <Bar dataKey="count" fill="#3f80ea" name="Egresados">
                                        {initializedEmploymentSectorDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%',
                                color: 'text.secondary'
                            }}>
                                No hay datos disponibles
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );

    // Componente habilidades
    const renderSkillsDistribution = () => (
        <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BuildIcon />
                            Habilidades más Frecuentes
                        </Typography>
                        <IconButton 
                            size="small" 
                            onClick={() => handleExportToPDF('skills')}
                            disabled={isExporting}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Box>
                    <Tabs
                        value={activeTab === 7 ? 0 : 1}
                        onChange={(e, newValue) => setActiveTab(newValue === 0 ? 7 : 8)}
                        variant="fullWidth"
                        sx={{ mb: 2 }}
                    >
                        <Tab 
                            label="Habilidades Blandas" 
                            icon={<PsychologyIcon />} 
                            iconPosition="start"
                        />
                        <Tab 
                            label="Habilidades Técnicas" 
                            icon={<BuildIcon />} 
                            iconPosition="start"
                        />
                    </Tabs>
                    <Box sx={{ height: 220 }}>
                        {activeTab === 7 ? (
                            initializedSoftSkills.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={initializedSoftSkills.slice(0, 8)}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={100} />
                                        <RechartsTooltip formatter={(value) => [`${value} menciones`, 'Frecuencia']} />
                                        <Bar dataKey="count" fill="#6f42c1" name="Frecuencia" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    height: '100%',
                                    color: 'text.secondary'
                                }}>
                                    No hay datos disponibles
                                </Box>
                            )
                        ) : (
                            initializedHardSkills.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={initializedHardSkills.slice(0, 8)}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={100} />
                                        <RechartsTooltip formatter={(value) => [`${value} menciones`, 'Frecuencia']} />
                                        <Bar dataKey="count" fill="#4caf50" name="Frecuencia" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    height: '100%',
                                    color: 'text.secondary'
                                }}>
                                    No hay datos disponibles
                                </Box>
                            )
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );

    // Componente principales empleadores
    const renderTopEmployers = () => (
        <Grid item xs={12}>
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon />
                            Principales Empleadores
                        </Typography>
                        <IconButton 
                            size="small" 
                            onClick={() => handleExportToPDF('topEmployers')}
                            disabled={isExporting}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ height: 250 }}>
                        {initializedTopEmployers.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={initializedTopEmployers}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="company" type="category" width={120} />
                                    <RechartsTooltip formatter={(value) => [`${value} egresados`, 'Cantidad']} />
                                    <Bar dataKey="count" fill="#3f80ea" name="Egresados">
                                        {initializedTopEmployers.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%',
                                color: 'text.secondary'
                            }}>
                                No hay datos disponibles
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );

    // Componente mapa de ubicación
    const renderLocationMap = () => (
        <Grid item xs={12} md={7}>
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MapIcon />
                            Mapa de Distribución Geográfica
                        </Typography>
                        <IconButton 
                            size="small" 
                            onClick={() => handleExportToPDF('locationMap')}
                            disabled={isExporting}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: alpha('#000', 0.02), borderRadius: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <MapIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                            <Typography variant="body2" color="text.secondary">
                                El mapa interactivo se renderiza con una biblioteca externa de mapas.
                            </Typography>
                            <Button 
                                variant="outlined" 
                                size="small" 
                                sx={{ mt: 2 }} 
                                startIcon={<SearchIcon />}
                                onClick={() => handleExportToPDF('locationMap')}
                            >
                                Ver reporte detallado
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );

    // Componente estado de contacto
    const renderContactStatus = () => (
        <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ContactMailIcon />
                            Estado de Contactabilidad
                        </Typography>
                        <IconButton 
                            size="small" 
                            onClick={() => handleExportToPDF('contactStatus')}
                            disabled={isExporting}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
                        {initializedContactStatusDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={initializedContactStatusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                    >
                                        {initializedContactStatusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                    <RechartsTooltip formatter={(value, name) => [`${value} egresados`, name]} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%',
                                color: 'text.secondary'
                            }}>
                                No hay datos disponibles
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );

    // Componente listado de egresados
    const renderGraduatesList = () => (
        <Grid item xs={12}>
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PeopleAltIcon />
                            Listado General de Egresados
                        </Typography>
                        <Box>
                            <IconButton 
                                size="small" 
                                onClick={() => handleExportToPDF('graduatesList')}
                                disabled={isExporting}
                                sx={{ mr: 1 }}
                            >
                                <FileDownloadIcon />
                            </IconButton>
                            <Button
                                startIcon={<FilterListIcon />}
                                variant="outlined"
                                size="small"
                                onClick={handleToggleFilterDialog}
                            >
                                Filtros
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            placeholder="Buscar por nombre, correo o carrera..."
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                            }}
                        />
                    </Box>
                    <TableContainer sx={{ maxHeight: 400 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Correo Electrónico</TableCell>
                                    <TableCell>Carrera</TableCell>
                                    <TableCell>Género</TableCell>
                                    <TableCell>Ciudad</TableCell>
                                    <TableCell align="center">Graduación</TableCell>
                                    <TableCell align="center">Progreso</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {initializedBasicInfo
                                    .filter(graduate => 
                                        !searchQuery || 
                                        graduate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        graduate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        graduate.career.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((graduate) => (
                                        <TableRow key={graduate.id} hover>
                                            <TableCell>{graduate.name}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <EmailIcon fontSize="small" color="action" />
                                                    {graduate.email}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{graduate.career}</TableCell>
                                            <TableCell>
                                                {graduate.gender === 'Masculino' ? (
                                                    <Chip icon={<ManIcon />} label="M" size="small" color="primary" variant="outlined" />
                                                ) : graduate.gender === 'Femenino' ? (
                                                    <Chip icon={<WomanIcon />} label="F" size="small" color="secondary" variant="outlined" />
                                                ) : (
                                                    <Chip label="No esp." size="small" variant="outlined" />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <LocationOnIcon fontSize="small" color="action" />
                                                    {graduate.city || graduate.department || 'No especificada'}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                {graduate.graduation_date ? graduate.graduation_date.substring(0, 4) : 'N/A'}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <LinearProgressWithLabel value={graduate.profile_completion} />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                {(initializedBasicInfo.length === 0 || 
                                 initializedBasicInfo.filter(graduate => 
                                    !searchQuery || 
                                    graduate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    graduate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    graduate.career.toLowerCase().includes(searchQuery.toLowerCase())
                                 ).length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            {initializedBasicInfo.length === 0 
                                                ? 'No hay datos disponibles' 
                                                : 'No se encontraron resultados para la búsqueda'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Grid>
    );
    
    // Componente diálogo de filtros
    const renderFilterDialog = () => (
        <Dialog
            open={openFilterDialog}
            onClose={handleToggleFilterDialog}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterListIcon />
                    Filtrar Reportes
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText sx={{ mb: 2 }}>
                    Utilice los siguientes filtros para refinar los datos de los reportes. Los filtros se aplicarán a todos los gráficos y tablas.
                </DialogContentText>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Institución</InputLabel>
                            <Select
                                value={filterInstitution}
                                onChange={(e) => setFilterInstitution(e.target.value)}
                                label="Institución"
                            >
                                <MenuItem value="">Todas las instituciones</MenuItem>
                                {initializedFilters.institutions.map((institution, index) => (
                                    <MenuItem key={index} value={institution}>
                                        {institution}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Carrera</InputLabel>
                            <Select
                                value={filterCareer}
                                onChange={(e) => setFilterCareer(e.target.value)}
                                label="Carrera"
                            >
                                <MenuItem value="">Todas las carreras</MenuItem>
                                {initializedFilters.careers.map((career, index) => (
                                    <MenuItem key={index} value={career}>
                                        {career}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Ciudad</InputLabel>
                            <Select
                                value={filterCity}
                                onChange={(e) => setFilterCity(e.target.value)}
                                label="Ciudad"
                            >
                                <MenuItem value="">Todas las ciudades</MenuItem>
                                {initializedFilters.cities.map((city, index) => (
                                    <MenuItem key={index} value={city}>
                                        {city}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Departamento</InputLabel>
                            <Select
                                value={filterDepartment}
                                onChange={(e) => setFilterDepartment(e.target.value)}
                                label="Departamento"
                            >
                                <MenuItem value="">Todos los departamentos</MenuItem>
                                {initializedFilters.departments.map((department, index) => (
                                    <MenuItem key={index} value={department}>
                                        {department}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Año de Graduación</InputLabel>
                            <Select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                label="Año de Graduación"
                            >
                                <MenuItem value="">Todos los años</MenuItem>
                                {initializedFilters.years.map((year, index) => (
                                    <MenuItem key={index} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleResetFilters} startIcon={<RefreshIcon />}>
                    Restablecer
                </Button>
                <Button onClick={handleToggleFilterDialog} color="inherit">
                    Cancelar
                </Button>
                <Button 
                    onClick={handleApplyFilters}
                    variant="contained" 
                    color="primary"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={24} /> : <FilterListIcon />}
                >
                    Aplicar Filtros
                </Button>
            </DialogActions>
        </Dialog>
    );

    // Renderizado principal del componente
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportes de Egresados" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ThemeProvider theme={darkTheme}>
                    {/* Mensaje de error si existe */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Cabecera del panel de reportes */}
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #1e1e2d 0%, #252537 100%)',
                            mb: 3,
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: { xs: 'flex-start', md: 'center' },
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: 2
                            }}>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AssessmentIcon fontSize="large" />
                                        Reportes de Egresados
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Visualiza estadísticas y datos detallados de los egresados registrados en el sistema.
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<FilterListIcon />}
                                        onClick={handleToggleFilterDialog}
                                    >
                                        Filtros
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<PictureAsPdfIcon />}
                                        onClick={() => handleExportToPDF('complete')}
                                        disabled={isExporting}
                                    >
                                        Exportar Todo
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Widgets de Resumen */}
                    {renderStatsSummary()}

                    {/* Panel principal con pestañas */}
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #1e1e2d 0%, #252537 100%)',
                            mb: 3,
                        }}
                    >
                        {/* Tabs de navegación entre reportes */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                textColor="primary"
                                indicatorColor="primary"
                            >
                                <Tab 
                                    icon={<PeopleAltIcon />}
                                    label="Reportes Básicos"
                                    iconPosition="start"
                                    sx={{ textTransform: 'none', fontWeight: 'medium' }}
                                />
                                <Tab 
                                    icon={<SchoolIcon />}
                                    label="Reportes Académicos"
                                    iconPosition="start"
                                    sx={{ textTransform: 'none', fontWeight: 'medium' }}
                                />
                                <Tab 
                                    icon={<LocationOnIcon />}
                                    label="Ubicación y Contacto"
                                    iconPosition="start"
                                    sx={{ textTransform: 'none', fontWeight: 'medium' }}
                                />
                                <Tab 
                                    icon={<DescriptionIcon />}
                                    label="Información Adicional"
                                    iconPosition="start"
                                    sx={{ textTransform: 'none', fontWeight: 'medium' }}
                                />
                                <Tab 
                                    icon={<AssessmentIcon />}
                                    label="Progreso de Perfiles"
                                    iconPosition="start"
                                    sx={{ textTransform: 'none', fontWeight: 'medium' }}
                                />
                                <Tab 
                                    icon={<WorkIcon />}
                                    label="Reportes Laborales"
                                    iconPosition="start"
                                    sx={{ textTransform: 'none', fontWeight: 'medium' }}
                                />
                            </Tabs>
                        </Box>

                        {/* Contenido de las tabs */}
                        <Box sx={{ mt: 3 }}>
                            {/* Tab 0: Reportes Básicos */}
                            <Fade in={activeTab === 0} timeout={500}>
                                <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
                                    <Grid container spacing={3}>
                                        {renderGraduatesList()}
                                        {renderGenderDistribution()}
                                        {renderLocationDistribution()}
                                    </Grid>
                                </Box>
                            </Fade>

                            {/* Tab 1: Reportes Académicos */}
                            <Fade in={activeTab === 1} timeout={500}>
                                <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
                                    <Grid container spacing={3}>
                                        {renderAcademicDistribution()}
                                        {renderGraduationYearDistribution()}
                                        {renderAcademicLevelDistribution()}
                                    </Grid>
                                </Box>
                            </Fade>

                            {/* Tab 2: Ubicación y Contacto */}
                            <Fade in={activeTab === 2} timeout={500}>
                                <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
                                    <Grid container spacing={3}>
                                        {renderLocationMap()}
                                        {renderContactStatus()}
                                    </Grid>
                                </Box>
                            </Fade>

                            {/* Tab 3: Información Adicional */}
                            <Fade in={activeTab === 3} timeout={500}>
                                <Box sx={{ display: activeTab === 3 ? 'block' : 'none' }}>
                                    <Grid container spacing={3}>
                                        {renderAdditionalInfo()}
                                    </Grid>
                                </Box>
                            </Fade>

                            {/* Tab 4: Progreso de Perfiles */}
                            <Fade in={activeTab === 4} timeout={500}>
                                <Box sx={{ display: activeTab === 4 ? 'block' : 'none' }}>
                                    <Grid container spacing={3}>
                                        {renderProfileCompletion()}
                                        {renderProfileDetail()}
                                    </Grid>
                                </Box>
                            </Fade>

                            {/* Tab 5: Reportes Laborales */}
                            <Fade in={activeTab === 5} timeout={500}>
                                <Box sx={{ display: activeTab === 5 ? 'block' : 'none' }}>
                                    <Grid container spacing={3}>
                                        {renderEmploymentSectorDistribution()}
                                        {renderSkillsDistribution()}
                                        {renderTopEmployers()}
                                    </Grid>
                                </Box>
                            </Fade>
                        </Box>
                    </Paper>

                    {/* Diálogo de filtros */}
                    {renderFilterDialog()}

                    {/* Snackbar para notificaciones */}
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert
                            onClose={handleCloseSnackbar}
                            severity={snackbarSeverity}
                            sx={{ width: '100%' }}
                            variant="filled"
                        >
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </ThemeProvider>
            </div>
        </AppLayout>
    );
}
