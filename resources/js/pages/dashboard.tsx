import React, { useState, useEffect, useContext } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Typography, 
  Box, 
  Skeleton, 
  Grid,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Paper,
  Chip,
  Avatar
} from '@mui/material';
import { 
  CalendarToday, 
  Person, 
  Close, 
  LaunchRounded,
  AccessTimeRounded,
  ArrowForwardRounded
} from '@mui/icons-material';

// Definir la interfaz para las noticias
interface News {
  id: number;
  title: string;
  content: string;
  image: string | null;
  user_id: number;
  created_at: string;
  user?: {
    id: number;
    name: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard() {
  const theme = useTheme();
  // Forzar modo oscuro para todo el componente
  const isDarkMode = true;
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Obtener noticias desde la API
        const response = await axios.get('/api/news');
        setNews(response.data);
      } catch (error) {
        console.error("Error al cargar noticias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Función para extraer un resumen del contenido
  const extractSummary = (htmlContent: string, wordCount = 30) => {
    // Eliminar etiquetas HTML
    const plainText = htmlContent.replace(/<[^>]*>?/gm, '');
    
    // Dividir en palabras y tomar la cantidad especificada
    const words = plainText.split(' ').slice(0, wordCount);
    
    // Unir las palabras nuevamente
    let summary = words.join(' ');
    
    // Añadir puntos suspensivos si el texto original es más largo
    if (plainText.split(' ').length > wordCount) {
      summary += '...';
    }
    
    return summary;
  };
  
  // Configuración fija de colores para tema oscuro
  const themeColors = {
    primary: '#64B5F6',
    background: '#121212',
    cardBackground: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: 'rgba(255, 255, 255, 0.1)'
  };
  
  // Abrir el diálogo con la noticia completa
  const handleOpenDialog = (item: News) => {
    setSelectedNews(item);
    setOpenDialog(true);
  };

  // Cerrar el diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Función para obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Función para generar un color basado en una cadena
  const stringToColor = (string: string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };
  
  // Función para calcular el tiempo relativo
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'hace un momento';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
    } else {
      return formatDate(dateString);
    }
  };

  // Estilo de la tarjeta basado en el tema
  const getCardStyle = () => {
    return {
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isDarkMode 
        ? '0 8px 12px -3px rgba(0,0,0,0.4), 0 4px 6px -4px rgba(0,0,0,0.4)' 
        : '0 8px 12px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
      border: isDarkMode ? `1px solid ${alpha(theme.palette.divider, 0.15)}` : 'none',
      backgroundColor: '#121212', // Fondo oscuro para modo dark
      color: '#ffffff',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: isDarkMode 
          ? '0 15px 20px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.2)'
          : '0 15px 20px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.04)'
      }
    };
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard - Últimas Noticias" />
      <div className="flex h-full flex-1 flex-col gap-2 rounded-xl p-2">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: '#64B5F6',
            }}
          >
            Últimas Noticias
          </Typography>
          <Chip 
            label={`${news.length} artículos`} 
            size="small"
            color="primary"
            sx={{ 
              fontWeight: 'bold',
              borderRadius: '16px'
            }}
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />

        {loading ? (
          // Skeleton de carga - diseño mejorado
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card sx={getCardStyle()}>
                  <Skeleton 
                    variant="rectangular" 
                    height={220} 
                    animation="wave"
                    sx={{ 
                      borderRadius: '0 0 16px 16px',
                      transform: 'scale(1.1)'
                    }}
                  />
                  <CardContent sx={{ pt: 2, pb: 1 }}>
                    <Skeleton animation="wave" height={32} width="90%" />
                    <Skeleton animation="wave" height={32} width="70%" />
                    <Box mt={2}>
                      <Skeleton animation="wave" height={20} width="100%" />
                      <Skeleton animation="wave" height={20} width="100%" />
                      <Skeleton animation="wave" height={20} width="60%" />
                    </Box>
                  </CardContent>
                  <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Skeleton animation="wave" height={40} width={80} variant="circular" />
                    <Skeleton animation="wave" height={36} width={100} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          // Tarjetas de noticias con diseño moderno
          <Grid container spacing={3}>
            {news.length > 0 ? (
              news.map((item) => {
                const userName = item.user?.name || 'Autor desconocido';
                const avatarColor = stringToColor(userName);
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card sx={getCardStyle()}>
                      {/* Imagen con overlay gradiente */}
                      <Box sx={{ position: 'relative' }}>
                        {item.image ? (
                          <CardMedia
                            component="img"
                            height="220"
                            image={item.image}
                            alt={item.title}
                            sx={{ 
                              objectFit: 'cover',
                              filter: isDarkMode ? 'brightness(0.85)' : 'none',
                              transition: 'transform 0.5s ease',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                        ) : (
                          <Box 
                            sx={{ 
                              height: 220, 
                              bgcolor: isDarkMode ? 'grey.800' : 'grey.300',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Sin imagen
                            </Typography>
                          </Box>
                        )}
                        {/* Tiempo relativo en chip flotante */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '20px',
                            padding: '4px 8px',
                            color: '#fff',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                        >
                          <AccessTimeRounded sx={{ fontSize: '0.875rem', marginRight: '4px' }} />
                          {getRelativeTime(item.created_at)}
                        </Box>
                        {/* Overlay gradiente */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '30%',
                            background: isDarkMode
                              ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)'
                              : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
                            zIndex: 1,
                            pointerEvents: 'none'
                          }}
                        />
                      </Box>
                      
                      <CardContent 
                        sx={{ 
                          flexGrow: 1, 
                          p: 2.5,
                          display: 'flex', 
                          flexDirection: 'column' 
                        }}
                      >
                        {/* Título con estilo mejorado */}
                        <Typography 
                          gutterBottom 
                          variant="h5" 
                          component="h2"
                          sx={{ 
                            fontWeight: 700,
                            lineHeight: 1.2,
                            letterSpacing: '-0.01em',
                            height: '2.4em',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            mb: 2,
                            color: '#64B5F6'
                          }}
                        >
                          {item.title}
                        </Typography>
                        
                        {/* Resumen con estilo mejorado */}
                        <Typography 
                          variant="body2" 
                          sx={{
                            minHeight: '5.4em',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.8,
                            color: '#e0e0e0',
                            mb: 2
                          }}
                        >
                          {extractSummary(item.content, 35)}
                        </Typography>
                      </CardContent>
                      
                      {/* Pie de tarjeta rediseñado */}
                      <Box
                        sx={{
                          px: 2.5,
                          pb: 2.5,
                          pt: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        {/* Avatar con información del autor - TEXTO CORREGIDO */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: avatarColor,
                              width: 40,
                              height: 40,
                              fontSize: '0.875rem',
                              fontWeight: 'bold',
                              boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
                            }}
                          >
                            C
                          </Avatar>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: 500,
                              color: '#ffffff' // Color blanco fijo para que sea visible
                            }}
                          >
                            Coordinador
                          </Typography>
                        </Box>
                        
                        {/* Botón de leer igual al original */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                              '& .arrow-icon': {
                                transform: 'translateX(3px)',
                              }
                            }
                          }}
                          onClick={() => handleOpenDialog(item)}
                        >
                          <Typography 
                            variant="body2" 
                            component="span"
                            sx={{ 
                              fontWeight: 'medium',
                              color: '#64B5F6',
                              mr: 0.5
                            }}
                          >
                            Leer
                          </Typography>
                          <ArrowForwardRounded 
                            className="arrow-icon"
                            sx={{ 
                              color: '#64B5F6', 
                              fontSize: '1.2rem',
                              transition: 'transform 0.2s ease-in-out'
                            }}
                          />
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Box width="100%" textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary">
                  No hay noticias disponibles
                </Typography>
              </Box>
            )}
          </Grid>
        )}
        
        {/* Diálogo para mostrar la noticia completa - con colores corregidos */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          scroll="paper"
          PaperProps={{
            sx: {
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              backgroundColor: '#121212'
            }
          }}
        >
          {selectedNews && (
            <>
              <DialogTitle 
                sx={{ 
                  px: 3.5, 
                  pt: 3.5,
                  pb: 2,
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  lineHeight: 1.3,
                  color: '#64B5F6' // Color corregido para título
                }}
              >
                {selectedNews.title}
                <IconButton
                  aria-label="close"
                  onClick={handleCloseDialog}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    color: '#aaaaaa', // Color más visible
                    bgcolor: alpha(theme.palette.divider, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.divider, 0.2),
                    }
                  }}
                >
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent 
                dividers 
                sx={{ 
                  px: 3.5, 
                  py: 3,
                  borderColor: 'rgba(255,255,255,0.1)' // Borde más visible
                }}
              >
                {selectedNews.image && (
                  <Box sx={{ textAlign: 'center', mb: 3.5 }}>
                    <Box
                      component="img"
                      src={selectedNews.image} 
                      alt={selectedNews.title} 
                      sx={{ 
                        width: '100%',
                        maxHeight: '500px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -4px rgba(0,0,0,0.2)',
                      }} 
                    />
                  </Box>
                )}
                
                <Box 
                  sx={{ 
                    mb: 3.5, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    p: 2,
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.05)', // Fondo ligeramente más claro
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#2196F3', // Color fijo para el avatar
                        width: 48,
                        height: 48,
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }}
                    >
                      C
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 'bold',
                          mb: 0.2,
                          color: '#ffffff' // Color blanco para "Coordinador"
                        }}
                      >
                        Coordinador
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#b0b0b0' // Gris claro para la fecha
                        }}
                      >
                        {formatDate(selectedNews.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Chip
                    icon={<AccessTimeRounded fontSize="small" />}
                    label={getRelativeTime(selectedNews.created_at)}
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      height: 32,
                      borderColor: '#64B5F6', // Color más visible para el borde
                      color: '#64B5F6' // Color más visible para el texto
                    }}
                  />
                </Box>

                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.03)', // Fondo ligeramente más claro
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <Typography 
                    variant="body1" 
                    component="div"
                    sx={{
                      lineHeight: 1.8,
                      color: '#e0e0e0', // Color más claro para el texto
                      '& p': {
                        mb: 2
                      },
                      '& h2, & h3': {
                        fontWeight: 700,
                        mt: 3,
                        mb: 2,
                        color: '#90CAF9' // Color más claro para títulos
                      },
                      '& img': {
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        my: 2
                      },
                      '& a': {
                        color: '#64B5F6', // Color más claro para enlaces
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      },
                      '& blockquote': {
                        borderLeft: '4px solid #2196F3',
                        pl: 2,
                        py: 1,
                        my: 2,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: '0 8px 8px 0'
                      }
                    }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: selectedNews.content }} />
                  </Typography>
                </Paper>
              </DialogContent>
              <DialogActions 
                sx={{ 
                  px: 3.5, 
                  py: 2.5,
                  justifyContent: 'flex-end'
                }}
              >
                <Button 
                  onClick={handleCloseDialog}
                  variant="outlined"
                  size="medium"
                  sx={{
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    borderColor: '#64B5F6', // Color más visible
                    color: '#64B5F6', // Color más visible
                    '&:hover': {
                      borderColor: '#90CAF9',
                      backgroundColor: 'rgba(100, 181, 246, 0.1)'
                    }
                  }}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </div>
    </AppLayout>
  );
}