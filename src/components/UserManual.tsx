import React from 'react';
import { X, BookOpen, Layers, TestTube2, BarChart3, Download, FolderOpen, Upload, Globe, Save, AlertTriangle, FileText } from 'lucide-react';
import { useI18n } from '@/i18n/context';

interface UserManualProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-3 text-primary border-b-2 border-primary pb-2">
        <Icon className="w-5 h-5 flex-shrink-0" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function InfoCard({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'warning' | 'note' }) {
  const base = 'rounded-lg p-4 text-sm';
  const styles = {
    default: `${base} bg-muted text-muted-foreground`,
    warning: `${base} bg-destructive/10 border border-destructive/20 text-foreground font-medium`,
    note: `${base} bg-primary/5 border border-primary/20 text-muted-foreground`,
  };
  return <div className={styles[variant]}>{children}</div>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 pl-4">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-muted-foreground flex gap-2">
          <span className="text-primary font-bold mt-0.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-1.5 pl-4">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-muted-foreground flex gap-2">
          <span className="text-primary font-bold min-w-[20px]">{i + 1}.</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-semibold text-xs uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-muted-foreground">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UserManual({ open, onOpenChange }: UserManualProps) {
  const { t } = useI18n();
  const m = t.userManual;

  if (!open || !m) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      {/* Sticky close button */}
      <div className="sticky top-0 z-10 flex justify-end p-3 pointer-events-none">
        <button
          onClick={() => onOpenChange(false)}
          className="pointer-events-auto p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
          aria-label={m.close}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-12 -mt-6 space-y-10">
        {/* Title */}
        <header className="text-center space-y-2 pt-4">
          <div className="flex items-center justify-center gap-3">
            <img src="/pwa-512x512.png" alt="SnowStrat Field" className="w-12 h-12 rounded-xl" />
            <h1 className="text-3xl font-bold text-foreground">{m.title}</h1>
          </div>
          <p className="text-sm text-muted-foreground italic">SnowStrat Field — Documentación funcional</p>
        </header>

        {/* 1. General Description */}
        <Section icon={BookOpen} title={`1. ${m.generalDescription}`}>
          <InfoCard>{m.generalDescriptionText}</InfoCard>
          <SubSection title={t.app.title}>
            <BulletList items={m.appFeatures} />
          </SubSection>
        </Section>

        {/* 2. Main Screen */}
        <Section icon={Layers} title={`2. ${m.mainScreen}`}>
          <p className="text-sm text-muted-foreground">{m.mainScreenDesc}</p>
          <SubSection title={m.topBar}>
            <BulletList items={m.topBarItems} />
          </SubSection>
          <SubSection title={m.profileCard}>
            <InfoCard>{m.profileCardDesc}</InfoCard>
          </SubSection>
        </Section>

        {/* 3. Language Selection */}
        <Section icon={Globe} title={`3. ${m.languageSelection}`}>
          <InfoCard>{m.languageSelectionDesc}</InfoCard>
          <SubSection title={m.languageHowTo}>
            <NumberedList items={m.languageSteps} />
          </SubSection>
        </Section>

        {/* 4. Stratigraphic Profile Workflow */}
        <Section icon={Layers} title={`4. ${m.workflowStratigraphic}`}>

          <img src="/guiatecnica_perfil.png" alt="SnowStrat Field - Guia técnica de perfil" className="w-800 h-600 rounded-lg" />

          {/* 4.1 Header Data */}
          <SubSection title={`4.1 ${m.headerData}`}>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">{m.mandatoryFields}:</p>
              <BulletList items={[m.fieldProfileName, m.fieldObserver]} />
              <p className="text-sm font-semibold text-foreground">{m.optionalFields}:</p>
              <BulletList items={[m.fieldAirTemp, `${m.fieldOrientation} ${m.fieldOrientationOptions}`, m.fieldObservations]} />
              <p className="text-sm font-semibold text-foreground">{m.autoInfo}:</p>
              <BulletList items={[m.fieldCoordinates, m.fieldAltitude, m.fieldTimeUTC]} />
            </div>
          </SubSection>

          {/* GPS Indicator */}
          <SubSection title={m.gpsIndicator}>
            <BulletList items={[m.gpsSearchingDesc, m.gpsActiveDesc, m.gpsFixedDesc, m.gpsErrorDesc]} />
          </SubSection>

          {/* 4.2 Start Sampling */}
          <SubSection title={`4.2 ${m.startSampling}`}>
            <NumberedList items={m.startSamplingSteps} />
            <InfoCard variant="note">{m.startSamplingNote}</InfoCard>
          </SubSection>

          {/* 4.3 Test Type Selection */}
          <SubSection title={`4.3 ${m.testTypeSelection}`}>
            <p className="text-sm text-muted-foreground">{m.testTypeSelectionDesc}</p>
            <BulletList items={[m.testTypeStratigraphicDesc, m.testTypeCompressionDesc]} />
            <InfoCard variant="note">{m.testTypeNote}</InfoCard>
          </SubSection>

          {/* 4.4 Sample Registration */}
          <SubSection title={`4.4 ${m.sampleRegistration}`}>
            <p className="text-sm text-muted-foreground mb-3">{m.sampleRegistrationDesc}</p>
            <BulletList items={[m.sampleFieldHeight, m.sampleFieldTemp, m.sampleFieldHardness, m.sampleFieldGrain, m.sampleFieldDiameter, m.sampleFieldHumidity]} />
          </SubSection>

          {/* Hardness Scale */}
          <SubSection title={m.hardnessScale}>
            <DataTable
              headers={['Código', 'Valor', 'Descripción']}
              rows={[
                ['F', '2', m.hardnessF],
                ['4F', '10', m.hardness4F],
                ['1F', '25', m.hardness1F],
                ['P', '50', m.hardnessP],
                ['K', '100', m.hardnessK],
                ['I', '120', m.hardnessI],
              ]}
            />
          </SubSection>

          {/* Grain Types */}
          <SubSection title={m.grainTypesTitle}>
            <DataTable
              headers={['Código', 'Descripción']}
              rows={[
                ['PP (+)', m.grainPP],
                ['PPgp (⛇)', m.grainPPgp],
                ['DF (/)', m.grainDF],
                ['RG (•)', m.grainRG],
                ['FC (□)', m.grainFC],
                ['DH (∧)', m.grainDH],
                ['MF (○)', m.grainMF],
                ['MFcr (⚭)', m.grainMFcr],
                ['IF (▮)', m.grainIF],
                ['SH (v)', m.grainSH],
              ]}
            />
          </SubSection>

          {/* Registration Process */}
          <SubSection title={m.registrationProcess}>
            <NumberedList items={m.registrationSteps} />
            <InfoCard variant="note">{m.registrationNote}</InfoCard>
          </SubSection>

          {/* 4.5 Sample Table */}
          <SubSection title={`4.5 ${m.sampleTable}`}>
            <p className="text-sm text-muted-foreground mb-2">{m.sampleTableDesc}</p>
            <BulletList items={m.sampleTableColumns} />
            <div className="mt-3 space-y-2">
              <p className="text-sm font-semibold text-foreground">{m.reorderSamples}:</p>
              <InfoCard>{m.reorderSamplesDesc}</InfoCard>
              <p className="text-sm font-semibold text-foreground">{m.deleteSamples}:</p>
              <InfoCard>{m.deleteSamplesDesc}</InfoCard>
            </div>
          </SubSection>

          {/* 4.6 Finish Sampling */}
          <SubSection title={`4.6 ${m.finishSampling}`}>
            <NumberedList items={m.finishSamplingSteps} />
          </SubSection>
        </Section>

        {/* 5. CT Workflow */}
        <Section icon={TestTube2} title={`5. ${m.workflowCT}`}>
          <InfoCard>{m.ctDescription}</InfoCard>

          <img src="/guiatecnica_testcompresion.png" alt="SnowStrat Field - Guia técnica Test de Compresión" className="w-800 h-600 rounded-lg" />

          <SubSection title={`5.1 ${m.ctSampleRegistration}`}>
            <BulletList items={[m.ctFieldTaps, m.ctFieldVerticalRef, m.ctFieldDepth, m.ctFieldFractureQuality, m.ctFieldGrain, m.ctFieldDiameter, m.ctFieldAdditionalInfo]} />
          </SubSection>

          <SubSection title={m.ctScoreScale}>
            <DataTable
              headers={['Puntuación', 'Golpes', 'Descripción']}
              rows={[
                ['V', '0', m.ctScoreV],
                ['E', '1–10', m.ctScoreE],
                ['M', '11–20', m.ctScoreM],
                ['H', '21–30', m.ctScoreH],
                ['N', '31', m.ctScoreN],
              ]}
            />
          </SubSection>

          <SubSection title={m.ctVerticalRef}>
            <BulletList items={[m.ctVerticalRefSurface, m.ctVerticalRefGround]} />
          </SubSection>

          <SubSection title={m.ctFractureQuality}>
            <DataTable
              headers={['Código', 'Descripción']}
              rows={[
                ['Q1', m.ctFractureQ1],
                ['Q2', m.ctFractureQ2],
                ['Q3', m.ctFractureQ3],
              ]}
            />
          </SubSection>

          <SubSection title={m.ctRegistrationProcess}>
            <NumberedList items={m.ctRegistrationSteps} />
          </SubSection>

          <SubSection title={m.ctResultFormat}>
            <InfoCard>
              <code className="text-xs font-mono block mb-2">{m.ctResultFormatDesc}</code>
              <p className="font-semibold text-sm mb-1">{m.ctResultExample}</p>
              <BulletList items={m.ctResultExampleDesc} />
            </InfoCard>
          </SubSection>

          <SubSection title={`5.2 ${m.ctResultsTable}`}>
            <p className="text-sm text-muted-foreground mb-2">{m.ctResultsTableDesc}</p>
            <BulletList items={m.ctResultsTableColumns} />
          </SubSection>
        </Section>

        {/* 6. Combined Sampling */}
        <Section icon={Layers} title={`6. ${m.combinedSampling}`}>
          <p className="text-sm text-muted-foreground">{m.combinedSamplingDesc}</p>
          <NumberedList items={m.combinedSamplingSteps} />
        </Section>

        {/* 7. Results Screen */}
        <Section icon={BarChart3} title={`7. ${m.resultsScreen}`}>
          <p className="text-sm text-muted-foreground">{m.resultsScreenDesc}</p>

          <SubSection title={`7.1 ${m.stratigraphicChart}`}>
            <BulletList items={m.chartFeatures} />
          </SubSection>

          <SubSection title={`7.2 ${m.dataTables}`}>
            <BulletList items={m.dataTablesDesc} />
          </SubSection>
        </Section>

        {/* 8. GeoJSON Export */}
        <Section icon={Download} title={`8. ${m.geojsonExport}`}>
          <SubSection title={m.geojsonHowTo}>
            <NumberedList items={m.geojsonExportSteps} />
          </SubSection>
          <SubSection title={m.geojsonContent}>
            <BulletList items={m.geojsonContentItems} />
          </SubSection>
          <InfoCard variant="note">{m.geojsonNote}</InfoCard>
        </Section>

        {/* 9. Share Profile */}
        <Section icon={FileText} title={`9. ${m.shareProfile}`}>
          <InfoCard variant="warning">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{m.shareProfileDesc}</span>
            </div>
          </InfoCard>
        </Section>

        {/* 10. Profile Management */}
        <Section icon={FolderOpen} title={`10. ${m.profileManagement}`}>
          <InfoCard>{m.profileManagementDesc}</InfoCard>

          <SubSection title={`10.1 ${m.exploreProfiles}`}>
            <NumberedList items={m.exploreProfilesSteps} />
            <p className="text-sm font-semibold text-foreground mt-2">Cada perfil muestra:</p>
            <BulletList items={m.exploreProfilesInfo} />
          </SubSection>

          <SubSection title={`10.2 ${m.loadProfile}`}>
            <NumberedList items={m.loadProfileSteps} />
          </SubSection>

          <SubSection title={`10.3 ${m.deleteProfile}`}>
            <NumberedList items={m.deleteProfileSteps} />
            <InfoCard variant="warning">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{m.deleteProfileWarning}</span>
              </div>
            </InfoCard>
          </SubSection>
        </Section>

        {/* 11. Import */}
        <Section icon={Upload} title={`11. ${m.importProfiles}`}>
          <SubSection title={m.importHowTo}>
            <NumberedList items={m.importSteps} />
          </SubSection>
          <SubSection title="Formatos aceptados">
            <BulletList items={m.importFormats} />
          </SubSection>
        </Section>

        {/* 12. Autosave */}
        <Section icon={Save} title={`12. ${m.autosave}`}>
          <p className="text-sm text-muted-foreground">{m.autosaveDesc}</p>
          <BulletList items={m.autosaveFeatures} />
          <InfoCard variant="note">{m.autosaveNote}</InfoCard>
        </Section>

        {/* 13. Documentation & Resources */}
        <Section icon={BookOpen} title={`13. ${m.documentationResources}`}>
          <p className="text-sm text-muted-foreground">{m.documentationResourcesDesc}</p>
          <BulletList items={m.documentationContent} />
        </Section>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pt-6 border-t border-border">
          <p className="italic">SnowStrat Field — Documentación funcional v1.0</p>
        </footer>
      </div>
    </div>
  );
}