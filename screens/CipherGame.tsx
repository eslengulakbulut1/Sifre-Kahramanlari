import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { speak } from '../services/audio';

interface CipherGameProps {
  onWin: () => void;
  onBack: () => void;
}

// Simple configuration for game logic
const LEVELS = [
  { story: "Çiçekler açtı, arılar geldi!", sequence: [1, 2, 1], map: [{s:"🌸", v:1}, {s:"🐝", v:2}, {s:"☀️", v:3}] },
  { story: "Gece oldu, yıldızlar parladı.", sequence: [3, 2, 3], map: [{s:"🌙", v:1}, {s:"☁️", v:2}, {s:"⭐", v:3}] },
  { story: "Balıklar suda yüzüyor.", sequence: [1, 1, 2], map: [{s:"🐟", v:1}, {s:"🦀", v:2}, {s:"🌊", v:3}] },
  { story: "Kuşlar ağaca kondu.", sequence: [2, 1, 3], map: [{s:"🌳", v:1}, {s:"🐦", v:2}, {s:"🍏", v:3}] },
  { story: "Arabalar yolda gidiyor.", sequence: [3, 1, 2], map: [{s:"🚗", v:1}, {s:"🚦", v:2}, {s:"⛽", v:3}] },
];

export const CipherGame: React.FC<CipherGameProps> = ({ onWin, onBack }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pick a random level on mount
  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * LEVELS.length);
    setLevelIdx(randomIdx);
  }, []);

  const currentLevel = LEVELS[levelIdx];

  useEffect(() => {
    if (!isSuccess) {
      speak(currentLevel.story + " Şifreyi çöz!");
    }
  }, [currentLevel, isSuccess]);

  const handleInput = (val: number) => {
    if (isSuccess) return;

    const newSeq = [...userSequence, val];
    setUserSequence(newSeq);

    // Check correctness immediately
    const currentIndex = newSeq.length - 1;
    if (newSeq[currentIndex] !== currentLevel.sequence[currentIndex]) {
      // Wrong input
      speak("Hayır, bu değil. Tekrar dene.");
      setUserSequence([]); // Reset
      return;
    }

    // Check completion
    if (newSeq.length === currentLevel.sequence.length) {
      setIsSuccess(true);
      speak("Harika! Şifre çözüldü!");
      
      // Delay to show full success state before reward modal
      setTimeout(() => {
        onWin();
        // Reset game for continuous play while modal is potentially open
        setTimeout(() => {
            let nextIdx = Math.floor(Math.random() * LEVELS.length);
            // Try to get a different level if possible
            while(nextIdx === levelIdx && LEVELS.length > 1) {
                nextIdx = Math.floor(Math.random() * LEVELS.length);
            }
            setLevelIdx(nextIdx);
            setUserSequence([]);
            setIsSuccess(false);
        }, 1000);
      }, 2000);
    } else {
        // Encouragement
        const sounds = ["Süper", "Devam et", "Aferin"];
        speak(sounds[Math.floor(Math.random()*sounds.length)]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-indigo-50/80 backdrop-blur-sm p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="bg-white p-2 rounded-full text-2xl shadow">⬅️</button>
        <h2 className="text-xl font-bold text-indigo-700 bg-white/50 px-4 py-1 rounded-full">Şifre Çözme</h2>
        <div className="w-10"></div>
      </div>

      {/* Legend / Map */}
      <div className="bg-white rounded-3xl p-4 shadow-md mb-6 flex justify-around border-4 border-indigo-100">
        {currentLevel.map.map((item) => (
          <div key={item.v} className="flex flex-col items-center">
            <span className="text-4xl mb-2 animate-[bounce_2s_infinite]">{item.s}</span>
            <span className="text-2xl font-black text-indigo-400">⬇️</span>
            <span className="text-3xl font-bold text-slate-700">{item.v}</span>
          </div>
        ))}
      </div>

      {/* Puzzle Display */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="flex gap-2 mb-8 bg-white/60 p-4 rounded-2xl shadow-inner border-2 border-white">
          {currentLevel.sequence.map((targetVal, idx) => {
             // Find symbol for this target value
             const symbol = currentLevel.map.find(m => m.v === targetVal)?.s;
             return (
               <div key={idx} className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-xl flex items-center justify-center text-4xl shadow-md transform transition hover:scale-110">
                 {symbol}
               </div>
             );
          })}
        </div>

        {/* Answer Slots */}
        <div className="flex gap-2 mb-8">
            {currentLevel.sequence.map((_, idx) => (
                <div key={idx} className={`w-16 h-16 md:w-24 md:h-24 rounded-xl flex items-center justify-center text-4xl border-4 shadow-sm transition-all duration-300 ${userSequence[idx] ? 'bg-green-100 border-green-400 scale-110' : 'bg-white/80 border-dashed border-slate-300'}`}>
                    {userSequence[idx] || "?"}
                </div>
            ))}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[1, 2, 3].map((num) => (
          <Button 
            key={num} 
            onClick={() => handleInput(num)}
            color="primary"
            className="text-4xl py-6 shadow-xl border-b-8 active:border-b-0"
            disabled={isSuccess}
          >
            {num}
          </Button>
        ))}
      </div>
    </div>
  );
};