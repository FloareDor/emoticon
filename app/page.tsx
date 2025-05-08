'use client';

import { EmotionPractice } from '@/components/EmotionPractice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm mb-8">
          <CardHeader className="text-center relative">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-emerald-500" />
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Empathy Practice
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHelpDialogOpen(true)}
                className="p-0 h-6 text-gray-400 hover:text-emerald-400"
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">Help</span>
              </Button>
            </div>
            <CardDescription className="text-gray-400 text-lg">
              To help with <a href="https://www.google.com/search?q=what+is+alexithymia" target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-400 hover:underline">alexithymia</a>, emotional awareness and intelligence.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Practice Section */}
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <CardContent className="p-0">
            <EmotionPractice />
          </CardContent>
        </Card>
      </div>

      {/* Help/Disclaimer Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-gray-100 max-w-lg mx-4 w-[calc(100%-2rem)] sm:mx-auto sm:w-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              About Emoticon
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[50vh] sm:max-h-[60vh] pr-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-emerald-400 mb-1">What is this tool?</h3>
                <p className="text-sm text-gray-300">
                  This is a practice tool to help you recognize emotions in text messages and respond with empathy. It's especially useful for people with <a href="https://www.google.com/search?q=what+is+alexithymia" target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-400 hover:underline">alexithymia</a> (difficulty identifying and expressing emotions) or those wanting to improve their emotional intelligence and awareness. It's designed as a low-stakes way to build emotional intelligence skills you can apply in real conversations.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-emerald-400 mb-1">How to use it:</h3>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal pl-5">
                  <li>Read the message as if it's from a friend or colleague</li>
                  <li>Identify which emotions you think the person is feeling</li>
                  <li>Write a response that acknowledges those emotions</li>
                  <li>Get feedback on both your emotion recognition and response</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-medium text-emerald-400 mb-1">Important Limitations:</h3>
                <ul className="text-sm text-gray-300 space-y-2 list-disc pl-5">
                  <li>This is a practice tool, not therapy or clinical training</li>
                  <li>Emotional recognition from text alone is inherently limited</li>
                  <li>The AI feedback is helpful but not perfect</li>
                  <li>In real conversations, always prioritize the actual person over techniques</li>
                  <li><strong>This is only for practice</strong> and does not replace deeper emotional healing work</li>
                  <li><strong>This tool cannot substitute</strong> for the process of releasing/feeling long-suppressed emotions</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-emerald-400 mb-1">Tips for responding with empathy:</h3>
                <ul className="text-sm text-gray-300 space-y-2 list-disc pl-5">
                  <li><span className="text-emerald-400">Acknowledge</span> the emotions you notice</li>
                  <li><span className="text-emerald-400">Validate</span> that their feelings make sense</li>
                  <li><span className="text-emerald-400">Ask questions</span> to better understand their experience</li>
                  <li><span className="text-emerald-400">Be present</span> rather than rushing to solve their problems</li>
                  <li><span className="text-emerald-400">Be authentic</span> - forced empathy can feel worse than none</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-emerald-400 mb-1">Different levels:</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li><span className="font-medium">Level 1:</span> Basic emotions with clear context</li>
                  <li><span className="font-medium">Level 2:</span> More complex emotions with subtle cues</li>
                  <li><span className="font-medium">Level 3:</span> Mixed emotions and nuanced situations</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 w-full sm:w-auto">
                Got it
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
} 