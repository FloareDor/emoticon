'use client';

import { EmotionPractice } from '@/components/EmotionPractice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-emerald-500" />
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Empathy Practice
              </CardTitle>
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
    </main>
  );
} 