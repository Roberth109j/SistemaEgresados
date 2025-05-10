import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import axios from 'axios';

interface LocationNotificationProps {
  onLocationShared?: () => void;
}

export default function LocationNotification({ onLocationShared }: LocationNotificationProps) {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Verificar si ya se ha compartido la ubicación
  const locationSharedBefore = localStorage.getItem('locationShared') === 'true';
  if (locationSharedBefore) {
    return null;
  }

  const handleRequestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta la geolocalización');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Solicitar permiso de ubicación
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      // Guardar la ubicación en el servidor
      await axios.post('/location', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      // Marcar como compartida en localStorage
      localStorage.setItem('locationShared', 'true');
      
      setSuccess(true);
      if (onLocationShared) {
        onLocationShared();
      }
      
      // Cerrar después de 2 segundos tras el éxito
      setTimeout(() => {
        setOpen(false);
      }, 2000);
      
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Permiso denegado para acceder a la ubicación.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Información de ubicación no disponible.');
            break;
          case err.TIMEOUT:
            setError('La solicitud para obtener la ubicación expiró.');
            break;
          default:
            setError('Error desconocido al obtener la ubicación.');
        }
      } else {
        setError('Error al guardar la ubicación en el servidor.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Acceso a ubicación</DialogTitle>
          <DialogDescription>
            Necesitamos acceder a tu ubicación para gestionar mejor 
            los programas de seguimiento. Tu ubicación solo será visible para el coordinador.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>¡Ubicación compartida con éxito!</AlertDescription>
          </Alert>
        )}
        
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleDismiss} disabled={loading}>
            Recordar más tarde
          </Button>
          <Button onClick={handleRequestLocation} disabled={loading || success}>
            {loading ? 'Obteniendo ubicación...' : 'Compartir ubicación'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
