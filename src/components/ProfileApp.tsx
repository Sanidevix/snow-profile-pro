import React, { useState, useCallback, useRef } from 'react';
import { Download, Eye, RotateCcw, Save, ChevronLeft, Upload, MapPin, FolderOpen, BookOpen } from 'lucide-react';
import { ProfileHeader } from './ProfileHeader';
import { SampleForm } from './SampleForm';
import { StratigraphicChart } from './StratigraphicChart';
import { SampleTable } from './SampleTable';
import { ProfileManager } from './ProfileManager';
import { LanguageSelector } from './LanguageSelector';
import { Documentation } from './Documentation';
import { SnowSample, SnowProfile, saveProfile, downloadCSV, downloadGeoJSON, parseGeoJSON } from '@/lib/db';
import { getISOTimestamp } from '@/hooks/useCurrentTime';
import { toast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/context';

type AppState = 'header' | 'sampling' | 'results';

export function ProfileApp() {
  const { t } = useI18n();
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
  const [showDocumentation, setShowDocumentation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartProfile = useCallback(() => {
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
    toast({ title: t.profile.started, description: t.profile.gpsTimeFixed });
  }, [t]);

  const handleAddSample = useCallback((sample: Omit<SnowSample, 'id'>) => {
    const newSample: SnowSample = {
      ...sample,
      id: samples.length + 1,
      timestamp: getISOTimestamp(new Date()),
    };
    setSamples(prev => [...prev, newSample]);
    toast({
      title: `${t.samples.sampleRegistered} #${newSample.id}`,
      description: t.samples.layerAdded.replace('{height}', String(sample.height)),
    });
  }, [samples.length, t]);

  const handleFinishProfile = useCallback(() => {
    setAppState('results');
    toast({
      title: t.results.profileFinished,
      description: t.results.samplesRegistered.replace('{count}', String(samples.length)),
    });
  }, [samples.length, t]);

  const handleDeleteSample = useCallback((index: number) => {
    setSamples(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, id: i + 1 })));
    toast({ title: t.table.deleted });
  }, [t]);

  const handleReorderSample = useCallback((fromIndex: number, toIndex: number) => {
    setSamples(prev => {
      const newSamples = [...prev];
      const [movedSample] = newSamples.splice(fromIndex, 1);
      newSamples.splice(toIndex, 0, movedSample);
      return newSamples.map((s, i) => ({ ...s, id: i + 1 }));
    });
    toast({
      title: t.table.reordered,
      description: t.table.movedTo.replace('{position}', String(toIndex + 1)),
    });
  }, [t]);

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
      toast({ title: t.results.saved, description: t.results.savedDescription });
    } catch (error) {
      toast({ title: t.profile.errorSaving, description: t.profile.couldNotSave, variant: 'destructive' });
    }
  }, [buildProfile, t]);

  const handleExportCSV = useCallback(() => {
    const profile = buildProfile();
    downloadCSV(profile);
    toast({ title: t.results.csvExported, description: t.results.downloading });
  }, [buildProfile, t]);

  const handleExportGeoJSON = useCallback(() => {
    const profile = buildProfile();
    downloadGeoJSON(profile);
    toast({ title: t.results.geojsonExported, description: t.results.downloading });
  }, [buildProfile, t]);

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
        toast({ title: t.manager.importError, description: t.manager.invalidFile, variant: 'destructive' });
        return;
      }

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
        title: t.manager.profileImported,
        description: t.manager.samplesLoaded.replace('{count}', String(imported.samples.length)),
      });
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [t]);

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
    if (window.confirm(t.profile.confirmReset)) {
      setAppState('header');
      setProfileName('');
      setObserver('');
      setObservations('');
      setSamples([]);
      setFrozenData(null);
    }
  }, [t]);

  const totalHeight = samples.reduce((sum, s) => sum + s.height, 0);

  return (
    <div className="min-h-screen bg-background">
      <input ref={fileInputRef} type="file" accept=".geojson,application/geo+json,application/json" className="hidden" onChange={handleFileChange} />
      <ProfileManager open={showProfileManager} onOpenChange={setShowProfileManager} onLoadProfile={handleLoadProfile} />
      <Documentation open={showDocumentation} onOpenChange={setShowDocumentation} />

      <header className="bg-primary text-primary-foreground py-4 px-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {appState !== 'header' && (
              <button onClick={appState === 'results' ? () => setAppState('sampling') : handleReset} className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold">{t.app.title}</h1>
              <p className="text-xs opacity-80">{t.app.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {appState === 'header' && (
              <>
                <button onClick={() => setShowProfileManager(true)} className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors flex items-center gap-2" title={t.manager.explore}>
                  <FolderOpen className="w-5 h-5" />
                  <span className="text-sm hidden sm:inline">{t.manager.explore}</span>
                </button>
                <button onClick={handleImportGeoJSON} className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors flex items-center gap-2" title={t.manager.import}>
                  <Upload className="w-5 h-5" />
                  <span className="text-sm hidden sm:inline">{t.manager.import}</span>
                </button>
              </>
            )}
            {appState !== 'header' && (
              <button onClick={handleReset} className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors" title={t.results.newProfile}>
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="nivo-container pb-8 space-y-6">
        <ProfileHeader profileName={profileName} setProfileName={setProfileName} observer={observer} setObserver={setObserver} observations={observations} setObservations={setObservations} onStartProfile={handleStartProfile} isStarted={appState !== 'header'} frozenData={frozenData} />

        {appState === 'sampling' && (
          <SampleForm sampleNumber={samples.length + 1} onAddSample={handleAddSample} onFinishProfile={handleFinishProfile} totalHeight={totalHeight} />
        )}

        {appState === 'sampling' && samples.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{t.results.preview}</h3>
              <button onClick={() => setShowChart(!showChart)} className="nivo-btn-outline text-sm py-2 px-4">
                <Eye className="w-4 h-4" />
                {showChart ? t.results.hideChart : t.results.showChart}
              </button>
            </div>
            {showChart && <StratigraphicChart samples={samples} />}
            <SampleTable samples={samples} onDeleteSample={handleDeleteSample} onReorderSample={handleReorderSample} />
          </div>
        )}

        {appState === 'results' && (
          <div className="space-y-6">
            <StratigraphicChart samples={samples} />
            <SampleTable samples={samples} />
            <div className="grid gap-4 sm:grid-cols-3">
              <button onClick={handleSaveProfile} className="nivo-btn-success"><Save className="w-5 h-5" />{t.results.save}</button>
              <button onClick={handleExportCSV} className="nivo-btn-primary"><Download className="w-5 h-5" />{t.results.exportCSV}</button>
              <button onClick={handleExportGeoJSON} className="nivo-btn-primary"><MapPin className="w-5 h-5" />{t.results.exportGeoJSON}</button>
            </div>
            <button onClick={handleReset} className="nivo-btn-outline w-full"><RotateCcw className="w-5 h-5" />{t.results.newProfile}</button>
          </div>
        )}
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground border-t">
        <p>{t.footer.basedOn}</p>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span>{t.footer.pwaOffline} • {t.footer.localData}</span>
          <button onClick={() => setShowDocumentation(true)} className="text-primary hover:underline flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {t.footer.documentation}
          </button>
        </div>
      </footer>
    </div>
  );
}
