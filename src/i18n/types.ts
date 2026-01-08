export type Language = 
  | 'es'    // Castellano (default)
  | 'gl'    // Gallego
  | 'ast'   // Asturiano
  | 'eu'    // Euskera
  | 'ca'    // Catalán
  | 'aran'  // Aranés
  | 'and'   // Andorrano (Catalán con matices)
  | 'en'    // English
  | 'fr'    // Français
  | 'de'    // Deutsch
  | 'it';   // Italiano

export interface Translation {
  // Common
  app: {
    title: string;
    subtitle: string;
    install: string;
    installDescription: string;
    close: string;
  };
  
  // Header
  header: {
    newProfile: string;
    profileName: string;
    profileNamePlaceholder: string;
    observer: string;
    observerPlaceholder: string;
    observations: string;
    observationsPlaceholder: string;
    coordinates: string;
    altitude: string;
    timeUTC: string;
    startSampling: string;
    gpsFixed: string;
    gpsActive: string;
    gpsSearching: string;
    gpsError: string;
  };
  
  // Sample form
  samples: {
    newSample: string;
    sampleNumber: string;
    layerHeight: string;
    layerHeightHint: string;
    grainType: string;
    grainTypeSelect: string;
    grainSize: string;
    hardness: string;
    hardnessHint: string;
    humidity: string;
    humidityHint: string;
    temperature: string;
    addSample: string;
    nextSample: string;
    finishProfile: string;
    sampleRegistered: string;
    layerAdded: string;
    totalHeight: string;
    accumulatedHeight: string;
    confirmFinishTitle: string;
    confirmFinishMessage: string;
    cancel: string;
    confirm: string;
  };
  
  // Results
  results: {
    preview: string;
    showChart: string;
    hideChart: string;
    save: string;
    saved: string;
    savedDescription: string;
    exportCSV: string;
    csvExported: string;
    exportGeoJSON: string;
    geojsonExported: string;
    downloading: string;
    newProfile: string;
    profileFinished: string;
    samplesRegistered: string;
  };
  
  // Table
  table: {
    sample: string;
    height: string;
    accum: string;
    grain: string;
    size: string;
    hardness: string;
    humidity: string;
    temp: string;
    actions: string;
    order: string;
    delete: string;
    deleted: string;
    reordered: string;
    movedTo: string;
    noSamples: string;
    sampleDetails: string;
    clickToChangePosition: string;
    moveUp: string;
    moveDown: string;
    confirm: string;
    cancel: string;
  };
  
  // Profile manager
  manager: {
    title: string;
    explore: string;
    import: string;
    noProfiles: string;
    noProfilesDescription: string;
    load: string;
    deleteProfile: string;
    confirmDelete: string;
    profileLoaded: string;
    profileDeleted: string;
    importError: string;
    invalidFile: string;
    profileImported: string;
    samplesLoaded: string;
  };
  
  // Profile actions
  profile: {
    started: string;
    gpsTimeFixed: string;
    confirmReset: string;
    errorSaving: string;
    couldNotSave: string;
  };
  
  // Documentation
  docs: {
    title: string;
    technicalGuide: string;
    pwaInstallation: string;
    pwaInstallationDesc: string;
    offlineCapabilities: string;
    offlineCapabilitiesDesc: string;
    multiplatform: string;
    multiplatformDesc: string;
    acknowledgements: string;
    acknowledgementsText: string;
    disclaimer: string;
    disclaimerText: string;
    trainingResources: string;
    close: string;
  };
  
  // Footer
  footer: {
    basedOn: string;
    pwaOffline: string;
    localData: string;
    documentation: string;
  };
}

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string; // ISO country code for flag representation
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Castellano', flag: 'ES' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: 'ES-GA' },
  { code: 'ast', name: 'Asturian', nativeName: 'Asturianu', flag: 'ES-AS' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', flag: 'ES-PV' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: 'ES-CT' },
  { code: 'aran', name: 'Aranese', nativeName: 'Aranés', flag: 'ES-CT' },
  { code: 'and', name: 'Andorran', nativeName: 'Català (Andorra)', flag: 'AD' },
  { code: 'en', name: 'English', nativeName: 'English', flag: 'GB' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: 'FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: 'DE' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: 'IT' },
];
