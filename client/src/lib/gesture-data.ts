export interface GestureData {
  text: string;
  hindi?: string;
  confidence: number;
  emergency?: boolean;
  region?: string;
  gestureType?: string;
  handShape?: string;
  movement?: string;
}

export interface DetectedGesture {
  handPositions: Array<{ x: number; y: number; confidence: number }>;
  movement: string;
  shape: string;
  gestureType: string;
  matchedGesture?: GestureData;
}

export const gesturePatterns: GestureData[] = [
  { 
    text: "Hello, how are you?", 
    hindi: "नमस्ते, आप कैसे हैं?", 
    confidence: 0.98,
    gestureType: "greeting",
    handShape: "open_palm",
    movement: "wave"
  },
  { 
    text: "Thank you very much", 
    hindi: "धन्यवाद", 
    confidence: 0.95,
    gestureType: "gratitude",
    handShape: "flat_hand",
    movement: "toward_chest"
  },
  { 
    text: "I need help please", 
    hindi: "कृपया मदद करें", 
    confidence: 0.92,
    gestureType: "request",
    handShape: "pointing",
    movement: "upward"
  },
  { 
    text: "Where is the bathroom?", 
    hindi: "बाथरूम कहाँ है?", 
    confidence: 0.89,
    gestureType: "question",
    handShape: "pointing",
    movement: "side_to_side"
  },
  { 
    text: "Good morning", 
    hindi: "सुप्रभात", 
    confidence: 0.96,
    gestureType: "greeting",
    handShape: "open_palm",
    movement: "upward"
  },
  { 
    text: "Emergency assistance needed", 
    hindi: "आपातकालीन सहायता चाहिए", 
    confidence: 0.99, 
    emergency: true,
    gestureType: "emergency",
    handShape: "closed_fist",
    movement: "rapid_up_down"
  },
  { 
    text: "Please call doctor", 
    hindi: "कृपया डॉक्टर को बुलाएं", 
    confidence: 0.94, 
    emergency: true,
    gestureType: "emergency",
    handShape: "phone_gesture",
    movement: "to_ear"
  },
  { 
    text: "I am fine", 
    hindi: "मैं ठीक हूं", 
    confidence: 0.97,
    gestureType: "status",
    handShape: "thumbs_up",
    movement: "static"
  },
  { 
    text: "What is your name?", 
    hindi: "आपका नाम क्या है?", 
    confidence: 0.91,
    gestureType: "question",
    handShape: "pointing",
    movement: "toward_person"
  },
  { 
    text: "How much does this cost?", 
    hindi: "इसकी कीमत कितनी है?", 
    confidence: 0.88,
    gestureType: "question",
    handShape: "counting",
    movement: "circular"
  },
];

// Simulate gesture analysis based on hand positions and movements
export function analyzeGesture(handPositions: Array<{ x: number; y: number }>): DetectedGesture | null {
  if (handPositions.length < 3) return null;

  // Analyze movement pattern
  const movements = handPositions.slice(1).map((pos, i) => ({
    dx: pos.x - handPositions[i].x,
    dy: pos.y - handPositions[i].y
  }));

  const avgMovement = movements.reduce((acc, mov) => ({
    dx: acc.dx + mov.dx,
    dy: acc.dy + mov.dy
  }), { dx: 0, dy: 0 });

  avgMovement.dx /= movements.length;
  avgMovement.dy /= movements.length;

  // Determine movement type
  let movement = "static";
  let shape = "open_palm";
  let gestureType = "unknown";

  const movementMagnitude = Math.sqrt(avgMovement.dx ** 2 + avgMovement.dy ** 2);

  if (movementMagnitude > 20) {
    if (Math.abs(avgMovement.dx) > Math.abs(avgMovement.dy)) {
      movement = avgMovement.dx > 0 ? "side_to_side" : "wave";
    } else {
      movement = avgMovement.dy > 0 ? "upward" : "toward_chest";
    }
  }

  // Determine hand shape based on position clustering
  const centerX = handPositions.reduce((sum, pos) => sum + pos.x, 0) / handPositions.length;
  const centerY = handPositions.reduce((sum, pos) => sum + pos.y, 0) / handPositions.length;

  if (centerX > 300 && centerY < 200) {
    shape = "pointing";
    gestureType = "question";
  } else if (centerY > 400) {
    shape = "flat_hand";
    gestureType = "gratitude";
  } else if (movementMagnitude > 30) {
    shape = "open_palm";
    gestureType = "greeting";
  } else if (centerX < 200) {
    shape = "thumbs_up";
    gestureType = "status";
  }

  // Find matching gesture pattern
  const matchedGesture = gesturePatterns.find(pattern => 
    pattern.handShape === shape && pattern.movement === movement
  ) || gesturePatterns.find(pattern => pattern.gestureType === gestureType);

  if (matchedGesture) {
    // Calculate confidence based on how well the pattern matches
    const confidence = Math.max(0.7, matchedGesture.confidence - (Math.random() * 0.15));
    
    return {
      handPositions: handPositions.map(pos => ({ ...pos, confidence: confidence })),
      movement,
      shape,
      gestureType,
      matchedGesture: { ...matchedGesture, confidence }
    };
  }

  return null;
}

export const regions = [
  { code: "MH", name: "Maharashtra" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "KA", name: "Karnataka" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "GJ", name: "Gujarat" },
];
