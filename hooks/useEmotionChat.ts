import { useState } from 'react';
import { useSWRConfig } from 'swr';

interface EmotionMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useEmotionChat() {
  const [messages, setMessages] = useState<EmotionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const sendMessage = async (message: string, context?: string) => {
    setIsLoading(true);
    const userMessage: EmotionMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('/api/emotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, context }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: EmotionMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      const errorMessage: EmotionMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  };
} 