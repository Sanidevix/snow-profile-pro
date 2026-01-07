import React, { useState } from 'react';
import { MapPin, Mountain, Clock, Loader2, FileText } from 'lucide-react';
import { useGeolocation, formatAltitude } from '@/hooks/useGeolocation';
import { useCurrentTime, formatTimeShortUTC, formatDateUTC } from '@/hooks/useCurrentTime';
import { formatDecimalCoords, formatSexagesimalCoords } from '@/lib/db';
import { useI18n } from '@/i18n/context';

interface ProfileHeaderProps {
  profileName: string;
  setProfileName: (name: string) => void;
  observer: string;
  setObserver: (observer: string) => void;
  observations: string;
  setObservations: (observations: string) => void;
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
  observations,
  setObservations,
  onStartProfile,
  isStarted,
  frozenData,
}: ProfileHeaderProps) {
  const { t } = useI18n();
  const geo = useGeolocation();
  const { currentTime } = useCurrentTime(isStarted);
  const [showSexagesimal, setShowSexagesimal] = useState(false);

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
    if (isStarted) return t.header.gpsFixed;
    if (geo.error) return t.header.gpsError;
    if (geo.loading && !geo.latitude) return t.header.gpsSearching;
    return t.header.gpsActive;
  };

  const toggleCoordFormat = () => {
    setShowSexagesimal(prev => !prev);
  };

  const formatCoords = () => {
    if (showSexagesimal) {
      return formatSexagesimalCoords(displayLat, displayLon);
    }
    return formatDecimalCoords(displayLat, displayLon);
  };

  return (
    <div className="nivo-card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="nivo-section-title flex items-center gap-2 mb-0 pb-0 border-0">
          <Mountain className="w-6 h-6" />
          {t.header.newProfile}
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
            {t.header.profileName}
          </label>
          <input
            id="profileName"
            type="text"
            className="nivo-input"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder={t.header.profileNamePlaceholder}
            disabled={isStarted}
          />
        </div>
        <div>
          <label className="nivo-field-label" htmlFor="observer">
            {t.header.observer}
          </label>
          <input
            id="observer"
            type="text"
            className="nivo-input"
            value={observer}
            onChange={(e) => setObserver(e.target.value)}
            placeholder={t.header.observerPlaceholder}
            disabled={isStarted}
          />
        </div>
      </div>

      {/* Observations field */}
      <div>
        <label className="nivo-field-label flex items-center gap-2" htmlFor="observations">
          <FileText className="w-4 h-4" />
          {t.header.observations}
        </label>
        <textarea
          id="observations"
          className="nivo-input min-h-[80px] resize-y"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder={t.header.observationsPlaceholder}
          disabled={isStarted}
        />
      </div>

      {/* GPS and Time display */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Interactive coordinate card - click to toggle format */}
        <div 
          className="bg-muted rounded-lg p-4 cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={toggleCoordFormat}
          title={t.header.coordinates}
        >
          <div className="nivo-field-label flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {t.header.coordinates}
            <span className="text-[10px] ml-auto bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              {showSexagesimal ? 'GMS' : 'DEC'}
            </span>
          </div>
          <div className="nivo-data-display text-sm font-mono">
            {formatCoords()}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="nivo-field-label flex items-center gap-2">
            <Mountain className="w-4 h-4" />
            {t.header.altitude}
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
            {t.header.timeUTC}
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
          {t.header.startSampling}
        </button>
      )}
    </div>
  );
}
