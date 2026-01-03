import React, { useState, useCallback } from 'react';
import { Download, Eye, RotateCcw, Save, ChevronLeft } from 'lucide-react';
import { ProfileHeader } from './ProfileHeader';
import { SampleForm } from './SampleForm';
import { StratigraphicChart } from './StratigraphicChart';
import { SampleTable } from './SampleTable';
import { SnowSample, SnowProfile, saveProfile, downloadCSV } from '@/lib/db';
import { getISOTimestamp } from '@/hooks/useCurrentTime';
import { toast } from '@/hooks/use-toast';

type AppState = 'header' | 'sampling' | 'results';

export function ProfileApp() {
  const [appState, setAppState] = useState<AppState>('header');
  const [profileName, setProfileName] = useState('');
  const [observer, setObserver] = useState('');
  const [samples, setSamples] = useState<SnowSample[]>([]);
  const [frozenData, setFrozenData] = useState<{
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
    timestamp: string | null;
  } | null>(null);
  const [showChart, setShowChart] = useState(true);

  const handleStartProfile = useCallback(() => {
    // Freeze GPS and time when starting
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFrozenData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
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

  const handleSaveProfile = useCallback(async () => {
    try {
      const profile: Omit<SnowProfile, 'id' | 'createdAt' | 'updatedAt'> = {
        name: profileName,
        observer,
        latitude: frozenData?.latitude ?? null,
        longitude: frozenData?.longitude ?? null,
        altitude: frozenData?.altitude ?? null,
        timestamp: frozenData?.timestamp ?? getISOTimestamp(new Date()),
        samples,
      };
      
      await saveProfile(profile);
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
  }, [profileName, observer, frozenData, samples]);

  const handleExportCSV = useCallback(() => {
    const profile: SnowProfile = {
      id: 0,
      name: profileName,
      observer,
      latitude: frozenData?.latitude ?? null,
      longitude: frozenData?.longitude ?? null,
      altitude: frozenData?.altitude ?? null,
      timestamp: frozenData?.timestamp ?? getISOTimestamp(new Date()),
      samples,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    downloadCSV(profile);
    toast({
      title: 'CSV exportado',
      description: 'El archivo se está descargando',
    });
  }, [profileName, observer, frozenData, samples]);

  const handleReset = useCallback(() => {
    if (window.confirm('¿Seguro que quieres empezar un nuevo perfil? Se perderán los datos no guardados.')) {
      setAppState('header');
      setProfileName('');
      setObserver('');
      setSamples([]);
      setFrozenData(null);
    }
  }, []);

  const totalHeight = samples.reduce((sum, s) => sum + s.height, 0);

  return (
    <div className="min-h-screen bg-background">
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
          
          {appState !== 'header' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                title="Nuevo perfil"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="nivo-container pb-8 space-y-6">
        {/* Profile Header - always shown */}
        <ProfileHeader
          profileName={profileName}
          setProfileName={setProfileName}
          observer={observer}
          setObserver={setObserver}
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
            <SampleTable samples={samples} onDeleteSample={handleDeleteSample} />
          </div>
        )}

        {/* Results - final view */}
        {appState === 'results' && (
          <div className="space-y-6">
            <StratigraphicChart samples={samples} />
            <SampleTable samples={samples} />
            
            {/* Action buttons */}
            <div className="grid gap-4 sm:grid-cols-2">
              <button onClick={handleSaveProfile} className="nivo-btn-success">
                <Save className="w-5 h-5" />
                Guardar Perfil
              </button>
              <button onClick={handleExportCSV} className="nivo-btn-primary">
                <Download className="w-5 h-5" />
                Exportar CSV
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
