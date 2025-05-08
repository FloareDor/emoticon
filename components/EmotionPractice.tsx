import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Star, CheckCircle2, XCircle, Loader2, ChevronLeft, ChevronRight, MessageSquare, Sparkles, Info, HelpCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from './ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

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
  const [customMessageDialogOpen, setCustomMessageDialogOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

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

  const handleSubmitCustomMessage = async () => {
    if (!customMessage || customMessage.trim() === '') return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze-custom-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: customMessage,
          level: currentLevel
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze custom message');
      }

      const data = await response.json();
      setCurrentMessage(data);
      setIdentifiedEmotions([]);
      setUserResponse('');
      setShowFeedback(false);
      setRating(null);
      setImprovedSuggestions([]);
      setCustomMessageDialogOpen(false);
      setCustomMessage('');
    } catch (err) {
      setError('Failed to analyze your custom message. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateNewMessage();
  }, [currentLevel, currentMode, currentIntensity]);

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
        {/* Help Button (Added) */}
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHelpDialogOpen(true)}
            className="p-0 h-6 text-gray-400 hover:text-emerald-400"
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">Disclaimer</span>
          </Button>
        </div>

        {/* Level Navigation */}
        <div className="p-4 sm:p-6 border-b border-gray-700">
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
              <p className="text-gray-400 text-sm sm:text-base">{LEVELS[currentLevel - 1].description}</p>
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
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-300">Emotional Tone</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Choose whether to practice with positive emotions (joy, gratitude) or negative emotions (sadness, anger) to build different emotional recognition skills.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex gap-2 justify-center">
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
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-300">Emotional Intensity</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Select how strong the emotions will be in the messages. Higher intensity means more obvious emotional cues, while mild requires more subtle recognition.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex gap-2 justify-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={currentIntensity === 'mild' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentIntensity('mild')}
                          className={currentIntensity === 'mild' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                        >
                          Mild
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Subtle emotions that are harder to detect</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={currentIntensity === 'moderate' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentIntensity('moderate')}
                          className={currentIntensity === 'moderate' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                        >
                          Moderate
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clear but not overwhelming emotions</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={currentIntensity === 'intense' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentIntensity('intense')}
                          className={currentIntensity === 'intense' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                        >
                          Intense
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Strong, obvious emotional expressions</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              {/* Custom Message Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomMessageDialogOpen(true)}
                  className="border-gray-700 hover:bg-gray-700 text-emerald-400"
                >
                  Use Custom Message
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Message Display */}
          <div className="bg-gray-700/30 rounded-lg border border-gray-600 p-3 sm:p-4">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
              <p className="text-gray-100 italic text-sm sm:text-base">"{currentMessage.text}"</p>
            </div>
          </div>

          {/* Emotion Identification */}
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-100">Identify Emotions</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHelpDialogOpen(true)}
                      className="p-0 h-6 text-gray-400 hover:text-emerald-400"
                    >
                      <HelpCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Disclaimer</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">This is only for practice and does not replace emotional healing work</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
                          ? 'bg-emerald-500/80 text-white border-emerald-600 font-medium'
                          : 'bg-red-500/80 text-white border-red-600 font-medium'
                        : 'bg-emerald-600 text-white border-emerald-700 font-medium shadow-md'
                      : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/70 hover:text-gray-100'
                  } text-xs sm:text-sm mb-1`}
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
            <div className="bg-gray-700/30 rounded-lg border border-gray-600 p-3 sm:p-4 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-100">Feedback</h3>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        i < (rating || 0) ? 'fill-emerald-500 text-emerald-500' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-xs sm:text-sm text-gray-300">
                {feedbackText}
              </div>

              <div>
                <h4 className="font-medium text-gray-100 mb-2 text-sm sm:text-base">Correct Emotions:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentMessage.correctEmotions.map((emotion) => (
                    <Button
                      key={emotion}
                      variant="outline"
                      size="sm"
                      className={`inline-flex items-center gap-1 text-xs sm:text-sm ${
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
                <h4 className="font-medium text-gray-100 mb-2 text-sm sm:text-base">Improved Responses:</h4>
                <ScrollArea className="h-[150px] sm:h-[200px] rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                  <div className="p-3 sm:p-4 space-y-3">
                    {improvedSuggestions.map((suggestion, index) => (
                      <p key={index} className="text-zinc-300 text-xs sm:text-sm">{suggestion}</p>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Response Practice */}
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-100">Practice Response</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHelpDialogOpen(true)}
                      className="p-0 h-6 text-gray-400 hover:text-emerald-400"
                    >
                      <HelpCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Disclaimer</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">This cannot substitute for releasing/feeling long-suppressed emotions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Write your empathetic response..."
              className="bg-gray-800/50 border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 text-gray-100 placeholder:text-gray-500 min-h-[80px] text-sm sm:text-base"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-3 sm:gap-4">
            <Button
              variant="outline"
              onClick={generateNewMessage}
              disabled={isLoading}
              className="flex-1 border-gray-700 hover:bg-gray-700 text-xs sm:text-sm py-2 h-auto"
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
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-xs sm:text-sm py-2 h-auto"
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

      {/* Custom Message Dialog */}
      <Dialog open={customMessageDialogOpen} onOpenChange={setCustomMessageDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-gray-100 sm:max-w-md mx-4 w-[calc(100%-2rem)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Enter Your Custom Message
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">
              Paste or type a message you'd like to analyze and practice responding to.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Enter a message from a friend or colleague..."
            className="min-h-[100px] bg-gray-800/50 border-gray-700 focus:border-emerald-500 focus:ring-emerald-500 text-gray-100 placeholder:text-gray-500 text-sm sm:text-base"
          />
          <DialogFooter>
            <Button
              onClick={handleSubmitCustomMessage}
              disabled={!customMessage.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 w-full sm:w-auto"
            >
              Analyze Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help Dialog (Added) */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-gray-100 mx-4 w-[calc(100%-2rem)] sm:mx-auto sm:w-auto max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Important Disclaimer
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[50vh] sm:max-h-[60vh] pr-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-300">
                  This is a practice tool to help you recognize emotions in text messages and respond with empathy. It's designed as a low-stakes way to build emotional intelligence skills.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-emerald-400 mb-1">Limitations:</h3>
                <ul className="text-sm text-gray-300 space-y-2 list-disc pl-5">
                  <li>This is a practice tool, not therapy or clinical training</li>
                  <li>Emotional recognition from text alone is inherently limited</li>
                  <li>The AI feedback is helpful but not perfect</li>
                  <li>In real conversations, always prioritize the actual person over techniques</li>
                  <li><strong>This is only for practice</strong> and does not replace deeper emotional healing work</li>
                  <li><strong>This tool cannot substitute</strong> for the process of releasing/feeling long-suppressed emotions</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 w-full sm:w-auto">
                I understand
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 