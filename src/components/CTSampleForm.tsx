import React, { useState } from 'react';
import { Plus, Ruler, Snowflake, Minus, Info } from 'lucide-react';
import { CTSample, FRACTURE_QUALITY_OPTIONS } from '@/lib/ctTypes';
import { GRAIN_TYPES } from '@/lib/db';
import { useI18n } from '@/i18n/context';

interface CTSampleFormProps {
  sampleNumber: number;
  onAddSample: (sample: Omit<CTSample, 'id'>) => void;
}

export function CTSampleForm({
  sampleNumber,
  onAddSample,
}: CTSampleFormProps) {
  const { t } = useI18n();
  const ct = t.compressionTest;
  
  const [taps, setTaps] = useState<string>('');
  const [depth, setDepth] = useState<string>('');
  const [fractureQuality, setFractureQuality] = useState<'Q1' | 'Q2' | 'Q3' | null>(null);
  const [grainType, setGrainType] = useState<number | null>(null);
  const [diameter, setDiameter] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (taps === '' || !depth || fractureQuality === null || grainType === null) {
      return;
    }

    const sample: Omit<CTSample, 'id'> = {
      taps: parseInt(taps),
      depth: parseFloat(depth),
      fractureQuality,
      grainType,
      diameter: diameter ? parseFloat(diameter) : null,
      additionalInfo: additionalInfo || null,
    };

    onAddSample(sample);
    
    // Reset form
    setTaps('');
    setDepth('');
    setDiameter('');
    setAdditionalInfo('');
    // Keep fractureQuality and grainType as they often repeat
  };

  const isFormValid = taps !== '' && depth && parseFloat(depth) > 0 && fractureQuality !== null && grainType !== null;

  return (
    <div className="nivo-card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="nivo-section-title mb-0 pb-0 border-0">
          {ct?.sampleNumber?.replace('{number}', String(sampleNumber)) || `Muestra CT #${sampleNumber}`}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Number of Taps - Required with stepper buttons (range 0-31) */}
        <div>
          <label className="nivo-field-label flex items-center gap-2">
            {ct?.tapNumber || 'Número de Golpes'} *
          </label>
          <div className="flex items-stretch">
            <button
              type="button"
              onClick={() => {
                const current = taps !== '' ? parseInt(taps) : 0;
                if (current > 0) {
                  setTaps(String(current - 1));
                }
              }}
              disabled={taps === '' || parseInt(taps) <= 0}
              className="nivo-stepper-btn rounded-l-lg border-r-0 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrementar golpes"
            >
              <Minus className="w-5 h-5" />
            </button>
            <input
              type="number"
              className="nivo-input rounded-none border-x-0 text-center flex-1 min-w-0"
              value={taps}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setTaps(value);
                } else {
                  const numValue = parseInt(value);
                  if (!isNaN(numValue)) {
                    if (numValue < 0) {
                      setTaps('0');
                    } else if (numValue > 31) {
                      setTaps('31');
                    } else {
                      setTaps(value);
                    }
                  }
                }
              }}
              onBlur={() => {
                if (taps !== '') {
                  const numValue = parseInt(taps);
                  if (!isNaN(numValue)) {
                    if (numValue < 0) {
                      setTaps('0');
                    } else if (numValue > 31) {
                      setTaps('31');
                    }
                  }
                }
              }}
              placeholder="0-31"
              min="0"
              max="31"
              step="1"
              required
            />
            <button
              type="button"
              onClick={() => {
                const current = taps !== '' ? parseInt(taps) : -1;
                if (current < 31) {
                  setTaps(String(current + 1));
                }
              }}
              disabled={taps !== '' && parseInt(taps) >= 31}
              className="nivo-stepper-btn rounded-r-lg border-l-0 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Incrementar golpes"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {ct?.tapNumberHint || 'De 0 a 31 golpes (0=V, 1-10=E, 11-20=M, 21-30=H, 31=N)'}
          </p>
        </div>

        {/* Layer Depth - Required with stepper buttons */}
        <div>
          <label className="nivo-field-label flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            {ct?.layerDepth || 'Profundidad de la capa (cm)'} *
          </label>
          <div className="flex items-stretch">
            <button
              type="button"
              onClick={() => {
                const current = depth ? parseFloat(depth) : 1;
                if (current > 1) {
                  setDepth(String(current - 1));
                }
              }}
              disabled={!depth || parseFloat(depth) <= 1}
              className="nivo-stepper-btn rounded-l-lg border-r-0 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrementar profundidad"
            >
              <Minus className="w-5 h-5" />
            </button>
            <input
              type="number"
              className="nivo-input rounded-none border-x-0 text-center flex-1 min-w-0"
              value={depth}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setDepth(value);
                } else {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue) && numValue >= 0) {
                    setDepth(value);
                  }
                }
              }}
              placeholder="Ej: 54"
              min="1"
              step="1"
              required
            />
            <button
              type="button"
              onClick={() => {
                const current = depth ? parseFloat(depth) : 0;
                setDepth(String(current + 1));
              }}
              className="nivo-stepper-btn rounded-r-lg border-l-0"
              aria-label="Incrementar profundidad"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {ct?.layerDepthHint || 'Profundidad donde se produce la fractura'}
          </p>
        </div>

        {/* Fracture Quality - Required with quick buttons */}
        <div>
          <label className="nivo-field-label">
            {ct?.fractureQuality || 'Calidad de la Fractura'} *
          </label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {FRACTURE_QUALITY_OPTIONS.map((q) => (
              <button
                key={q.value}
                type="button"
                onClick={() => setFractureQuality(q.value)}
                className={`nivo-quick-btn ${fractureQuality === q.value ? 'active' : ''}`}
                title={q.description}
              >
                {q.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {ct?.fractureQualityHint || 'Q1=Limpia, Q2=Parcial, Q3=Irregular'}
          </p>
        </div>

        {/* Grain Type - Required */}
        <div>
          <label className="nivo-field-label flex items-center gap-2">
            <Snowflake className="w-4 h-4" />
            {ct?.grainType || 'Tipo de Grano'} *
          </label>
          <select
            className="nivo-select"
            value={grainType ?? ''}
            onChange={(e) => setGrainType(e.target.value ? parseInt(e.target.value) : null)}
            required
          >
            <option value="">{ct?.grainTypeSelect || 'Seleccionar tipo...'}</option>
            {GRAIN_TYPES.map((g) => (
              <option key={g.value} value={g.value}>
                {g.value} - {g.label}: {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Diameter - Optional */}
        <div>
          <label className="nivo-field-label">
            {ct?.grainDiameter || 'Diámetro del grano (mm)'}
          </label>
          <input
            type="number"
            className="nivo-input"
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
            placeholder="Ej: 3"
            min="0.1"
            step="0.1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {ct?.grainDiameterHint || 'Tamaño medio del grano'}
          </p>
        </div>

        {/* Additional Info - Optional */}
        <div>
          <label className="nivo-field-label flex items-center gap-2">
            <Info className="w-4 h-4" />
            {ct?.additionalInfo || 'Información Adicional'}
          </label>
          <input
            type="text"
            className="nivo-input"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder={ct?.additionalInfoPlaceholder || 'Ej: Pendiente grande, capa de escarcha...'}
          />
        </div>

        {/* Action button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!isFormValid}
            className="nivo-btn-success w-full"
          >
            <Plus className="w-5 h-5" />
            {ct?.nextSample || 'Siguiente Muestra'}
          </button>
        </div>
      </form>
    </div>
  );
}
