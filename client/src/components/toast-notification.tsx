import { useEffect, useState } from "react";
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

export interface ToastData {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface ToastNotificationProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

export function ToastNotification({ toast, onRemove }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const timeoutIn = setTimeout(() => setIsVisible(true), 100);
    
    // Auto remove
    const timeoutOut = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 3000);

    return () => {
      clearTimeout(timeoutIn);
      clearTimeout(timeoutOut);
    };
  }, [toast.id, toast.duration, onRemove]);

  const bgColor = {
    'info': 'bg-card border-border',
    'success': 'bg-green-900/50 border-green-500/50',
    'warning': 'bg-yellow-900/50 border-yellow-500/50',
    'error': 'bg-red-900/50 border-red-500/50'
  }[toast.type];

  const Icon = {
    'info': Info,
    'success': CheckCircle,
    'warning': AlertTriangle,
    'error': AlertCircle
  }[toast.type];

  return (
    <div
      className={`${bgColor} border rounded-lg p-4 shadow-lg backdrop-blur-sm max-w-sm transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      data-testid={`toast-${toast.type}`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{toast.message}</p>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => onRemove(toast.id)}
          data-testid="toast-close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose addToast globally for easy access
  useEffect(() => {
    (window as any).showToast = addToast;
    return () => {
      delete (window as any).showToast;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2" data-testid="toast-container">
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}
