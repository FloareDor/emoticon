'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface Sound {
  name: string;
  icon: string;
  url: string;
}

const sounds: Sound[] = [
  {
    name: "Cafe Ambience",
    icon: "☕",
    url: "/sounds/cafe2.mp3"
  },
  {
    name: "Rain",
    icon: "🌧️",
    url: "/sounds/rain.mp3"
  }
];

export function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<Sound>(sounds[0]);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentSound) {
      audioRef.current = new Audio(currentSound.url);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentSound, volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const selectSound = (sound: Sound) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentSound(sound);
    setIsPlaying(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 hover:bg-white/15 text-white font-light p-3 rounded-full transition-all duration-300 border border-white/10 flex items-center"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-lg">🎵</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute right-full top-0 mr-2 bg-black/80 backdrop-blur-lg p-4 rounded-lg border border-white/10 w-64"
          >
            <div className="space-y-2">
              {sounds.map((sound) => (
                <motion.button
                  key={sound.name}
                  onClick={() => selectSound(sound)}
                  className={`w-full text-left p-2 rounded flex items-center space-x-2 transition-colors ${
                    currentSound.name === sound.name
                      ? 'bg-white/20 text-white'
                      : 'hover:bg-white/10 text-white/80'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-lg">{sound.icon}</span>
                  <span>{sound.name}</span>
                </motion.button>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <button 
                  onClick={togglePlay} 
                  className="text-white/80 hover:text-white"
                >
                  {isPlaying ? "⏸️" : "▶️"}
                </button>
                <span className="text-white/60 text-sm">{currentSound.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-white/60" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-emerald-400"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 