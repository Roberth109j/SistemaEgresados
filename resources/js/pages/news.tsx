import React, { useState, useRef, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    TextField,
    Button,
    Paper,
    Typography,
    CircularProgress,
    Box,
    Alert,
    IconButton,
    Input,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Tabs,
    Tab,
    Pagination,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PhotoCamera, Edit, Delete, Visibility } from '@mui/icons-material';

interface News {
    id: number;
    title: string;
    content: string;
    image: string | null;
    user_id: number;
    created_at: string;
    updated_at?: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface PaginatedData {
    data: News[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Errors {
    title?: string;
    content?: string;
    image?: string;
}

const darkTheme = createTheme({
    palette: { mode: 'dark' },
});

export default function NewsManager() {
    // Definimos un tipo específico para mayor claridad
    type NewsMode = 'create' | 'edit' | 'view' | 'list';
    
    // Obtener los props iniciales de la página
    const pageProps = usePage();
    const initialNews = pageProps.props.news as PaginatedData;
   
    // Estado para el manejo de noticias
    const [newsData, setNewsData] = useState<PaginatedData>(initialNews);
    const [selectedNews, setSelectedNews] = useState<News | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<NewsMode>('list');
   
    // Estado para formulario
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
   
    // Estado para UI
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, newsId: 0 });
    const [activeTab, setActiveTab] = useState(0);
    const [currentPage, setCurrentPage] = useState(initialNews.current_page || 1);
   
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Actualiza el estado local cuando cambian los props
    useEffect(() => {
        if (initialNews) {
            setNewsData(initialNews);
            setCurrentPage(initialNews.current_page || 1);
        }
    }, [initialNews]);

    // Obtiene todas las noticias al cambiar de página
    useEffect(() => {
        if (initialNews && currentPage !== initialNews.current_page) {
            fetchNews(currentPage);
        }
    }, [currentPage, initialNews]);

    const fetchNews = async (pageNumber = 1) => {
        setIsLoading(true);
        try {
            router.get('/news', { page: pageNumber }, {
                preserveState: true,
                only: ['news'],
                onSuccess: (pageData) => {
                    // Asegurarnos de que pageData.props.news existe y es del tipo correcto
                    if (pageData.props.news) {
                        const newsData = pageData.props.news as PaginatedData;
                        setNewsData(newsData);
                    }
                    setIsLoading(false);
                },
                onError: () => {
                    setSnackbar({
                        open: true,
                        message: 'Error al cargar noticias',
                        severity: 'error'
                    });
                    setIsLoading(false);
                }
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al cargar noticias',
                severity: 'error'
            });
            setIsLoading(false);
        }
    };

    // Obtiene detalles de una noticia específica
    const fetchNewsDetails = async (id: number) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/news/${id}`);
            const data = response.data;
            
            setSelectedNews(data);
           
            // Pre-cargar formulario para edición/visualización
            setTitle(data.title);
            setContent(data.content);
            setPreview(data.image || null);
            setImage(null); // Resetear el campo de imagen al cargar nueva noticia
        } catch (error) {
            console.error("Error fetching news details:", error);
            setSnackbar({
                open: true,
                message: 'Error al cargar detalles de la noticia',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Maneja el cambio de imagen
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            // Liberar URL anterior para evitar fugas de memoria
            if (preview && !preview.startsWith('/storage/')) {
                URL.revokeObjectURL(preview);
            }
            setPreview(URL.createObjectURL(file));
        }
    };

    // Resetea el formulario
    const resetForm = () => {
        setTitle('');
        setContent('');
        setImage(null);
        setPreview(null);
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Maneja envío del formulario (crear/actualizar)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

                    // Si estamos editando, usa el método PUT
        if (mode === 'edit' && selectedNews) {
            formData.append('_method', 'PUT');
           
            axios.post(`/news/${selectedNews.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                handleSubmitSuccess('¡Noticia actualizada correctamente!');
                fetchNews(currentPage);
                setMode('list');
                setActiveTab(0);
            })
            .catch(error => {
                console.error("Update error:", error);
                handleSubmitError(error.response?.data || { message: 'Error al actualizar la noticia' });
            });
        } else {
            // Si estamos creando, usa POST
            axios.post('/news', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                handleSubmitSuccess('¡Noticia creada correctamente!');
                fetchNews(1);
                setMode('list');
                setActiveTab(0);
                setCurrentPage(1);
            })
            .catch(error => {
                console.error("Create error:", error);
                handleSubmitError(error.response?.data || { message: 'Error al crear la noticia' });
            });
        }
    };

    const handleSubmitSuccess = (message: string) => {
        setIsSubmitting(false);
        setSnackbar({
            open: true,
            message: message,
            severity: 'success'
        });
        resetForm();
    };

    const handleSubmitError = (err: any) => {
        setIsSubmitting(false);
        console.error("Submit error:", err);
        setErrors(err.errors || {});
        setSnackbar({
            open: true,
            message: err.message || 'Hubo un error al procesar tu solicitud',
            severity: 'error'
        });
    };

    // Maneja la eliminación de noticias
    const handleDelete = () => {
        const { newsId } = deleteDialog;
        setIsLoading(true);
       
        axios.delete(`/news/${newsId}`)
        .then(response => {
            setIsLoading(false);
            setSnackbar({
                open: true,
                message: '¡Noticia eliminada correctamente!',
                severity: 'success'
            });
           
            if (newsData.data.length === 1 && newsData.current_page > 1) {
                setCurrentPage(newsData.current_page - 1);
            } else {
                fetchNews(newsData.current_page);
            }
            setDeleteDialog({ open: false, newsId: 0 });
        })
        .catch(error => {
            console.error("Delete error:", error);
            setIsLoading(false);
            setSnackbar({
                open: true,
                message: 'Error al eliminar la noticia',
                severity: 'error'
            });
        });
    };

    // Maneja el cambio entre modos (crear, editar, ver)
    const handleModeChange = (newMode: NewsMode, newsId?: number) => {
        resetForm();
        setMode(newMode);
       
        if (newMode === 'create') {
            setSelectedNews(null);
            setActiveTab(1); // Cambiar al tab de formulario
        } else if ((newMode === 'edit' || newMode === 'view') && newsId) {
            fetchNewsDetails(newsId);
            setActiveTab(1); // Cambiar al tab de formulario
        } else if (newMode === 'list') {
            setActiveTab(0); // Cambiar al tab de lista
        }
    };

    // Determina los breadcrumbs basados en el modo actual
    const getBreadcrumbs = (): BreadcrumbItem[] => {
        const base = [{ title: 'News', href: '/news' }];
       
        if (mode === 'create') {
            return [...base, { title: 'Create', href: '/news/create' }];
        } else if (mode === 'edit' && selectedNews) {
            return [...base, { title: `Edit ${selectedNews.title}`, href: `/news/${selectedNews.id}/edit` }];
        } else if (mode === 'view' && selectedNews) {
            return [...base, { title: selectedNews.title, href: `/news/${selectedNews.id}` }];
        }
       
        return base;
    };

    // Manejar cambio de página
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    return (
        <AppLayout breadcrumbs={getBreadcrumbs()}>
            <Head title={`Noticias - ${mode === 'create' ? 'Crear' : mode === 'edit' ? 'Editar' : mode === 'view' ? 'Ver' : 'Lista'}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ThemeProvider theme={darkTheme}>
                    <Paper elevation={3} className="p-4">
                        <Tabs
                            value={activeTab}
                            onChange={(_, newValue) => {
                                setActiveTab(newValue);
                                if (newValue === 0) handleModeChange('list');
                                if (newValue === 1 && mode === 'list') handleModeChange('create');
                            }}
                        >
                            <Tab label="Lista de Noticias" />
                            <Tab label={mode === 'edit' ? "Editar Noticia" : mode === 'view' ? "Ver Noticia" : "Crear Noticia"} />
                        </Tabs>
                        {/* Lista de noticias */}
                        {activeTab === 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">Lista de Noticias</Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleModeChange('create')}
                                    >
                                        Crear Nueva
                                    </Button>
                                </Box>
                               
                                {isLoading ? (
                                    <Box display="flex" justifyContent="center" p={3}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <>
                                        <TableContainer>
                                            <Table aria-label="news table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Título</TableCell>
                                                        <TableCell>Creado Por</TableCell>
                                                        <TableCell>Fecha de Creación</TableCell>
                                                        <TableCell align="right">Acciones</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {newsData.data.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={4} align="center">No se encontraron noticias</TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        newsData.data.map((news) => (
                                                            <TableRow key={news.id}>
                                                                <TableCell>{news.title}</TableCell>
                                                                <TableCell>{news.user?.name || 'Desconocido'}</TableCell>
                                                                <TableCell>{new Date(news.created_at).toLocaleDateString()}</TableCell>
                                                                <TableCell align="right">
                                                                    <IconButton
                                                                        onClick={() => handleModeChange('view', news.id)}
                                                                        title="Ver"
                                                                    >
                                                                        <Visibility />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={() => handleModeChange('edit', news.id)}
                                                                        title="Editar"
                                                                    >
                                                                        <Edit />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={() => setDeleteDialog({ open: true, newsId: news.id })}
                                                                        color="error"
                                                                        title="Eliminar"
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                       
                                        {/* Paginación */}
                                        {newsData.last_page > 1 && (
                                            <Box display="flex" justifyContent="center" mt={3}>
                                                <Pagination
                                                    count={newsData.last_page}
                                                    page={newsData.current_page}
                                                    onChange={handlePageChange}
                                                    color="primary"
                                                />
                                            </Box>
                                        )}
                                    </>
                                )}
                            </Box>
                        )}

                        {/* Formulario de creación/edición/visualización */}
                        {activeTab === 1 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    {mode === 'create' ? 'Crear Nueva Noticia' :
                                     mode === 'edit' ? 'Editar Noticia' : 'Ver Noticia'}
                                </Typography>
                               
                                {isLoading ? (
                                    <Box display="flex" justifyContent="center" p={3}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <TextField
                                            label="Título"
                                            variant="outlined"
                                            fullWidth
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            error={!!errors.title}
                                            helperText={errors.title}
                                            disabled={mode === 'view' as NewsMode}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="Contenido"
                                            variant="outlined"
                                            multiline
                                            rows={6}
                                            fullWidth
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            error={!!errors.content}
                                            helperText={errors.content}
                                            disabled={mode === 'view' as NewsMode}
                                            margin="normal"
                                        />
                                       
                                        <Box display="flex" flexDirection="column" alignItems="flex-start" mt={2}>
                                            {(mode !== 'view' as NewsMode) && (
                                                <>
                                                    <Input
                                                        id="contained-button-file"
                                                        type="file"
                                                        style={{ display: 'none' }}
                                                        onChange={handleImageChange}
                                                        inputRef={fileInputRef}
                                                        disabled={mode === 'view' as NewsMode}
                                                    />
                                                    <label htmlFor="contained-button-file">
                                                        <Button
                                                            component="span"
                                                            startIcon={<PhotoCamera />}
                                                            variant="outlined"
                                                            disabled={mode === 'view' as NewsMode}
                                                        >
                                                            {image !== null ? 'Cambiar Imagen' : 'Subir Imagen'}
                                                        </Button>
                                                    </label>
                                                </>
                                            )}
                                           
                                            {preview && (
                                                <Box mt={2} mb={2}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Vista Previa de Imagen
                                                    </Typography>
                                                    <img
                                                        src={preview}
                                                        alt="Vista Previa"
                                                        style={{ maxWidth: '300px', maxHeight: '200px' }}
                                                    />
                                                </Box>
                                            )}
                                           
                                            {errors.image && <Typography color="error">{errors.image}</Typography>}
                                        </Box>
                                       
                                        <Box mt={3} display="flex" gap={2}>
                                            {(mode !== 'view' as NewsMode) && (
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? <CircularProgress size={24} /> :
                                                     (mode === 'create' as NewsMode) ? 'Crear' : 'Actualizar'}
                                                </Button>
                                            )}
                                           
                                            <Button
                                                variant="outlined"
                                                onClick={() => {
                                                    handleModeChange('list');
                                                }}
                                            >
                                                Volver a la Lista
                                            </Button>
                                           
                                            {(mode === 'view' as NewsMode) && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleModeChange('edit', selectedNews?.id)}
                                                >
                                                    Editar
                                                </Button>
                                            )}
                                        </Box>
                                    </form>
                                )}
                            </Box>
                        )}
                    </Paper>
                   
                    {/* Diálogo de confirmación de eliminación */}
                    <Dialog
                        open={deleteDialog.open}
                        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
                    >
                        <DialogTitle>Confirmar Eliminación</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                ¿Estás seguro de que deseas eliminar esta noticia? Esta acción no se puede deshacer.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}>
                                Cancelar
                            </Button>
                            <Button onClick={handleDelete} color="error" variant="contained">
                                {isLoading ? <CircularProgress size={24} /> : 'Eliminar'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                   
                    {/* Snackbar para mensajes de éxito/error */}
                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        message={snackbar.message}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <Alert
                            onClose={() => setSnackbar({ ...snackbar, open: false })}
                            severity={snackbar.severity}
                            variant="filled"
                        >
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </ThemeProvider>
            </div>
        </AppLayout>
    );
}