import React from 'react';
import { Trash2 } from 'lucide-react';
import { SnowSample, GRAIN_TYPES, RESISTANCE_VALUES, HUMIDITY_VALUES } from '@/lib/db';

interface SampleTableProps {
  samples: SnowSample[];
  onDeleteSample?: (index: number) => void;
}

export function SampleTable({ samples, onDeleteSample }: SampleTableProps) {
  if (samples.length === 0) {
    return (
      <div className="nivo-card text-center py-8">
        <p className="text-muted-foreground">
          No hay muestras registradas
        </p>
      </div>
    );
  }

  // Calculate accumulated heights
  let accumulatedHeight = 0;
  const samplesWithAccum = samples.map(sample => {
    accumulatedHeight += sample.height;
    return { ...sample, accumulatedHeight };
  });

  const getGrainLabel = (value: number) => 
    GRAIN_TYPES.find(g => g.value === value)?.label ?? value.toString();

  const getResistanceLabel = (value: number) =>
    RESISTANCE_VALUES.find(r => r.value === value)?.label ?? value.toString();

  const getHumidityLabel = (value: string | null) =>
    value ? HUMIDITY_VALUES.find(h => h.value === value)?.label ?? value : '-';

  return (
    <div className="nivo-card overflow-x-auto">
      <h3 className="nivo-section-title">Detalle de Muestras</h3>
      <table className="nivo-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Altura (cm)</th>
            <th>Acum (cm)</th>
            <th>T (°C)</th>
            <th>R</th>
            <th>Grano</th>
            <th>Ø (mm)</th>
            <th>H</th>
            {onDeleteSample && <th></th>}
          </tr>
        </thead>
        <tbody>
          {samplesWithAccum.map((sample, index) => (
            <tr key={index}>
              <td className="font-bold">{index + 1}</td>
              <td>{sample.height}</td>
              <td className="font-medium text-primary">{sample.accumulatedHeight}</td>
              <td>{sample.temperature ?? '-'}</td>
              <td>
                <span className="inline-flex items-center gap-1">
                  <span className="font-bold">{getResistanceLabel(sample.resistance)}</span>
                  <span className="text-xs text-muted-foreground">({sample.resistance})</span>
                </span>
              </td>
              <td>
                <span className="inline-flex items-center gap-1">
                  <span className="font-bold">{getGrainLabel(sample.grainType)}</span>
                  <span className="text-xs text-muted-foreground">({sample.grainType})</span>
                </span>
              </td>
              <td>{sample.diameter ?? '-'}</td>
              <td>{getHumidityLabel(sample.humidity)}</td>
              {onDeleteSample && (
                <td>
                  <button
                    onClick={() => onDeleteSample(index)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Eliminar muestra"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
