import { useState, useCallback, useRef } from "react";

export interface SpeechSynthesisHook {
  isSpeaking: boolean;
  volume: number;
  speak: (text: string, language?: string) => void;
  stop: () => void;
  setVolume: (volume: number) => void;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, language: string = "en-US") => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Stop any current speech
    if (utteranceRef.current) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume / 100;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.lang = language;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [volume]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(100, newVolume)));
  }, []);

  return {
    isSpeaking,
    volume,
    speak,
    stop,
    setVolume,
  };
}
