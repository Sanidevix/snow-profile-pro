import React, { useMemo } from 'react';
import { SnowSample, GRAIN_TYPES } from '@/lib/db';
import { CTSample, getCTScore, formatCTResult } from '@/lib/ctTypes';

interface StratigraphicChartProps {
  samples: SnowSample[];
  ctSamples?: CTSample[];
  maxHeight?: number;
}

const CHART_CONFIG = {
  width: 700,
  height: 500,
  marginTop: 50,
  marginRight: 60, // For height labels on right
  marginBottom: 50,
  marginLeft: 120, // For legend on left
  resistanceMax: 120,
  temperatureMin: -24,
  temperatureMax: 0,
  heightMax: 200, // Default max height in cm
};

// IACS color mapping for grain types
const getGrainColor = (grainType: number): string => {
  const grain = GRAIN_TYPES.find(g => g.value === grainType);
  return grain?.color ?? '#808080';
};

const getGrainLabel = (grainType: number): string => {
  const grain = GRAIN_TYPES.find(g => g.value === grainType);
  return grain?.label ?? '';
};

// Calculate CT sample Y position based on reference and total height
const calculateCTYPosition = (sample: CTSample, totalHeight: number): number => {
  if (sample.reference === 'bottom_up') {
    // Case A: From ground (↑) - position equals the value
    return sample.depth;
  } else {
    // Case B: From surface (↓)
    if (totalHeight > 0) {
      // With accumulated height: H - depth
      return totalHeight - sample.depth;
    } else {
      // Without accumulated height: use depth directly
      return sample.depth;
    }
  }
};

