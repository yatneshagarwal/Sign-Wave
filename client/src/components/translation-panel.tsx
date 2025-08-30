import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Languages, AlertTriangle, History } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { GestureData } from "@/lib/gesture-data";

interface TranslationPanelProps {
  currentGesture: GestureData | null;
  selectedRegion: string;
  gestureHistory: Array<{ gesture: GestureData; timestamp: Date }>;
}

export default function TranslationPanel({ 
  currentGesture, 
  selectedRegion, 
  gestureHistory 
}: TranslationPanelProps) {
  const { isSpeaking, volume, speak, stop, setVolume } = useSpeechSynthesis();
  const [hasSpoken, setHasSpoken] = useState(false);

  const handleSpeakHindi = useCallback(() => {
    if (!currentGesture) return;

    // Always speak in Hindi if available, otherwise English
    const textToSpeak = currentGesture.hindi || currentGesture.text;
    const language = currentGesture.hindi ? 'hi-IN' : 'en-US';

    speak(textToSpeak, language);

    if (window.showToast) {
      window.showToast({ 
        message: `Auto-speaking in ${currentGesture.hindi ? 'Hindi' : 'English'}: ${textToSpeak}`, 
        type: 'success',
        duration: 3000
      });
    }
  }, [currentGesture, speak]);

  // Auto-speak when gesture is completed and has reasonable confidence
  useEffect(() => {
    if (currentGesture && !hasSpoken && currentGesture.confidence > 0.6) {
      const delay = setTimeout(() => {
        handleSpeakHindi();
        setHasSpoken(true);
      }, 500);

      return () => clearTimeout(delay);
    }
  }, [currentGesture, hasSpoken, handleSpeakHindi]);

  // Reset hasSpoken when gesture changes
  useEffect(() => {
    setHasSpoken(false);
  }, [currentGesture]);

  const handleSpeak = () => {
    if (!currentGesture) return;

    const textToSpeak = getDisplayText();
    const language = selectedRegion === 'MH' && currentGesture.hindi ? 'hi-IN' : 'en-US';

    speak(textToSpeak, language);

    if (window.showToast) {
      window.showToast({ message: 'Speaking translation...', type: 'success' });
    }
  };

  const getDisplayText = () => {
    if (!currentGesture) return '';
    return selectedRegion === 'MH' && currentGesture.hindi ? currentGesture.hindi : currentGesture.text;
  };

  const handleEmergency = (gesture: GestureData) => {
    if (window.showToast) {
      window.showToast({ 
        message: '🚨 Emergency gesture detected! Alerting authorities...', 
        type: 'error',
        duration: 5000
      });
    }
  };

  useEffect(() => {
    if (currentGesture?.emergency) {
      handleEmergency(currentGesture);
    }
  }, [currentGesture]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  return (
    <div className="space-y-6">
      {/* Live Translation Output */}
      <div className="gradient-border">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Languages className="w-5 h-5 mr-2 text-neon-magenta" />
            Translation
          </h3>

          <div 
            className="bg-muted rounded-lg p-4 min-h-[120px] flex items-center justify-center text-center border border-border/50"
            data-testid="translation-output"
          >
            {currentGesture ? (
              <div className="text-left w-full">
                <p className="text-lg font-semibold text-foreground mb-2 leading-relaxed">
                  {getDisplayText()}
                </p>
                {selectedRegion === 'MH' && currentGesture.hindi && currentGesture.text !== currentGesture.hindi && (
                  <p className="text-sm text-muted-foreground italic font-medium">
                    {currentGesture.text}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground italic font-medium">
                Translation will appear here after gesture completion...
              </p>
            )}
          </div>

          {/* Translation Confidence */}
          {currentGesture && (
            <div className="mt-3" data-testid="confidence-section">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Confidence Score</span>
                <span className="font-mono" data-testid="confidence-score">
                  {Math.round(currentGesture.confidence * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="confidence-bar rounded-full transition-all duration-300" 
                  style={{ width: `${currentGesture.confidence * 100}%` }}
                  data-testid="confidence-bar"
                />
              </div>
            </div>
          )}

          {/* TTS Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                onClick={handleSpeakHindi}
                disabled={!currentGesture || isSpeaking}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                data-testid="speak-hindi-btn"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {isSpeaking ? 'Speaking...' : 'Speak Hindi'}
              </Button>
              <Button
                onClick={handleSpeak}
                disabled={!currentGesture || isSpeaking}
                variant="outline"
                data-testid="speak-btn"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                English
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <VolumeX className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                max={100}
                step={1}
                className="w-20"
                data-testid="volume-slider"
              />
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Detection */}
      <div className="gradient-border">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
            Emergency Detection
          </h3>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-sm text-red-200 mb-3">
              Emergency gestures will trigger immediate alerts
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className="text-green-400 text-sm font-medium" data-testid="emergency-status">
                Monitoring
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Translations */}
      <div className="gradient-border">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <History className="w-5 h-5 mr-2 text-neon-amber" />
            History
          </h3>

          <div className="space-y-3" data-testid="history-list">
            {gestureHistory.length === 0 ? (
              <p className="text-muted-foreground text-sm italic">No gestures detected yet</p>
            ) : (
              gestureHistory.slice(0, 5).map((item, index) => (
                <div key={index} className="bg-muted rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground font-mono">
                      {formatTime(item.timestamp)}
                    </span>
                    <span className="text-neon-teal text-xs">
                      {Math.round(item.gesture.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-foreground">{item.gesture.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}