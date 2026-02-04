import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Types for snow profile data
export interface SnowSample {
  id: number;
  height: number; // Height of this layer in cm
  temperature: number | null; // Temperature in °C (optional)
  resistance: number; // Resistance value (I=120, K=100, P=50, 1F=25, 4F=10, F=2)
  grainType: number; // Grain type 1-9
  diameter: number | null; // Diameter in mm (optional)
  humidity: string | null; // D, M, W, V, S (optional)
  timestamp?: string; // ISO 8601 UTC format - when sample was taken
}

export interface SnowProfile {
  id?: number;
  name: string;
  observer: string;
  observations: string; // Field for observations
  // WGS84 decimal coordinates (standard)
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  timestamp: string; // ISO 8601 UTC format
  samples: SnowSample[];
  createdAt: string;
  updatedAt: string;
}

interface NivoDBSchema extends DBSchema {
  profiles: {
    key: number;
    value: SnowProfile;
    indexes: { 'by-date': string; 'by-name': string };
  };
}

let dbInstance: IDBPDatabase<NivoDBSchema> | null = null;

export async function getDB(): Promise<IDBPDatabase<NivoDBSchema>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<NivoDBSchema>('nivo-profiles-db', 3, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const profileStore = db.createObjectStore('profiles', {
          keyPath: 'id',
          autoIncrement: true,
        });
        profileStore.createIndex('by-date', 'createdAt');
        profileStore.createIndex('by-name', 'name');
      }
    },
  });

  return dbInstance;
}

// CRUD operations
export async function saveProfile(profile: Omit<SnowProfile, 'id' | 'createdAt' | 'updatedAt'>, existingId?: number): Promise<number> {
  const db = await getDB();
  const now = new Date().toISOString();
  
  if (existingId) {
    // Update existing profile
    const existing = await db.get('profiles', existingId);
    if (existing) {
      const updated: SnowProfile = {
        ...existing,
        ...profile,
        id: existingId,
        updatedAt: now,
      };
      await db.put('profiles', updated);
      return existingId;
    }
  }
  
  // Create new profile
  const fullProfile: SnowProfile = {
    ...profile,
    createdAt: now,
    updatedAt: now,
  };
  return db.add('profiles', fullProfile);
}

export async function updateProfile(id: number, profile: Partial<SnowProfile>): Promise<void> {
  const db = await getDB();
  const existing = await db.get('profiles', id);
  if (!existing) throw new Error('Profile not found');
  
  const updated: SnowProfile = {
    ...existing,
    ...profile,
    id,
    updatedAt: new Date().toISOString(),
  };
  await db.put('profiles', updated);
}

export async function getProfile(id: number): Promise<SnowProfile | undefined> {
  const db = await getDB();
  return db.get('profiles', id);
}

export async function getAllProfiles(): Promise<SnowProfile[]> {
  const db = await getDB();
  return db.getAllFromIndex('profiles', 'by-date');
}

export async function deleteProfile(id: number): Promise<void> {
  const db = await getDB();
  await db.delete('profiles', id);
}

// Resistance quick values per AEMET standard
export const RESISTANCE_VALUES = [
  { label: 'I', value: 120, description: 'Hielo (Ice)' },
  { label: 'K', value: 100, description: 'Cuchillo (Knife)' },
  { label: 'P', value: 50, description: 'Lápiz (Pencil)' },
  { label: '1F', value: 25, description: '1 Dedo (1 Finger)' },
  { label: '4F', value: 10, description: '4 Dedos (4 Fingers)' },
  { label: 'F', value: 2, description: 'Puño (Fist)' },
] as const;

// Grain types per AEMET classification (1-9) with IACS colors
export const GRAIN_TYPES = [
  { value: 1, label: 'PP', name: '+ Nieve reciente', color: '#00FF00' },
  { value: 2, label: 'PPgp', name: '⛇ Nieve granulada', color: '#00FF00' },
  { value: 3, label: 'DF', name: '/ Partículas reconocibles', color: '#228B22' },
  { value: 4, label: 'RG', name: '• Grano fino', color: '#FFC0CB' },
  { value: 5, label: 'FC', name: '□ Granos Caras planas', color: '#ADD8E6' },
  { value: 6, label: 'DH', name: '∧ Cubiletes', color: '#0000FF' },
  { value: 7, label: 'MF', name: '○ Grano redondo', color: '#FF0000' },
  { value: 8, label: 'MFcr', name: '⚭ Costra de rehielo', color: '#BDBDBD' },
  { value: 9, label: 'IF', name: '▮ Capa de hielo', color: '#00FFFF' },
  { value: 10, label: 'SH', name: 'v Escarcha', color: '#FF00FF' },
] as const;

// Humidity values per AEMET standard
export const HUMIDITY_VALUES = [
  { value: 'D', label: 'D - Seca', description: 'Temperatura <0°C, nieve polvo' },
  { value: 'M', label: 'M - Húmeda', description: 'T≈0°C, se puede hacer bola' },
  { value: 'W', label: 'W - Mojada', description: 'Agua visible al apretar' },
  { value: 'V', label: 'V - Muy mojada', description: 'Agua escurre al apretar' },
  { value: 'S', label: 'S - Empapada', description: 'Saturada de agua' },
] as const;

