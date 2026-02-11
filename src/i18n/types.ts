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
    airTemperature?: string;
    airTemperaturePlaceholder?: string;
    slopeOrientation?: string;
    slopeOrientationPlaceholder?: string;
    startSampling: string;
    gpsFixed: string;
    gpsActive: string;
    gpsSearching: string;
    gpsError: string;
  };

  // Test type selection (optional - not all languages have this yet)
  testType?: {
    selectTest: string;
    stratigraphicProfile: string;
    stratigraphicProfileDesc: string;
    compressionTest: string;
    compressionTestDesc: string;
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
    temperatureError: string;
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

  // Compression Test (CT) form (optional - not all languages have this yet)
  compressionTest?: {
    newSample: string;
    sampleNumber: string;
    tapNumber: string;
    tapNumberHint: string;
    verticalReference: string;
    verticalReferenceHint: string;
    verticalReferenceOptions: {
      top_down: string;
      bottom_up: string;
    };
    layerDepth: string;
    layerDepthHint: string;
    fractureQuality: string;
    fractureQualityHint: string;
    fractureQ1: string;
    fractureQ2: string;
    fractureQ3: string;
    grainType: string;
    grainTypeSelect: string;
    grainDiameter: string;
    grainDiameterHint: string;
    additionalInfo: string;
    additionalInfoPlaceholder: string;
    addSample: string;
    nextSample: string;
    finishTest: string;
    finishSampling: string;
    sampleRegistered: string;
    layerAdded: string;
    confirmFinishTitle: string;
    confirmFinishMessage: string;
    cancel: string;
    confirm: string;
    scoreVeryEasy: string;
    scoreEasy: string;
    scoreMedium: string;
    scoreHard: string;
    scoreNoFracture: string;
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
    share: string;
    shared: string;
    sharedDescription: string;
    shareError: string;
    shareNotSupported: string;
    shareNotReady: string;
    shareNotReadyDescription: string;
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

  // CT Table (optional - not all languages have this yet)
  ctTable?: {
    sample: string;
    result: string;
    taps: string;
    depth: string;
    quality: string;
    grain: string;
    size: string;
    info: string;
    actions: string;
    noSamples: string;
    sampleDetails: string;
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
  
  // User Manual
  userManual?: {
    title: string;
    close: string;
    generalDescription: string;
    generalDescriptionText: string;
    appFeatures: string[];
    mainScreen: string;
    mainScreenDesc: string;
    topBar: string;
    topBarItems: string[];
    profileCard: string;
    profileCardDesc: string;
    languageSelection: string;
    languageSelectionDesc: string;
    languageSupported: string;
    languageHowTo: string;
    languageSteps: string[];
    workflowStratigraphic: string;
    headerData: string;
    mandatoryFields: string;
    fieldProfileName: string;
    fieldObserver: string;
    optionalFields: string;
    fieldAirTemp: string;
    fieldOrientation: string;
    fieldOrientationOptions: string;
    fieldObservations: string;
    autoInfo: string;
    fieldCoordinates: string;
    fieldAltitude: string;
    fieldTimeUTC: string;
    gpsIndicator: string;
    gpsSearchingDesc: string;
    gpsActiveDesc: string;
    gpsFixedDesc: string;
    gpsErrorDesc: string;
    startSampling: string;
    startSamplingSteps: string[];
    startSamplingNote: string;
    testTypeSelection: string;
    testTypeSelectionDesc: string;
    testTypeStratigraphicDesc: string;
    testTypeCompressionDesc: string;
    testTypeNote: string;
    sampleRegistration: string;
    sampleRegistrationDesc: string;
    sampleFieldHeight: string;
    sampleFieldTemp: string;
    sampleFieldHardness: string;
    sampleFieldGrain: string;
    sampleFieldDiameter: string;
    sampleFieldHumidity: string;
    hardnessScale: string;
    hardnessF: string;
    hardness4F: string;
    hardness1F: string;
    hardnessP: string;
    hardnessK: string;
    hardnessI: string;
    grainTypesTitle: string;
    grainPP: string;
    grainPPgp: string;
    grainDF: string;
    grainRG: string;
    grainFC: string;
    grainDH: string;
    grainMF: string;
    grainMFcr: string;
    grainIF: string;
    grainSH: string;
    registrationProcess: string;
    registrationSteps: string[];
    registrationNote: string;
    sampleTable: string;
    sampleTableDesc: string;
    sampleTableColumns: string[];
    reorderSamples: string;
    reorderSamplesDesc: string;
    deleteSamples: string;
    deleteSamplesDesc: string;
    finishSampling: string;
    finishSamplingSteps: string[];
    workflowCT: string;
    ctDescription: string;
    ctSampleRegistration: string;
    ctFieldTaps: string;
    ctFieldVerticalRef: string;
    ctFieldDepth: string;
    ctFieldFractureQuality: string;
    ctFieldGrain: string;
    ctFieldDiameter: string;
    ctFieldAdditionalInfo: string;
    ctScoreScale: string;
    ctScoreV: string;
    ctScoreE: string;
    ctScoreM: string;
    ctScoreH: string;
    ctScoreN: string;
    ctVerticalRef: string;
    ctVerticalRefSurface: string;
    ctVerticalRefGround: string;
    ctFractureQuality: string;
    ctFractureQ1: string;
    ctFractureQ2: string;
    ctFractureQ3: string;
    ctRegistrationProcess: string;
    ctRegistrationSteps: string[];
    ctResultFormat: string;
    ctResultFormatDesc: string;
    ctResultExample: string;
    ctResultExampleDesc: string[];
    ctResultsTable: string;
    ctResultsTableDesc: string;
    ctResultsTableColumns: string[];
    combinedSampling: string;
    combinedSamplingDesc: string;
    combinedSamplingSteps: string[];
    resultsScreen: string;
    resultsScreenDesc: string;
    stratigraphicChart: string;
    chartFeatures: string[];
    dataTables: string;
    dataTablesDesc: string[];
    geojsonExport: string;
    geojsonHowTo: string;
    geojsonExportSteps: string[];
    geojsonContent: string;
    geojsonContentItems: string[];
    geojsonNote: string;
    shareProfile: string;
    shareProfileDesc: string;
    profileManagement: string;
    profileManagementDesc: string;
    exploreProfiles: string;
    exploreProfilesSteps: string[];
    exploreProfilesInfo: string[];
    loadProfile: string;
    loadProfileSteps: string[];
    deleteProfile: string;
    deleteProfileSteps: string[];
    deleteProfileWarning: string;
    importProfiles: string;
    importHowTo: string;
    importSteps: string[];
    importFormats: string[];
    autosave: string;
    autosaveDesc: string;
    autosaveFeatures: string[];
    autosaveNote: string;
    documentationResources: string;
    documentationResourcesDesc: string;
    documentationContent: string[];
  };

  // Contact Modal
  contactModal?: {
    title: string;
    subtitle: string;
    emailSection: string;
    linksSection: string;
  };

  // Footer
  footer: {
    basedOn: string;
    pwaOffline: string;
    localData: string;
    documentation: string;
    userManual: string;
    license: string;
    contact: string;
  };

  // Grain Types
  grainTypes: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
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
  { code: 'aran', name: 'Aranese', nativeName: 'Aranés', flag: 'ES-CT-VA' },
  { code: 'and', name: 'Andorran', nativeName: 'Català (Andorra)', flag: 'AD' },
  { code: 'en', name: 'English', nativeName: 'English', flag: 'GB' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: 'FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: 'DE' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: 'IT' },
];
