import React, { useState, useEffect } from 'react';
import { FolderOpen, Trash2, Eye, Calendar, Mountain, MapPin, Layers, Share2 } from 'lucide-react';
import { SnowProfile, getAllProfiles, deleteProfile, formatDecimalCoords } from '@/lib/db';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { shareProfile, canShare } from '@/hooks/useShareProfile';

interface ProfileManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadProfile: (profile: SnowProfile) => void;
}

export function ProfileManager({ open, onOpenChange, onLoadProfile }: ProfileManagerProps) {
  const [profiles, setProfiles] = useState<SnowProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const allProfiles = await getAllProfiles();
      // Sort by date descending (most recent first)
      setProfiles(allProfiles.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los perfiles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadProfiles();
    }
  }, [open]);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`¿Seguro que quieres eliminar el perfil "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteProfile(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
      toast({
        title: 'Perfil eliminado',
        description: `"${name}" ha sido eliminado`,
      });
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el perfil',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleLoad = (profile: SnowProfile) => {
    onLoadProfile(profile);
    onOpenChange(false);
    toast({
      title: 'Perfil cargado',
      description: `"${profile.name}" listo para visualizar`,
    });
  };

  const handleShare = async (profile: SnowProfile) => {
    const success = await shareProfile(profile, {});
    if (success) {
      toast({
        title: 'Compartido',
        description: `"${profile.name}" compartido correctamente`,
      });
    }
  };

  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Perfiles Guardados
          </DialogTitle>
          <DialogDescription>
            Gestiona los perfiles estratigráficos almacenados en tu dispositivo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay perfiles guardados</p>
              <p className="text-sm mt-1">Los perfiles que guardes aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-3">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">
                        {profile.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {profile.observer}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(profile.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {profile.samples.length} muestras
                        </div>
                        {(profile.latitude !== null && profile.longitude !== null) && (
                          <div className="flex items-center gap-1 col-span-2">
                            <MapPin className="w-3 h-3" />
                            {formatDecimalCoords(profile.latitude, profile.longitude)}
                          </div>
                        )}
                        {profile.altitude !== null && (
                          <div className="flex items-center gap-1">
                            <Mountain className="w-3 h-3" />
                            {Math.round(profile.altitude)} m
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleLoad(profile)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Cargar perfil"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canShare() && (
                        <button
                          onClick={() => handleShare(profile)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                          title="Compartir perfil"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => profile.id && handleDelete(profile.id, profile.name)}
                        disabled={deletingId === profile.id}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
                        title="Eliminar perfil"
                      >
                        {deletingId === profile.id ? (
                          <div className="animate-spin w-4 h-4 border-2 border-destructive border-t-transparent rounded-full"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            {profiles.length} perfil{profiles.length !== 1 ? 'es' : ''} almacenado{profiles.length !== 1 ? 's' : ''} localmente
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
