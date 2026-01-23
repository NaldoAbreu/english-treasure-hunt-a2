import { useCallback, useState } from 'react';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string, language: string = 'en-US') => {
    // Verificar se o navegador suporta Web Speech API
    const SpeechSynthesisUtterance =
      window.SpeechSynthesisUtterance ||
      (window as any).webkitSpeechSynthesisUtterance;

    if (!SpeechSynthesisUtterance) {
      console.warn('Web Speech API não suportada neste navegador');
      return;
    }

    // Cancelar fala anterior se estiver acontecendo
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9; // Velocidade um pouco mais lenta para melhor compreensão
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
};
