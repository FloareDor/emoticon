import { useState } from 'react';
import { useEmotionChat } from '@/hooks/useEmotionChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Send, Trash2 } from 'lucide-react';

export function EmotionChat() {
  const { messages, isLoading, sendMessage, clearChat } = useEmotionChat();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Emotion Explorer</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            className="text-slate-500 hover:text-slate-700"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[400px] mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-emerald-50 ml-auto max-w-[80%]'
                  : 'bg-slate-100 mr-auto max-w-[80%]'
              }`}
            >
              <div className="text-sm text-slate-500 mb-2">
                {format(message.timestamp, 'h:mm a')}
              </div>
              <div className="text-slate-800 whitespace-pre-wrap">{message.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-pulse text-slate-500">Thinking...</div>
            </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your feelings..."
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
} 