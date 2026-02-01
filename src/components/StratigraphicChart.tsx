import React, { useMemo, useState, useCallback } from 'react';
import { SnowSample, GRAIN_TYPES, RESISTANCE_VALUES, HUMIDITY_VALUES } from '@/lib/db';
import { CTSample, getCTScore, formatCTResult, getCTScoreLabel, FRACTURE_QUALITY_OPTIONS } from '@/lib/ctTypes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Droplets, Thermometer, Layers, Circle } from 'lucide-react';

interface StratigraphicChartProps {
  samples: SnowSample[];
  ctSamples?: CTSample[];
  maxHeight?: number;
}

const CHART_CONFIG = {
  width: 800,
  height: 500,
  marginTop: 50,
  marginRight: 120, // Extended for CT labels
  marginBottom: 50,
  marginLeft: 120,
  resistanceMax: 120,
  temperatureMin: -24,
  temperatureMax: 0,
  heightMax: 200,
};

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];

// IACS color mapping for grain types
const getGrainColor = (grainType: number): string => {
  const grain = GRAIN_TYPES.find(g => g.value === grainType);
  return grain?.color ?? '#808080';
};

const getGrainLabel = (grainType: number): string => {
  const grain = GRAIN_TYPES.find(g => g.value === grainType);
  return grain?.label ?? '';
};

const getGrainName = (grainType: number): string => {
  const grain = GRAIN_TYPES.find(g => g.value === grainType);
  return grain?.name ?? '';
};

// Calculate CT sample Y position based on reference and total height
const calculateCTYPosition = (sample: CTSample, totalHeight: number): number => {
  if (sample.reference === 'bottom_up') {
    return sample.depth;
  } else {
    if (totalHeight > 0) {
      return totalHeight - sample.depth;
    } else {
      return sample.depth;
    }
  }
};

interface ProcessedSample extends SnowSample {
  index: number;
  baseHeight: number;
  topHeight: number;
}

interface SampleDetailsProps {
  sample: ProcessedSample;
  onClose: () => void;
}

