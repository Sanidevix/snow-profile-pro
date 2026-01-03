import { useState, useCallback, useEffect } from 'react';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  accuracy: number | null;
  timestamp: Date | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    altitude: null,
    accuracy: null,
    timestamp: null,
    error: null,
    loading: false,
  });

  const [watching, setWatching] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const updatePosition = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date(position.timestamp),
      error: null,
      loading: false,
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Error desconocido de geolocalización';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Permiso de ubicación denegado';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Ubicación no disponible';
        break;
      case error.TIMEOUT:
        errorMessage = 'Tiempo de espera agotado';
        break;
    }

    setState(prev => ({
      ...prev,
      error: errorMessage,
      loading: false,
    }));
  }, []);

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocalización no soportada en este dispositivo',
        loading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(updatePosition, handleError, {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    });
  }, [updatePosition, handleError]);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocalización no soportada en este dispositivo',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const id = navigator.geolocation.watchPosition(updatePosition, handleError, {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 5000,
    });

    setWatchId(id);
    setWatching(true);
  }, [updatePosition, handleError]);

  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setWatching(false);
    }
  }, [watchId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    ...state,
    watching,
    getPosition,
    startWatching,
    stopWatching,
  };
}

// Format coordinates for display
export function formatCoordinate(value: number | null, type: 'lat' | 'lon'): string {
  if (value === null) return '--';
  
  const direction = type === 'lat' 
    ? (value >= 0 ? 'N' : 'S')
    : (value >= 0 ? 'E' : 'W');
  
  const absValue = Math.abs(value);
  const degrees = Math.floor(absValue);
  const minutes = Math.floor((absValue - degrees) * 60);
  const seconds = ((absValue - degrees) * 60 - minutes) * 60;
  
  return `${degrees}° ${minutes}' ${seconds.toFixed(1)}" ${direction}`;
}

// Format altitude
export function formatAltitude(altitude: number | null): string {
  if (altitude === null) return '-- m';
  return `${Math.round(altitude)} m`;
}
