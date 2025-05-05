import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Heart, 
  Brain, 
  Lungs, 
  Stomach, 
  Hand, 
  Foot, 
  ArrowRight, 
  ArrowLeft,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

interface EmotionLocation {
  emotion: string;
  bodyParts: string[];
  description: string;
  color: string;
}

const emotionLocations: EmotionLocation[] = [
  {
    emotion: 'Anxiety',
    bodyParts: ['chest', 'stomach', 'hands'],
    description: 'Tightness in chest, butterflies in stomach, sweaty palms',
    color: 'bg-amber-900 text-amber-200'
  },
  {
    emotion: 'Anger',
    bodyParts: ['head', 'chest', 'hands'],
    description: 'Hot face, pounding heart, clenched fists',
    color: 'bg-red-900 text-red-200'
  },
  {
    emotion: 'Sadness',
    bodyParts: ['chest', 'throat', 'eyes'],
    description: 'Heavy chest, lump in throat, watery eyes',
    color: 'bg-blue-900 text-blue-200'
  },
  {
    emotion: 'Joy',
    bodyParts: ['chest', 'face', 'whole body'],
    description: 'Warm chest, smiling face, light body',
    color: 'bg-emerald-900 text-emerald-200'
  },
  {
    emotion: 'Fear',
    bodyParts: ['stomach', 'legs', 'whole body'],
    description: 'Knot in stomach, weak legs, tense body',
    color: 'bg-purple-900 text-purple-200'
  }
];

interface BreathingStep {
  duration: number;
  action: 'inhale' | 'hold' | 'exhale';
  description: string;
}

const boxBreathingSteps: BreathingStep[] = [
  { duration: 4, action: 'inhale', description: 'Breathe in slowly through your nose' },
  { duration: 4, action: 'hold', description: 'Hold your breath' },
  { duration: 4, action: 'exhale', description: 'Breathe out slowly through your mouth' },
  { duration: 4, action: 'hold', description: 'Hold your breath' }
];

export function EmotionBodyMap() {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionLocation | null>(null);
  const [breathingStep, setBreathingStep] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleEmotionSelect = (emotion: EmotionLocation) => {
    setSelectedEmotion(emotion);
    setIsBreathingActive(false);
    if (timer) clearInterval(timer);
  };

  const startBreathing = () => {
    setIsBreathingActive(true);
    const interval = setInterval(() => {
      setBreathingStep((prev) => (prev + 1) % boxBreathingSteps.length);
    }, boxBreathingSteps[breathingStep].duration * 1000);
    setTimer(interval);
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
    if (timer) clearInterval(timer);
  };

  const resetBreathing = () => {
    stopBreathing();
    setBreathingStep(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Emotion Body Map</h2>

        {/* Emotion Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Select an Emotion</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {emotionLocations.map((emotion) => (
              <Button
                key={emotion.emotion}
                variant={selectedEmotion?.emotion === emotion.emotion ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleEmotionSelect(emotion)}
                className={`text-sm ${emotion.color}`}
              >
                {emotion.emotion}
              </Button>
            ))}
          </div>
        </div>

        {/* Body Map Display */}
        {selectedEmotion && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Where You Feel {selectedEmotion.emotion}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-64 mb-4">
                    {/* Simple body outline with highlighted areas */}
                    <div className="absolute inset-0 border-2 border-gray-600 rounded-lg"></div>
                    {selectedEmotion.bodyParts.map((part) => (
                      <div
                        key={part}
                        className={`absolute ${part === 'chest' ? 'top-1/4 left-1/4 w-1/2 h-1/4' : 
                          part === 'stomach' ? 'top-1/2 left-1/4 w-1/2 h-1/4' :
                          part === 'head' ? 'top-0 left-1/3 w-1/3 h-1/4' :
                          part === 'hands' ? 'top-1/3 left-0 w-1/4 h-1/4' :
                          part === 'legs' ? 'top-3/4 left-1/4 w-1/2 h-1/4' :
                          'top-1/4 left-1/4 w-1/2 h-1/2'} 
                          ${selectedEmotion.color.replace('text', 'bg')} opacity-50 rounded-full`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-gray-300 text-center">{selectedEmotion.description}</p>
                </div>
              </div>

              {/* Breathing Exercise */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-100 mb-3">Box Breathing Exercise</h4>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 border-4 border-emerald-500 rounded-lg mb-4 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-2xl font-bold text-emerald-500">
                        {boxBreathingSteps[breathingStep].duration}
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-sm text-gray-300">
                        {boxBreathingSteps[breathingStep].action}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-center mb-4">
                    {boxBreathingSteps[breathingStep].description}
                  </p>
                  <div className="flex gap-2">
                    {!isBreathingActive ? (
                      <Button onClick={startBreathing} size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    ) : (
                      <Button onClick={stopBreathing} size="sm">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button variant="outline" onClick={resetBreathing} size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emotion Wheel */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Emotion Wheel</h3>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {emotionLocations.map((emotion) => (
                <div
                  key={emotion.emotion}
                  className={`p-2 rounded-lg text-center ${emotion.color}`}
                >
                  {emotion.emotion}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 