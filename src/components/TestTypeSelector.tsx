import React from 'react';
import { Layers, Hammer } from 'lucide-react';
import { useI18n } from '@/i18n/context';

export type TestType = 'stratigraphic' | 'compression';

interface TestTypeSelectorProps {
  selectedType: TestType;
  onTypeChange: (type: TestType) => void;
}

export function TestTypeSelector({ selectedType, onTypeChange }: TestTypeSelectorProps) {
  const { t } = useI18n();
  const testType = t.testType;

  return (
    <div className="nivo-card">
      <h3 className="nivo-section-title mb-4">
        {testType?.selectTest || 'Seleccionar tipo de test'}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onTypeChange('stratigraphic')}
          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
            selectedType === 'stratigraphic'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <Layers className="w-8 h-8" />
          <div className="text-center">
            <p className="font-bold text-sm">
              {testType?.stratigraphicProfile || 'Perfil Estratigráfico'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {testType?.stratigraphicProfileDesc || 'Análisis completo de las capas de nieve'}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onTypeChange('compression')}
          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
            selectedType === 'compression'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <Hammer className="w-8 h-8" />
          <div className="text-center">
            <p className="font-bold text-sm">
              {testType?.compressionTest || 'Test de Compresión (CT)'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {testType?.compressionTestDesc || 'Test de estabilidad por compresión'}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
