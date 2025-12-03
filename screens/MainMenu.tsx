import React, { useEffect } from 'react';
import { ScreenName, CharacterData } from '../types';
import { speak } from '../services/audio';
import { Button } from '../components/Button';

interface MainMenuProps {
  character: CharacterData;
  onNavigate: (screen: ScreenName) => void;
  onBack: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ character, onNavigate, onBack }) => {
  useEffect(() => {
    speak("Bir oyun seç bakalım!", true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-between h-full w-full bg-white/60 backdrop-blur-sm p-6">
      <div className="flex w-full justify-between items-center mb-4">
        <button onClick={onBack} className="bg-white p-2 rounded-full text-2xl shadow">⬅️</button>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
          <span className="text-2xl">{character.emoji}</span>
          <span className="font-bold text-green-700">{character.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl flex-grow content-center">
        <Button 
          onClick={() => onNavigate('cipher-game')} 
          color="primary" 
          className="h-32 text-2xl flex-col gap-2"
        >
          <span className="text-4xl">🔐</span>
          Şifre Çözme
        </Button>

        <Button 
          onClick={() => onNavigate('memory-game')} 
          color="secondary" 
          className="h-32 text-2xl flex-col gap-2"
        >
          <span className="text-4xl">🃏</span>
          Kart Eşleştirme
        </Button>

        <Button 
          onClick={() => onNavigate('puzzle-game')} 
          color="success" 
          className="h-32 text-2xl flex-col gap-2"
        >
          <span className="text-4xl">🧩</span>
          Yapboz
        </Button>

        <Button 
          onClick={() => onNavigate('sticker-room')} 
          color="danger" 
          className="h-32 text-2xl flex-col gap-2"
        >
          <span className="text-4xl">⭐</span>
          Kahraman Odası
        </Button>
      </div>
      
      <div className="mt-4 text-center text-green-800/70 text-sm font-bold bg-white/50 px-4 py-1 rounded-full">
        Seviye: {character.level} • Çıkartmalar: {character.unlockedStickers.length}
      </div>
    </div>
  );
};