// Format coordinates for display - decimal
export function formatDecimalCoords(lat: number | null, lon: number | null): string {
  if (lat === null || lon === null) return 'N/A';
  return `${lat.toFixed(6)}°, ${lon.toFixed(6)}°`;
}

// Format coordinates for display - sexagesimal (DMS)
export function formatSexagesimalCoords(lat: number | null, lon: number | null): string {
  if (lat === null || lon === null) return 'N/A';
  
  const formatDMS = (value: number, isLat: boolean): string => {
    const direction = isLat 
      ? (value >= 0 ? 'N' : 'S')
      : (value >= 0 ? 'E' : 'W');
    const absValue = Math.abs(value);
    const degrees = Math.floor(absValue);
    const minutes = Math.floor((absValue - degrees) * 60);
    const seconds = ((absValue - degrees) * 60 - minutes) * 60;
    return `${degrees}°${minutes}'${seconds.toFixed(1)}"${direction}`;
  };
  
  return `${formatDMS(lat, true)} ${formatDMS(lon, false)}`;
}

// Export profile to CSV
export function exportToCSV(profile: SnowProfile): string {
  const header = [
    'Perfil Estratigráfico de Nieve - Estándar AEMET',
    '',
    `Nombre del Perfil,${profile.name}`,
    `Observador,${profile.observer}`,
    `Observaciones,"${(profile.observations || '').replace(/"/g, '""')}"`,
    `Latitud,${profile.latitude ?? 'N/A'}`,
    `Longitud,${profile.longitude ?? 'N/A'}`,
    `Altitud (m),${profile.altitude ?? 'N/A'}`,
    `Fecha/Hora UTC,${profile.timestamp}`,
    '',
    'Muestra,Altura (cm),Altura Acumulada (cm),Temperatura (°C),Resistencia,Tipo Grano,Diámetro (mm),Humedad,Timestamp',
  ].join('\n');

  let accumulatedHeight = 0;
  const rows = profile.samples.map((sample, index) => {
    accumulatedHeight += sample.height;
    const grainLabel = GRAIN_TYPES.find(g => g.value === sample.grainType)?.label ?? sample.grainType;
    const resistanceLabel = RESISTANCE_VALUES.find(r => r.value === sample.resistance)?.label ?? sample.resistance;
    
    return [
      index + 1,
      sample.height,
      accumulatedHeight,
      sample.temperature ?? '',
      `${resistanceLabel} (${sample.resistance})`,
      `${grainLabel} (${sample.grainType})`,
      sample.diameter ?? '',
      sample.humidity ?? '',
      sample.timestamp ?? '',
    ].join(',');
  }).join('\n');

  return `${header}\n${rows}`;
}

// Download CSV file
export function downloadCSV(profile: SnowProfile): void {
  const csv = exportToCSV(profile);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const filename = `perfil_nivo_${profile.name.replace(/\s+/g, '_')}_${new Date(profile.timestamp).toISOString().split('T')[0]}.csv`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export profile to GeoJSON (standard WGS84 format)
export function exportToGeoJSON(profile: SnowProfile): string {
  const feature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        profile.longitude ?? 0, 
        profile.latitude ?? 0, 
        profile.altitude ?? 0
      ] // [longitude, latitude, altitude] - GeoJSON standard
    },
    properties: {
      name: profile.name,
      observer: profile.observer,
      observations: profile.observations || '',
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
        resistanceLabel: RESISTANCE_VALUES.find(r => r.value === sample.resistance)?.label ?? null,
        grainType: sample.grainType,
        grainTypeLabel: GRAIN_TYPES.find(g => g.value === sample.grainType)?.label ?? null,
        diameter: sample.diameter,
        humidity: sample.humidity,
        timestamp: sample.timestamp, // ISO 8601 timestamp per sample
      }))
    }
  };

  return JSON.stringify(feature, null, 2);
}

// Download GeoJSON file
export function downloadGeoJSON(profile: SnowProfile): void {
  const geojson = exportToGeoJSON(profile);
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
}

// Import profile from GeoJSON (standard WGS84 format)
export function parseGeoJSON(content: string): Omit<SnowProfile, 'id' | 'createdAt' | 'updatedAt'> | null {
  try {
    const data = JSON.parse(content);
    
    if (data.type !== 'Feature' || !data.geometry || !data.properties) {
      throw new Error('Invalid GeoJSON Feature');
    }

    const coords = data.geometry.coordinates || [];
    const props = data.properties;

    // GeoJSON standard: [longitude, latitude, altitude]
    const longitude = coords[0] ?? null;
    const latitude = coords[1] ?? null;
    const altitude = coords[2] ?? null;

    const samples: SnowSample[] = (props.samples || []).map((s: any, index: number) => ({
      id: s.id ?? index + 1,
      height: s.height ?? 0,
      temperature: s.temperature ?? null,
      resistance: s.resistance ?? 50,
      grainType: s.grainType ?? 1,
      diameter: s.diameter ?? null,
      humidity: s.humidity ?? null,
      timestamp: s.timestamp ?? null, // Preserve sample timestamp
    }));

    return {
      name: props.name || 'Perfil Importado',
      observer: props.observer || '',
      observations: props.observations || '',
      latitude,
      longitude,
      altitude,
      timestamp: props.timestamp || new Date().toISOString(),
      samples
    };
  } catch (error) {
    console.error('Error parsing GeoJSON:', error);
    return null;
  }
}
