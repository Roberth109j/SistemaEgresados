import React, { useState, useEffect, useRef } from 'react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import {
  Typography,
  Box,
  Skeleton,
  Divider,
  Chip,
  Paper,
  alpha,
  useTheme,
  Card,
  CardContent,
  Avatar,
  Container,
  LinearProgress
} from '@mui/material';
import { AccessTimeRounded, LocationOnOutlined, PersonOutline } from '@mui/icons-material';

// Define la interfaz para las ubicaciones
interface Location {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  address: string | null;
  created_at: string;
  updated_at: string;
  cityName?: string; // Nueva propiedad para almacenar el nombre de la ciudad
  user?: {
    name: string;
    email: string;
  };
}

// Breadcrumbs para la navegación
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Ubicaciones',
    href: '/map',
  }
];

export default function MapView() {
  const theme = useTheme();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Cargar datos
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/locations');
        console.log('Datos recibidos:', response.data);
        
        const locationsData = response.data.locations || [];
        
        // Obtener información de ciudades para cada ubicación
        const locationsWithCities = await Promise.all(
          locationsData.map(async (location: Location) => {
            try {
              // Intentar obtener el nombre de la ciudad usando geocodificación inversa
              const cityName = await getCityName(location.latitude, location.longitude);
              return {
                ...location,
                cityName: cityName || (location.address || `${location.latitude}, ${location.longitude}`)
              };
            } catch (error) {
              console.error('Error obteniendo ciudad para ubicación:', error);
              return location;
            }
          })
        );
        
        setLocations(locationsWithCities);
      } catch (err) {
        console.error('Error al cargar ubicaciones:', err);
        setError('No se pudieron cargar las ubicaciones de los egresados.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);
  
  // Función para obtener el nombre de la ciudad usando geocodificación inversa
  const getCityName = async (latitude: number, longitude: number): Promise<string | null> => {
    try {
      // Esperar un pequeño tiempo aleatorio para evitar ser limitado por la API
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
      
      // Usar la API de OpenStreetMap Nominatim para geocodificación inversa
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
        {
          headers: {
            'User-Agent': 'EgresadosMapApplication'
          }
        }
      );
      
      if (response.data && response.data.address) {
        // Intentar obtener la ciudad o pueblo más cercano
        const address = response.data.address;
        return address.city || 
               address.town || 
               address.village || 
               address.municipality || 
               address.county ||
               address.state || 
               response.data.display_name.split(',')[0] || 
               null;
      }
      
      return null;
    } catch (error) {
      console.error('Error en geocodificación inversa:', error);
      return null;
    }
  };

  // Inicializar y actualizar el mapa con Leaflet
  useEffect(() => {
    if (!loading && mapContainerRef.current) {
      // Cargar Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      // Cargar Leaflet JS
      const loadLeaflet = async () => {
        if (!window.L) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
          script.crossOrigin = '';
          
          // Promesa para esperar a que se cargue el script
          await new Promise((resolve) => {
            script.onload = resolve;
            document.head.appendChild(script);
          });
        }
        
        initMap();
      };

      // Inicializar el mapa
      const initMap = () => {
        if (!window.L || !mapContainerRef.current) return;
        
        // Limpiar mapa existente si hay uno
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }
        
        // Limpiar marcadores anteriores
        markersRef.current = [];
        
        // Determinar el centro y zoom
        let mapCenter: [number, number] = [20.6, -100.4]; // Centro por defecto (México) con tipo específico
        let zoomLevel = 5;
        
        // Definir límites de zoom
        const minZoom = 2;
        const maxZoom = 18;
        
        if (locations.length > 0) {
          // Calcular el centro basado en las ubicaciones
          const lats = locations.map(l => l.latitude);
          const lngs = locations.map(l => l.longitude);
          
          mapCenter = [
            (Math.min(...lats) + Math.max(...lats)) / 2, 
            (Math.min(...lngs) + Math.max(...lngs)) / 2
          ] as [number, number];
          
          // Ajustar zoom según la dispersión de los puntos, respetando los límites
          const latSpread = Math.max(...lats) - Math.min(...lats);
          const lngSpread = Math.max(...lngs) - Math.min(...lngs);
          
          if (latSpread > 20 || lngSpread > 20) {
            zoomLevel = 3;
          } else if (latSpread > 10 || lngSpread > 10) {
            zoomLevel = 4;
          } else if (latSpread > 5 || lngSpread > 5) {
            zoomLevel = 5;
          } else if (latSpread > 1 || lngSpread > 1) {
            zoomLevel = 6;
          } else {
            zoomLevel = 8;
          }
          
          // Asegurar que el zoom esté dentro de los límites
          zoomLevel = Math.max(2, Math.min(zoomLevel, 18));
        }
        
        // Crear el mapa con opciones específicas para controlar el comportamiento
        const map = window.L.map(mapContainerRef.current!, {
          center: mapCenter,
          zoom: zoomLevel,
          minZoom: 2,
          maxZoom: 18,
          maxBoundsViscosity: 1.0, // Hace que el mapa "rebote" al llegar a los límites
          worldCopyJump: false // Evita saltar a copias del mundo
        });
        
        // Configurar el estilo claro para el mapa
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 18,
          minZoom: 2,
          noWrap: true // Evita que el mapa se repita horizontalmente
        }).addTo(map);
        
        // Establecer límites para evitar desplazamiento excesivo
        const southWest = window.L.latLng(-89.98155760646617, -180);
        const northEast = window.L.latLng(89.99346179538875, 180);
        const bounds = window.L.latLngBounds(southWest, northEast);
        map.setMaxBounds(bounds);
        
        // Agregar marcadores para cada ubicación
        locations.forEach((location, index) => {
          // Crear un icono personalizado para el marcador
          const customIcon = window.L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #3f51b5; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          });
          
          const marker = window.L.marker([location.latitude, location.longitude] as [number, number], {
            icon: customIcon
          }).addTo(map);
          
          // Añadir popup con información
          const popupContent = `
            <div style="min-width: 220px; padding: 4px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #1a1a2e;">${location.user?.name || 'Egresado'}</div>
              <div style="font-size: 12px; color: #555; display: flex; align-items: center; margin-top: 4px;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #3f51b5; margin-right: 6px;"></span>
                ${location.cityName || location.address || 'Ubicación sin determinar'}
              </div>
            </div>
          `;
          
          marker.bindPopup(popupContent);
          
          // Abrir popup al hacer clic en el marcador
          marker.on('click', () => {
            marker.openPopup();
          });
          
          // Guardar referencia del marcador
          markersRef.current.push(marker);
        });
        
        // Guardar la referencia del mapa
        mapInstanceRef.current = map;
        
        // Forzar una actualización del tamaño del mapa después de renderizar
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      };

      loadLeaflet();
    }
    
    // Limpiar el mapa cuando el componente se desmonte
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [loading, locations]);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ubicaciones de Egresados" />
      <Box className="map-container" sx={{ 
        height: 'calc(100vh - 64px)', // Altura total menos el header
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth={false} disableGutters sx={{ flex: 1, height: '100%', position: 'relative' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid rgba(0,0,0,0.06)'
          }}>
            <Typography 
              variant="h5" 
              component="h1" 
              sx={{ 
                fontWeight: 600,
                letterSpacing: '-0.5px',
                color: theme.palette.primary.main,
              }}
            >
              Mapa de Egresados
            </Typography>
            <Chip 
              label={`${locations.length} egresados`} 
              size="small"
              color="primary"
              sx={{ 
                fontWeight: 500,
                px: 1,
                borderRadius: '6px',
                height: 28
              }}
            />
          </Box>
          
          {loading ? (
            <Box sx={{ width: '100%', p: 2 }}>
              <LinearProgress color="primary" />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Cargando datos de ubicaciones...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ p: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '8px',
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.12)}`,
                  color: theme.palette.error.main
                }}
              >
                <Typography variant="body1">{error}</Typography>
              </Paper>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              height: 'calc(100% - 57px)', // Altura total menos el header interno
              position: 'relative'
            }}>
              {/* Mapa con Leaflet - MODO CLARO (ocupa toda la pantalla) */}
              <Box 
                sx={{
                  flex: 1,
                  position: 'relative',
                  height: '100%',
                  zIndex: 1
                }}
              >
                <div 
                  ref={mapContainerRef} 
                  style={{ width: '100%', height: '100%' }}
                />
              </Box>
              
              {/* Lista de ubicaciones (panel lateral) */}
              {locations.length > 0 && (
                <Box sx={{
                  width: { xs: '100%', sm: '320px', md: '360px' },
                  height: '100%',
                  position: { xs: 'absolute', sm: 'relative' },
                  right: 0,
                  top: 0,
                  zIndex: 10,
                  backgroundColor: '#1a1a2e',
                  color: '#fff',
                  boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'auto'
                }}>
                  <Box sx={{ 
                    px: 3, 
                    py: 2, 
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#1a1a2e',
                    zIndex: 2
                  }}>
                    <PersonOutline sx={{ mr: 1, color: alpha('#fff', 0.7) }} />
                    <Typography variant="h6" sx={{ 
                      fontWeight: 500, 
                      fontSize: '1rem',
                      color: alpha('#fff', 0.95) 
                    }}>
                      Ubicaciones de Egresados
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    flex: 1,
                    p: 2,
                    overflowY: 'auto'
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 1.5
                    }}>
                    {locations.map((location, index) => (
                      <Box 
                        key={location.id} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          p: 2,
                          bgcolor: alpha('#fff', 0.03),
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          border: '1px solid transparent',
                          '&:hover': {
                            bgcolor: alpha('#fff', 0.05),
                            borderColor: alpha('#fff', 0.08),
                            transform: 'translateY(-1px)',
                          }
                        }}
                        onClick={() => {
                          if (mapInstanceRef.current) {
                            // Centrar en esta ubicación al hacer clic
                            mapInstanceRef.current.setView(
                              [location.latitude, location.longitude] as [number, number], 
                              14
                            );
                            
                            // Abrir el popup del marcador correspondiente
                            if (markersRef.current[index]) {
                              markersRef.current[index].openPopup();
                            }
                          }
                        }}
                      >
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40,
                            mr: 2, 
                            bgcolor: alpha('#fff', 0.1),
                            color: theme.palette.primary.light,
                            fontWeight: 500,
                            fontSize: '0.95rem'
                          }}
                        >
                          {location.user?.name?.[0] || 'E'}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              color: '#fff', 
                              fontWeight: 500,
                              fontSize: '0.95rem',
                              mb: 0.5
                            }}
                          >
                            {location.user?.name || 'Egresado'}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                color: alpha('#fff', 0.6),
                                fontSize: '0.8rem'
                              }}
                            >
                              <AccessTimeRounded sx={{ fontSize: 14, mr: 0.5, opacity: 0.7 }} />
                              {getRelativeTime(location.created_at)}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                color: alpha('#fff', 0.6),
                                fontSize: '0.8rem'
                              }}
                            >
                              <LocationOnOutlined sx={{ fontSize: 14, mr: 0.5, opacity: 0.7 }} />
                              {location.cityName || location.address || 'Ubicación sin determinar'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </AppLayout>
  );
}