import React, { useState } from 'react';
import { Plus, Thermometer, Ruler, Droplets, Snowflake, Minus, Circle } from 'lucide-react';
import { SnowSample, RESISTANCE_VALUES, GRAIN_TYPES, HUMIDITY_VALUES } from '@/lib/db';
import { useI18n } from '@/i18n/context';

interface SampleFormProps {
  sampleNumber: number;
  onAddSample: (sample: Omit<SnowSample, 'id'>) => void;
  totalHeight: number;
}

export function SampleForm({
  sampleNumber,
  onAddSample,
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
        {/* Height - Required with stepper buttons (range 1-200) */}
        <div>
          <label className="nivo-field-label flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            {t.samples.layerHeight} *
          </label>
          <div className="flex items-stretch">
            <button
              type="button"
              onClick={() => {
                const current = height ? parseFloat(height) : 1;
                if (current > 1) {
                  setHeight(String(current - 1));
                }
              }}
              disabled={!height || parseFloat(height) <= 1}
              className="nivo-stepper-btn rounded-l-lg border-r-0 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrementar altura"
            >
              <Minus className="w-5 h-5" />
            </button>
            <input
              type="number"
              className="nivo-input rounded-none border-x-0 text-center flex-1 min-w-0"
              value={height}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setHeight(value);
                } else {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue)) {
                    if (numValue < 1) {
                      setHeight('1');
                    } else if (numValue > 200) {
                      setHeight('200');
                    } else {
                      setHeight(value);
                    }
                  }
                }
              }}
              onBlur={() => {
                if (height) {
                  const numValue = parseFloat(height);
                  if (!isNaN(numValue)) {
                    if (numValue < 1) {
                      setHeight('1');
                    } else if (numValue > 200) {
                      setHeight('200');
                    }
                  }
                }
              }}
              placeholder="Ej: 10"
              min="1"
              max="200"
              step="1"
              required
            />
            <button
              type="button"
              onClick={() => {
                const current = height ? parseFloat(height) : 0;
                if (current < 200) {
                  setHeight(String(current + 1));
                }
              }}
              disabled={height !== '' && parseFloat(height) >= 200}
              className="nivo-stepper-btn rounded-r-lg border-l-0 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Incrementar altura"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t.samples.layerHeightHint}
          </p>
        </div>

        {/* Temperature - Optional with stepper buttons (max 0°C) */}
        <div>
          <label className="nivo-field-label flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            {t.samples.temperature}
          </label>
          <div className="flex items-stretch">
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
              className="nivo-input rounded-none border-x-0 text-center flex-1 min-w-0"
              value={temperature}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || value === '-') {
                  setTemperature(value);
                } else {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue)) {
                    if (numValue > 0) {
                      setTemperature('0.0');
                    } else {
                      setTemperature(value);
                    }
                  }
                }
              }}
              onBlur={() => {
                if (temperature && temperature !== '-') {
                  const numValue = parseFloat(temperature);
                  if (!isNaN(numValue) && numValue > 0) {
                    setTemperature('0.0');
                  }
                }
              }}
              placeholder="0.0"
              step="0.1"
              max="0"
            />
            <button
              type="button"
              onClick={() => {
                const current = temperature ? parseFloat(temperature) : 0.0;
                const newValue = current + 0.1;
                if (newValue <= 0) {
                  setTemperature(newValue.toFixed(1));
                }
              }}
              disabled={temperature === '' || temperature === '0.0' || temperature === '0' || (temperature !== '' && parseFloat(temperature) >= 0)}
              className="nivo-stepper-btn rounded-r-lg border-l-0 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Incrementar temperatura"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {temperature && parseFloat(temperature) > 0 && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {t.samples.temperatureError || 'La temperatura de la nieve no puede superar los 0°C'}
            </p>
          )}
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
                {g.name} ({g.label})
              </option>
            ))}
          </select>
        </div>

        {/* Diameter - Optional with stepper buttons */}
        <div>
          <label className="nivo-field-label flex items-center gap-2">
            <Circle className="w-4 h-4" />
            {t.samples.grainSize}
          </label>
          <div className="flex items-stretch">
            <button
              type="button"
              onClick={() => {
                const current = diameter ? parseFloat(diameter) : 0.1;
                if (current > 0.1) {
                  setDiameter((current - 0.1).toFixed(1));
                }
              }}
              disabled={!diameter || parseFloat(diameter) <= 0.1}
              className="nivo-stepper-btn rounded-l-lg border-r-0 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrementar diámetro"
            >
              <Minus className="w-5 h-5" />
            </button>
            <input
              type="number"
              className="nivo-input rounded-none border-x-0 text-center flex-1 min-w-0"
              value={diameter}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setDiameter(value);
                } else {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue) && numValue >= 0) {
                    setDiameter(value);
                  }
                }
              }}
              placeholder="Ej: 1.5"
              min="0.1"
              step="0.1"
            />
            <button
              type="button"
              onClick={() => {
                const current = diameter ? parseFloat(diameter) : 0;
                setDiameter((current + 0.1).toFixed(1));
              }}
              className="nivo-stepper-btn rounded-r-lg border-l-0"
              aria-label="Incrementar diámetro"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
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

        {/* Action button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!isFormValid}
            className="nivo-btn-success w-full"
          >
            <Plus className="w-5 h-5" />
            {t.samples.nextSample}
          </button>
        </div>
      </form>
    </div>
  );
}
