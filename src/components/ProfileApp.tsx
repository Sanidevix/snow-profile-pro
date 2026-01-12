import React, { useState, useCallback, useRef } from 'react';
import { Download, Eye, RotateCcw, Save, ChevronLeft, Upload, MapPin, FolderOpen, BookOpen, Check } from 'lucide-react';
import { ProfileHeader } from './ProfileHeader';
import { SampleForm } from './SampleForm';
import { StratigraphicChart } from './StratigraphicChart';
import { SampleTable } from './SampleTable';
import { ProfileManager } from './ProfileManager';
import { LanguageSelector } from './LanguageSelector';
import { Documentation } from './Documentation';
import { TestTypeSelector, TestType } from './TestTypeSelector';
import { CTSampleForm } from './CTSampleForm';
import { CTSampleTable } from './CTSampleTable';
import { SnowSample, SnowProfile, saveProfile, downloadCSV, downloadGeoJSON, parseGeoJSON, GRAIN_TYPES } from '@/lib/db';
import { CTSample, formatCTResult } from '@/lib/ctTypes';
import { getISOTimestamp } from '@/hooks/useCurrentTime';
import { toast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type AppState = 'header' | 'testSelection' | 'sampling' | 'results';

export function ProfileApp() {
  const { t } = useI18n();
  const [appState, setAppState] = useState<AppState>('header');
  const [testType, setTestType] = useState<TestType>('stratigraphic');
  const [profileName, setProfileName] = useState('');
  const [observer, setObserver] = useState('');
  const [observations, setObservations] = useState('');
  const [temperature, setTemperature] = useState('');
  const [orientation, setOrientation] = useState('');
  const [samples, setSamples] = useState<SnowSample[]>([]);
  const [ctSamples, setCTSamples] = useState<CTSample[]>([]);
  const [frozenData, setFrozenData] = useState<{
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
    timestamp: string | null;
  } | null>(null);
  const [showChart, setShowChart] = useState(true);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [activeTab, setActiveTab] = useState<'stratigraphic' | 'compression'>('stratigraphic');
  const [showFinishDialog, setShowFinishDialog] = useState(false);
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
    setAppState('testSelection');
    toast({ title: t.profile.started, description: t.profile.gpsTimeFixed });
  }, [t]);

  const handleTestTypeSelect = useCallback((type: TestType) => {
    setTestType(type);
    setActiveTab(type === 'stratigraphic' ? 'stratigraphic' : 'compression');
    setAppState('sampling');
  }, []);

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

  const handleAddCTSample = useCallback((sample: Omit<CTSample, 'id'>) => {
    const newSample: CTSample = {
      ...sample,
      id: ctSamples.length + 1,
      timestamp: getISOTimestamp(new Date()),
    };
    setCTSamples(prev => [...prev, newSample]);
    const ct = t.compressionTest;
    toast({
      title: `${ct?.sampleRegistered || 'Muestra CT registrada'} #${newSample.id}`,
      description: (ct?.layerAdded || 'Fractura a {depth}cm añadida').replace('{depth}', String(sample.depth)),
    });
  }, [ctSamples.length, t]);

  const handleFinishProfile = useCallback(() => {
    setAppState('results');
    const totalSamples = samples.length + ctSamples.length;
    toast({
      title: t.results.profileFinished,
      description: t.results.samplesRegistered.replace('{count}', String(totalSamples)),
    });
  }, [samples.length, ctSamples.length, t]);

  const handleDeleteSample = useCallback((index: number) => {
    setSamples(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, id: i + 1 })));
    toast({ title: t.table.deleted });
  }, [t]);

  const handleDeleteCTSample = useCallback((index: number) => {
    setCTSamples(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, id: i + 1 })));
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

  const getGrainLabel = (value: number) => 
    GRAIN_TYPES.find(g => g.value === value)?.label ?? value.toString();

  const buildProfile = useCallback((): SnowProfile & { ctSamples?: any[] } => {
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
      ctSamples: ctSamples.length > 0 ? ctSamples.map((sample, index) => ({
        id: sample.id,
        number: index + 1,
        taps: sample.taps,
        depth: sample.depth,
        fractureQuality: sample.fractureQuality,
        grainType: sample.grainType,
        grainTypeLabel: getGrainLabel(sample.grainType),
        diameter: sample.diameter,
        additionalInfo: sample.additionalInfo,
        formattedResult: formatCTResult(sample, getGrainLabel(sample.grainType)),
        timestamp: sample.timestamp,
      })) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [profileName, observer, observations, frozenData, samples, ctSamples]);

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
    // Extended GeoJSON export that includes CT samples
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          profile.longitude ?? 0, 
          profile.latitude ?? 0, 
          profile.altitude ?? 0
        ]
      },
      properties: {
        name: profile.name,
        observer: profile.observer,
        observations: profile.observations || '',
        airTemperature: temperature ? parseFloat(temperature) : null,
        slopeOrientation: orientation || null,
        timestamp: profile.timestamp,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        totalHeight: profile.samples.reduce((sum, s) => sum + s.height, 0),
        sampleCount: profile.samples.length,
        samples: profile.samples.map((sample, index) => ({
          id: sample.id,
          number: index + 1,
          height: sample.height,
          temperature: sample.temperature,
          resistance: sample.resistance,
          grainType: sample.grainType,
          grainTypeLabel: GRAIN_TYPES.find(g => g.value === sample.grainType)?.label ?? null,
          diameter: sample.diameter,
          humidity: sample.humidity,
          timestamp: sample.timestamp,
        })),
        ctSampleCount: ctSamples.length,
        ctSamples: ctSamples.length > 0 ? ctSamples.map((sample, index) => ({
          id: sample.id,
          number: index + 1,
          taps: sample.taps,
          reference: sample.reference,
          depth: sample.depth,
          fractureQuality: sample.fractureQuality,
          grainType: sample.grainType,
          grainTypeLabel: getGrainLabel(sample.grainType),
          diameter: sample.diameter,
          additionalInfo: sample.additionalInfo,
          formattedResult: formatCTResult(sample, getGrainLabel(sample.grainType)),
          timestamp: sample.timestamp,
        })) : undefined,
      }
    };

    const geojson = JSON.stringify(feature, null, 2);
    const blob = new Blob([geojson], { type: 'application/geo+json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const filename = `perfil_nivo_${profile.name.replace(/\s+/g, '_')}_${new Date(profile.timestamp).toISOString().split('T')[0]}.geojson`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: t.results.geojsonExported, description: t.results.downloading });
  }, [buildProfile, ctSamples, temperature, orientation, t]);

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
    setAppState('header');
    setProfileName('');
    setObserver('');
    setObservations('');
    setTemperature('');
    setOrientation('');
    setSamples([]);
    setCTSamples([]);
    setFrozenData(null);
    setTestType('stratigraphic');
    setActiveTab('stratigraphic');
  }, []);

  const totalHeight = samples.reduce((sum, s) => sum + s.height, 0);
  const hasSamples = samples.length > 0 || ctSamples.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <input ref={fileInputRef} type="file" accept=".geojson,application/geo+json,application/json" className="hidden" onChange={handleFileChange} />
      <ProfileManager open={showProfileManager} onOpenChange={setShowProfileManager} onLoadProfile={handleLoadProfile} />
      <Documentation open={showDocumentation} onOpenChange={setShowDocumentation} />

      <header className="bg-primary text-primary-foreground py-4 px-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {appState !== 'header' && (
              <button 
                onClick={() => {
                  if (appState === 'results') {
                    setAppState('sampling');
                  } else if (appState === 'sampling') {
                    setAppState('testSelection');
                  } else if (appState === 'testSelection') {
                    handleReset();
                  }
                }} 
                className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <img src="/pwa-512x512.png" alt="SnowStrat Field" className="w-10 h-10 rounded-lg" />
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
        <ProfileHeader profileName={profileName} setProfileName={setProfileName} observer={observer} setObserver={setObserver} observations={observations} setObservations={setObservations} temperature={temperature} setTemperature={setTemperature} orientation={orientation} setOrientation={setOrientation} onStartProfile={handleStartProfile} isStarted={appState !== 'header'} frozenData={frozenData} />

        {appState === 'testSelection' && (
          <TestTypeSelector selectedType={testType} onTypeChange={handleTestTypeSelect} />
        )}

        {appState === 'sampling' && (
          <div className="nivo-card p-0 overflow-hidden">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'stratigraphic' | 'compression')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-14 rounded-none bg-muted/50 p-0 gap-0">
                <TabsTrigger 
                  value="stratigraphic" 
                  className="h-full rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 data-[state=active]:border-primary data-[state=inactive]:border-transparent flex items-center justify-center gap-2 text-sm font-medium"
                >
                  {t.testType?.stratigraphicProfile || 'Perfil Estratigráfico'}
                  {samples.length > 0 && (
                    <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-bold min-w-[24px]">
                      {samples.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="compression" 
                  className="h-full rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 data-[state=active]:border-primary data-[state=inactive]:border-transparent flex items-center justify-center gap-2 text-sm font-medium"
                >
                  {t.testType?.compressionTest || 'Test CT'}
                  {ctSamples.length > 0 && (
                    <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-bold min-w-[24px]">
                      {ctSamples.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stratigraphic" className="p-4 space-y-6 mt-0">
              <SampleForm sampleNumber={samples.length + 1} onAddSample={handleAddSample} totalHeight={totalHeight} />
              
              {samples.length > 0 && (
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
            </TabsContent>

              <TabsContent value="compression" className="p-4 space-y-6 mt-0">
                <CTSampleForm sampleNumber={ctSamples.length + 1} onAddSample={handleAddCTSample} />
              
              {ctSamples.length > 0 && (
                <CTSampleTable samples={ctSamples} onDeleteSample={handleDeleteCTSample} />
              )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {appState === 'sampling' && hasSamples && (
          <div className="nivo-card">
            <button
              onClick={() => setShowFinishDialog(true)}
              className="nivo-btn-primary w-full"
            >
              <Check className="w-5 h-5" />
              {t.compressionTest?.finishSampling || 'Finalizar muestreo'}
            </button>
          </div>
        )}

        <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.samples.confirmFinishTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {t.samples.confirmFinishMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.samples.cancel}</AlertDialogCancel>
              <AlertDialogAction onClick={() => { setShowFinishDialog(false); handleFinishProfile(); }}>
                {t.samples.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {appState === 'results' && (
          <div className="space-y-6">
            {samples.length > 0 && (
              <>
                <StratigraphicChart samples={samples} />
                <SampleTable samples={samples} />
              </>
            )}
            {ctSamples.length > 0 && (
              <CTSampleTable samples={ctSamples} />
            )}
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
