import proj4 from 'proj4';

export interface UTMCoordinates {
  easting: number;
  northing: number;
  zone: number;
  hemisphere: 'N' | 'S';
}

// Calculate UTM zone from longitude
function getUTMZone(longitude: number): number {
  return Math.floor((longitude + 180) / 6) + 1;
}

// Get UTM proj4 string for a specific zone and hemisphere
function getUTMProj4String(zone: number, hemisphere: 'N' | 'S'): string {
  const hemCode = hemisphere === 'N' ? 'north' : 'south';
  return `+proj=utm +zone=${zone} +${hemCode} +datum=WGS84 +units=m +no_defs`;
}

// Convert WGS84 (lat/lon) to UTM
export function latLonToUTM(latitude: number, longitude: number): UTMCoordinates {
  const zone = getUTMZone(longitude);
  const hemisphere: 'N' | 'S' = latitude >= 0 ? 'N' : 'S';
  
  const utmProj = getUTMProj4String(zone, hemisphere);
  const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';
  
  const [easting, northing] = proj4(wgs84, utmProj, [longitude, latitude]);
  
  return {
    easting: Math.round(easting * 100) / 100,
    northing: Math.round(northing * 100) / 100,
    zone,
    hemisphere,
  };
}

// Convert UTM to WGS84 (lat/lon)
export function utmToLatLon(utm: UTMCoordinates): { latitude: number; longitude: number } {
  const utmProj = getUTMProj4String(utm.zone, utm.hemisphere);
  const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';
  
  const [longitude, latitude] = proj4(utmProj, wgs84, [utm.easting, utm.northing]);
  
  return {
    latitude: Math.round(latitude * 1000000) / 1000000,
    longitude: Math.round(longitude * 1000000) / 1000000,
  };
}

// Format UTM coordinates for display
export function formatUTM(utm: UTMCoordinates | null): string {
  if (!utm) return 'Sin datos';
  return `${utm.zone}${utm.hemisphere} ${Math.round(utm.easting)}E ${Math.round(utm.northing)}N`;
}

// Parse UTM string (e.g., "30N 439234E 4721345N")
export function parseUTMString(utmString: string): UTMCoordinates | null {
  const regex = /^(\d{1,2})([NS])\s*(\d+(?:\.\d+)?)[E]?\s*(\d+(?:\.\d+)?)[N]?$/i;
  const match = utmString.trim().match(regex);
  
  if (!match) return null;
  
  return {
    zone: parseInt(match[1]),
    hemisphere: match[2].toUpperCase() as 'N' | 'S',
    easting: parseFloat(match[3]),
    northing: parseFloat(match[4]),
  };
}

// Convert lat/lon to UTM if available
export function coordinatesToUTM(latitude: number | null, longitude: number | null): UTMCoordinates | null {
  if (latitude === null || longitude === null) return null;
  return latLonToUTM(latitude, longitude);
}
