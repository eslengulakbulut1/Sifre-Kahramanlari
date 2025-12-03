import React, { useEffect } from 'react';
import { Button } from '../components/Button';
import { speak } from '../services/audio';

interface IntroProps {
  onStart: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onStart }) => {
  useEffect(() => {
    // Delay slightly to ensure browser is ready
    const timer = setTimeout(() => {
      speak("Şifre Kahramanları oyununa hoş geldin! Hadi başla düğmesine bas!", true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full p-6 overflow-hidden">
      
      {/* Decorative Animations */}
      {/* Rocket */}
      <div className="absolute w-24 h-24 text-6xl animate-rocket pointer-events-none z-0" style={{ animationDelay: '1s' }}>
        🚀
      </div>

      {/* Stars */}
      <div className="absolute top-10 left-10 text-yellow-300 text-4xl animate-twinkle z-0" style={{ animationDelay: '0s' }}>⭐</div>
      <div className="absolute top-20 right-20 text-yellow-100 text-2xl animate-twinkle z-0" style={{ animationDelay: '1s' }}>✦</div>
      <div className="absolute bottom-32 left-1/4 text-yellow-200 text-3xl animate-twinkle z-0" style={{ animationDelay: '2s' }}>✨</div>
      <div className="absolute top-1/3 right-10 text-white text-xl animate-twinkle z-0" style={{ animationDelay: '1.5s' }}>⭐</div>

      {/* Peeking Cats */}
      <div className="absolute bottom-20 left-0 text-6xl animate-cat-peek z-10 origin-left">
        🐱
      </div>
      <div className="absolute bottom-40 right-0 text-6xl animate-cat-peek-right z-10 origin-right">
        🐯
      </div>


      {/* Main Content */}
      <div className="z-20 flex flex-col items-center">
        <div className="animate-bounce mb-8 text-9xl drop-shadow-2xl filter brightness-110">🦸‍♂️</div>
        
        <div className="bg-white/30 backdrop-blur-md p-6 rounded-3xl border-4 border-white/50 shadow-xl mb-12 transform hover:scale-105 transition duration-500">
           <h1 className="text-4xl md:text-6xl font-black text-white text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] leading-tight">
            Şifre<br/>Kahramanları
          </h1>
          <p className="text-white text-center font-bold text-lg mt-2 drop-shadow-md opacity-90">Oyununa Hoş Geldin!</p>
        </div>
        
        <Button onClick={onStart} color="success" className="text-3xl px-12 py-6 w-full max-w-sm shadow-2xl border-b-8 active:border-b-0 animate-float">
          BAŞLA ▶
        </Button>
      </div>
    </div>
  );
};