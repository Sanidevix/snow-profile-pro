import React, { useEffect, useState } from 'react';
import { ProfileApp } from '@/components/ProfileApp';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Index = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBanner(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setInstallPrompt(null);
  };

  const handleDismissBanner = () => {
    setShowInstallBanner(false);
  };

  return (
    <>
      <ProfileApp />
      
      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="pwa-install-banner">
          <div className="flex items-center gap-3">
            <Download className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold">Instalar SnowStrat</p>
              <p className="text-sm opacity-90">Acceso rápido y funcionamiento sin conexión</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="bg-primary-foreground text-primary px-4 py-2 rounded-lg font-bold hover:bg-primary-foreground/90 transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={handleDismissBanner}
              className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
