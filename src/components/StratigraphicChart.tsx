import React, { useMemo } from 'react';
import { SnowSample, GRAIN_TYPES } from '@/lib/db';

interface StratigraphicChartProps {
  samples: SnowSample[];
  maxHeight?: number;
}

const CHART_CONFIG = {
  width: 600,
  height: 500,
  marginTop: 50,
  marginRight: 30,
  marginBottom: 50,
  marginLeft: 60,
  resistanceMax: 120,
  temperatureMin: -24,
  temperatureMax: 0,
  heightMax: 200, // Default max height in cm
};

export function StratigraphicChart({ samples, maxHeight }: StratigraphicChartProps) {
  const chartData = useMemo(() => {
    if (samples.length === 0) return null;

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
    const chartHeight = Math.max(totalHeight, maxHeight ?? CHART_CONFIG.heightMax);

    return {
      samples: processedSamples,
      totalHeight,
      chartHeight,
    };
  }, [samples, maxHeight]);

  if (!chartData) {
    return (
      <div className="nivo-chart-container flex items-center justify-center h-64">
        <p className="text-muted-foreground text-lg">
          No hay muestras para visualizar
        </p>
      </div>
    );
  }

  const { samples: processedSamples, chartHeight } = chartData;
  const { width, height, marginTop, marginRight, marginBottom, marginLeft } = CHART_CONFIG;
  
  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  // Scale functions
  const yScale = (h: number) => marginTop + innerHeight * (1 - h / chartHeight);
  const xScaleResistance = (r: number) => marginLeft + innerWidth * (r / CHART_CONFIG.resistanceMax);
  const xScaleTemperature = (t: number) => marginLeft + innerWidth * ((t - CHART_CONFIG.temperatureMin) / (CHART_CONFIG.temperatureMax - CHART_CONFIG.temperatureMin));

  // Generate grid lines
  const heightGridLines = Array.from({ length: Math.ceil(chartHeight / 20) + 1 }, (_, i) => i * 20);
  const resistanceGridLines = [0, 20, 40, 60, 80, 100, 120];
  const temperatureGridLines = [-24, -20, -16, -12, -8, -4, 0];

  // Temperature line path
  const temperaturePoints = processedSamples
    .filter(s => s.temperature !== null)
    .map(s => ({
      x: xScaleTemperature(s.temperature!),
      y: yScale(s.topHeight),
    }));

  const temperaturePath = temperaturePoints.length > 1
    ? `M ${temperaturePoints.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  // Get grain type color
  const getGrainColor = (grainType: number): string => {
    const colors: Record<number, string> = {
      1: 'hsl(200, 80%, 60%)',
      2: 'hsl(180, 70%, 50%)',
      3: 'hsl(150, 60%, 50%)',
      4: 'hsl(120, 50%, 50%)',
      5: 'hsl(80, 60%, 50%)',
      6: 'hsl(50, 70%, 50%)',
      7: 'hsl(30, 80%, 55%)',
      8: 'hsl(0, 70%, 55%)',
      9: 'hsl(280, 60%, 55%)',
    };
    return colors[grainType] || 'hsl(220, 75%, 45%)';
  };

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
          x={15}
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

        {/* Height axis (left) */}
        <line
          x1={marginLeft}
          y1={marginTop}
          x2={marginLeft}
          y2={marginTop + innerHeight}
          stroke="hsl(var(--chart-axis))"
          strokeWidth="2"
        />
        {heightGridLines.filter(h => h <= chartHeight).map(h => (
          <g key={`height-${h}`}>
            <text
              x={marginLeft - 10}
              y={yScale(h) + 4}
              textAnchor="end"
              className="text-[10px] fill-foreground"
            >
              {h}
            </text>
            <line
              x1={marginLeft - 5}
              y1={yScale(h)}
              x2={marginLeft}
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

        {/* Resistance bars (horizontal histogram stacked from base) */}
        {processedSamples.map((sample, index) => {
          const barWidth = (sample.resistance / CHART_CONFIG.resistanceMax) * innerWidth;
          const barY = yScale(sample.topHeight);
          const barHeight = yScale(sample.baseHeight) - yScale(sample.topHeight);
          const grainLabel = GRAIN_TYPES.find(g => g.value === sample.grainType)?.label ?? '';
          
          return (
            <g key={`sample-${index}`}>
              <rect
                x={marginLeft}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={getGrainColor(sample.grainType)}
                stroke="hsl(var(--chart-axis))"
                strokeWidth="1"
                opacity="0.8"
                className="animate-draw-bar"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
              {/* Grain type label */}
              {barHeight > 15 && (
                <text
                  x={marginLeft + 5}
                  y={barY + barHeight / 2 + 4}
                  className="text-[10px] font-bold fill-foreground"
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

        {/* Legend */}
        <g transform={`translate(${marginLeft + innerWidth + 5}, ${marginTop})`}>
          {GRAIN_TYPES.slice(0, 6).map((grain, i) => (
            <g key={grain.value} transform={`translate(0, ${i * 18})`}>
              <rect
                x="0"
                y="0"
                width="12"
                height="12"
                fill={getGrainColor(grain.value)}
                opacity="0.8"
              />
              <text
                x="16"
                y="10"
                className="text-[8px] fill-muted-foreground"
              >
                {grain.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
