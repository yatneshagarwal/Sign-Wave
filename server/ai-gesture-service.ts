import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o", not "gpt-4". do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface AIGestureResult {
  gestureDetected: boolean;
  gestureType: string;
  confidence: number;
  description: string;
  isISLGesture: boolean;
}

export async function analyzeGestureImage(base64Image: string): Promise<AIGestureResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert in Indian Sign Language (ISL) gesture recognition. Analyze the image and identify if there's a clear hand gesture being performed. 

If you see a hand gesture, classify it as one of these types:
- "greeting" (hello, namaste, waving, open palm)
- "question" (pointing, questioning gestures)
- "status" (thumbs up/down, okay signs)
- "gratitude" (thank you gestures, prayer hands, folded hands)
- "emergency" (help signals, urgent gestures, closed fist)
- "number" (counting gestures, finger counting)
- "direction" (pointing directions)

Respond in JSON format with:
{
  "gestureDetected": boolean,
  "gestureType": string (one of the types above),
  "confidence": number (0.0-1.0),
  "description": string (brief description of what you see),
  "isISLGesture": boolean (true if this looks like a deliberate sign language gesture)
}

Only respond with high confidence (>0.7) if you clearly see a deliberate hand gesture.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image for Indian Sign Language hand gestures. Look for clear, deliberate hand positions and movements."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      gestureDetected: result.gestureDetected || false,
      gestureType: result.gestureType || '',
      confidence: result.confidence || 0,
      description: result.description || '',
      isISLGesture: result.isISLGesture || false
    };

  } catch (error) {
    console.error('OpenAI gesture analysis failed:', error);
    return {
      gestureDetected: false,
      gestureType: '',
      confidence: 0,
      description: 'Analysis failed',
      isISLGesture: false
    };
  }
}