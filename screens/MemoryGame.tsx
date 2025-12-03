import React, { useState, useEffect } from 'react';
import { MEMORY_CARDS_POOL } from '../constants';
import { speak } from '../services/audio';

interface MemoryGameProps {
  onWin: () => void;
  onBack: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onWin, onBack }) => {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [matched, setMatched] = useState<boolean[]>([]);
  const [choices, setChoices] = useState<number[]>([]);

  const initGame = () => {
    // Setup game
    const shuffledPool = [...MEMORY_CARDS_POOL].sort(() => 0.5 - Math.random());
    const selected = shuffledPool.slice(0, 4); // Pick 4 unique types
    const gameCards = [...selected, ...selected].sort(() => 0.5 - Math.random()); // Duplicate and shuffle
    
    setCards(gameCards);
    setFlipped(new Array(8).fill(false));
    setMatched(new Array(8).fill(false));
    setChoices([]);
    speak("Kartları eşleştir!");
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    // Ignore if already matched, already flipped, or 2 cards already open
    if (matched[index] || flipped[index] || choices.length >= 2) return;

    // Flip logic
    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);

    const newChoices = [...choices, index];
    setChoices(newChoices);

    if (newChoices.length === 2) {
      const [first, second] = newChoices;
      if (cards[first] === cards[second]) {
        // Match!
        speak("Aferin!");
        const newMatched = [...matched];
        newMatched[first] = true;
        newMatched[second] = true;
        setMatched(newMatched);
        setChoices([]);

        // Check win
        if (newMatched.every(Boolean)) {
           setTimeout(() => {
             speak("Tebrikler! Hepsini buldun!");
             onWin();
             // Auto reset for continuous play
             setTimeout(() => {
                initGame();
             }, 1000);
           }, 1000);
        }
      } else {
        // No match
        speak("Hımm, değil.");
        setTimeout(() => {
          const resetFlipped = [...newFlipped];
          resetFlipped[first] = false;
          resetFlipped[second] = false;
          setFlipped(resetFlipped);
          setChoices([]);
        }, 900);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-pink-50/80 backdrop-blur-sm p-4">
       <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="bg-white p-2 rounded-full text-2xl shadow hover:scale-110 transition-transform">⬅️</button>
        <h2 className="text-xl font-bold text-pink-700 bg-white/50 px-4 py-1 rounded-full">Kart Eşleştirme</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-md">
          {cards.map((card, idx) => (
            <div 
                key={idx} 
                className="aspect-square relative cursor-pointer transform transition-transform duration-200 hover:scale-105 active:scale-95"
                style={{ perspective: '1000px' }}
                onClick={() => handleCardClick(idx)}
            >
                <div 
                    className="w-full h-full transition-transform duration-500 shadow-md rounded-xl"
                    style={{ 
                        transformStyle: 'preserve-3d',
                        transform: flipped[idx] || matched[idx] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                >
                    {/* Front Face (Question Mark) */}
                    <div 
                        className="absolute inset-0 w-full h-full flex items-center justify-center text-4xl bg-pink-400 border-4 border-pink-600 rounded-xl shadow-lg"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        ❓
                    </div>

                    {/* Back Face (Content) */}
                    <div 
                        className="absolute inset-0 w-full h-full flex items-center justify-center text-4xl bg-white border-4 border-pink-400 rounded-xl shadow-lg"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        {card}
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};