import React, { useEffect } from 'react';
import { INITIAL_CHARACTERS } from '../constants';
import { CharacterData } from '../types';
import { speak } from '../services/audio';

interface CharacterSelectProps {
  onSelect: (charId: string) => void;
  savedCharacters: Record<string, CharacterData>;
  onHover: (charId: string | null) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelect, savedCharacters, onHover }) => {
  useEffect(() => {
    speak("Lütfen bir kahraman seç!", true);
  }, []);

  const handleSelect = (id: string, name: string) => {
    speak(`${name} seçildi. Hadi oynayalım!`);
    onSelect(id);
  };

  return (
    <div className="flex flex-col items-center justify-start h-full w-full bg-white/30 backdrop-blur-sm p-4 pt-10 z-10">
      <h2 className="text-3xl font-bold text-white mb-8 text-center bg-black/20 px-8 py-3 rounded-full shadow-lg border-2 border-white/30 backdrop-blur-md">
        Kahramanını Seç
      </h2>
      
      <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
        {INITIAL_CHARACTERS.map((char) => {
            // Merge saved state if exists to show correct level
            const saved = savedCharacters[char.id];
            const level = saved ? saved.level : 1;
            const theme = char.theme;

            return (
              <button
                key={char.id}
                onClick={() => handleSelect(char.id, char.name)}
                onMouseEnter={() => onHover(char.id)}
                onMouseLeave={() => onHover(null)}
                // Mobile touch handling to preview
                onTouchStart={() => onHover(char.id)} 
                className={`flex flex-col items-center justify-center bg-white/90 p-4 rounded-3xl shadow-xl hover:bg-white transform hover:scale-110 transition-all duration-300 border-b-8 active:border-b-0 active:scale-95 group relative overflow-hidden`}
                style={{ borderColor: theme.accentColor.replace('bg-', '') }} // Hacky way to get border color from bg class, or just let default styles handle it
              >
                {/* Character-specific background hint inside card */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${theme.backgroundClass}`}></div>

                <span className="text-7xl mb-2 drop-shadow-md z-10 group-hover:animate-bounce">{char.emoji}</span>
                <span className="text-lg font-bold text-slate-700 text-center leading-tight z-10">{char.name}</span>
                <span className="mt-2 text-xs bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold shadow-sm z-10">
                  Seviye {level}
                </span>
              </button>
            );
        })}
      </div>
    </div>
  );
};