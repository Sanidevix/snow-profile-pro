import React from 'react';
import { MapPin, Mountain, Clock, Loader2 } from 'lucide-react';
import { useGeolocation, formatCoordinate, formatAltitude } from '@/hooks/useGeolocation';
import { useCurrentTime, formatTimeShortUTC, formatDateUTC } from '@/hooks/useCurrentTime';

interface ProfileHeaderProps {
  profileName: string;
  setProfileName: (name: string) => void;
  observer: string;
  setObserver: (observer: string) => void;
  onStartProfile: () => void;
  isStarted: boolean;
  frozenData: {
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
    timestamp: string | null;
  } | null;
}

export function ProfileHeader({
  profileName,
  setProfileName,
  observer,
  setObserver,
  onStartProfile,
  isStarted,
  frozenData,
}: ProfileHeaderProps) {
  const geo = useGeolocation();
  const { currentTime, isFrozen } = useCurrentTime(isStarted);

  // Use frozen data if profile is started, otherwise live data
  const displayLat = frozenData?.latitude ?? geo.latitude;
  const displayLon = frozenData?.longitude ?? geo.longitude;
  const displayAlt = frozenData?.altitude ?? geo.altitude;

  React.useEffect(() => {
    if (!isStarted) {
      geo.startWatching();
    }
    return () => {
      if (!isStarted) {
        geo.stopWatching();
      }
    };
  }, [isStarted]);

  const getGpsBadgeClass = () => {
    if (geo.error) return 'nivo-gps-badge error';
    if (geo.loading && !geo.latitude) return 'nivo-gps-badge waiting';
    return 'nivo-gps-badge';
  };

  const getGpsStatusText = () => {
    if (isStarted) return 'GPS Fijado';
    if (geo.error) return geo.error;
    if (geo.loading && !geo.latitude) return 'Buscando GPS...';
    return 'GPS Activo';
  };

  return (
    <div className="nivo-card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="nivo-section-title flex items-center gap-2 mb-0 pb-0 border-0">
          <Mountain className="w-6 h-6" />
          Nuevo Perfil Estratigráfico
        </h2>
        <div className={getGpsBadgeClass()}>
          {geo.loading && !geo.latitude ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          <span>{getGpsStatusText()}</span>
        </div>
      </div>

      {/* Profile identification */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="nivo-field-label" htmlFor="profileName">
            Nombre del Perfil
          </label>
          <input
            id="profileName"
            type="text"
            className="nivo-input"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Ej: Portalet Norte"
            disabled={isStarted}
          />
        </div>
        <div>
          <label className="nivo-field-label" htmlFor="observer">
            Observador
          </label>
          <input
            id="observer"
            type="text"
            className="nivo-input"
            value={observer}
            onChange={(e) => setObserver(e.target.value)}
            placeholder="Ej: J. García"
            disabled={isStarted}
          />
        </div>
      </div>

      {/* GPS and Time display */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-muted rounded-lg p-4">
          <div className="nivo-field-label flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Coordenadas
          </div>
          <div className="space-y-1">
            <div className="nivo-data-display text-sm">
              {formatCoordinate(displayLat, 'lat')}
            </div>
            <div className="nivo-data-display text-sm">
              {formatCoordinate(displayLon, 'lon')}
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="nivo-field-label flex items-center gap-2">
            <Mountain className="w-4 h-4" />
            Altitud
          </div>
          <div className="nivo-data-display text-2xl">
            {formatAltitude(displayAlt)}
          </div>
          {geo.accuracy && !isStarted && (
            <div className="text-xs text-muted-foreground mt-1">
              ±{Math.round(geo.accuracy)}m
            </div>
          )}
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="nivo-field-label flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Hora UTC
          </div>
          <div className="nivo-data-display text-lg">
            {frozenData?.timestamp 
              ? formatTimeShortUTC(new Date(frozenData.timestamp))
              : formatTimeShortUTC(currentTime)
            }
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {frozenData?.timestamp 
              ? formatDateUTC(new Date(frozenData.timestamp))
              : formatDateUTC(currentTime)
            }
          </div>
        </div>
      </div>

      {/* Start button */}
      {!isStarted && (
        <button
          onClick={onStartProfile}
          disabled={!profileName.trim() || !observer.trim()}
          className="nivo-btn-primary w-full"
        >
          Iniciar Toma de Muestras
        </button>
      )}
    </div>
  );
}
