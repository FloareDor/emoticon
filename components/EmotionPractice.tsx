import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, CheckCircle2, XCircle, Loader2, ChevronLeft, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';

interface PracticeMessage {
  id: string;
  text: string;
  correctEmotions: string[];
  possibleEmotions: string[];
  suggestedResponses: string[];
  level: number;
}

const LEVELS = [
  {
    level: 1,
    name: 'Beginner',
    description: 'Basic emotions, clear context',
    emotions: ['happy', 'sad', 'angry', 'scared', 'excited', 'surprised'],
    modes: ['positive', 'negative'],
    intensities: ['mild', 'moderate', 'intense']
  },
  {
    level: 2,
    name: 'Intermediate',
    description: 'Complex emotions, subtle context',
    emotions: ['frustrated', 'disappointed', 'proud', 'anxious', 'hopeful', 'lonely'],
    modes: ['positive', 'negative'],
    intensities: ['mild', 'moderate', 'intense']
  },
  {
    level: 3,
    name: 'Advanced',
    description: 'Mixed emotions, nuanced context',
    emotions: ['vulnerable', 'resentful', 'grateful', 'overwhelmed', 'insecure', 'content'],
    modes: ['positive', 'negative'],
    intensities: ['mild', 'moderate', 'intense']
  }
];

export function EmotionPractice() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentMode, setCurrentMode] = useState<'positive' | 'negative'>('negative');
  const [currentIntensity, setCurrentIntensity] = useState<'mild' | 'moderate' | 'intense'>('moderate');
  const [showOptions, setShowOptions] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<PracticeMessage | null>(null);
  const [identifiedEmotions, setIdentifiedEmotions] = useState<string[]>([]);
  const [userResponse, setUserResponse] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [improvedSuggestions, setImprovedSuggestions] = useState<string[]>([]);

  const generateNewMessage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: 'relationship',
          complexity: LEVELS[currentLevel - 1].name.toLowerCase(),
          level: currentLevel,
          mode: currentMode,
          intensity: currentIntensity
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate message');
      }

      const data = await response.json();
      setCurrentMessage(data);
      setIdentifiedEmotions([]);
      setUserResponse('');
      setShowFeedback(false);
      setRating(null);
      setImprovedSuggestions([]);
    } catch (err) {
      setError('Failed to generate a new message. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentMessage || !userResponse) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalMessage: currentMessage.text,
          identifiedEmotions,
          userResponse,
          level: currentLevel
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze response');
      }

      const data = await response.json();
      setRating(data.rating);
      setFeedbackText(data.feedback);
      setImprovedSuggestions(data.suggestions);
      setShowFeedback(true);
    } catch (err) {
      setError('Failed to analyze your response. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateNewMessage();
  }, [currentLevel]);

  const handleEmotionSelect = (emotion: string) => {
    if (identifiedEmotions.includes(emotion)) {
      setIdentifiedEmotions(identifiedEmotions.filter(e => e !== emotion));
    } else {
      setIdentifiedEmotions([...identifiedEmotions, emotion]);
    }
  };

  const handleLevelChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
    } else if (direction === 'next' && currentLevel < LEVELS.length) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  if (isLoading && !currentMessage) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 shadow-sm p-6">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 shadow-sm p-6">
          <div className="text-center text-red-400 mb-4">{error}</div>
          <Button onClick={generateNewMessage} className="w-full bg-emerald-500 hover:bg-emerald-600">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!currentMessage) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 shadow-sm">
        {/* Level Navigation */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLevelChange('prev')}
              disabled={currentLevel === 1}
              className="border-gray-700 hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                  Level {currentLevel}
                </h2>
              </div>
              <p className="text-gray-400">{LEVELS[currentLevel - 1].description}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLevelChange('next')}
              disabled={currentLevel === LEVELS.length}
              className="border-gray-700 hover:bg-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Options Toggle Button */}
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOptions(!showOptions)}
              className="border-gray-700 hover:bg-gray-700"
            >
              {showOptions ? 'Hide Options' : 'Show Options'}
            </Button>
          </div>

          {/* Mode and Intensity Selectors */}
          {showOptions && (
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              <div className="flex gap-2">
                <Button
                  variant={currentMode === 'positive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentMode('positive')}
                  className={currentMode === 'positive' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                >
                  Positive
                </Button>
                <Button
                  variant={currentMode === 'negative' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentMode('negative')}
                  className={currentMode === 'negative' ? 'bg-red-500 hover:bg-red-600' : ''}
                >
                  Negative
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={currentIntensity === 'mild' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentIntensity('mild')}
                  className={currentIntensity === 'mild' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                >
                  Mild
                </Button>
                <Button
                  variant={currentIntensity === 'moderate' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentIntensity('moderate')}
                  className={currentIntensity === 'moderate' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                >
                  Moderate
                </Button>
                <Button
                  variant={currentIntensity === 'intense' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentIntensity('intense')}
                  className={currentIntensity === 'intense' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                >
                  Intense
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Message Display */}
          <div className="bg-gray-700/30 rounded-lg border border-gray-600 p-4">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-500 mt-1" />
              <p className="text-gray-100 italic">"{currentMessage.text}"</p>
            </div>
          </div>

          {/* Emotion Identification */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Identify Emotions</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {currentMessage.possibleEmotions.map((emotion) => (
                <Button
                  key={emotion}
                  variant={identifiedEmotions.includes(emotion) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleEmotionSelect(emotion)}
                  className={`${
                    identifiedEmotions.includes(emotion)
                      ? showFeedback
                        ? currentMessage.correctEmotions.includes(emotion)
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-gray-700 text-gray-100 border-gray-600'
                      : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  {emotion}
                  {showFeedback && (
                    <>
                      {currentMessage.correctEmotions.includes(emotion) && identifiedEmotions.includes(emotion) && (
                        <CheckCircle2 className="h-3 w-3 ml-1" />
                      )}
                      {!currentMessage.correctEmotions.includes(emotion) && identifiedEmotions.includes(emotion) && (
                        <XCircle className="h-3 w-3 ml-1" />
                      )}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          {showFeedback && (
            <div className="bg-gray-700/30 rounded-lg border border-gray-600 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-100">Feedback</h3>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < (rating || 0) ? 'fill-emerald-500 text-emerald-500' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-300">
                {feedbackText}
              </div>

              <div>
                <h4 className="font-medium text-gray-100 mb-2">Correct Emotions:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentMessage.correctEmotions.map((emotion) => (
                    <Button
                      key={emotion}
                      variant="outline"
                      size="sm"
                      className={`inline-flex items-center gap-1 ${
                        identifiedEmotions.includes(emotion)
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-gray-800/50 text-gray-400 border-gray-600'
                      }`}
                    >
                      {emotion}
                      {identifiedEmotions.includes(emotion) ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-100 mb-2">Improved Responses:</h4>
                <ScrollArea className="h-[200px] rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <div className="p-4 space-y-3">
                    {improvedSuggestions.map((suggestion, index) => (
                      <p key={index} className="text-zinc-300 text-sm">{suggestion}</p>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Response Practice */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Practice Response</h3>
            <Input
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Write your empathetic response..."
              className="bg-gray-800/50 border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 text-gray-100 placeholder:text-gray-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={generateNewMessage}
              disabled={isLoading}
              className="flex-1 border-gray-700 hover:bg-gray-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Refresh Message'
              )}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !identifiedEmotions.length || !userResponse}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 