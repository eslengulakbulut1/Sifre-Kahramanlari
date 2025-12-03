let synthesis: SpeechSynthesis | null = null;
if (typeof window !== 'undefined') {
  synthesis = window.speechSynthesis;
}

export const speak = (text: string, force: boolean = false) => {
  if (!synthesis) return;

  if (force) {
    synthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'tr-TR';
  utterance.rate = 0.9; // Slightly slower for kids
  utterance.pitch = 1.1; // Slightly higher/friendly

  // Attempt to find a Turkish voice
  const voices = synthesis.getVoices();
  const trVoice = voices.find(v => v.lang.includes('tr'));
  if (trVoice) {
    utterance.voice = trVoice;
  }

  synthesis.speak(utterance);
};

// Helper to preload voices (Chrome needs this sometimes)
export const initVoices = () => {
  if (synthesis) {
    synthesis.getVoices();
  }
};
