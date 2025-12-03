import React, { useRef, useState, useEffect } from 'react';
import { DRAWING_COLORS } from '../constants';
import { CharacterData } from '../types';
import { Button } from '../components/Button';
import { speak } from '../services/audio';

interface StickerRoomProps {
  character: CharacterData;
  onSave: (imageData: string) => void;
  onBack: () => void;
}

const BRUSH_SIZES = [
  { label: 'İnce', value: 4 },
  { label: 'Orta', value: 8 },
  { label: 'Kalın', value: 16 },
  { label: 'Dev', value: 24 },
];

export const StickerRoom: React.FC<StickerRoomProps> = ({ character, onSave, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState(DRAWING_COLORS[0].value);
  const [brushSize, setBrushSize] = useState(8);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    speak("Burası senin odan. Resim yap ve çıkartma yapıştır!");
    // Init canvas white background
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0,0, canvas.width, canvas.height);
        }
    }
  }, []);

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in event) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        clientX = (event as React.MouseEvent).clientX;
        clientY = (event as React.MouseEvent).clientY;
    }
    
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (selectedSticker) {
        // Place sticker
        ctx.font = "40px Arial";
        ctx.fillText(selectedSticker, x - 15, y + 15);
        setIsDrawing(false); // Single tap for stickers
        speak("Yapıştı!");
        setSelectedSticker(null); // Reset to brush after sticker
    } else {
        // Start line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || selectedSticker) return;
    e.preventDefault(); // Prevent scrolling on touch
    
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.closePath();
  };

  const handleClear = () => {
      const canvas = canvasRef.current;
      if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0,0, canvas.width, canvas.height);
            speak("Tertemiz oldu!");
          }
      }
  };

  const handleSave = () => {
      if (canvasRef.current) {
          const data = canvasRef.current.toDataURL();
          onSave(data);
          speak("Resim kaydedildi!");
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/80 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-2 bg-white/90 shadow z-10">
            <button onClick={onBack} className="bg-slate-100 p-2 rounded-full text-xl hover:bg-slate-200">⬅️</button>
            <div className="flex gap-2">
                <Button onClick={handleClear} color="danger" className="py-1 px-4 text-sm">Temizle</Button>
                <Button onClick={handleSave} color="success" className="py-1 px-4 text-sm">Kaydet</Button>
            </div>
        </div>

        <div className="flex flex-grow overflow-hidden">
            {/* Sidebar Tools */}
            <div className="w-28 bg-white/90 flex flex-col items-center gap-4 p-2 overflow-y-auto no-scrollbar border-r border-slate-300">
                {/* Colors */}
                <div className="text-xs font-bold text-slate-500">Renkler</div>
                <div className="grid grid-cols-2 gap-2">
                  {DRAWING_COLORS.map(c => (
                      <button 
                          key={c.name}
                          onClick={() => { setSelectedColor(c.value); setSelectedSticker(null); }}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === c.value && !selectedSticker ? 'border-slate-800 scale-125' : 'border-transparent'}`}
                          style={{ backgroundColor: c.value }}
                      />
                  ))}
                </div>

                <div className="h-px w-full bg-slate-300 my-1"></div>

                {/* Brush Sizes */}
                <div className="text-xs font-bold text-slate-500">Kalınlık</div>
                <div className="flex flex-col gap-2 w-full items-center">
                  {BRUSH_SIZES.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setBrushSize(size.value)}
                      className={`flex items-center gap-2 px-2 py-1 rounded w-full justify-center transition-all ${brushSize === size.value && !selectedSticker ? 'bg-slate-100 shadow border border-slate-300' : 'opacity-60'}`}
                    >
                      <div 
                        className="rounded-full bg-slate-800" 
                        style={{ width: Math.min(size.value, 16), height: Math.min(size.value, 16) }} 
                      />
                      <span className="text-[10px] font-bold">{size.label}</span>
                    </button>
                  ))}
                </div>

                <div className="h-px w-full bg-slate-300 my-1"></div>
                
                {/* Stickers */}
                <div className="text-xs font-bold text-slate-500">Çıkartmalar</div>
                <div className="flex flex-wrap justify-center gap-1">
                  {character.unlockedStickers.length === 0 && <div className="text-[10px] text-center text-slate-400">Henüz yok</div>}
                  {character.unlockedStickers.map((s, i) => (
                      <button 
                          key={i}
                          onClick={() => setSelectedSticker(s)}
                          className={`text-2xl p-1 rounded hover:bg-white transition-all ${selectedSticker === s ? 'bg-white shadow scale-110 ring-2 ring-yellow-400' : ''}`}
                      >
                          {s}
                      </button>
                  ))}
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-grow relative flex items-center justify-center p-4">
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={500}
                    className="bg-white shadow-2xl rounded-xl cursor-crosshair touch-none max-w-full max-h-full border-4 border-slate-200"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>
            
            {/* Gallery Sidebar (Hidden on small mobile, visible on tablet+) */}
            <div className="hidden md:flex w-32 bg-white/90 flex-col p-2 overflow-y-auto border-l border-slate-300">
                 <div className="text-xs font-bold text-slate-500 mb-2 text-center">Galeri</div>
                 {character.drawings.map((img, i) => (
                     <img key={i} src={img} alt="drawing" className="w-full bg-white mb-2 rounded border border-slate-300 cursor-pointer hover:opacity-75" 
                        onClick={() => {
                            // Load image back to canvas
                            const canvas = canvasRef.current;
                            const ctx = canvas?.getContext('2d');
                            if(canvas && ctx) {
                                const image = new Image();
                                image.onload = () => {
                                    ctx.drawImage(image, 0, 0);
                                };
                                image.src = img;
                            }
                        }}
                     />
                 ))}
            </div>
        </div>
    </div>
  );
};