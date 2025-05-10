import React, { useState, useEffect } from 'react';
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
    Fade,
    Autocomplete,
    IconButton,
    Chip,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItemText,
    List,
    ListItem,
    ListItemIcon,
    FormControlLabel,
    Switch,
    TextareaAutosize,
    FormGroup,
    FormLabel,
} from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { Head, router, usePage } from '@inertiajs/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import SaveIcon from '@mui/icons-material/Save';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BuildIcon from '@mui/icons-material/Build';
import PsychologyIcon from '@mui/icons-material/Psychology';
// Definición del tema oscuro (consistente con el componente academicInformation)
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

// Definición de los breadcrumbs
const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Información Laboral', href: '/employmentInformation' },
];
// Interfaz para la información laboral
interface EmploymentRecord {
    id?: number;
    position_name: string;
    company_name: string;
    company_type?: string | null;
    location: string;
    start_date: string;
    end_date?: string | null;
    is_current_job: boolean;
    contract_type?: string | null;
    responsibilities?: string | null;
    soft_skills?: string[];
    hard_skills?: string[];
    duration?: string; // Campo calculado
}

// Interfaz para props del componente
interface Props {
    employmentHistory: EmploymentRecord[];
    completionPercentage: number;
    commonPositions: string[];
    companyTypes: string[];
    contractTypes: string[];
}
// Habilidades blandas predefinidas
const SOFT_SKILLS = [
    'Trabajo en equipo',
    'Comunicación efectiva',
    'Liderazgo',
    'Resolución de problemas',
    'Creatividad',
    'Adaptabilidad',
    'Gestión del tiempo',
    'Pensamiento crítico',
    'Empatía',
    'Negociación',
    'Inteligencia emocional',
    'Otro'
];

