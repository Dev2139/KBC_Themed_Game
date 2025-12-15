import { useEffect } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';

export function CameraBox() {
  const { videoRef, isActive, error, permission, startCamera } = useCamera();

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  return (
    <div className="hidden md:block fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div className="gradient-border rounded-lg overflow-hidden shadow-lg">
        <div className="bg-card p-1">
          {isActive ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-40 h-32 object-cover rounded"
              />
              <div className="absolute top-1 left-1 flex items-center gap-1 bg-success/80 text-success-foreground px-1.5 py-0.5 rounded text-xs">
                <Camera className="w-3 h-3" />
                <span>લાઇવ</span>
              </div>
            </div>
          ) : (
            <div className="w-40 h-32 bg-muted rounded flex flex-col items-center justify-center gap-2 p-2">
              {permission === 'denied' ? (
                <>
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                  <p className="text-xs text-center text-destructive">
                    {error || 'કૅમેરા બંધ છે'}
                  </p>
                </>
              ) : (
                <>
                  <CameraOff className="w-8 h-8 text-muted-foreground" />
                  <p className="text-xs text-center text-muted-foreground">
                    કૅમેરા લોડ થઈ રહ્યો છે...
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
