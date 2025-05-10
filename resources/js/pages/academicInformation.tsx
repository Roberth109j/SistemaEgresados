import React, { useState, useRef, useEffect } from 'react';
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
} from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { Head, router } from '@inertiajs/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import SaveIcon from '@mui/icons-material/Save';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import WarningIcon from '@mui/icons-material/Warning';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Información Académica', href: '/academicInformation' },
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
interface AcademicRecord {
    id?: number;
    type: 'formal' | 'course';
    level?: 'educación superior' | 'pregrado' | 'especialización' | 'maestría' | 'doctorado' | null;
    program_name: string;
    custom_program_name?: string | null; // Campo para programas personalizados
    institution: string;
    custom_institution?: string | null;
    start_date?: string | null;
    end_date: string;
    degree_obtained?: string | null;
    certificate_file?: string | null;
    certificate_file_name?: string | null;
}

interface Props {
    formalEducation: AcademicRecord[];
    courses: AcademicRecord[];
    institutions: string[];
    programs: string[];
}
export default function AcademicInformation({ formalEducation, courses, institutions, programs }: Props) {
    // Estado para gestionar pestañas y diálogos
    const [tabValue, setTabValue] = useState(0);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<AcademicRecord | null>(null);
    const [recordsToDelete, setRecordsToDelete] = useState<number[]>([]);
    const [selectedRecordIds, setSelectedRecordIds] = useState<number[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isFormalForm, setIsFormalForm] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Estados para el formulario de educación formal
    const [formalType, setFormalType] = useState<'formal'>('formal');
    const [formalLevel, setFormalLevel] = useState<'educación superior' | 'pregrado' | 'especialización' | 'maestría' | 'doctorado'>('pregrado');
    const [formalProgramName, setFormalProgramName] = useState('');
    const [formalCustomProgramName, setFormalCustomProgramName] = useState('');
    const [formalInstitution, setFormalInstitution] = useState('');
    const [formalCustomInstitution, setFormalCustomInstitution] = useState('');
    const [formalStartDate, setFormalStartDate] = useState<string | null>(null);
    const [formalEndDate, setFormalEndDate] = useState<string | null>(null);
    const [formalDegreeObtained, setFormalDegreeObtained] = useState('');
    const [formalCertificateFile, setFormalCertificateFile] = useState<File | null>(null);
    const [formalErrors, setFormalErrors] = useState<Record<string, string>>({});

    // Estados para el formulario de cursos
    const [courseType, setCourseType] = useState<'course'>('course');
    const [courseProgramName, setCourseProgramName] = useState('');
    const [courseCustomProgramName, setCourseCustomProgramName] = useState('');
    const [courseInstitution, setCourseInstitution] = useState('');
    const [courseCustomInstitution, setCourseCustomInstitution] = useState('');
    const [courseEndDate, setCourseEndDate] = useState<string | null>(null);
    const [courseCertificateFile, setCourseCertificateFile] = useState<File | null>(null);
    const [courseErrors, setCourseErrors] = useState<Record<string, string>>({});

    // Referencia para el input de archivo
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Debug - Para ver el estado de los formularios
    useEffect(() => {
        console.log('Estado del formulario formal:', {
            formalType, formalLevel, formalProgramName, formalCustomProgramName, formalInstitution,
            formalStartDate, formalEndDate, formalDegreeObtained
        });

        console.log('Estado del formulario curso:', {
            courseType, courseProgramName, courseCustomProgramName, courseInstitution, courseEndDate
        });
    }, [formDialogOpen]);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Reset de formulario formal - CORREGIDO
    const resetFormalForm = () => {
        setFormalType('formal');
        setFormalLevel('pregrado');
        setFormalProgramName('');
        setFormalCustomProgramName('');
        setFormalInstitution('');
        setFormalCustomInstitution('');
        setFormalStartDate(null);
        setFormalEndDate(null);
        setFormalDegreeObtained('');
        setFormalCertificateFile(null);
        setFormalErrors({});
    };

    // Reset de formulario de curso - CORREGIDO
    const resetCourseForm = () => {
        setCourseType('course');
        setCourseProgramName('');
        setCourseCustomProgramName('');
        setCourseInstitution('');
        setCourseCustomInstitution('');
        setCourseEndDate(null);
        setCourseCertificateFile(null);
        setCourseErrors({});
    };

    // Abrir el diálogo de formulario para agregar/editar - CORREGIDO
    const handleOpenFormDialog = (type: 'formal' | 'course', record: AcademicRecord | null = null) => {
        resetFormalForm();
        resetCourseForm();
        setIsFormalForm(type === 'formal');

        if (record) {
            setEditingRecord(record);

            if (type === 'formal') {
                setFormalType('formal');

                // Manejo cuidadoso del nivel
                if (record.level && ['educación superior', 'pregrado', 'especialización', 'maestría', 'doctorado'].includes(record.level)) {
                    setFormalLevel(record.level as 'educación superior' | 'pregrado' | 'especialización' | 'maestría' | 'doctorado');
                }

                // Manejo correcto del programa
                setFormalProgramName(record.program_name);
                // Si hay custom_program_name, es porque el programa era "Otro"
                if (record.custom_program_name) {
                    setFormalProgramName('Otro');
                    setFormalCustomProgramName(record.custom_program_name);
                }

                // Manejo correcto de la institución
                setFormalInstitution(record.institution);
                // Si hay custom_institution, es porque la institución era "Otro"
                if (record.custom_institution) {
                    setFormalInstitution('Otro');
                    setFormalCustomInstitution(record.custom_institution);
                }

                // Manejo seguro de fechas
                if (typeof record.start_date === 'string') {
                    setFormalStartDate(record.start_date);
                }

                if (typeof record.end_date === 'string') {
                    setFormalEndDate(record.end_date);
                }

                setFormalDegreeObtained(record.degree_obtained || '');
                setFormalCertificateFile(null);
            } else {
                setCourseType('course');

                // Manejo correcto del programa
                setCourseProgramName(record.program_name);
                // Si hay custom_program_name, es porque el programa era "Otro"
                if (record.custom_program_name) {
                    setCourseProgramName('Otro');
                    setCourseCustomProgramName(record.custom_program_name);
                }

                // Manejo correcto de la institución
                setCourseInstitution(record.institution);
                // Si hay custom_institution, es porque la institución era "Otro"
                if (record.custom_institution) {
                    setCourseInstitution('Otro');
                    setCourseCustomInstitution(record.custom_institution);
                }

                // Manejo seguro de fechas
                if (typeof record.end_date === 'string') {
                    setCourseEndDate(record.end_date);
                }

                setCourseCertificateFile(null);
            }
        } else {
            setEditingRecord(null);
        }

        setFormDialogOpen(true);
    };

    // Cerrar el diálogo de formulario
    const handleCloseFormDialog = () => {
        setFormDialogOpen(false);
        resetFormalForm();
        resetCourseForm();
        setEditingRecord(null);
    };

    // Manejar la selección de archivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (isFormalForm) {
                setFormalCertificateFile(file);
            } else {
                setCourseCertificateFile(file);
            }
        }
    };
    // Preparar los datos del formulario formal - CORREGIDO
    const prepareFormalFormData = () => {
        const formData = new FormData();
        formData.append('type', formalType);
        formData.append('level', formalLevel);

        // Manejo correcto del programa y programa personalizado
        formData.append('program_name', formalProgramName);
        if (formalProgramName === 'Otro') {
            formData.append('custom_program_name', formalCustomProgramName);
        }

        // Manejo correcto de la institución y institución personalizada
        formData.append('institution', formalInstitution);
        if (formalInstitution === 'Otro') {
            formData.append('custom_institution', formalCustomInstitution);
        }

        if (formalStartDate) {
            formData.append('start_date', formalStartDate);
        }

        if (formalEndDate) {
            formData.append('end_date', formalEndDate);
        }

        formData.append('degree_obtained', formalDegreeObtained);

        if (formalCertificateFile) {
            formData.append('certificate_file', formalCertificateFile);
        }

        return formData;
    };

    // Preparar los datos del formulario de curso - CORREGIDO
    const prepareCourseFormData = () => {
        const formData = new FormData();
        formData.append('type', courseType);

        // Manejo correcto del programa y programa personalizado
        formData.append('program_name', courseProgramName);
        if (courseProgramName === 'Otro') {
            formData.append('custom_program_name', courseCustomProgramName);
        }

        // Manejo correcto de la institución y institución personalizada
        formData.append('institution', courseInstitution);
        if (courseInstitution === 'Otro') {
            formData.append('custom_institution', courseCustomInstitution);
        }

        if (courseEndDate) {
            formData.append('end_date', courseEndDate);
        }

        if (courseCertificateFile) {
            formData.append('certificate_file', courseCertificateFile);
        }

        return formData;
    };
    // Enviar formulario - CORREGIDO para solucionar problema de guardado
    const handleSubmitForm = () => {
        setProcessing(true);
        console.log("Iniciando proceso de guardado...");

        if (isFormalForm) {
            // Validación mejorada del formulario formal
            const errors: Record<string, string> = {};

            if (!formalProgramName) {
                errors.program_name = 'El nombre del programa es requerido';
            }

            if (formalProgramName === 'Otro' && !formalCustomProgramName) {
                errors.custom_program_name = 'Debe ingresar el nombre del programa';
            }

            if (!formalInstitution) {
                errors.institution = 'La institución es requerida';
            }

            if (formalInstitution === 'Otro' && !formalCustomInstitution) {
                errors.custom_institution = 'Debe ingresar el nombre de la institución';
            }

            if (!formalStartDate) {
                errors.start_date = 'La fecha de inicio es requerida';
            }

            if (!formalEndDate) {
                errors.end_date = 'La fecha de finalización es requerida';
            }

            if (!formalDegreeObtained) {
                errors.degree_obtained = 'El título obtenido es requerido';
            }

            if (Object.keys(errors).length > 0) {
                setFormalErrors(errors);
                setProcessing(false);
                console.log("Errores de validación en formulario formal:", errors);
                return;
            }

            // Preparar datos del formulario
            const formData = prepareFormalFormData();

            if (editingRecord?.id) {
                // Para edición, utilizamos PUT correctamente
                formData.append('_method', 'put');
                console.log("Enviando actualización de educación formal");

                router.post(`/academicInformation/${editingRecord.id}`, formData, {
                    forceFormData: true,
                    onSuccess: () => {
                        console.log("Actualización exitosa, recargando página...");
                        setSuccessMessage('La información académica ha sido actualizada correctamente');
                        setOpenSnackbar(true);
                        handleCloseFormDialog();
                        // Forzar recarga completa de la página para refrescar los datos
                        window.location.reload();
                    },
                    onError: (errors) => {
                        setFormalErrors(errors);
                        console.error('Errores de validación:', errors);
                        setProcessing(false);
                    }
                });
            } else {
                // Para creación
                console.log("Enviando nueva educación formal");
                router.post('/academicInformation', formData, {
                    forceFormData: true,
                    onSuccess: () => {
                        console.log("Guardado exitoso, recargando página...");
                        setSuccessMessage('La información académica ha sido guardada correctamente');
                        setOpenSnackbar(true);
                        handleCloseFormDialog();
                        // Forzar recarga completa de la página para refrescar los datos
                        window.location.reload();
                    },
                    onError: (errors) => {
                        setFormalErrors(errors);
                        console.error('Errores de validación:', errors);
                        setProcessing(false);
                    }
                });
            }
        } else {
            // Validación mejorada del formulario de curso
            const errors: Record<string, string> = {};

            if (!courseProgramName) {
                errors.program_name = 'El nombre del curso es requerido';
            }

            if (courseProgramName === 'Otro' && !courseCustomProgramName) {
                errors.custom_program_name = 'Debe ingresar el nombre del curso';
            }

            if (!courseInstitution) {
                errors.institution = 'La institución es requerida';
            }

            if (courseInstitution === 'Otro' && !courseCustomInstitution) {
                errors.custom_institution = 'Debe ingresar el nombre de la institución';
            }

            if (!courseEndDate) {
                errors.end_date = 'La fecha de finalización es requerida';
            }

            if (Object.keys(errors).length > 0) {
                setCourseErrors(errors);
                setProcessing(false);
                console.log("Errores de validación en formulario de curso:", errors);
                return;
            }

            // Preparar datos del formulario
            const formData = prepareCourseFormData();

            if (editingRecord?.id) {
                // Para edición
                formData.append('_method', 'put');
                console.log("Enviando actualización de curso");

                router.post(`/academicInformation/${editingRecord.id}`, formData, {
                    forceFormData: true,
                    onSuccess: () => {
                        console.log("Actualización exitosa, recargando página...");
                        setSuccessMessage('El curso ha sido actualizado correctamente');
                        setOpenSnackbar(true);
                        handleCloseFormDialog();
                        // Forzar recarga completa de la página para refrescar los datos
                        window.location.reload();
                    },
                    onError: (errors) => {
                        setCourseErrors(errors);
                        console.error('Errores de validación:', errors);
                        setProcessing(false);
                    }
                });
            } else {
                // Para creación
                console.log("Enviando nuevo curso");
                router.post('/academicInformation', formData, {
                    forceFormData: true,
                    onSuccess: () => {
                        console.log("Guardado exitoso, recargando página...");
                        setSuccessMessage('El curso ha sido guardado correctamente');
                        setOpenSnackbar(true);
                        handleCloseFormDialog();
                        // Forzar recarga completa de la página para refrescar los datos
                        window.location.reload();
                    },
                    onError: (errors) => {
                        setCourseErrors(errors);
                        console.error('Errores de validación:', errors);
                        setProcessing(false);
                    }
                });
            }
        }
    };
    // Abrir diálogo de confirmación para eliminar
    const handleOpenDeleteDialog = (id?: number) => {
        if (id) {
            setRecordsToDelete([id]);
        } else {
            setRecordsToDelete(selectedRecordIds);
        }
        setDeleteDialogOpen(true);
    };

    // Cerrar diálogo de confirmación
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    // Eliminar registros
    const handleDeleteRecords = () => {
        if (recordsToDelete.length === 1) {
            router.delete(`/academicInformation/${recordsToDelete[0]}`, {
                onSuccess: () => {
                    setSuccessMessage('El registro ha sido eliminado correctamente');
                    setOpenSnackbar(true);
                    setSelectedRecordIds([]);
                    // Recarga la página después de la eliminación
                    window.location.reload();
                }
            });
        } else {
            router.post('/academicInformation/destroyMultiple', {
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

    // Descargar certificado
    const handleDownloadCertificate = (id: number) => {
        window.open(`/academicInformation/certificate/${id}`, '_blank');
    };

    // Manejar selección de registros con checkbox - CORREGIDO
    const handleSelectRecord = (id: number) => {
        setSelectedRecordIds(prevSelected => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(recordId => recordId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    // Manejar selección de todos los registros - CORREGIDO
    const handleSelectAllRecords = (records: AcademicRecord[]) => {
        if (records.length === 0) return;

        // Filtrar solo los IDs que existen
        const recordIds = records
            .filter(record => record.id !== undefined)
            .map(record => record.id as number);

        if (recordIds.length === 0) return;

        // Si todos están seleccionados, deseleccionar todos
        const allSelected = recordIds.every(id => selectedRecordIds.includes(id));

        if (allSelected) {
            setSelectedRecordIds(prevSelected =>
                prevSelected.filter(id => !recordIds.includes(id))
            );
        } else {
            // Si no, seleccionar todos
            setSelectedRecordIds(prevSelected => {
                const newSelection = [...prevSelected];
                recordIds.forEach(id => {
                    if (!newSelection.includes(id)) {
                        newSelection.push(id);
                    }
                });
                return newSelection;
            });
        }
    };

    // Cerrar Snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    // Función para formatear fecha
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return dayjs(dateString).format('DD/MM/YYYY');
    };

    // Obtener el nombre correcto de la institución - CORREGIDO
    const getInstitutionName = (record: AcademicRecord) => {
        // Acceder directamente a las propiedades sin usar el accessor
        if (record.custom_institution) {
            return record.custom_institution;
        }
        return record.institution;
    };

    // Obtener el nombre correcto del programa - CORREGIDO
    const getProgramName = (record: AcademicRecord) => {
        // Acceder directamente a las propiedades sin usar el accessor
        if (record.custom_program_name) {
            return record.custom_program_name;
        }
        return record.program_name;
    };

    // Renderizar tabla de educación formal
    const renderFormalEducationTable = () => {
        if (formalEducation.length === 0) {
            return (
                <Box sx={{
                    textAlign: 'center',
                    py: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
                    <Typography variant="h6" color="text.secondary">
                        No hay registros de educación formal
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenFormDialog('formal')}
                    >
                        Añadir Educación Formal
                    </Button>
                </Box>
            );
        }

        return (
            <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenFormDialog('formal')}
                    >
                        Añadir Registro
                    </Button>

                    {selectedRecordIds.length > 0 && (
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleOpenDeleteDialog()}
                        >
                            Eliminar Seleccionados ({selectedRecordIds.filter(id =>
                                formalEducation.some(record => record.id === id)
                            ).length})
                        </Button>
                    )}
                </Box>

                <TableContainer component={Paper} sx={{ mb: 4, overflow: 'hidden', borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: alpha('#3f80ea', 0.1) }}>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={
                                            selectedRecordIds.filter(id =>
                                                formalEducation.some(record => record.id === id)
                                            ).length > 0 &&
                                            selectedRecordIds.filter(id =>
                                                formalEducation.some(record => record.id === id)
                                            ).length < formalEducation.length
                                        }
                                        checked={
                                            formalEducation.length > 0 &&
                                            formalEducation.every(record =>
                                                record.id && selectedRecordIds.includes(record.id)
                                            )
                                        }
                                        onChange={() => handleSelectAllRecords(formalEducation)}
                                    />
                                </TableCell>
                                <TableCell>Nivel</TableCell>
                                <TableCell>Programa</TableCell>
                                <TableCell>Institución</TableCell>
                                <TableCell>Título Obtenido</TableCell>
                                <TableCell>Fecha de Finalización</TableCell>
                                <TableCell>Certificado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {formalEducation.map((record) => (
                                <TableRow key={record.id} hover>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={record.id ? selectedRecordIds.includes(record.id) : false}
                                            onChange={() => record.id && handleSelectRecord(record.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={record.level}
                                            color={
                                                record.level === 'pregrado' ? 'primary' :
                                                    record.level === 'especialización' ? 'secondary' :
                                                        record.level === 'maestría' ? 'success' : 'warning'
                                            }
                                            size="small"
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    </TableCell>
                                    <TableCell>{getProgramName(record)}</TableCell>
                                    <TableCell>{getInstitutionName(record)}</TableCell>
                                    <TableCell>{record.degree_obtained}</TableCell>
                                    <TableCell>{formatDate(record.end_date)}</TableCell>
                                    <TableCell>
                                        {record.certificate_file ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => record.id && handleDownloadCertificate(record.id)}
                                                size="small"
                                                startIcon={<PictureAsPdfIcon />}
                                                sx={{ py: 0.5 }}
                                            >
                                                Ver PDF
                                            </Button>
                                        ) : (
                                            <Chip
                                                label="Sin certificado"
                                                size="small"
                                                variant="outlined"
                                                color="default"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenFormDialog('formal', record)}
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    };
    // Renderizar tabla de cursos
    const renderCoursesTable = () => {
        if (courses.length === 0) {
            return (
                <Box sx={{
                    textAlign: 'center',
                    py: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <CastForEducationIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
                    <Typography variant="h6" color="text.secondary">
                        No hay registros de cursos cortos y complementarios
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenFormDialog('course')}
                    >
                        Añadir Curso
                    </Button>
                </Box>
            );
        }

        return (
            <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenFormDialog('course')}
                    >
                        Añadir Curso
                    </Button>

                    {selectedRecordIds.length > 0 && (
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleOpenDeleteDialog()}
                        >
                            Eliminar Seleccionados ({selectedRecordIds.filter(id =>
                                courses.some(record => record.id === id)
                            ).length})
                        </Button>
                    )}
                </Box>

                <TableContainer component={Paper} sx={{ mb: 4, overflow: 'hidden', borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: alpha('#3f80ea', 0.1) }}>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={
                                            selectedRecordIds.filter(id =>
                                                courses.some(record => record.id === id)
                                            ).length > 0 &&
                                            selectedRecordIds.filter(id =>
                                                courses.some(record => record.id === id)
                                            ).length < courses.length
                                        }
                                        checked={
                                            courses.length > 0 &&
                                            courses.every(record =>
                                                record.id && selectedRecordIds.includes(record.id)
                                            )
                                        }
                                        onChange={() => handleSelectAllRecords(courses)}
                                    />
                                </TableCell>
                                <TableCell>Nombre del Curso</TableCell>
                                <TableCell>Institución</TableCell>
                                <TableCell>Fecha de Finalización</TableCell>
                                <TableCell>Certificado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((record) => (
                                <TableRow key={record.id} hover>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={record.id ? selectedRecordIds.includes(record.id) : false}
                                            onChange={() => record.id && handleSelectRecord(record.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{getProgramName(record)}</TableCell>
                                    <TableCell>{getInstitutionName(record)}</TableCell>
                                    <TableCell>{formatDate(record.end_date)}</TableCell>
                                    <TableCell>
                                        {record.certificate_file ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => record.id && handleDownloadCertificate(record.id)}
                                                size="small"
                                                startIcon={<PictureAsPdfIcon />}
                                                sx={{ py: 0.5 }}
                                            >
                                                Ver PDF
                                            </Button>
                                        ) : (
                                            <Chip
                                                label="Sin certificado"
                                                size="small"
                                                variant="outlined"
                                                color="default"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenFormDialog('course', record)}
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Información Académica" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ThemeProvider theme={darkTheme}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #1e1e2d 0%, #252537 100%)',
                            mb: 3
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', md: 'center' },
                            mb: 3,
                            gap: 2
                        }}>
                            <Box>
                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                                    Información Académica
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Gestiona tu historial educativo, títulos obtenidos y certificaciones
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                textColor="primary"
                                indicatorColor="primary"
                            >
                                <Tab
                                    icon={<SchoolIcon />}
                                    label="Educación Formal"
                                    iconPosition="start"
                                    sx={{ textTransform: 'none', fontWeight: 'medium' }}
                                />
                                <Tab
                                    icon={<CastForEducationIcon />}
                                    label="Cursos cortos y complementarios"
                                    iconPosition="start"
                                    sx={{ textTransform: 'none', fontWeight: 'medium' }}
                                />
                            </Tabs>
                        </Box>

                        <Fade in={tabValue === 0} timeout={500}>
                            <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
                                {renderFormalEducationTable()}
                            </Box>
                        </Fade>

                        <Fade in={tabValue === 1} timeout={500}>
                            <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
                                {renderCoursesTable()}
                            </Box>
                        </Fade>
                    </Paper>

                    {/* Sección de todos los certificados */}
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #1e1e2d 0%, #252537 100%)',
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                            <LocalLibraryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Biblioteca de Certificados
                        </Typography>

                        {/* Lista de certificados disponibles */}
                        <List>
                            {[...formalEducation, ...courses]
                                .filter(record => record.certificate_file)
                                .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())
                                .map((record) => (
                                    <ListItem
                                        key={record.id}
                                        sx={{
                                            mb: 1,
                                            border: '1px solid',
                                            borderColor: alpha('#ffffff', 0.1),
                                            borderRadius: 2,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                borderColor: alpha('#ffffff', 0.2),
                                                bgcolor: alpha('#ffffff', 0.05)
                                            }
                                        }}
                                        secondaryAction={
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                endIcon={<FileDownloadIcon />}
                                                onClick={() => record.id && handleDownloadCertificate(record.id)}
                                                sx={{ px: 2, py: 1 }}
                                            >
                                                Descargar PDF
                                            </Button>
                                        }
                                    >
                                        <ListItemIcon>
                                            <PictureAsPdfIcon color="primary" fontSize="large" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {getProgramName(record)}
                                                    {record.type === 'formal' && (
                                                        <Chip
                                                            label={record.level}
                                                            size="small"
                                                            color="secondary"
                                                            sx={{ textTransform: 'capitalize' }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="text.secondary">
                                                    {getInstitutionName(record)} - {formatDate(record.end_date)}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}

                            {[...formalEducation, ...courses].filter(record => record.certificate_file).length === 0 && (
                                <Box sx={{
                                    textAlign: 'center',
                                    py: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <InfoIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5 }} />
                                    <Typography variant="body1" color="text.secondary">
                                        No hay certificados disponibles. Sube certificados en la sección correspondiente.
                                    </Typography>
                                </Box>
                            )}
                        </List>
                    </Paper>
                    {/* Diálogo para añadir/editar información académica */}
                    <Dialog
                        open={formDialogOpen}
                        onClose={handleCloseFormDialog}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle sx={{ pb: 1 }}>
                            {editingRecord ? 'Editar' : 'Añadir'} {isFormalForm ? 'Educación Formal' : 'Curso corto y complementario'}
                        </DialogTitle>
                        <DialogContent dividers>
                            {isFormalForm ? (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="level-label">Nivel de Formación</InputLabel>
                                            <Select
                                                labelId="level-label"
                                                value={formalLevel}
                                                onChange={(e: any) => setFormalLevel(e.target.value)}
                                                label="Nivel de Formación"
                                                error={!!formalErrors.level}
                                            >
                                                <MenuItem value="educación superior">Educación Superior</MenuItem>
                                                <MenuItem value="pregrado">Pregrado</MenuItem>
                                                <MenuItem value="especialización">Especialización</MenuItem>
                                                <MenuItem value="maestría">Maestría</MenuItem>
                                                <MenuItem value="doctorado">Doctorado</MenuItem>
                                            </Select>
                                            {formalErrors.level && (
                                                <Typography variant="caption" color="error">
                                                    {formalErrors.level}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="program-label">Programa de Estudios</InputLabel>
                                            <Select
                                                labelId="program-label"
                                                value={formalProgramName}
                                                onChange={(e) => {
                                                    setFormalProgramName(e.target.value);
                                                    if (e.target.value !== 'Otro') {
                                                        setFormalCustomProgramName('');
                                                    }
                                                }}
                                                label="Programa de Estudios"
                                                error={!!formalErrors.program_name}
                                                required
                                            >
                                                {programs.map((program) => (
                                                    <MenuItem key={program} value={program}>
                                                        {program}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {formalErrors.program_name && (
                                                <Typography variant="caption" color="error">
                                                    {formalErrors.program_name}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    {formalProgramName === 'Otro' && (
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Nombre del Programa"
                                                fullWidth
                                                value={formalCustomProgramName}
                                                onChange={(e) => setFormalCustomProgramName(e.target.value)}
                                                error={!!formalErrors.custom_program_name}
                                                helperText={formalErrors.custom_program_name || "Ingrese el nombre específico del programa"}
                                                required
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                    )}

                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="institution-label">Institución</InputLabel>
                                            <Select
                                                labelId="institution-label"
                                                value={formalInstitution}
                                                onChange={(e) => {
                                                    setFormalInstitution(e.target.value);
                                                    if (e.target.value !== 'Otro') {
                                                        setFormalCustomInstitution('');
                                                    }
                                                }}
                                                label="Institución"
                                                error={!!formalErrors.institution}
                                                required
                                            >
                                                {institutions.map((institution) => (
                                                    <MenuItem key={institution} value={institution}>
                                                        {institution}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {formalErrors.institution && (
                                                <Typography variant="caption" color="error">
                                                    {formalErrors.institution}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    {formalInstitution === 'Otro' && (
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Nombre de la Institución"
                                                fullWidth
                                                value={formalCustomInstitution}
                                                onChange={(e) => setFormalCustomInstitution(e.target.value)}
                                                error={!!formalErrors.custom_institution}
                                                helperText={formalErrors.custom_institution || "Ingrese el nombre específico de la institución"}
                                                required
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                    )}

                                    <Grid item xs={12} sm={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Fecha de Inicio"
                                                value={formalStartDate ? dayjs(formalStartDate) : null}
                                                onChange={(date) => {
                                                    // Manejo explícito para evitar problemas con fechas null/undefined
                                                    if (date) {
                                                        setFormalStartDate(date.format('YYYY-MM-DD'));
                                                    } else {
                                                        setFormalStartDate(null);
                                                    }
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        variant: 'outlined',
                                                        error: !!formalErrors.start_date,
                                                        helperText: formalErrors.start_date,
                                                        required: true
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Fecha de Finalización"
                                                value={formalEndDate ? dayjs(formalEndDate) : null}
                                                onChange={(date) => {
                                                    // Manejo explícito para evitar problemas con fechas null/undefined
                                                    if (date) {
                                                        setFormalEndDate(date.format('YYYY-MM-DD'));
                                                    } else {
                                                        setFormalEndDate(null);
                                                    }
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        variant: 'outlined',
                                                        error: !!formalErrors.end_date,
                                                        helperText: formalErrors.end_date,
                                                        required: true
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            label="Título Obtenido"
                                            fullWidth
                                            value={formalDegreeObtained}
                                            onChange={(e) => setFormalDegreeObtained(e.target.value)}
                                            error={!!formalErrors.degree_obtained}
                                            helperText={formalErrors.degree_obtained}
                                            required
                                            sx={{ mb: 2 }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            startIcon={<FileUploadIcon />}
                                            fullWidth
                                            sx={{ py: 1.5, mb: 1 }}
                                        >
                                            {editingRecord && editingRecord.certificate_file
                                                ? 'Cambiar Certificado'
                                                : 'Subir Certificado (PDF)'}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="application/pdf"
                                                hidden
                                                onChange={handleFileChange}
                                            />
                                        </Button>

                                        {formalCertificateFile && (
                                            <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                                                <CheckCircleIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                                Archivo seleccionado: {formalCertificateFile.name}
                                            </Typography>
                                        )}

                                        {editingRecord && editingRecord.certificate_file && !formalCertificateFile && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                                Certificado actual: {editingRecord.certificate_file_name}
                                            </Typography>
                                        )}

                                        {formalErrors.certificate_file && (
                                            <Typography variant="caption" color="error">
                                                {formalErrors.certificate_file}
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="course-program-label">Nombre del Curso</InputLabel>
                                            <Select
                                                labelId="course-program-label"
                                                value={courseProgramName}
                                                onChange={(e) => {
                                                    setCourseProgramName(e.target.value);
                                                    if (e.target.value !== 'Otro') {
                                                        setCourseCustomProgramName('');
                                                    }
                                                }}
                                                label="Nombre del Curso"
                                                error={!!courseErrors.program_name}
                                                required
                                            >
                                                {programs.map((program) => (
                                                    <MenuItem key={program} value={program}>
                                                        {program}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {courseErrors.program_name && (
                                                <Typography variant="caption" color="error">
                                                    {courseErrors.program_name}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    {courseProgramName === 'Otro' && (
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Nombre del Curso"
                                                fullWidth
                                                value={courseCustomProgramName}
                                                onChange={(e) => setCourseCustomProgramName(e.target.value)}
                                                error={!!courseErrors.custom_program_name}
                                                helperText={courseErrors.custom_program_name || "Ingrese el nombre específico del curso"}
                                                required
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                    )}

                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="course-institution-label">Institución</InputLabel>
                                            <Select
                                                labelId="course-institution-label"
                                                value={courseInstitution}
                                                onChange={(e) => {
                                                    setCourseInstitution(e.target.value);
                                                    if (e.target.value !== 'Otro') {
                                                        setCourseCustomInstitution('');
                                                    }
                                                }}
                                                label="Institución"
                                                error={!!courseErrors.institution}
                                                required
                                            >
                                                {institutions.map((institution) => (
                                                    <MenuItem key={institution} value={institution}>
                                                        {institution}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {courseErrors.institution && (
                                                <Typography variant="caption" color="error">
                                                    {courseErrors.institution}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    {courseInstitution === 'Otro' && (
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Nombre de la Institución"
                                                fullWidth
                                                value={courseCustomInstitution}
                                                onChange={(e) => setCourseCustomInstitution(e.target.value)}
                                                error={!!courseErrors.custom_institution}
                                                helperText={courseErrors.custom_institution || "Ingrese el nombre específico de la institución"}
                                                required
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                    )}

                                    <Grid item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Fecha de Finalización"
                                                value={courseEndDate ? dayjs(courseEndDate) : null}
                                                onChange={(date) => {
                                                    // Manejo explícito para evitar problemas con fechas null/undefined
                                                    if (date) {
                                                        setCourseEndDate(date.format('YYYY-MM-DD'));
                                                    } else {
                                                        setCourseEndDate(null);
                                                    }
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        variant: 'outlined',
                                                        error: !!courseErrors.end_date,
                                                        helperText: courseErrors.end_date,
                                                        required: true
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            startIcon={<FileUploadIcon />}
                                            fullWidth
                                            sx={{ py: 1.5, mb: 1 }}
                                        >
                                            {editingRecord && editingRecord.certificate_file
                                                ? 'Cambiar Certificado'
                                                : 'Subir Certificado (PDF)'}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="application/pdf"
                                                hidden
                                                onChange={handleFileChange}
                                            />
                                        </Button>

                                        {courseCertificateFile && (
                                            <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                                                <CheckCircleIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                                Archivo seleccionado: {courseCertificateFile.name}
                                            </Typography>
                                        )}

                                        {editingRecord && editingRecord.certificate_file && !courseCertificateFile && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                                Certificado actual: {editingRecord.certificate_file_name}
                                            </Typography>
                                        )}

                                        {courseErrors.certificate_file && (
                                            <Typography variant="caption" color="error">
                                                {courseErrors.certificate_file}
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseFormDialog}>Cancelar</Button>
                            <Button
                                onClick={handleSubmitForm}
                                variant="contained"
                                startIcon={
                                    processing ?
                                        <CircularProgress size={20} color="inherit" /> :
                                        <SaveIcon />
                                }
                                disabled={processing}
                            >
                                {processing ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {/* Diálogo de confirmación para eliminar */}
                    <Dialog
                        open={deleteDialogOpen}
                        onClose={handleCloseDeleteDialog}
                    >
                        <DialogTitle>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <WarningIcon color="error" />
                                Confirmar eliminación
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {recordsToDelete.length === 1
                                    ? '¿Estás seguro de que deseas eliminar este registro?'
                                    : `¿Estás seguro de que deseas eliminar los ${recordsToDelete.length} registros seleccionados?`
                                }
                                {' '}Esta acción no se puede deshacer.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
                            <Button onClick={handleDeleteRecords} color="error" variant="contained">
                                Eliminar
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Snackbar para mensajes de éxito */}
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
                </ThemeProvider>
            </div>
        </AppLayout>
    );
}