export function StratigraphicChart({ samples, ctSamples = [], maxHeight }: StratigraphicChartProps) {
  const chartData = useMemo(() => {
    if (samples.length === 0 && ctSamples.length === 0) return null;

    // Calculate accumulated heights
    let accumulatedHeight = 0;
    const processedSamples = samples.map((sample, index) => {
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
    
    // Calculate max CT position to ensure chart height accommodates CT samples
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
  
  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  // Scale functions
  const yScale = (h: number) => marginTop + innerHeight * (1 - h / chartHeight);
  // Resistance scale: 120 (left) to 0 (right) - decreasing
  const xScaleResistance = (r: number) => marginLeft + innerWidth * (1 - r / CHART_CONFIG.resistanceMax);
  const xScaleTemperature = (t: number) => marginLeft + innerWidth * ((t - CHART_CONFIG.temperatureMin) / (CHART_CONFIG.temperatureMax - CHART_CONFIG.temperatureMin));

  // Generate grid lines
  const heightGridLines = Array.from({ length: Math.ceil(chartHeight / 20) + 1 }, (_, i) => i * 20);
  const resistanceGridLines = [120, 100, 80, 60, 40, 20, 0];
  const temperatureGridLines = [-24, -20, -16, -12, -8, -4, 0];

  // Temperature line path - points at center of each sample
  const temperaturePoints = processedSamples
    .filter(s => s.temperature !== null)
    .map(s => {
      // Calculate center height of this sample
      const centerHeight = s.baseHeight + (s.height / 2);
      return {
        x: xScaleTemperature(s.temperature!),
        y: yScale(centerHeight),
      };
    });

  const temperaturePath = temperaturePoints.length > 1
    ? `M ${temperaturePoints.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  // Process CT samples for visualization
  const processedCTSamples = ctSamples.map((sample, index) => {
    const yPosition = calculateCTYPosition(sample, totalHeight);
    const grainLabel = getGrainLabel(sample.grainType);
    const formattedResult = formatCTResult(sample, grainLabel);
    return {
      ...sample,
      index: index + 1,
      yPosition,
      formattedResult,
    };
  });

  return (
    <div className="nivo-chart-container overflow-x-auto">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-foreground">
          Perfil Estratigráfico de Nieve
        </h3>
        <p className="text-sm text-muted-foreground">
          Según estándar AEMET - Sección 5.4.4
        </p>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-full"
        style={{ minWidth: '400px' }}
      >
        {/* Marker definitions for CT arrows */}
        <defs>
          <marker
            id="ct-arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="0"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M0,0 L0,8 L8,4 Z"
              fill="#FF0000"
            />
          </marker>
        </defs>

        {/* Axis labels */}
        <text
          x={width / 2}
          y={15}
          textAnchor="middle"
          className="text-xs font-bold fill-chart-temperature"
        >
          Temperatura (°C)
        </text>
        <text
          x={width / 2}
          y={height - 5}
          textAnchor="middle"
          className="text-xs font-bold fill-chart-resistance"
        >
          Resistencia (R: 0-120)
        </text>
        <text
          x={width - 15}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90, 15, ${height / 2})`}
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
              className="text-[10px] fill-chart-temperature"
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
              className="text-[10px] fill-chart-resistance"
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

        {/* Height axis (right) */}
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
              x={marginLeft + innerWidth + 10}
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
          // Bar starts from the right edge (where resistance = 0) and extends left
          const barX = marginLeft + innerWidth - barWidth;
          
          return (
            <g key={`sample-${index}`}>
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={getGrainColor(sample.grainType)}
                stroke="hsl(var(--chart-axis))"
                strokeWidth="1"
                opacity="0.85"
                className="animate-draw-bar"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
              {/* Grain type label inside bar */}
              {barHeight > 15 && (
                <text
                  x={barX + 5}
                  y={barY + barHeight / 2 + 4}
                  className="text-[10px] font-bold fill-foreground"
                  style={{ textShadow: '0 0 3px white, 0 0 3px white' }}
                >
                  {grainLabel}
                </text>
              )}
            </g>
          );
        })}

        {/* Temperature line */}
        {temperaturePath && (
          <>
            <path
              d={temperaturePath}
              className="temperature-line"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {temperaturePoints.map((point, index) => (
              <circle
                key={`temp-point-${index}`}
                cx={point.x}
                cy={point.y}
                r="4"
                className="temperature-point"
              />
            ))}
          </>
        )}

        {/* CT Sample Connectors - Red precision arrows with z-index priority */}
        {processedCTSamples.map((ct, index) => {
          const y = yScale(ct.yPosition);
          // Connector starts slightly offset from axis for readability
          const axisX = marginLeft + innerWidth + 5;
          const lineStartX = axisX + 8;
          const lineEndX = axisX + 45;
          const textX = lineEndX + 5;
          
          // Prevent connector from going outside chart bounds
          if (y < marginTop || y > marginTop + innerHeight) {
            return null;
          }

          return (
            <g key={`ct-${index}`} style={{ zIndex: 100 }}>
              {/* Arrow line pointing to exact height */}
              <line
                x1={lineStartX}
                y1={y}
                x2={axisX}
                y2={y}
                stroke="#FF0000"
                strokeWidth="2"
                markerEnd="url(#ct-arrowhead)"
              />
              {/* Horizontal connector line */}
              <line
                x1={lineStartX}
                y1={y}
                x2={lineEndX}
                y2={y}
                stroke="#FF0000"
                strokeWidth="1.5"
              />
              {/* CT result text */}
              <text
                x={textX}
                y={y + 4}
                className="text-[9px] font-semibold"
                fill="#FF0000"
                style={{ 
                  textShadow: '0 0 2px white, 0 0 2px white, 0 0 2px white',
                  fontFamily: 'monospace'
                }}
              >
                {ct.formattedResult}
              </text>
              {/* Small marker at exact position for precision */}
              <circle
                cx={axisX}
                cy={y}
                r="3"
                fill="#FF0000"
                stroke="white"
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* Legend - positioned on the left with IACS colors */}
        <g transform={`translate(5, ${marginTop})`}>
          <text
            x="0"
            y="-10"
            className="text-[9px] font-bold fill-foreground"
          >
            Tipo Grano (IACS)
          </text>
          {GRAIN_TYPES.map((grain, i) => (
            <g key={grain.value} transform={`translate(0, ${i * 20})`}>
              <rect
                x="0"
                y="0"
                width="14"
                height="14"
                fill={grain.color}
                opacity="0.85"
                stroke="hsl(var(--chart-axis))"
                strokeWidth="0.5"
              />
              <text
                x="18"
                y="11"
                className="text-[9px] fill-foreground"
              >
                {grain.label}
              </text>
            </g>
          ))}
          
          {/* CT Legend entry if there are CT samples */}
          {processedCTSamples.length > 0 && (
            <g transform={`translate(0, ${GRAIN_TYPES.length * 20 + 10})`}>
              <line
                x1="0"
                y1="7"
                x2="14"
                y2="7"
                stroke="#FF0000"
                strokeWidth="2"
                markerEnd="url(#ct-arrowhead)"
              />
              <text
                x="18"
                y="11"
                className="text-[9px] fill-foreground"
              >
                Test CT
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