function SampleDetailsDialog({ sample, onClose }: SampleDetailsProps) {
  const grainType = GRAIN_TYPES.find(g => g.value === sample.grainType);
  const resistance = RESISTANCE_VALUES.find(r => r.value === sample.resistance);
  const humidity = sample.humidity ? HUMIDITY_VALUES.find(h => h.value === sample.humidity) : null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Capa #{sample.index}
          </DialogTitle>
          <DialogDescription>
            Detalles de la muestra estratigráfica
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Height info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Espesor de capa</p>
              <p className="text-lg font-bold text-foreground">{sample.height} cm</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Altura acumulada</p>
              <p className="text-lg font-bold text-foreground">{sample.topHeight} cm</p>
            </div>
          </div>

          {/* Grain type */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Tipo de grano (IACS)</p>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border border-border"
                style={{ backgroundColor: grainType?.color ?? '#808080' }}
              />
              <span className="font-bold">{grainType?.label}</span>
              <span className="text-muted-foreground">{grainType?.name}</span>
            </div>
          </div>

          {/* Resistance */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Resistencia (Dureza)</p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{resistance?.label}</span>
              <span className="text-muted-foreground">({sample.resistance})</span>
              <span className="text-sm text-muted-foreground">- {resistance?.description}</span>
            </div>
          </div>

          {/* Temperature */}
          {sample.temperature !== null && (
            <div className="bg-blue-500/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Thermometer className="h-3 w-3" />
                Temperatura
              </p>
              <p className="text-lg font-bold text-blue-600">{sample.temperature}°C</p>
            </div>
          )}

          {/* Diameter */}
          {sample.diameter !== null && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Circle className="h-3 w-3" />
                Diámetro del grano
              </p>
              <p className="text-lg font-bold">{sample.diameter} mm</p>
            </div>
          )}

          {/* Humidity */}
          {humidity && (
            <div className="bg-cyan-500/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                Humedad
              </p>
              <p className="font-bold">{humidity.label}</p>
              <p className="text-sm text-muted-foreground">{humidity.description}</p>
            </div>
          )}

          {/* Timestamp */}
          {sample.timestamp && (
            <div className="text-xs text-muted-foreground text-center border-t pt-2">
              Registrado: {new Date(sample.timestamp).toLocaleString()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CTDetailsProps {
  sample: CTSample & { index: number; yPosition: number; formattedResult: string };
  onClose: () => void;
}

function CTDetailsDialog({ sample, onClose }: CTDetailsProps) {
  const grainType = GRAIN_TYPES.find(g => g.value === sample.grainType);
  const fractureQuality = FRACTURE_QUALITY_OPTIONS.find(f => f.value === sample.fractureQuality);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <span className="text-xl">🔨</span>
            Test CT #{sample.index}
          </DialogTitle>
          <DialogDescription>
            Resultado del test de compresión
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Result summary */}
          <div className="bg-red-500/10 rounded-lg p-4 text-center border border-red-200">
            <p className="text-xs text-muted-foreground mb-2">Resultado Completo</p>
            <p className="text-xl font-mono font-bold text-red-600">{sample.formattedResult}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Taps/Score */}
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Nº de Golpes</p>
              <p className="text-lg font-bold">{sample.taps}</p>
              <p className="text-sm text-muted-foreground">{getCTScoreLabel(sample.taps)}</p>
            </div>

            {/* Position */}
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Profundidad</p>
              <p className="text-lg font-bold">
                {sample.reference === 'bottom_up' ? '↑' : '↓'}{sample.depth} cm
              </p>
              <p className="text-sm text-muted-foreground">
                {sample.reference === 'bottom_up' ? 'Desde el suelo' : 'Desde superficie'}
              </p>
            </div>
          </div>

          {/* Fracture Quality */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Calidad de Fractura</p>
            <p className="font-bold">{sample.fractureQuality}</p>
            <p className="text-sm text-muted-foreground">{fractureQuality?.description}</p>
          </div>

          {/* Grain type */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Tipo de grano (IACS)</p>
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border border-border"
                style={{ backgroundColor: grainType?.color ?? '#808080' }}
              />
              <span className="font-bold">{grainType?.label}</span>
              <span className="text-muted-foreground">{grainType?.name}</span>
            </div>
          </div>

          {/* Diameter */}
          {sample.diameter !== null && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Diámetro del grano</p>
              <p className="text-lg font-bold">{sample.diameter} mm</p>
            </div>
          )}

          {/* Additional Info */}
          {sample.additionalInfo && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Información adicional</p>
              <p className="text-sm">{sample.additionalInfo}</p>
            </div>
          )}

          {/* Timestamp */}
          {sample.timestamp && (
            <div className="text-xs text-muted-foreground text-center border-t pt-2">
              Registrado: {new Date(sample.timestamp).toLocaleString()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function StratigraphicChart({ samples, ctSamples = [], maxHeight }: StratigraphicChartProps) {
  const [zoomIndex, setZoomIndex] = useState(2); // Start at 1x (index 2)
  const [selectedSample, setSelectedSample] = useState<ProcessedSample | null>(null);
  const [selectedCT, setSelectedCT] = useState<(CTSample & { index: number; yPosition: number; formattedResult: string }) | null>(null);

  const zoom = ZOOM_LEVELS[zoomIndex];

  const handleZoomIn = useCallback(() => {
    setZoomIndex(prev => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomIndex(2);
  }, []);

  const chartData = useMemo(() => {
    if (samples.length === 0 && ctSamples.length === 0) return null;

    let accumulatedHeight = 0;
    const processedSamples: ProcessedSample[] = samples.map((sample, index) => {
      const baseHeight = accumulatedHeight;
      accumulatedHeight += sample.height;
      return {
        ...sample,
        index: index + 1,
        baseHeight,
        topHeight: accumulatedHeight,
      };
    });

    const totalHeight = accumulatedHeight;
    
    const maxCTPosition = ctSamples.length > 0 
      ? Math.max(...ctSamples.map(s => calculateCTYPosition(s, totalHeight)))
      : 0;
    
    const chartHeight = Math.max(totalHeight, maxCTPosition, maxHeight ?? CHART_CONFIG.heightMax);

    return {
      samples: processedSamples,
      totalHeight,
      chartHeight,
    };
  }, [samples, ctSamples, maxHeight]);

  const processedCTSamples = useMemo(() => {
    if (!chartData) return [];
    return ctSamples.map((sample, index) => {
      const yPosition = calculateCTYPosition(sample, chartData.totalHeight);
      const grainLabel = getGrainLabel(sample.grainType);
      const formattedResult = formatCTResult(sample, grainLabel);
      return {
        ...sample,
        index: index + 1,
        yPosition,
        formattedResult,
      };
    });
  }, [ctSamples, chartData]);

  if (!chartData) {
    return (
      <div className="nivo-chart-container flex items-center justify-center h-64">
        <p className="text-muted-foreground text-lg">
          No hay muestras para visualizar
        </p>
      </div>
    );
  }

  const { samples: processedSamples, totalHeight, chartHeight } = chartData;
  const { width, height, marginTop, marginRight, marginBottom, marginLeft } = CHART_CONFIG;
  
  const scaledWidth = width * zoom;
  const scaledHeight = height * zoom;
  
  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  // Scale functions
  const yScale = (h: number) => marginTop + innerHeight * (1 - h / chartHeight);
  const xScaleResistance = (r: number) => marginLeft + innerWidth * (1 - r / CHART_CONFIG.resistanceMax);
  const xScaleTemperature = (t: number) => marginLeft + innerWidth * ((t - CHART_CONFIG.temperatureMin) / (CHART_CONFIG.temperatureMax - CHART_CONFIG.temperatureMin));

  // Generate grid lines
  const heightGridLines = Array.from({ length: Math.ceil(chartHeight / 20) + 1 }, (_, i) => i * 20);
  const resistanceGridLines = [120, 100, 80, 60, 40, 20, 0];
  const temperatureGridLines = [-24, -20, -16, -12, -8, -4, 0];

  // Temperature line path
  const temperaturePoints = processedSamples
    .filter(s => s.temperature !== null)
    .map(s => {
      const centerHeight = s.baseHeight + (s.height / 2);
      return {
        x: xScaleTemperature(s.temperature!),
        y: yScale(centerHeight),
      };
    });

  const temperaturePath = temperaturePoints.length > 1
    ? `M ${temperaturePoints.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  return (
    <div className="nivo-chart-container">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">
          Perfil Estratigráfico de Nieve
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoomIndex === 0}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[50px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            className="h-8 px-2"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-2 text-center">
        Haz clic en cualquier capa para ver los detalles
      </p>

      <div className="overflow-auto border rounded-lg bg-background" style={{ maxHeight: '600px' }}>
        <svg
          width={scaledWidth}
          height={scaledHeight}
          viewBox={`0 0 ${width} ${height}`}
          className="block"
        >
          {/* Marker definitions for CT arrows */}
          <defs>
            <marker
              id="ct-arrowhead"
              markerWidth="6"
              markerHeight="6"
              refX="0"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L6,3 Z" fill="#DC2626" />
            </marker>
          </defs>

          {/* Background */}
          <rect
            x={marginLeft}
            y={marginTop}
            width={innerWidth}
            height={innerHeight}
            fill="hsl(var(--muted))"
            opacity="0.3"
          />

          {/* Axis labels */}
          <text
            x={width / 2}
            y={20}
            textAnchor="middle"
            className="text-xs font-bold"
            fill="hsl(var(--chart-temperature))"
          >
            Temperatura (°C)
          </text>
          <text
            x={width / 2}
            y={height - 8}
            textAnchor="middle"
            className="text-xs font-bold"
            fill="hsl(var(--chart-resistance))"
          >
            Resistencia (R: 0-120)
          </text>
          <text
            x={marginLeft + innerWidth + 15}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90, ${marginLeft + innerWidth + 15}, ${height / 2})`}
            className="text-xs font-bold fill-foreground"
          >
            Altura (cm)
          </text>

          {/* Temperature axis (top) */}
          <line
            x1={marginLeft}
            y1={marginTop}
            x2={marginLeft + innerWidth}
            y2={marginTop}
            stroke="hsl(var(--chart-temperature))"
            strokeWidth="2"
          />
          {temperatureGridLines.map(t => (
            <g key={`temp-${t}`}>
              <text
                x={xScaleTemperature(t)}
                y={marginTop - 8}
                textAnchor="middle"
                className="text-[10px]"
                fill="hsl(var(--chart-temperature))"
              >
                {t}
              </text>
              <line
                x1={xScaleTemperature(t)}
                y1={marginTop}
                x2={xScaleTemperature(t)}
                y2={marginTop + 5}
                stroke="hsl(var(--chart-temperature))"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* Resistance axis (bottom) */}
          <line
            x1={marginLeft}
            y1={marginTop + innerHeight}
            x2={marginLeft + innerWidth}
            y2={marginTop + innerHeight}
            stroke="hsl(var(--chart-resistance))"
            strokeWidth="2"
          />
          {resistanceGridLines.map(r => (
            <g key={`res-${r}`}>
              <text
                x={xScaleResistance(r)}
                y={marginTop + innerHeight + 20}
                textAnchor="middle"
                className="text-[10px]"
                fill="hsl(var(--chart-resistance))"
              >
                {r}
              </text>
              <line
                x1={xScaleResistance(r)}
                y1={marginTop + innerHeight}
                x2={xScaleResistance(r)}
                y2={marginTop + innerHeight - 5}
                stroke="hsl(var(--chart-resistance))"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* Height axis (right side of chart area) */}
          <line
            x1={marginLeft + innerWidth}
            y1={marginTop}
            x2={marginLeft + innerWidth}
            y2={marginTop + innerHeight}
            stroke="hsl(var(--chart-axis))"
            strokeWidth="2"
          />
          {heightGridLines.filter(h => h <= chartHeight).map(h => (
            <g key={`height-${h}`}>
              <text
                x={marginLeft + innerWidth + 8}
                y={yScale(h) + 4}
                textAnchor="start"
                className="text-[10px] fill-foreground"
              >
                {h}
              </text>
              <line
                x1={marginLeft + innerWidth}
                y1={yScale(h)}
                x2={marginLeft + innerWidth + 5}
                y2={yScale(h)}
                stroke="hsl(var(--chart-axis))"
                strokeWidth="1"
              />
              {/* Grid line */}
              <line
                x1={marginLeft}
                y1={yScale(h)}
                x2={marginLeft + innerWidth}
                y2={yScale(h)}
                stroke="hsl(var(--chart-grid))"
                strokeWidth="0.5"
                strokeDasharray="4,4"
              />
            </g>
          ))}

          {/* Resistance bars - colored by grain type (IACS colors) */}
          {processedSamples.map((sample, index) => {
            const barWidth = (sample.resistance / CHART_CONFIG.resistanceMax) * innerWidth;
            const barY = yScale(sample.topHeight);
            const barHeight = yScale(sample.baseHeight) - yScale(sample.topHeight);
            const grainLabel = GRAIN_TYPES.find(g => g.value === sample.grainType)?.label ?? '';
            const barX = marginLeft + innerWidth - barWidth;
            
            return (
              <g 
                key={`sample-${index}`} 
                className="cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => setSelectedSample(sample)}
              >
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={getGrainColor(sample.grainType)}
                  stroke="hsl(var(--chart-axis))"
                  strokeWidth="1"
                  opacity="0.85"
                  className="transition-all hover:opacity-100"
                />
                {/* Hover overlay */}
                <rect
                  x={marginLeft}
                  y={barY}
                  width={innerWidth}
                  height={barHeight}
                  fill="transparent"
                  className="hover:fill-foreground/5"
                />
                {/* Grain type label inside bar */}
                {barHeight > 15 && (
                  <text
                    x={barX + 5}
                    y={barY + barHeight / 2 + 4}
                    className="text-[10px] font-bold pointer-events-none"
                    fill="hsl(var(--foreground))"
                    style={{ textShadow: '0 0 3px white, 0 0 3px white' }}
                  >
                    {grainLabel}
                  </text>
                )}
                {/* Sample number indicator */}
                <text
                  x={marginLeft - 5}
                  y={barY + barHeight / 2 + 4}
                  textAnchor="end"
                  className="text-[9px] fill-muted-foreground pointer-events-none"
                >
                  #{sample.index}
                </text>
              </g>
            );
          })}

          {/* Temperature line */}
          {temperaturePath && (
            <>
              <path
                d={temperaturePath}
                fill="none"
                stroke="hsl(var(--chart-temperature))"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {temperaturePoints.map((point, index) => (
                <circle
                  key={`temp-point-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="hsl(var(--chart-temperature))"
                  stroke="white"
                  strokeWidth="1.5"
                />
              ))}
            </>
          )}

          {/* CT Sample Connectors - positioned to not overlap height axis */}
          {processedCTSamples.map((ct, index) => {
            const y = yScale(ct.yPosition);
            // Position CT markers in dedicated zone after height numbers
            const startX = marginLeft + innerWidth + 25;
            const endX = startX + 12;
            const textX = endX + 4;
            
            // Prevent connector from going outside chart bounds
            if (y < marginTop || y > marginTop + innerHeight) {
              return null;
            }

            return (
              <g 
                key={`ct-${index}`}
                className="cursor-pointer"
                onClick={() => setSelectedCT(ct)}
              >
                {/* Tick mark on axis */}
                <line
                  x1={marginLeft + innerWidth}
                  y1={y}
                  x2={marginLeft + innerWidth + 4}
                  y2={y}
                  stroke="#DC2626"
                  strokeWidth="2"
                />
                {/* Arrow pointing to position */}
                <line
                  x1={endX}
                  y1={y}
                  x2={startX}
                  y2={y}
                  stroke="#DC2626"
                  strokeWidth="2"
                  markerEnd="url(#ct-arrowhead)"
                />
                {/* CT result text */}
                <text
                  x={textX}
                  y={y + 3}
                  className="text-[8px] font-semibold"
                  fill="#DC2626"
                  style={{ 
                    fontFamily: 'ui-monospace, monospace',
                    textShadow: '0 0 2px white, 0 0 2px white'
                  }}
                >
                  {ct.formattedResult}
                </text>
                {/* Small marker at exact position */}
                <circle
                  cx={startX}
                  cy={y}
                  r="3"
                  fill="#DC2626"
                  stroke="white"
                  strokeWidth="1"
                  className="hover:r-4 transition-all"
                />
              </g>
            );
          })}

          {/* Legend - positioned on the left */}
          <g transform={`translate(5, ${marginTop})`}>
            <text
              x="0"
              y="-10"
              className="text-[9px] font-bold fill-foreground"
            >
              Tipo Grano (IACS)
            </text>
            {GRAIN_TYPES.map((grain, i) => (
              <g key={grain.value} transform={`translate(0, ${i * 18})`}>
                <rect
                  x="0"
                  y="0"
                  width="12"
                  height="12"
                  fill={grain.color}
                  opacity="0.85"
                  stroke="hsl(var(--chart-axis))"
                  strokeWidth="0.5"
                />
                <text
                  x="16"
                  y="10"
                  className="text-[8px] fill-foreground"
                >
                  {grain.label}
                </text>
              </g>
            ))}
            
            {/* CT Legend entry */}
            {processedCTSamples.length > 0 && (
              <g transform={`translate(0, ${GRAIN_TYPES.length * 18 + 8})`}>
                <line
                  x1="0"
                  y1="6"
                  x2="12"
                  y2="6"
                  stroke="#DC2626"
                  strokeWidth="2"
                  markerEnd="url(#ct-arrowhead)"
                />
                <text
                  x="16"
                  y="10"
                  className="text-[8px] fill-foreground"
                >
                  Test CT
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Sample Details Dialog */}
      {selectedSample && (
        <SampleDetailsDialog
          sample={selectedSample}
          onClose={() => setSelectedSample(null)}
        />
      )}

      {/* CT Details Dialog */}
      {selectedCT && (
        <CTDetailsDialog
          sample={selectedCT}
          onClose={() => setSelectedCT(null)}
        />
      )}
    </div>
  );
}
