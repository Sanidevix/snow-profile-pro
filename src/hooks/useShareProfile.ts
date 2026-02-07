import { SnowProfile, GRAIN_TYPES } from '@/lib/db';
import { CTSample, formatCTResult } from '@/lib/ctTypes';
import { toast } from '@/hooks/use-toast';

interface ShareableProfile extends SnowProfile {
  ctSamples?: CTSample[];
  airTemperature?: number | null;
  slopeOrientation?: string | null;
}

const getGrainLabel = (value: number) => 
  GRAIN_TYPES.find(g => g.value === value)?.label ?? value.toString();

export function buildGeoJSONContent(profile: ShareableProfile): string {
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
      airTemperature: profile.airTemperature ?? null,
      slopeOrientation: profile.slopeOrientation ?? null,
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
        grainTypeLabel: getGrainLabel(sample.grainType),
        diameter: sample.diameter,
        humidity: sample.humidity,
        timestamp: sample.timestamp,
      })),
      ctSampleCount: profile.ctSamples?.length ?? 0,
      ctSamples: profile.ctSamples && profile.ctSamples.length > 0 ? profile.ctSamples.map((sample, index) => ({
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

  return JSON.stringify(feature, null, 2);
}

export function getFilename(profileName: string, timestamp: string): string {
  return `perfil_nivo_${profileName.replace(/\s+/g, '_')}_${new Date(timestamp).toISOString().split('T')[0]}.geojson`;
}

/**
 * Build a File object from a profile, ready for sharing.
 * Uses application/json MIME for maximum mobile compatibility.
 */
export function buildShareFile(profile: ShareableProfile): File {
  const geojsonContent = buildGeoJSONContent(profile);
  const filename = getFilename(profile.name, profile.timestamp);
  return new File([geojsonContent], filename, { type: 'application/json' });
}

/**
 * Download the GeoJSON file locally AND return the File object for later sharing.
 */
export function exportAndPrepareFile(profile: ShareableProfile): File {
  const file = buildShareFile(profile);
  
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return file;
}

/**
 * Share using a pre-generated File object.
 * The file must be created beforehand so navigator.share is called
 * immediately on user gesture without async computation.
 */
export async function shareFile(
  file: File,
  profileName: string,
  translations: { shareError?: string; shareNotSupported?: string }
): Promise<boolean> {
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: profileName,
        text: `Perfil estratigráfico: ${profileName}`,
      });
      return true;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return false;
      }
      console.error('Share error:', error);
      toast({
        title: translations.shareError || 'Error al compartir',
        description: (error as Error).message,
        variant: 'destructive',
      });
      return false;
    }
  }

  // Fallback: share as text
  if (navigator.share) {
    try {
      await navigator.share({
        title: profileName,
        text: `Perfil estratigráfico: ${profileName}`,
      });
      return true;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return false;
      }
      console.error('Share error:', error);
      return false;
    }
  }

  toast({
    title: translations.shareNotSupported || 'Compartir no disponible',
    description: 'Tu navegador no soporta la función de compartir.',
    variant: 'destructive',
  });
  return false;
}

export function canShare(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}
