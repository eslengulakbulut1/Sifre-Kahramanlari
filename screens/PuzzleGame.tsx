import React, { useState, useEffect } from 'react';
import { PUZZLE_IMAGES } from '../constants';
import { speak } from '../services/audio';

interface PuzzleGameProps {
  onWin: () => void;
  onBack: () => void;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ onWin, onBack }) => {
  const [tiles, setTiles] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]); // 3x3 grid
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [targetImage, setTargetImage] = useState(PUZZLE_IMAGES[0]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Static list of piece IDs to map over for animation purposes
  const pieces = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const initGame = () => {
    setShowConfetti(false);
    // Pick random image
    const img = PUZZLE_IMAGES[Math.floor(Math.random() * PUZZLE_IMAGES.length)];
    setTargetImage(img);
    speak("Parçaları karıştırıyorum. Numaralara bakarak düzeltebilir misin?");
    
    // Shuffle tiles until not sorted
    let shuffled = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random());
    while (shuffled.every((val, i) => val === i)) {
        shuffled = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random());
    }
    setTiles(shuffled);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleTileClick = (index: number) => {
    if (showConfetti) return; // Disable clicks during celebration

    if (selectedIdx === null) {
      setSelectedIdx(index);
      speak("Şimdi değiştireceğin parçaya bas.");
    } else {
      // Swap
      const newTiles = [...tiles];
      const temp = newTiles[selectedIdx];
      newTiles[selectedIdx] = newTiles[index];
      newTiles[index] = temp;
      setTiles(newTiles);
      setSelectedIdx(null);

      // Check sorted
      const isSorted = newTiles.every((val, i) => val === i);
      if (isSorted) {
        setShowConfetti(true);
        speak("Harika! Yapbozu tamamladın!");
        setTimeout(() => {
            onWin();
            // Reset game in background for continuous play
            setTimeout(() => {
                initGame();
            }, 1000);
        }, 3000); // Wait a bit longer to enjoy confetti
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-orange-50/80 backdrop-blur-sm p-4 relative overflow-hidden">
      {/* Styles for Confetti */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          top: -20px;
          width: 10px;
          height: 10px;
          animation: fall linear forwards;
        }
      `}</style>

      {/* Confetti Overlay */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'][Math.floor(Math.random() * 6)],
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-6 z-10">
        <button onClick={onBack} className="bg-white p-2 rounded-full text-2xl shadow hover:scale-110 transition-transform">⬅️</button>
        <h2 className="text-xl font-bold text-orange-700 bg-white/50 px-4 py-1 rounded-full">Yapboz</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center z-10">
        {/* The Grid Container - Perfectly sized for 9 pieces */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 bg-white rounded-xl shadow-2xl border-4 border-orange-300 overflow-hidden">
            {pieces.map((pieceId) => {
                // Determine where this piece is currently located in the grid (tiles array)
                const currentIndex = tiles.indexOf(pieceId);
                const row = Math.floor(currentIndex / 3);
                const col = currentIndex % 3;
                
                // Determine what this piece *looks* like (its original position in the image)
                const origRow = Math.floor(pieceId / 3);
                const origCol = pieceId % 3;
                
                const isSelected = selectedIdx === currentIndex;

                return (
                  <div 
                    key={pieceId}
                    onClick={() => handleTileClick(currentIndex)}
                    className="absolute transition-all duration-300 ease-in-out border border-white/20"
                    style={{
                        width: '33.333333%', 
                        height: '33.333333%',
                        left: `${col * 33.333333}%`, 
                        top: `${row * 33.333333}%`,
                        zIndex: isSelected ? 30 : 10,
                        cursor: 'pointer',
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                        // Glow effect and thick border when selected
                        boxShadow: isSelected ? '0 0 20px rgba(255, 165, 0, 0.9)' : 'none',
                        borderColor: isSelected ? '#f59e0b' : 'rgba(255,255,255,0.2)'
                    }}
                  >
                     <div 
                        className={`w-full h-full relative overflow-hidden ${targetImage.color} ${isSelected ? 'ring-4 ring-yellow-400 z-40' : ''}`}
                     >
                        {/* The Image Part - Scaled massively to simulate a full image */}
                        <div 
                            className="absolute flex items-center justify-center pointer-events-none select-none drop-shadow-md"
                            style={{
                                width: '300%', // 3x width of a tile
                                height: '300%', // 3x height of a tile
                                position: 'absolute',
                                left: `-${origCol * 100}%`,
                                top: `-${origRow * 100}%`,
                                fontSize: '20rem', // Massive size to fill grid
                                lineHeight: '1',
                            }}
                        >
                            {targetImage.emoji}
                        </div>

                        {/* Number Indicator (1-9) */}
                        <div className="absolute bottom-1 right-1 bg-white/90 text-orange-900 border border-orange-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-sm pointer-events-none">
                            {pieceId + 1}
                        </div>
                     </div>
                  </div>
                );
            })}
        </div>
        <p className="mt-8 text-orange-800 font-bold text-center bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm">
          Numaraları sıraya diz: 1, 2, 3...
        </p>
      </div>
    </div>
  );
};