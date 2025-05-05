import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  onDismiss: (id: string) => void;
}

export const Toast = ({ id, title, description, onDismiss }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(id), 300); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md border border-gray-200 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onDismiss(id), 300);
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}; 