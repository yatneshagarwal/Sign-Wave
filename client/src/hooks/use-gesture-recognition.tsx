import { useState, useCallback, useRef, useEffect } from "react";
import { GestureData, analyzeGesture } from "@/lib/gesture-data";
import { Hands, Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

export interface GestureRecognitionHook {
  isScanning: boolean;
  currentGesture: GestureData | null;
  gestureStatus: string;
  gestureCount: number;
  startScanning: (videoElement: HTMLVideoElement) => void;
  stopScanning: () => void;
  lastDetection: Date | null;
}

const useGestureRecognition = (): GestureRecognitionHook => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<GestureData | null>(null);
  const [gestureStatus, setGestureStatus] = useState("Ready to detect");
  const [gestureCount, setGestureCount] = useState(0);
  const [lastDetection, setLastDetection] = useState<Date | null>(null);
  
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const isAnalyzingRef = useRef(false);

  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const handPositionsRef = useRef<Array<{ x: number; y: number }>>([]);


  // Initialize MediaPipe Hands
  useEffect(() => {
    setGestureStatus("MediaPipe hand tracking ready");
    
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    const handleResults = (results: Results) => {
      if (!isScanning) return;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // Convert landmarks to screen coordinates for gesture analysis
        const handPositions = landmarks.map(landmark => ({
          x: landmark.x * 640,
          y: landmark.y * 480
        }));

        // Store hand positions for gesture analysis
        handPositionsRef.current = handPositions;

        // Analyze gesture based on hand positions
        const detectedGesture = analyzeGesture(handPositions);

        if (detectedGesture && detectedGesture.matchedGesture) {
          const gestureData: GestureData = {
            text: detectedGesture.matchedGesture.text,
            hindi: detectedGesture.matchedGesture.hindi,
            confidence: detectedGesture.matchedGesture.confidence,
            gestureType: detectedGesture.gestureType
          };

          setCurrentGesture(gestureData);
          setGestureStatus(`MediaPipe detected: ${detectedGesture.gestureType} (${Math.round(gestureData.confidence * 100)}%)`);
          setGestureCount(prev => prev + 1);
          setLastDetection(new Date());
          
          if (window.showToast) {
            window.showToast({ 
              message: `Hand gesture detected: ${gestureData.text}`, 
              type: 'success',
              duration: 2000
            });
          }
        } else {
          setGestureStatus("Hand detected - analyzing gesture...");
        }
      } else {
        setGestureStatus("Looking for hands...");
        handPositionsRef.current = [];
      }
    };

    hands.onResults(handleResults);
    handsRef.current = hands;

    return () => {
      handsRef.current = null;
    };
  }, [isScanning]);

  const startScanning = useCallback((videoElement: HTMLVideoElement) => {
    setIsScanning(true);
    setGestureStatus("Starting MediaPipe hand tracking...");
    setCurrentGesture(null);
    setGestureCount(0);
    videoElementRef.current = videoElement;
    
    // Initialize camera for MediaPipe
    if (handsRef.current && videoElement) {
      const camera = new Camera(videoElement, {
        onFrame: async () => {
          if (handsRef.current) {
            await handsRef.current.send({ image: videoElement });
          }
        },
        width: 640,
        height: 480
      });
      
      cameraRef.current = camera;
      camera.start();
    }
    
    if (window.showToast) {
      window.showToast({ 
        message: 'MediaPipe hand tracking started', 
        type: 'success' 
      });
    }
  }, []);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
    setGestureStatus("Hand tracking stopped");
    setCurrentGesture(null);
    videoElementRef.current = null;
    isAnalyzingRef.current = false;
    handPositionsRef.current = [];
    
    // Stop camera
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    
    if (window.showToast) {
      window.showToast({ 
        message: 'MediaPipe scanning stopped', 
        type: 'info' 
      });
    }
  }, []);


  return {
    isScanning,
    currentGesture,
    gestureStatus,
    gestureCount,
    startScanning,
    stopScanning,
    lastDetection,
  };
};

export { useGestureRecognition };
