import React from 'react';
import { Trash2 } from 'lucide-react';
import { CTSample, formatCTResult, getCTScoreLabel } from '@/lib/ctTypes';
import { GRAIN_TYPES } from '@/lib/db';
import { useI18n } from '@/i18n/context';

interface CTSampleTableProps {
  samples: CTSample[];
  onDeleteSample?: (index: number) => void;
}

export function CTSampleTable({ samples, onDeleteSample }: CTSampleTableProps) {
  const { t } = useI18n();
  const ctTable = t.ctTable;

  if (samples.length === 0) {
    return (
      <div className="nivo-card text-center py-8">
        <p className="text-muted-foreground">
          {ctTable?.noSamples || 'No hay muestras CT registradas'}
        </p>
      </div>
    );
  }

  const getGrainLabel = (value: number) => 
    GRAIN_TYPES.find(g => g.value === value)?.label ?? value.toString();

  return (
    <div className="nivo-card overflow-x-auto">
      <h3 className="nivo-section-title">{ctTable?.sampleDetails || 'Detalle de Muestras CT'}</h3>
      <table className="nivo-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{ctTable?.result || 'Resultado'}</th>
            <th>{ctTable?.taps || 'Golpes'}</th>
            <th>{ctTable?.depth || 'Prof (cm)'}</th>
            <th>{ctTable?.quality || 'Calidad'}</th>
            <th>{ctTable?.grain || 'Grano'}</th>
            <th>{ctTable?.size || 'Ø (mm)'}</th>
            <th>{ctTable?.info || 'Info'}</th>
            {onDeleteSample && <th></th>}
          </tr>
        </thead>
        <tbody>
          {samples.map((sample, index) => {
            const grainLabel = getGrainLabel(sample.grainType);
            const formattedResult = formatCTResult(sample, grainLabel);
            
            return (
              <tr key={index}>
                <td className="font-bold">{index + 1}</td>
                <td className="font-mono text-sm bg-muted/50 rounded px-2">
                  {formattedResult}
                </td>
                <td>
                  <span className="inline-flex items-center gap-1">
                    <span className="font-bold">{sample.taps}</span>
                    <span className="text-xs text-muted-foreground">
                      ({getCTScoreLabel(sample.taps).split(' ')[0]})
                    </span>
                  </span>
                </td>
                <td>{sample.depth}</td>
                <td className="font-bold">{sample.fractureQuality}</td>
                <td>
                  <span className="inline-flex items-center gap-1">
                    <span className="font-bold">{grainLabel}</span>
                    <span className="text-xs text-muted-foreground">({sample.grainType})</span>
                  </span>
                </td>
                <td>{sample.diameter ?? '-'}</td>
                <td className="max-w-[150px] truncate" title={sample.additionalInfo || ''}>
                  {sample.additionalInfo || '-'}
                </td>
                {onDeleteSample && (
                  <td>
                    <button
                      onClick={() => onDeleteSample(index)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title={t.table?.delete || 'Eliminar'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
