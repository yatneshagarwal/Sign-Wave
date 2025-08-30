import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Camera } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { useGestureRecognition } from "@/hooks/use-gesture-recognition";

interface CameraSectionProps {
  onGestureComplete: (gesture: any) => void;
  isListening: boolean;
  onListeningChange: (listening: boolean) => void;
}

export default function CameraSection({ onGestureComplete, isListening, onListeningChange }: CameraSectionProps) {
  const { isActive, error, videoRef, startCamera, stopCamera } = useCamera();
  const {
    isScanning,
    currentGesture,
    gestureStatus,
    gestureCount,
    startScanning,
    stopScanning,
    lastDetection
  } = useGestureRecognition();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    onListeningChange(isScanning);
  }, [isScanning, onListeningChange]);

  useEffect(() => {
    if (currentGesture && lastDetection) {
      onGestureComplete(currentGesture);
    }
  }, [currentGesture, lastDetection, onGestureComplete]);

  const handleStartScanning = () => {
    if (videoRef.current) {
      startScanning(videoRef.current);
    } else {
      if (window.showToast) {
        window.showToast({ message: 'Camera not ready - please wait', type: 'warning' });
      }
    }
  };

  const handleStopScanning = () => {
    stopScanning();
  };

  return (
    <div className="lg:col-span-2">
      <div className="gradient-border h-96 lg:h-[500px] relative">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Camera Feed</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span>{isActive ? 'Active' : error ? 'Error' : 'Inactive'}</span>
              </div>
            </div>
          </div>

          {/* Camera Viewport */}
          <div className="flex-1 bg-black rounded-lg relative overflow-hidden glow-effect">
            {error ? (
              <div className="w-full h-full flex items-center justify-center text-red-400">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Camera access denied</p>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  data-testid="camera-video"
                />

                {/* Real-time scanning indicator */}
                {isScanning && (
                  <div className="absolute inset-0 border-2 border-neon-teal rounded-lg animate-pulse" />
                )}

                {/* AI scanning status display */}
                {isScanning && (
                  <div className="absolute top-16 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-neon-magenta/30">
                    <div className="text-white text-xs space-y-1">
                      <div className="font-semibold text-neon-magenta">🤖 AI Scanning</div>
                      <div>Gestures Detected: <span className="text-neon-teal">{gestureCount}</span></div>
                      <div className="text-green-400 animate-pulse">● Computer Vision Active</div>
                    </div>
                  </div>
                )}

                {/* Scanning overlay */}
                {isScanning && <div className="scanning-overlay" />}

                {/* Gesture Detection Status */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-neon-teal/30">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-neon-teal rounded-full animate-pulse" />
                    <span className="text-white font-semibold" data-testid="gesture-status">{gestureStatus}</span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-neon-teal/30">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-semibold">Status</span>
                      <span className="text-white text-sm font-mono font-bold" data-testid="status-text">
                        {isScanning ? 'LIVE' : 'STOPPED'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Camera Controls */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            {!isScanning ? (
              <Button
                onClick={handleStartScanning}
                disabled={!isActive}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 glow-effect"
                data-testid="start-scan-btn"
              >
                <Play className="w-4 h-4 mr-2" />
                Start AI Gesture Recognition
              </Button>
            ) : (
              <Button
                onClick={handleStopScanning}
                variant="destructive"
                className="px-8 py-3"
                data-testid="stop-btn"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop AI Recognition
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}