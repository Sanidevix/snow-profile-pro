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

export function downloadAsFile(profile: ShareableProfile): void {
  const geojsonContent = buildGeoJSONContent(profile);
  const filename = getFilename(profile.name, profile.timestamp);
  
  const blob = new Blob([geojsonContent], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function shareProfile(profile: ShareableProfile, translations: { shareTitle?: string; shareError?: string; shareNotSupported?: string; downloadFallback?: string }): Promise<boolean> {
  const geojsonContent = buildGeoJSONContent(profile);
  const filename = getFilename(profile.name, profile.timestamp);
  
  // Check if Web Share API with files is supported
  if (navigator.canShare) {
    try {
      const file = new File([geojsonContent], filename, { type: 'application/geo+json' });
      
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: profile.name,
          text: `Perfil estratigráfico: ${profile.name}`,
        });
        return true;
      }
    } catch (error) {
      // User cancelled or share failed
      if ((error as Error).name === 'AbortError') {
        return false;
      }
      
      // Permission denied (common in iframes/preview) - fallback to download
      if ((error as Error).name === 'NotAllowedError') {
        console.warn('Share permission denied, falling back to download');
        downloadAsFile(profile);
        toast({
          title: translations.downloadFallback || 'Archivo descargado',
          description: 'Compartir no disponible en este contexto. El archivo se ha descargado.',
        });
        return true;
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
  
  // Fallback: try sharing just text/URL if file sharing not supported
  if (navigator.share) {
    try {
      await navigator.share({
        title: profile.name,
        text: `Perfil estratigráfico: ${profile.name}\n\n${geojsonContent.substring(0, 500)}...`,
      });
      return true;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return false;
      }
      
      // Permission denied - fallback to download
      if ((error as Error).name === 'NotAllowedError') {
        console.warn('Share permission denied, falling back to download');
        downloadAsFile(profile);
        toast({
          title: translations.downloadFallback || 'Archivo descargado',
          description: 'Compartir no disponible en este contexto. El archivo se ha descargado.',
        });
        return true;
      }
      
      console.error('Share error:', error);
      return false;
    }
  }
  
  // No share API available - download directly
  downloadAsFile(profile);
  toast({
    title: translations.downloadFallback || 'Archivo descargado',
    description: 'Tu navegador no soporta compartir. El archivo se ha descargado.',
  });
  return true;
}

export function canShare(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}
