import { GameState, CharacterData } from '../types';
import { INITIAL_CHARACTERS } from '../constants';

const STORAGE_KEY = 'sesli_sifre_v1';

const DEFAULT_STATE: GameState = {
  characters: {},
  currentCharacterId: null,
  currentScreen: 'intro',
};

// Initialize empty character map from constant list
INITIAL_CHARACTERS.forEach(char => {
  DEFAULT_STATE.characters[char.id] = char;
});

export const loadState = (): GameState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;
    const parsed = JSON.parse(stored) as GameState;
    
    // Merge latest character definitions (specifically themes) with stored data
    // This ensures old saves get the new visual updates
    const mergedCharacters = { ...parsed.characters };
    INITIAL_CHARACTERS.forEach(initialChar => {
      if (mergedCharacters[initialChar.id]) {
        // Keep user progress (level, stickers, drawings) but update theme
        mergedCharacters[initialChar.id] = {
          ...mergedCharacters[initialChar.id],
          theme: initialChar.theme, 
          // ensure we have all fields
          name: initialChar.name,
          emoji: initialChar.emoji
        };
      } else {
        // New character added to game since save
        mergedCharacters[initialChar.id] = initialChar;
      }
    });

    return { ...DEFAULT_STATE, ...parsed, characters: mergedCharacters };
  } catch (e) {
    console.error("Save load error", e);
    return DEFAULT_STATE;
  }
};

export const saveState = (state: GameState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Save error", e);
  }
};