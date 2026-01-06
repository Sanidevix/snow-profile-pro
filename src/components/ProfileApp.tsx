import React, { useState, useCallback, useRef } from 'react';
import { Download, Eye, RotateCcw, Save, ChevronLeft, Upload, MapPin, FolderOpen } from 'lucide-react';
import { ProfileHeader } from './ProfileHeader';
import { SampleForm } from './SampleForm';
import { StratigraphicChart } from './StratigraphicChart';
import { SampleTable } from './SampleTable';
import { ProfileManager } from './ProfileManager';
import { SnowSample, SnowProfile, saveProfile, downloadCSV, downloadGeoJSON, parseGeoJSON } from '@/lib/db';
import { getISOTimestamp } from '@/hooks/useCurrentTime';
import { toast } from '@/hooks/use-toast';

type AppState = 'header' | 'sampling' | 'results';

export function ProfileApp() {
  const [appState, setAppState] = useState<AppState>('header');
  const [profileName, setProfileName] = useState('');
  const [observer, setObserver] = useState('');
  const [observations, setObservations] = useState('');
  const [samples, setSamples] = useState<SnowSample[]>([]);
  const [frozenData, setFrozenData] = useState<{
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
    timestamp: string | null;
  } | null>(null);
  const [showChart, setShowChart] = useState(true);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartProfile = useCallback(() => {
    // Freeze GPS and time when starting - store WGS84 decimal
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude } = position.coords;
        setFrozenData({
          latitude,
          longitude,
          altitude,
          timestamp: getISOTimestamp(new Date()),
        });
      },
      () => {
        // Even if GPS fails, freeze the time
        setFrozenData({
          latitude: null,
          longitude: null,
          altitude: null,
          timestamp: getISOTimestamp(new Date()),
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
    setAppState('sampling');
    toast({
      title: 'Perfil iniciado',
      description: 'GPS y hora fijados. Comienza a registrar muestras.',
    });
  }, []);

  const handleAddSample = useCallback((sample: Omit<SnowSample, 'id'>) => {
    const newSample: SnowSample = {
      ...sample,
      id: samples.length + 1,
      timestamp: getISOTimestamp(new Date()), // ISO 8601 timestamp when sample is created
    };
    setSamples(prev => [...prev, newSample]);
    toast({
      title: `Muestra #${newSample.id} registrada`,
      description: `Capa de ${sample.height}cm añadida`,
    });
  }, [samples.length]);

  const handleFinishProfile = useCallback(() => {
    setAppState('results');
    toast({
      title: 'Perfil finalizado',
      description: `${samples.length} muestras registradas`,
    });
  }, [samples.length]);

  const handleDeleteSample = useCallback((index: number) => {
    setSamples(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, id: i + 1 })));
    toast({
      title: 'Muestra eliminada',
    });
  }, []);

  const handleReorderSample = useCallback((fromIndex: number, toIndex: number) => {
    setSamples(prev => {
      const newSamples = [...prev];
      const [movedSample] = newSamples.splice(fromIndex, 1);
      newSamples.splice(toIndex, 0, movedSample);
      // Reassign sequential IDs
      return newSamples.map((s, i) => ({ ...s, id: i + 1 }));
    });
    toast({
      title: 'Orden actualizado',
      description: `Muestra movida a posición ${toIndex + 1}`,
    });
  }, []);

  const buildProfile = useCallback((): SnowProfile => {
    return {
      id: 0,
      name: profileName,
      observer,
      observations,
      latitude: frozenData?.latitude ?? null,
      longitude: frozenData?.longitude ?? null,
      altitude: frozenData?.altitude ?? null,
      timestamp: frozenData?.timestamp ?? getISOTimestamp(new Date()),
      samples,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [profileName, observer, observations, frozenData, samples]);

  const handleSaveProfile = useCallback(async () => {
    try {
      const profile = buildProfile();
      await saveProfile({
        name: profile.name,
        observer: profile.observer,
        observations: profile.observations,
        latitude: profile.latitude,
        longitude: profile.longitude,
        altitude: profile.altitude,
        timestamp: profile.timestamp,
        samples: profile.samples,
      });
      toast({
        title: 'Perfil guardado',
        description: 'Los datos se han guardado localmente',
      });
    } catch (error) {
      toast({
        title: 'Error al guardar',
        description: 'No se pudo guardar el perfil',
        variant: 'destructive',
      });
    }
  }, [buildProfile]);

  const handleExportCSV = useCallback(() => {
    const profile = buildProfile();
    downloadCSV(profile);
    toast({
      title: 'CSV exportado',
      description: 'El archivo se está descargando',
    });
  }, [buildProfile]);

  const handleExportGeoJSON = useCallback(() => {
    const profile = buildProfile();
    downloadGeoJSON(profile);
    toast({
      title: 'GeoJSON exportado',
      description: 'El archivo se está descargando',
    });
  }, [buildProfile]);

  const handleImportGeoJSON = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const imported = parseGeoJSON(content);

      if (!imported) {
        toast({
          title: 'Error de importación',
          description: 'El archivo GeoJSON no es válido',
          variant: 'destructive',
        });
        return;
      }

      // Load imported data
      setProfileName(imported.name);
      setObserver(imported.observer);
      setObservations(imported.observations);
      setSamples(imported.samples);
      setFrozenData({
        latitude: imported.latitude,
        longitude: imported.longitude,
        altitude: imported.altitude,
        timestamp: imported.timestamp,
      });
      setAppState('results');

      toast({
        title: 'Perfil importado',
        description: `${imported.samples.length} muestras cargadas`,
      });
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = '';
  }, []);

  const handleLoadProfile = useCallback((profile: SnowProfile) => {
    setProfileName(profile.name);
    setObserver(profile.observer);
    setObservations(profile.observations);
    setSamples(profile.samples);
    setFrozenData({
      latitude: profile.latitude,
      longitude: profile.longitude,
      altitude: profile.altitude,
      timestamp: profile.timestamp,
    });
    setAppState('results');
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('¿Seguro que quieres empezar un nuevo perfil? Se perderán los datos no guardados.')) {
      setAppState('header');
      setProfileName('');
      setObserver('');
      setObservations('');
      setSamples([]);
      setFrozenData(null);
    }
  }, []);

  const totalHeight = samples.reduce((sum, s) => sum + s.height, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".geojson,application/geo+json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Profile Manager Modal */}
      <ProfileManager
        open={showProfileManager}
        onOpenChange={setShowProfileManager}
        onLoadProfile={handleLoadProfile}
      />

      {/* Header bar */}
      <header className="bg-primary text-primary-foreground py-4 px-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {appState !== 'header' && (
              <button
                onClick={appState === 'results' ? () => setAppState('sampling') : handleReset}
                className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold">NivoApp</h1>
              <p className="text-xs opacity-80">Perfil Estratigráfico AEMET</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {appState === 'header' && (
              <>
                <button
                  onClick={() => setShowProfileManager(true)}
                  className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors flex items-center gap-2"
                  title="Explorar perfiles guardados"
                >
                  <FolderOpen className="w-5 h-5" />
                  <span className="text-sm hidden sm:inline">Archivo</span>
                </button>
                <button
                  onClick={handleImportGeoJSON}
                  className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors flex items-center gap-2"
                  title="Importar GeoJSON"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-sm hidden sm:inline">Importar</span>
                </button>
              </>
            )}
            {appState !== 'header' && (
              <button
                onClick={handleReset}
                className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                title="Nuevo perfil"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="nivo-container pb-8 space-y-6">
        {/* Profile Header - always shown */}
        <ProfileHeader
          profileName={profileName}
          setProfileName={setProfileName}
          observer={observer}
          setObserver={setObserver}
          observations={observations}
          setObservations={setObservations}
          onStartProfile={handleStartProfile}
          isStarted={appState !== 'header'}
          frozenData={frozenData}
        />

        {/* Sample Form - shown during sampling */}
        {appState === 'sampling' && (
          <SampleForm
            sampleNumber={samples.length + 1}
            onAddSample={handleAddSample}
            onFinishProfile={handleFinishProfile}
            totalHeight={totalHeight}
          />
        )}

        {/* Live preview during sampling */}
        {appState === 'sampling' && samples.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Vista previa</h3>
              <button
                onClick={() => setShowChart(!showChart)}
                className="nivo-btn-outline text-sm py-2 px-4"
              >
                <Eye className="w-4 h-4" />
                {showChart ? 'Ocultar' : 'Mostrar'} gráfico
              </button>
            </div>
            {showChart && <StratigraphicChart samples={samples} />}
            <SampleTable samples={samples} onDeleteSample={handleDeleteSample} onReorderSample={handleReorderSample} />
          </div>
        )}

        {/* Results - final view */}
        {appState === 'results' && (
          <div className="space-y-6">
            <StratigraphicChart samples={samples} />
            <SampleTable samples={samples} />
            
            {/* Action buttons */}
            <div className="grid gap-4 sm:grid-cols-3">
              <button onClick={handleSaveProfile} className="nivo-btn-success">
                <Save className="w-5 h-5" />
                Guardar
              </button>
              <button onClick={handleExportCSV} className="nivo-btn-primary">
                <Download className="w-5 h-5" />
                CSV
              </button>
              <button onClick={handleExportGeoJSON} className="nivo-btn-primary">
                <MapPin className="w-5 h-5" />
                GeoJSON
              </button>
            </div>
            
            <button onClick={handleReset} className="nivo-btn-outline w-full">
              <RotateCcw className="w-5 h-5" />
              Nuevo Perfil
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t">
        <p>NivoApp - Basado en Guía AEMET para la Observación Nivometeorológica</p>
        <p className="mt-1">PWA Offline-First • Datos almacenados localmente</p>
      </footer>
    </div>
  );
}
