import { CharacterData, CharacterTheme } from './types';

export const THEMES: Record<string, CharacterTheme> = {
  default: {
    id: 'default',
    backgroundClass: 'bg-sky-300',
    patternOpacity: 'opacity-30',
    backgroundImage: 'radial-gradient(white 2px, transparent 2px), radial-gradient(white 1px, transparent 1px)',
    textColor: 'text-white',
    accentColor: 'bg-white/20',
    bubbleColor: 'bg-white/40'
  },
  zizi: {
    id: 'zizi',
    backgroundClass: 'bg-slate-900',
    patternOpacity: 'opacity-100',
    backgroundImage: 'radial-gradient(white 2px, transparent 2px), radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', // Stars
    textColor: 'text-sky-100',
    accentColor: 'bg-indigo-500',
    bubbleColor: 'bg-indigo-400/30'
  },
  kedi: {
    id: 'kedi',
    backgroundClass: 'bg-green-300',
    patternOpacity: 'opacity-40',
    backgroundImage: 'radial-gradient(#15803d 3px, transparent 3px)', // Grass dots
    textColor: 'text-green-900',
    accentColor: 'bg-green-500',
    bubbleColor: 'bg-green-100/40'
  },
  baykus: {
    id: 'baykus',
    backgroundClass: 'bg-amber-800',
    patternOpacity: 'opacity-20',
    backgroundImage: 'repeating-linear-gradient(45deg, #78350f 0, #78350f 1px, transparent 0, transparent 50%)', // Wood texture
    textColor: 'text-amber-100',
    accentColor: 'bg-amber-600',
    bubbleColor: 'bg-amber-200/20'
  },
  robot: {
    id: 'robot',
    backgroundClass: 'bg-blue-100',
    patternOpacity: 'opacity-30',
    backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', // Grid
    textColor: 'text-slate-800',
    accentColor: 'bg-blue-500',
    bubbleColor: 'bg-blue-400/30'
  }
};

export const INITIAL_CHARACTERS: CharacterData[] = [
  { id: 'zizi', name: 'Uzay Kaşifi Zizi', emoji: '🚀', level: 1, unlockedStickers: [], drawings: [], theme: THEMES.zizi },
  { id: 'kedi', name: 'Dedektif Kedi', emoji: '🐱', level: 1, unlockedStickers: [], drawings: [], theme: THEMES.kedi },
  { id: 'baykus', name: 'Bilge Baykuş', emoji: '🦉', level: 1, unlockedStickers: [], drawings: [], theme: THEMES.baykus },
  { id: 'robot', name: 'Boyacı Robot', emoji: '🤖', level: 1, unlockedStickers: [], drawings: [], theme: THEMES.robot },
];

export const REWARD_STICKERS = ["⭐", "🌈", "🍭", "💎", "🐾", "🎈", "🎵", "🌸", "🦄", "🍦", "🦋", "🌞"];

export const MEMORY_CARDS_POOL = ["🐶", "🐱", "🐻", "🐰", "🌞", "⭐", "🍎", "🌸", "🎈", "🐾"];

export const PUZZLE_IMAGES = [
  { id: 'cat', emoji: '🐱', color: 'bg-orange-200' },
  { id: 'bear', emoji: '🐻', color: 'bg-amber-200' },
  { id: 'tiger', emoji: '🐯', color: 'bg-orange-300' },
  { id: 'panda', emoji: '🐼', color: 'bg-emerald-200' },
  { id: 'lion', emoji: '🦁', color: 'bg-yellow-200' },
  { id: 'pig', emoji: '🐷', color: 'bg-pink-200' },
  { id: 'koala', emoji: '🐨', color: 'bg-slate-300' },
  { id: 'sun', emoji: '🌞', color: 'bg-sky-200' },
];

export const DRAWING_COLORS = [
  { name: 'Siyah', value: '#000000' },
  { name: 'Kırmızı', value: '#EF4444' },
  { name: 'Mavi', value: '#3B82F6' },
  { name: 'Yeşil', value: '#22C55E' },
  { name: 'Sarı', value: '#EAB308' },
  { name: 'Mor', value: '#A855F7' },
  { name: 'Beyaz', value: '#FFFFFF' }, // Eraser effectively
];