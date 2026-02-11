import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, Github, ExternalLink } from 'lucide-react';
import { useI18n } from '@/i18n/context';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LINKS = [
  {
    section: 'github',
    icon: Github,
    name: 'GitHub',
    url: 'https://github.com/sanidevix/snowstrat-field',
  },
];

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const { t } = useI18n();
  const ct = t.contactModal;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {ct?.title || 'Contacto'}
          </DialogTitle>
          <DialogDescription>{ct?.subtitle || 'Información de contacto y enlaces del proyecto'}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {/* Email */}
            <section>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                {ct?.emailSection || 'Correo electrónico'}
              </h3>
              <a
                href="mailto:sanidevix@gmail.com"
                className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">sanidevix@gmail.com</span>
              </a>
            </section>

            {/* Links */}
            <section>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Github className="w-4 h-4 text-primary" />
                {ct?.linksSection || 'Enlaces del proyecto'}
              </h3>
              <div className="grid gap-2">
                {LINKS.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <link.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{link.name}</span>
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
