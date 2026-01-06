import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, BookOpen, AlertTriangle, Heart, GraduationCap } from 'lucide-react';
import { useI18n } from '@/i18n/context';

interface DocumentationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TRAINING_RESOURCES = [
  { name: 'RecMountain', url: 'https://recmountain.com' },
  { name: 'Alurte', url: 'https://alurte.com' },
  { name: 'ACNA', url: 'https://acna.es' },
  { name: 'Lauegi Report', url: 'https://lauegi.report' },
  { name: 'Montaña Segura', url: 'https://montanasegura.com' },
];

export function Documentation({ open, onOpenChange }: DocumentationProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {t.docs.title}
          </DialogTitle>
          <DialogDescription>NivoApp - Stratigraphic Profile Application</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Technical Guide */}
            <section>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                {t.docs.technicalGuide}
              </h3>
              
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{t.docs.pwaInstallation}</h4>
                  <p className="text-sm text-muted-foreground">{t.docs.pwaInstallationDesc}</p>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{t.docs.offlineCapabilities}</h4>
                  <p className="text-sm text-muted-foreground">{t.docs.offlineCapabilitiesDesc}</p>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{t.docs.multiplatform}</h4>
                  <p className="text-sm text-muted-foreground">{t.docs.multiplatformDesc}</p>
                </div>
              </div>
            </section>

            {/* Acknowledgements */}
            <section>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                {t.docs.acknowledgements}
              </h3>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">{t.docs.acknowledgementsText}</p>
              </div>
            </section>

            {/* Disclaimer */}
            <section>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" />
                {t.docs.disclaimer}
              </h3>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm font-medium">{t.docs.disclaimerText}</p>
              </div>
            </section>

            {/* Training Resources */}
            <section>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                {t.docs.trainingResources}
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {TRAINING_RESOURCES.map((resource) => (
                  <a
                    key={resource.name}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{resource.name}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
