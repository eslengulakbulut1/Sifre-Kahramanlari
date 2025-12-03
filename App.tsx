import React, { useState, useEffect } from 'react';
import { GameState, CharacterData, ScreenName } from './types';
import { loadState, saveState } from './services/storage';
import { speak, initVoices } from './services/audio';
import { REWARD_STICKERS, THEMES, INITIAL_CHARACTERS } from './constants';

// Screens
import { Intro } from './screens/Intro';
import { CharacterSelect } from './screens/CharacterSelect';
import { MainMenu } from './screens/MainMenu';
import { CipherGame } from './screens/CipherGame';
import { MemoryGame } from './screens/MemoryGame';
import { PuzzleGame } from './screens/PuzzleGame';
import { StickerRoom } from './screens/StickerRoom';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(loadState());
  const [showReward, setShowReward] = useState<{show: boolean, sticker: string | null}>({show: false, sticker: null});
  const [rewardStage, setRewardStage] = useState<'closed' | 'open'>('closed');
  
  // State for Character Select Preview
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);

  // Initialize Audio
  useEffect(() => {
    initVoices();
    // Re-save state whenever it changes
    saveState(gameState);
  }, [gameState]);

  // --- Actions ---

  const navigate = (screen: ScreenName) => {
    setGameState(prev => ({ ...prev, currentScreen: screen }));
  };

  const selectCharacter = (charId: string) => {
    setGameState(prev => ({ 
      ...prev, 
      currentCharacterId: charId,
      currentScreen: 'main-menu' 
    }));
  };

  const getCurrentCharacter = (): CharacterData => {
    if (!gameState.currentCharacterId) return gameState.characters['zizi']; // Fallback
    return gameState.characters[gameState.currentCharacterId];
  };

  const handleGameWin = () => {
    const charId = gameState.currentCharacterId;
    if (!charId) return;

    const char = gameState.characters[charId];
    
    // Pick random sticker not yet unlocked
    const available = REWARD_STICKERS.filter(s => !char.unlockedStickers.includes(s));
    const newSticker = available.length > 0 
      ? available[Math.floor(Math.random() * available.length)] 
      : REWARD_STICKERS[Math.floor(Math.random() * REWARD_STICKERS.length)]; 

    const updatedChar = {
      ...char,
      level: char.level + 1,
      unlockedStickers: Array.from(new Set([...char.unlockedStickers, newSticker]))
    };

    setGameState(prev => ({
      ...prev,
      characters: {
        ...prev.characters,
        [charId]: updatedChar
      }
    }));

    // Start reward sequence
    setRewardStage('closed');
    setShowReward({ show: true, sticker: newSticker });
    
    speak("Harika! Bir hediye kazandın!");

    // Auto open box after delay
    setTimeout(() => {
        setRewardStage('open');
        speak(`Yaşasın! ${newSticker} çıkartması senin oldu. Devam etmek için tamam düğmesine bas.`);
    }, 2000);
  };

  const closeReward = () => {
    setShowReward({ show: false, sticker: null });
    // We do NOT navigate to main-menu here anymore.
    // The game screen remains active, and the game component itself handles resetting the level.
  };

  const handleSaveDrawing = (imageData: string) => {
    const charId = gameState.currentCharacterId;
    if (!charId) return;
    
    const char = gameState.characters[charId];
    // Keep last 10 drawings
    const newDrawings = [imageData, ...char.drawings].slice(0, 10);

    setGameState(prev => ({
        ...prev,
        characters: {
            ...prev.characters,
            [charId]: { ...char, drawings: newDrawings }
        }
    }));
  };

  // --- Dynamic Background Logic ---
  const getCurrentTheme = () => {
    // If hovering in character select, use that theme
    if (gameState.currentScreen === 'character-select' && previewThemeId) {
       const char = INITIAL_CHARACTERS.find(c => c.id === previewThemeId);
       return char ? char.theme : THEMES.default;
    }
    
    // If playing, use active character theme
    if (gameState.currentCharacterId) {
      const char = gameState.characters[gameState.currentCharacterId];
      // Defensive check if theme exists (for old saves, though storage.ts should handle this)
      return char && char.theme ? char.theme : THEMES.default;
    }
    
    // Default intro theme
    return THEMES.default;
  };

  const activeTheme = getCurrentTheme();

  // --- Rendering ---

  const renderScreen = () => {
    switch (gameState.currentScreen) {
      case 'intro':
        return <Intro onStart={() => navigate('character-select')} />;
      case 'character-select':
        return <CharacterSelect 
                  savedCharacters={gameState.characters} 
                  onSelect={selectCharacter} 
                  onHover={(id) => setPreviewThemeId(id)}
               />;
      case 'main-menu':
        return <MainMenu character={getCurrentCharacter()} onNavigate={navigate} onBack={() => navigate('character-select')} />;
      case 'cipher-game':
        return <CipherGame onWin={handleGameWin} onBack={() => navigate('main-menu')} />;
      case 'memory-game':
        return <MemoryGame onWin={handleGameWin} onBack={() => navigate('main-menu')} />;
      case 'puzzle-game':
        return <PuzzleGame onWin={handleGameWin} onBack={() => navigate('main-menu')} />;
      case 'sticker-room':
        return <StickerRoom character={getCurrentCharacter()} onSave={handleSaveDrawing} onBack={() => navigate('main-menu')} />;
      default:
        return <Intro onStart={() => navigate('character-select')} />;
    }
  };

  return (
    <div className={`h-full w-full relative overflow-hidden transition-colors duration-700 ease-in-out ${activeTheme.backgroundClass}`}>
      {/* CSS Pattern Overlay */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${activeTheme.patternOpacity}`}
        style={{
             backgroundImage: activeTheme.backgroundImage,
             backgroundSize: activeTheme.id === 'robot' ? '40px 40px' : (activeTheme.id === 'baykus' ? '20px 20px' : '60px 60px'),
             backgroundPosition: '0 0, 30px 30px'
        }}
      ></div>

      {/* Floating Bubbles Global Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(6)].map((_, i) => (
             <div 
               key={i} 
               className={`absolute rounded-full ${activeTheme.bubbleColor} animate-float backdrop-blur-[1px]`}
               style={{
                 width: `${Math.random() * 100 + 50}px`,
                 height: `${Math.random() * 100 + 50}px`,
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
                 animationDelay: `${Math.random() * 5}s`,
                 animationDuration: `${10 + Math.random() * 10}s`
               }}
             />
          ))}
      </div>

      {/* Screen Content */}
      <div className="relative z-10 w-full h-full">
        {renderScreen()}
      </div>

      {/* Reward Overlay */}
      {showReward.show && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
           <div className={`bg-white rounded-3xl p-8 flex flex-col items-center shadow-2xl border-8 border-yellow-400 transition-all duration-500 ${rewardStage === 'open' ? 'scale-100 opacity-100' : 'scale-90 opacity-100'}`}>
              
              <h2 className="text-3xl font-bold text-yellow-600 mb-6">
                 {rewardStage === 'closed' ? 'Sürpriz!' : 'Tebrikler!'}
              </h2>

              <div className="h-48 w-48 flex items-center justify-center mb-6 relative">
                 {rewardStage === 'closed' ? (
                     <div className="text-9xl animate-bounce cursor-pointer" onClick={() => setRewardStage('open')}>
                         🎁
                     </div>
                 ) : (
                     <div className="text-9xl filter drop-shadow-lg animate-[spin_1s_ease-out]">
                         {showReward.sticker}
                     </div>
                 )}
              </div>

              {rewardStage === 'open' && (
                <button 
                    onClick={closeReward}
                    className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-3 px-8 rounded-full shadow-lg transform transition active:scale-95 animate-pulse"
                >
                    Tamam
                </button>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default App;