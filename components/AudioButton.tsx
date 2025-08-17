import React, { useState } from 'react';
import elevenLabsService from '@/services/elevenlabs';

interface AudioButtonProps {
  text: string;
  isWord?: boolean;
  size?: 'small' | 'medium';
  className?: string;
}

const AudioButton: React.FC<AudioButtonProps> = ({ 
  text, 
  isWord = false, 
  size = 'medium',
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      await elevenLabsService.playAudio(text, isWord);
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      // Reset after a reasonable duration
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const sizeClasses = {
    small: 'w-6 h-6 text-xs',
    medium: 'w-8 h-8 text-sm'
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isPlaying}
      className={`
        ${sizeClasses[size]}
        bg-indigo-500/80 hover:bg-indigo-500 
        text-white rounded-full 
        flex items-center justify-center 
        transition-all duration-200 
        hover:scale-110 hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title="Play pronunciation"
    >
      {isPlaying ? (
        <span className="animate-pulse">⏸</span>
      ) : (
        <span>🔊</span>
      )}
    </button>
  );
};

export default AudioButton;