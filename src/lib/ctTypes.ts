// Types for Compression Test (CT) data

export type VerticalReference = 'top_down' | 'bottom_up';

export interface CTSample {
  id: number;
  taps: number; // Number of taps/blows (0-31)
  reference: VerticalReference; // Vertical reference for depth measurement
  depth: number; // Depth of the layer in cm
  fractureQuality: 'Q1' | 'Q2' | 'Q3'; // Fracture quality
  grainType: number; // Grain type 1-9
  diameter: number | null; // Diameter in mm (optional)
  additionalInfo: string | null; // Additional information
  timestamp?: string; // ISO 8601 UTC format - when sample was taken
}

// Get CT score based on number of taps
// V = 0 taps (Very Easy)
// E = 1-10 taps (Easy)
// M = 11-20 taps (Medium)
// H = 21-30 taps (Hard)
// N = 31 taps (No fracture)
export function getCTScore(taps: number): string {
  if (taps === 0) return 'V';
  if (taps >= 1 && taps <= 10) return 'E';
  if (taps >= 11 && taps <= 20) return 'M';
  if (taps >= 21 && taps <= 30) return 'H';
  return 'N'; // 31
}

// Get the full score label
export function getCTScoreLabel(taps: number): string {
  const score = getCTScore(taps);
  switch (score) {
    case 'V': return 'V (Muy Fácil)';
    case 'E': return 'E (Fácil)';
    case 'M': return 'M (Medio)';
    case 'H': return 'H (Difícil)';
    case 'N': return 'N (Sin Fractura)';
    default: return score;
  }
}

// Format CT sample result as: CT#Qn@↓zzzFD Infos or CT#Qn@↑zzzFD Infos
// CT = fixed
// # = score (V, E, M, H, N)
// Qn = fracture quality (Q1, Q2, Q3)
// @ = fixed
// ↓ or ↑ = vertical reference symbol (top_down=↓, bottom_up=↑)
// zzz = depth
// F = grain type (IACS acronym)
// D = diameter with mm
// Infos = additional info
export function formatCTResult(sample: CTSample, grainLabel: string): string {
  const score = getCTScore(sample.taps);
  const refSymbol = sample.reference === 'bottom_up' ? '↑' : '↓';
  const depth = sample.depth;
  const diameter = sample.diameter !== null ? `${sample.diameter}mm` : '';
  const info = sample.additionalInfo || '';
  
  return `CT${score}${sample.fractureQuality}@${refSymbol}${depth}${grainLabel}${diameter} ${info}`.trim();
}

// Vertical reference options
export const VERTICAL_REFERENCE_OPTIONS = [
  { value: 'top_down' as const, label: '↓', description: 'Desde superficie del manto' },
  { value: 'bottom_up' as const, label: '↑', description: 'Desde el suelo' },
] as const;

// Fracture quality options
export const FRACTURE_QUALITY_OPTIONS = [
  { value: 'Q1' as const, label: 'Q1', description: 'Fractura limpia y plana' },
  { value: 'Q2' as const, label: 'Q2', description: 'Fractura parcialmente plana' },
  { value: 'Q3' as const, label: 'Q3', description: 'Fractura irregular o rugosa' },
] as const;
