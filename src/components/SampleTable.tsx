import React, { useState } from 'react';
import { Trash2, ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import { SnowSample, GRAIN_TYPES, RESISTANCE_VALUES, HUMIDITY_VALUES } from '@/lib/db';

interface SampleTableProps {
  samples: SnowSample[];
  onDeleteSample?: (index: number) => void;
  onReorderSample?: (fromIndex: number, toIndex: number) => void;
}

export function SampleTable({ samples, onDeleteSample, onReorderSample }: SampleTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newPosition, setNewPosition] = useState<string>('');

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

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setNewPosition((index + 1).toString());
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewPosition('');
  };

  const handleConfirmReorder = (currentIndex: number) => {
    const newIndex = parseInt(newPosition) - 1;
    
    // Validate: must be different, within bounds, and a valid number
    if (
      isNaN(newIndex) || 
      newIndex < 0 || 
      newIndex >= samples.length || 
      newIndex === currentIndex
    ) {
      handleCancelEdit();
      return;
    }

    onReorderSample?.(currentIndex, newIndex);
    handleCancelEdit();
  };

  const handleMoveUp = (index: number) => {
    if (index > 0 && onReorderSample) {
      onReorderSample(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < samples.length - 1 && onReorderSample) {
      onReorderSample(index, index + 1);
    }
  };

  const canEdit = !!onReorderSample;

  return (
    <div className="nivo-card overflow-x-auto">
      <h3 className="nivo-section-title">Detalle de Muestras</h3>
      {canEdit && (
        <p className="text-xs text-muted-foreground mb-3">
          Haz clic en el número de muestra para cambiar su posición
        </p>
      )}
      <table className="nivo-table">
        <thead>
          <tr>
            <th>#</th>
            {canEdit && <th>Orden</th>}
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
              <td className="font-bold">
                {editingIndex === index ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={newPosition}
                      onChange={(e) => setNewPosition(e.target.value)}
                      className="w-12 px-1 py-0.5 text-center border rounded bg-background text-foreground"
                      min="1"
                      max={samples.length}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleConfirmReorder(index);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <button
                      onClick={() => handleConfirmReorder(index)}
                      className="p-1 text-primary hover:bg-primary/10 rounded"
                      title="Confirmar"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-destructive hover:bg-destructive/10 rounded"
                      title="Cancelar"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => canEdit && handleStartEdit(index)}
                    className={canEdit ? "hover:bg-primary/10 px-2 py-1 rounded cursor-pointer" : ""}
                    disabled={!canEdit}
                    title={canEdit ? "Clic para cambiar posición" : ""}
                  >
                    {index + 1}
                  </button>
                )}
              </td>
              {canEdit && (
                <td>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 hover:bg-primary/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Subir"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === samples.length - 1}
                      className="p-1 hover:bg-primary/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Bajar"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              )}
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
