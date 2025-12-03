export type ScreenName = 'intro' | 'character-select' | 'main-menu' | 'cipher-game' | 'memory-game' | 'puzzle-game' | 'sticker-room';

export interface CharacterTheme {
  id: string;
  backgroundClass: string; // Tailwind classes for gradient/color
  patternOpacity: string; // opacity-20, etc.
  backgroundImage?: string; // CSS specific patterns (radial gradients for stars/dots)
  textColor: string;
  accentColor: string;
  bubbleColor: string; // For floating bubbles
}

export interface CharacterData {
  id: string;
  name: string;
  emoji: string;
  level: number;
  unlockedStickers: string[];
  drawings: string[]; // Base64 strings of saved canvas
  theme: CharacterTheme;
}

export interface GameState {
  characters: Record<string, CharacterData>;
  currentCharacterId: string | null;
  currentScreen: ScreenName;
}

export interface PuzzleConfig {
  id: number;
  targetSequence: string[];
  storyText: string;
  backgroundEmoji: string;
}

export interface Sticker {
  emoji: string;
  id: string;
}