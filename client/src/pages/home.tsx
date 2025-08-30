import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Contrast, Settings, Zap } from "lucide-react";
import CameraSection from "@/components/camera-section";
import TranslationPanel from "@/components/translation-panel";
import StatsPanel from "@/components/stats-panel";
import CustomCursor from "@/components/custom-cursor";
import { ToastContainer } from "@/components/toast-notification";
import { regions, GestureData } from "@/lib/gesture-data";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState("MH");
  const [isListening, setIsListening] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<GestureData | null>(null);
  const [gestureHistory, setGestureHistory] = useState<Array<{ gesture: GestureData; timestamp: Date }>>([]);

  const handleGestureComplete = (gesture: GestureData) => {
    setCurrentGesture(gesture);
    setGestureHistory(prev => [{ gesture, timestamp: new Date() }, ...prev]);
  };

  const handleHighContrast = () => {
    document.documentElement.classList.toggle('high-contrast');
    if (window.showToast) {
      window.showToast({ message: 'High contrast mode toggled', type: 'info' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground cyber-grid relative overflow-hidden">
      <CustomCursor isListening={isListening} />
      <ToastContainer />

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-neon-teal/10 to-transparent rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-gradient-to-l from-neon-magenta/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-2s"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-t from-neon-amber/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-1s"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border glass-morphism relative">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 floating-particles relative">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-teal to-neon-magenta rounded-lg flex items-center justify-center shadow-lg shadow-neon-teal/30">
                <Zap className="w-4 h-4 text-white animate-bounce" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-neon-amber bg-clip-text text-transparent neon-text">
                  SignWave
                </h1>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  Breaking silence with real-time Indian Sign Language translation
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-48 border-2 border-neon-teal/50 bg-background/50 backdrop-blur-sm shadow-lg shadow-neon-teal/20" data-testid="region-select">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.code} value={region.code}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={handleHighContrast}
                title="High Contrast Mode"
                data-testid="contrast-btn"
                className="border-2 border-neon-magenta/50 shadow-lg shadow-neon-magenta/20 hover:bg-neon-magenta/10"
              >
                <Contrast className="w-4 h-4 text-neon-magenta" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                title="Settings"
                data-testid="settings-btn"
                className="shadow-lg shadow-accent/10 hover:bg-accent/10"
              >
                <Settings className="w-4 h-4 text-accent" />
              </Button>

              <div className="relative ml-4">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse glow-effect shadow-primary"></div>
                <div className="absolute inset-0 w-3 h-3 bg-primary rounded-full animate-ping opacity-30 shadow-primary"></div>
              </div>
              <span className="text-xs text-muted-foreground font-semibold tracking-wide">LIVE</span>
            </div>
          </div>
        </div>
        {/* Holographic line effect */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] holographic-effect opacity-60"></div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Camera */}
          <div className="lg:col-span-2">
            <div className="energy-pulse rounded-2xl shadow-2xl shadow-blue-500/30">
              <CameraSection
                onGestureComplete={handleGestureComplete}
                isListening={isListening}
                onListeningChange={setIsListening}
              />
            </div>
          </div>

          {/* Right Column - Translation & Stats */}
          <div className="space-y-8">
            <div className="transform hover:scale-[1.02] transition-transform duration-300 ease-in-out">
              <TranslationPanel
                currentGesture={currentGesture}
                selectedRegion={selectedRegion}
                gestureHistory={gestureHistory}
              />
            </div>
            <div className="transform hover:scale-[1.02] transition-transform duration-300 ease-in-out">
              <StatsPanel
                isScanning={isListening}
                gestureHistory={gestureHistory}
              />
            </div>
          </div>
        </div>

        {/* Floating accent elements */}
        <div className="absolute top-20 right-10 w-2 h-2 bg-neon-teal rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-1 h-1 bg-neon-magenta rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-32 w-1.5 h-1.5 bg-neon-amber rounded-full opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
      </main>
    </div>
  );
}