// Habilidades técnicas predefinidas
const HARD_SKILLS = [
    'JavaScript',
    'React',
    'PHP',
    'Laravel',
    'SQL',
    'Python',
    'Java',
    'Excel avanzado',
    'Gestión de proyectos',
    'Node.js',
    'TypeScript',
    'Docker',
    'AWS',
    'Análisis de datos',
    'Otro'
];
export default function EmploymentInformation({
    employmentHistory,
    completionPercentage,
    commonPositions,
    companyTypes,
    contractTypes
}: Props) {
    // Obtener información del usuario para verificar si es egresado
    const { auth } = usePage().props as any;
    const isGraduate = auth?.user?.is_graduate || false;

    // Estados para gestionar diálogos y componentes
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<EmploymentRecord | null>(null);
    const [recordsToDelete, setRecordsToDelete] = useState<number[]>([]);
    const [selectedRecordIds, setSelectedRecordIds] = useState<number[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Estados para el formulario
    const [positionName, setPositionName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyType, setCompanyType] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [isCurrentJob, setIsCurrentJob] = useState(false);
    const [contractType, setContractType] = useState('');
    const [responsibilities, setResponsibilities] = useState('');
    const [softSkills, setSoftSkills] = useState<string[]>([]);
    const [hardSkills, setHardSkills] = useState<string[]>([]);
    const [otherSoftSkill, setOtherSoftSkill] = useState('');
    const [otherHardSkill, setOtherHardSkill] = useState('');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    // Manejar cambio de pestaña
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    // Funciones para gestionar el diálogo de formulario
    const handleOpenFormDialog = (record: EmploymentRecord | null = null) => {
        resetForm();

        if (record) {
            setEditingRecord(record);
            setPositionName(record.position_name);
            setCompanyName(record.company_name);
            setCompanyType(record.company_type || '');
            setLocation(record.location);
            setStartDate(record.start_date);
            setEndDate(record.end_date || null);
            setIsCurrentJob(record.is_current_job);
            setContractType(record.contract_type || '');
            setResponsibilities(record.responsibilities || '');
            setSoftSkills(record.soft_skills || []);
            setHardSkills(record.hard_skills || []);

            // Manejo de "Otro" en las habilidades
            if (record.soft_skills?.includes('Otro')) {
                const otherIndex = record.soft_skills.indexOf('Otro');
                if (otherIndex !== -1 && record.soft_skills.length > otherIndex + 1) {
                    setOtherSoftSkill(record.soft_skills[otherIndex + 1]);
                }
            }
            if (record.hard_skills?.includes('Otro')) {
                const otherIndex = record.hard_skills.indexOf('Otro');
                if (otherIndex !== -1 && record.hard_skills.length > otherIndex + 1) {
                    setOtherHardSkill(record.hard_skills[otherIndex + 1]);
                }
            }
        } else {
            setEditingRecord(null);
        }

        setFormDialogOpen(true);
    };

    const handleCloseFormDialog = () => {
        setFormDialogOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setPositionName('');
        setCompanyName('');
        setCompanyType('');
        setLocation('');
        setStartDate(null);
        setEndDate(null);
        setIsCurrentJob(false);
        setContractType('');
        setResponsibilities('');
        setSoftSkills([]);
        setHardSkills([]);
        setOtherSoftSkill('');
        setOtherHardSkill('');
        setFormErrors({});
    };
    // Manejar selección de habilidades blandas
    const handleSoftSkillChange = (skill: string) => {
        setSoftSkills(prevSkills => {
            if (prevSkills.includes(skill)) {
                return prevSkills.filter(s => s !== skill);
            } else {
                return [...prevSkills, skill];
            }
        });
    };

    // Manejar selección de habilidades duras
    const handleHardSkillChange = (skill: string) => {
        setHardSkills(prevSkills => {
            if (prevSkills.includes(skill)) {
                return prevSkills.filter(s => s !== skill);
            } else {
                return [...prevSkills, skill];
            }
        });
    };

    // Procesar las habilidades para guardar
    const processSkills = () => {
        let processedSoftSkills = [...softSkills];
        let processedHardSkills = [...hardSkills];

        // Añadir la habilidad blanda personalizada si "Otro" está seleccionado
        if (softSkills.includes('Otro') && otherSoftSkill.trim() !== '') {
            processedSoftSkills = [...softSkills, otherSoftSkill.trim()];
        }

        // Añadir la habilidad dura personalizada si "Otro" está seleccionado
        if (hardSkills.includes('Otro') && otherHardSkill.trim() !== '') {
            processedHardSkills = [...hardSkills, otherHardSkill.trim()];
        }

        return {
            soft_skills: processedSoftSkills,
            hard_skills: processedHardSkills
        };
    };
    // Funciones para gestionar el diálogo de eliminación
    const handleOpenDeleteDialog = (id?: number) => {
        if (id) {
            setRecordsToDelete([id]);
        } else {
            setRecordsToDelete(selectedRecordIds);
        }
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    // Manejar eliminación de registros
    const handleDeleteRecords = () => {
        if (recordsToDelete.length === 1) {
            router.delete(`/employmentInformation/${recordsToDelete[0]}`, {
                onSuccess: () => {
                    setSuccessMessage('El registro ha sido eliminado correctamente');
                    setOpenSnackbar(true);
                    setSelectedRecordIds([]);
                    // Recarga la página después de la eliminación
                    window.location.reload();
                }
            });
        } else {
            router.post('/employmentInformation/destroyMultiple', {
                ids: recordsToDelete
            }, {
                onSuccess: () => {
                    setSuccessMessage('Los registros seleccionados han sido eliminados correctamente');
                    setOpenSnackbar(true);
                    setSelectedRecordIds([]);
                    // Recarga la página después de la eliminación
                    window.location.reload();
                }
            });
        }

        setDeleteDialogOpen(false);
    };
    // Manejar selección de registros
    const handleSelectRecord = (id: number) => {
        setSelectedRecordIds(prevSelected => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(recordId => recordId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAllRecords = () => {
        if (employmentHistory.length === 0) return;

        // Filtrar solo los IDs que existen
        const recordIds = employmentHistory
            .filter(record => record.id !== undefined)
            .map(record => record.id as number);

        if (recordIds.length === 0) return;

        // Si todos están seleccionados, deseleccionar todos
        const allSelected = recordIds.every(id => selectedRecordIds.includes(id));

        if (allSelected) {
            setSelectedRecordIds([]);
        } else {
            // Si no, seleccionar todos
            setSelectedRecordIds(recordIds);
        }
    };
    // Enviar formulario
    const handleSubmitForm = () => {
        setProcessing(true);
        console.log("Iniciando proceso de guardado...");

        // Validación del formulario
        const errors: Record<string, string> = {};

        if (!positionName) {
            errors.position_name = 'El nombre del cargo es requerido';
        }

        if (!companyName) {
            errors.company_name = 'El nombre de la empresa es requerido';
        }

        if (!location) {
            errors.location = 'La ubicación es requerida';
        }

        if (!startDate) {
            errors.start_date = 'La fecha de inicio es requerida';
        }

        if (!isCurrentJob && !endDate) {
            errors.end_date = 'La fecha de finalización es requerida si no es el trabajo actual';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setProcessing(false);
            console.log("Errores de validación:", errors);
            return;
        }

        // Procesar habilidades
        const { soft_skills, hard_skills } = processSkills();

        // Preparar datos del formulario
        const formData = {
            position_name: positionName,
            company_name: companyName,
            company_type: companyType || null,
            location: location,
            start_date: startDate,
            end_date: isCurrentJob ? null : endDate,
            is_current_job: isCurrentJob,
            contract_type: contractType || null,
            responsibilities: responsibilities || null,
            soft_skills: soft_skills,
            hard_skills: hard_skills,
        };

        if (editingRecord?.id) {
            // Para edición
            router.put(`/employmentInformation/${editingRecord.id}`, formData, {
                onSuccess: () => {
                    console.log("Actualización exitosa, recargando página...");
                    setSuccessMessage('La información laboral ha sido actualizada correctamente');
                    setOpenSnackbar(true);
                    handleCloseFormDialog();
                    // Forzar recarga completa de la página para refrescar los datos
                    window.location.reload();
                },
                onError: (errors) => {
                    setFormErrors(errors);
                    console.error('Errores de validación:', errors);
                    setProcessing(false);
                }
            });
        } else {
            // Para creación
            router.post('/employmentInformation', formData, {
                onSuccess: () => {
                    console.log("Guardado exitoso, recargando página...");
                    setSuccessMessage('La información laboral ha sido guardada correctamente');
                    setOpenSnackbar(true);
                    handleCloseFormDialog();
                    // Forzar recarga completa de la página para refrescar los datos
                    window.location.reload();
                },
                onError: (errors) => {
                    setFormErrors(errors);
                    console.error('Errores de validación:', errors);
                    setProcessing(false);
                }
            });
        }
    };

    // Cerrar Snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    // Formatear fecha
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return dayjs(dateString).format('DD/MM/YYYY');
    };

    // Componente para el círculo de progreso
    const CircularProgressWithLabel = (props: { value: number }) => {
        return (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={props.value} size={120} thickness={5} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h4" component="div" color="text.primary">
                        {`${Math.round(props.value)}%`}
                    </Typography>
                </Box>
            </Box>
        );
    };
    // Renderizar sección de historial laboral vacío
    const renderEmptyState = () => {
        return (
            <Box sx={{
                textAlign: 'center',
                py: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
            }}>
                <WorkIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
                <Typography variant="h6" color="text.secondary">
                    No hay registros de experiencia laboral
                </Typography>
                {!isGraduate && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenFormDialog()}
                    >
                        Añadir Experiencia Laboral
                    </Button>
                )}
            </Box>
        );
    };

    // Renderizar tabla de experiencia laboral
    const renderEmploymentTable = () => {
        if (employmentHistory.length === 0) {
            return renderEmptyState();
        }

        return (
            <>
                {!isGraduate && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenFormDialog()}
                        >
                            Añadir Experiencia
                        </Button>

                        {selectedRecordIds.length > 0 && (
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleOpenDeleteDialog()}
                            >
                                Eliminar Seleccionados ({selectedRecordIds.length})
                            </Button>
                        )}
                    </Box>
                )}

                <TableContainer component={Paper} sx={{ mb: 4, overflow: 'hidden', borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: alpha('#3f80ea', 0.1) }}>
                            <TableRow>
                                {!isGraduate && (
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={
                                                selectedRecordIds.length > 0 &&
                                                selectedRecordIds.length < employmentHistory.length
                                            }
                                            checked={
                                                employmentHistory.length > 0 &&
                                                employmentHistory.every(record =>
                                                    record.id && selectedRecordIds.includes(record.id)
                                                )
                                            }
                                            onChange={handleSelectAllRecords}
                                        />
                                    </TableCell>
                                )}
                                <TableCell>Cargo</TableCell>
                                <TableCell>Empresa</TableCell>
                                <TableCell>Ubicación</TableCell>
                                <TableCell>Período</TableCell>
                                <TableCell>Estado</TableCell>
                                {!isGraduate && <TableCell>Acciones</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employmentHistory.map((record) => (
                                <TableRow key={record.id} hover>
                                    {!isGraduate && (
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={record.id ? selectedRecordIds.includes(record.id) : false}
                                                onChange={() => record.id && handleSelectRecord(record.id)}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AssignmentIndIcon fontSize="small" color="primary" />
                                            <Typography variant="body2" fontWeight="medium">
                                                {record.position_name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            {record.company_name}
                                            {record.company_type && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {record.company_type}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <LocationOnIcon fontSize="small" color="action" />
                                            {record.location}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <CalendarTodayIcon fontSize="small" color="action" />
                                            {formatDate(record.start_date)} - {record.is_current_job ? 'Presente' : (record.end_date ? formatDate(record.end_date) : '')}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {record.is_current_job ? (
                                            <Chip
                                                label="Actual"
                                                size="small"
                                                color="success"
                                            />
                                        ) : (
                                            <Chip
                                                label="Finalizado"
                                                size="small"
                                                variant="outlined"
                                                color="default"
                                            />
                                        )}
                                    </TableCell>
                                    {!isGraduate && (
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleOpenFormDialog(record)}
                                                    size="small"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => record.id && handleOpenDeleteDialog(record.id)}
                                                    size="small"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    };
    // Renderizar tarjetas de experiencia laboral
    const renderEmploymentCards = () => {
        if (employmentHistory.length === 0) {
            return renderEmptyState();
        }

        return (
            <Box sx={{ mt: 2 }}>
                {/* Solo mostrar botón de añadir si no es egresado */}
                {!isGraduate && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenFormDialog()}
                        >
                            Añadir Experiencia
                        </Button>
                    </Box>
                )}

                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
                    <BusinessCenterIcon />
                    Detalle de Experiencia Laboral
                </Typography>
                <Grid container spacing={3}>
                    {employmentHistory.map((record) => (
                        <Grid item xs={12} md={6} key={record.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    borderLeft: '4px solid',
                                    borderColor: record.is_current_job ? 'primary.main' : 'grey.600',
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6" component="div">
                                            {record.position_name}
                                        </Typography>
                                        {record.is_current_job && (
                                            <Chip
                                                label="Actual"
                                                size="small"
                                                color="primary"
                                            />
                                        )}
                                    </Box>

                                    <Typography variant="subtitle1" color="primary" gutterBottom>
                                        <BusinessIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                                        {record.company_name}
                                    </Typography>

                                    {record.company_type && (
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Sector: {record.company_type}
                                        </Typography>
                                    )}

                                    <Typography variant="body2" gutterBottom>
                                        <LocationOnIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                                        {record.location}
                                    </Typography>

                                    <Typography variant="body2" gutterBottom>
                                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                                        {formatDate(record.start_date)} - {record.is_current_job ? 'Presente' : (record.end_date ? formatDate(record.end_date) : '')}
                                    </Typography>

                                    {record.contract_type && (
                                        <Typography variant="body2" gutterBottom>
                                            <Typography component="span" fontWeight="medium">Tipo de contrato:</Typography> {record.contract_type}
                                        </Typography>
                                    )}

                                    {record.responsibilities && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                <DescriptionIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                                                Responsabilidades:
                                            </Typography>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                                {record.responsibilities}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Habilidades blandas */}
                                    {record.soft_skills && record.soft_skills.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                <PsychologyIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                                                Habilidades blandas:
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {record.soft_skills.filter(skill => skill !== 'Otro').map((skill) => (
                                                    <Chip
                                                        key={skill}
                                                        label={skill}
                                                        size="small"
                                                        color="info"
                                                        variant="outlined"
                                                        sx={{ mb: 0.5 }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Habilidades duras */}
                                    {record.hard_skills && record.hard_skills.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                <BuildIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                                                Habilidades técnicas:
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {record.hard_skills.filter(skill => skill !== 'Otro').map((skill) => (
                                                    <Chip
                                                        key={skill}
                                                        label={skill}
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                        sx={{ mb: 0.5 }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Botones de edición/eliminación solo si no es egresado */}
                                    {!isGraduate && (
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                            <Button
                                                size="small"
                                                startIcon={<EditIcon />}
                                                onClick={() => handleOpenFormDialog(record)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="small"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => record.id && handleOpenDeleteDialog(record.id)}
                                                sx={{ ml: 1 }}
                                            >
                                                Eliminar
                                            </Button>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };
    // Renderizar el diálogo del formulario
    const renderFormDialog = () => {
        return (
            <Dialog
                open={formDialogOpen}
                onClose={handleCloseFormDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ pb: 0 }}>
                    {editingRecord ? 'Editar Experiencia Laboral' : 'Añadir Experiencia Laboral'}
                </DialogTitle>

                <DialogContent sx={{ pt: 3 }}>
                    <Grid container spacing={3}>
                        {/* Primera fila - Información básica */}
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ position: 'relative' }}>
                                <Typography
                                    variant="body1"
                                    component="label"
                                    sx={{
                                        display: 'block',
                                        mb: 1,
                                        color: 'white',
                                        fontWeight: 500,
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    Cargo o Puesto *
                                </Typography>
                                <Autocomplete
                                    freeSolo
                                    options={commonPositions}
                                    value={positionName}
                                    onChange={(event, newValue) => {
                                        setPositionName(newValue || '');
                                    }}
                                    onInputChange={(event, newInputValue) => {
                                        setPositionName(newInputValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            error={!!formErrors.position_name}
                                            helperText={formErrors.position_name}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <AssignmentIndIcon color="action" sx={{ mr: 1 }} />
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box sx={{ position: 'relative' }}>
                                <Typography
                                    variant="body1"
                                    component="label"
                                    sx={{
                                        display: 'block',
                                        mb: 1,
                                        color: 'white',
                                        fontWeight: 500,
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    Nombre de la Empresa *
                                </Typography>
                                <TextField
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    fullWidth
                                    error={!!formErrors.company_name}
                                    helperText={formErrors.company_name}
                                    InputProps={{
                                        startAdornment: (
                                            <BusinessIcon color="action" sx={{ mr: 1 }} />
                                        ),
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* Segunda fila */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="company-type-label">Tipo de Empresa</InputLabel>
                                <Select
                                    labelId="company-type-label"
                                    value={companyType}
                                    onChange={(e) => setCompanyType(e.target.value)}
                                    label="Tipo de Empresa"
                                >
                                    <MenuItem value="">
                                        <em>Ninguno</em>
                                    </MenuItem>
                                    {companyTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Ubicación *"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                fullWidth
                                error={!!formErrors.location}
                                helperText={formErrors.location}
                                InputProps={{
                                    startAdornment: (
                                        <LocationOnIcon color="action" sx={{ mr: 1 }} />
                                    ),
                                }}
                                placeholder="Ej: Madrid, España"
                            />
                        </Grid>
                        {/* Tercera fila - Fechas - AJUSTADAS */}
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ position: 'relative' }}>
                                <Typography
                                    variant="body1"
                                    component="label"
                                    sx={{
                                        display: 'block',
                                        mb: 1,
                                        color: 'white',
                                        fontWeight: 500,
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    Fecha de Inicio *
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={startDate ? dayjs(startDate) : null}
                                        onChange={(date) => setStartDate(date ? date.format('YYYY-MM-DD') : null)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!formErrors.start_date,
                                                helperText: formErrors.start_date,
                                                InputProps: {
                                                    startAdornment: (
                                                        <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                                                    ),
                                                },
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box sx={{ position: 'relative' }}>
                                <Typography
                                    variant="body1"
                                    component="label"
                                    sx={{
                                        display: 'block',
                                        mb: 1,
                                        color: 'white',
                                        fontWeight: 500,
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    Fecha de Finalización *
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={endDate ? dayjs(endDate) : null}
                                        onChange={(date) => setEndDate(date ? date.format('YYYY-MM-DD') : null)}
                                        disabled={isCurrentJob}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!formErrors.end_date,
                                                helperText: formErrors.end_date,
                                                InputProps: {
                                                    startAdornment: (
                                                        <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                                                    ),
                                                },
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>
                            
                            {/* Switch para "Es mi trabajo actual" movido debajo del campo de fecha de finalización */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isCurrentJob}
                                        onChange={(e) => setIsCurrentJob(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Es mi trabajo actual"
                                sx={{ 
                                    mt: 1.5,
                                    color: 'white',
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '0.95rem'
                                    }
                                }}
                            />
                        </Grid>

                        {/* Cuarta fila */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="contract-type-label">Tipo de Contrato</InputLabel>
                                <Select
                                    labelId="contract-type-label"
                                    value={contractType}
                                    onChange={(e) => setContractType(e.target.value)}
                                    label="Tipo de Contrato"
                                >
                                    <MenuItem value="">
                                        <em>Ninguno</em>
                                    </MenuItem>
                                    {contractTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Quinta fila - Responsabilidades */}
                        <Grid item xs={12}>
                            <TextField
                                label="Responsabilidades y Logros"
                                value={responsibilities}
                                onChange={(e) => setResponsibilities(e.target.value)}
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Describe tus principales responsabilidades, logros o actividades realizadas en este puesto"
                                InputProps={{
                                    startAdornment: (
                                        <DescriptionIcon color="action" sx={{ mr: 1, mt: 1 }} />
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Sexta fila - Habilidades blandas */}
                        <Grid item xs={12}>
                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <FormLabel component="legend" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PsychologyIcon sx={{ mr: 1 }} />
                                    Habilidades Blandas
                                </FormLabel>
                                <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {SOFT_SKILLS.map((skill) => (
                                        <FormControlLabel
                                            key={skill}
                                            control={
                                                <Checkbox
                                                    checked={softSkills.includes(skill)}
                                                    onChange={() => handleSoftSkillChange(skill)}
                                                    color="primary"
                                                />
                                            }
                                            label={skill}
                                            sx={{ width: '33%', minWidth: '200px' }}
                                        />
                                    ))}
                                </FormGroup>
                                {softSkills.includes('Otro') && (
                                    <TextField
                                        label="Especificar otra habilidad blanda"
                                        value={otherSoftSkill}
                                        onChange={(e) => setOtherSoftSkill(e.target.value)}
                                        fullWidth
                                        size="small"
                                        placeholder="Ej: Resolución de conflictos, Pensamiento estratégico"
                                        sx={{ mt: 1 }}
                                    />
                                )}
                            </FormControl>
                        </Grid>

                        {/* Séptima fila - Habilidades duras */}
                        <Grid item xs={12}>
                            <FormControl component="fieldset" sx={{ width: '100%' }}>
                                <FormLabel component="legend" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <BuildIcon sx={{ mr: 1 }} />
                                    Habilidades Técnicas
                                </FormLabel>
                                <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {HARD_SKILLS.map((skill) => (
                                        <FormControlLabel
                                            key={skill}
                                            control={
                                                <Checkbox
                                                    checked={hardSkills.includes(skill)}
                                                    onChange={() => handleHardSkillChange(skill)}
                                                    color="primary"
                                                />
                                            }
                                            label={skill}
                                            sx={{ width: '33%', minWidth: '200px' }}
                                        />
                                    ))}
                                </FormGroup>
                                {hardSkills.includes('Otro') && (
                                    <TextField
                                        label="Especificar otra habilidad técnica"
                                        value={otherHardSkill}
                                        onChange={(e) => setOtherHardSkill(e.target.value)}
                                        fullWidth
                                        size="small"
                                        placeholder="Ej: MongoDB, Flutter, Marketing Digital"
                                        sx={{ mt: 1 }}
                                    />
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={handleCloseFormDialog}
                        variant="outlined"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmitForm}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                Guardando...
                            </>
                        ) : (
                            editingRecord ? 'Actualizar' : 'Guardar'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };
    // Renderizar el diálogo de confirmación de eliminación
    const renderDeleteDialog = () => {
        return (
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WarningIcon color="error" />
                        Confirmar Eliminación
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {recordsToDelete.length === 1
                            ? '¿Estás seguro de que deseas eliminar esta experiencia laboral? Esta acción no se puede deshacer.'
                            : `¿Estás seguro de que deseas eliminar ${recordsToDelete.length} experiencias laborales seleccionadas? Esta acción no se puede deshacer.`
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary" variant="outlined">
                        Cancelar
                    </Button>
                    <Button onClick={handleDeleteRecords} color="error" variant="contained" startIcon={<DeleteIcon />}>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    // Componente principal
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Información Laboral" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ThemeProvider theme={darkTheme}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #1e1e2d 0%, #252537 100%)',
                            mb: 3,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                justifyContent: 'space-between',
                                alignItems: { xs: 'flex-start', md: 'center' },
                                mb: 3,
                                gap: 2
                            }}
                        >
                            <Box>
                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                                    Experiencia Laboral
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Gestiona tu historial laboral y experiencia profesional. Esta información será utilizada para tu currículum y perfil profesional.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Pestañas para alternar entre vista de tabla y tarjetas */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                textColor="primary"
                                indicatorColor="primary"
                            >
                                <Tab
                                    icon={<WorkIcon />}
                                    label="Vista de Tabla"
                                    iconPosition="start"
                                    sx={{ textTransform: 'none', fontWeight: 'medium' }}
                                />
                                <Tab
                                    icon={<BusinessCenterIcon />}
                                    label="Vista de Tarjetas"
                                    iconPosition="start"
                                    sx={{ textTransform: 'none', fontWeight: 'medium' }}
                                />
                            </Tabs>
                        </Box>

                        {/* Contenido de las pestañas */}
                        <Box sx={{ mt: 3 }}>
                            {activeTab === 0 ? (
                                renderEmploymentTable()
                            ) : (
                                renderEmploymentCards()
                            )}
                        </Box>

                        {/* Diálogo de formulario para agregar/editar */}
                        {renderFormDialog()}

                        {/* Diálogo de confirmación de eliminación */}
                        {renderDeleteDialog()}

                        {/* Snackbar de notificación */}
                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={6000}
                            onClose={handleCloseSnackbar}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                            <Alert
                                onClose={handleCloseSnackbar}
                                severity="success"
                                sx={{ width: '100%' }}
                                variant="filled"
                            >
                                {successMessage}
                            </Alert>
                        </Snackbar>
                    </Paper>
                </ThemeProvider>
            </div>
        </AppLayout>
    );
}