import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'danger' | 'success';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, color = 'primary', className = '', disabled = false }) => {
  const baseStyle = "transform active:scale-95 transition-all duration-200 font-bold rounded-2xl shadow-[0_6px_0_rgb(0,0,0,0.2)] active:shadow-none active:translate-y-[6px] flex items-center justify-center text-center";
  
  const colors = {
    primary: "bg-blue-500 hover:bg-blue-400 text-white border-b-blue-700",
    secondary: "bg-purple-500 hover:bg-purple-400 text-white border-b-purple-700",
    success: "bg-green-500 hover:bg-green-400 text-white border-b-green-700",
    danger: "bg-red-500 hover:bg-red-400 text-white border-b-red-700",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${colors[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};