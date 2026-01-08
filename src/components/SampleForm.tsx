import React, { useState } from 'react';
import { Plus, Check, Thermometer, Ruler, Droplets, Snowflake, Minus } from 'lucide-react';
import { SnowSample, RESISTANCE_VALUES, GRAIN_TYPES, HUMIDITY_VALUES } from '@/lib/db';
import { useI18n } from '@/i18n/context';

interface SampleFormProps {
  sampleNumber: number;
  onAddSample: (sample: Omit<SnowSample, 'id'>) => void;
  onFinishProfile: () => void;
  totalHeight: number;
}

export function SampleForm({
  sampleNumber,
  onAddSample,
  onFinishProfile,
  totalHeight,
}: SampleFormProps) {
  const { t } = useI18n();
  const [height, setHeight] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [resistance, setResistance] = useState<number | null>(null);
  const [grainType, setGrainType] = useState<number | null>(null);
  const [diameter, setDiameter] = useState<string>('');
  const [humidity, setHumidity] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!height || resistance === null || grainType === null) {
      return;
    }

    const sample: Omit<SnowSample, 'id'> = {
      height: parseFloat(height),
      temperature: temperature ? parseFloat(temperature) : null,
      resistance,
      grainType,
      diameter: diameter ? parseFloat(diameter) : null,
      humidity: humidity || null,
    };

    onAddSample(sample);
    
    // Reset form except resistance (often similar between layers)
    setHeight('');
    setTemperature('');
    setDiameter('');
    setHumidity('');
    // Keep grainType and resistance as they often repeat
  };

  const isFormValid = height && parseFloat(height) > 0 && resistance !== null && grainType !== null;

  return (
    <div className="nivo-card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="nivo-section-title mb-0 pb-0 border-0">
          {t.samples.sampleNumber.replace('{number}', String(sampleNumber))}
        </h2>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold">
          {t.samples.accumulatedHeight}: {totalHeight} cm
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Height - Required */}
        <div>
          <label className="nivo-field-label flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            {t.samples.layerHeight} *
          </label>
          <input
            type="number"
            className="nivo-input"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Ej: 10"
            min="0.1"
            step="0.1"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t.samples.layerHeightHint}
          </p>
        </div>

        {/* Temperature - Optional with stepper buttons */}
        <div>
          <label className="nivo-field-label flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            {t.samples.temperature}
          </label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => {
                const current = temperature ? parseFloat(temperature) : 0.0;
                setTemperature((current - 0.1).toFixed(1));
              }}
              className="nivo-stepper-btn rounded-l-lg border-r-0"
              aria-label="Decrementar temperatura"
            >
              <Minus className="w-5 h-5" />
            </button>
            <input
              type="number"
              className="nivo-input rounded-none border-x-0 text-center flex-1"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="0.0"
              step="0.1"
              max="0"
            />
            <button
              type="button"
              onClick={() => {
                const current = temperature ? parseFloat(temperature) : 0.0;
                setTemperature((current + 0.1).toFixed(1));
              }}
              className="nivo-stepper-btn rounded-r-lg border-l-0"
              aria-label="Incrementar temperatura"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resistance - Required with quick buttons */}
        <div>
          <label className="nivo-field-label">
            {t.samples.hardness} *
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
            {RESISTANCE_VALUES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setResistance(r.value)}
                className={`nivo-quick-btn ${resistance === r.value ? 'active' : ''}`}
                title={r.description}
              >
                {r.label}
              </button>
            ))}
          </div>
          <input
            type="number"
            className="nivo-input"
            value={resistance ?? ''}
            onChange={(e) => setResistance(e.target.value ? parseInt(e.target.value) : null)}
            placeholder="0-120"
            min="0"
            max="120"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t.samples.hardnessHint}
          </p>
        </div>

        {/* Grain Type - Required */}
        <div>
          <label className="nivo-field-label flex items-center gap-2">
            <Snowflake className="w-4 h-4" />
            {t.samples.grainType} *
          </label>
          <select
            className="nivo-select"
            value={grainType ?? ''}
            onChange={(e) => setGrainType(e.target.value ? parseInt(e.target.value) : null)}
            required
          >
            <option value="">{t.samples.grainTypeSelect}</option>
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
            {t.samples.grainSize}
          </label>
          <input
            type="number"
            className="nivo-input"
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
            placeholder="Ej: 1.5"
            min="0.1"
            step="0.1"
          />
        </div>

        {/* Humidity - Optional */}
        <div>
          <label className="nivo-field-label flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            {t.samples.humidity}
          </label>
          <div className="grid grid-cols-5 gap-2">
            {HUMIDITY_VALUES.map((h) => (
              <button
                key={h.value}
                type="button"
                onClick={() => setHumidity(humidity === h.value ? '' : h.value)}
                className={`nivo-quick-btn ${humidity === h.value ? 'active' : ''}`}
                title={h.description}
              >
                {h.value}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t.samples.humidityHint}
          </p>
        </div>

        {/* Action buttons */}
        <div className="grid gap-4 sm:grid-cols-2 pt-4">
          <button
            type="submit"
            disabled={!isFormValid}
            className="nivo-btn-success"
          >
            <Plus className="w-5 h-5" />
            {t.samples.nextSample}
          </button>
          <button
            type="button"
            onClick={onFinishProfile}
            className="nivo-btn-primary"
            disabled={sampleNumber === 1}
          >
            <Check className="w-5 h-5" />
            {t.samples.finishProfile}
          </button>
        </div>
      </form>
    </div>
  );
}
