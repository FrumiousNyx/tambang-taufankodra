import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const AdvancedToast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  action
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setIsVisible(true);

    // Auto-dismiss
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      // Remove from DOM
      const element = document.getElementById(`toast-${id}`);
      if (element) {
        element.remove();
      }
    }, 300);
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'error':
        return <AlertCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
      case 'info':
        return <Info className={`${iconClass} text-blue-500`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div
      id={`toast-${id}`}
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`
        ${getBgColor()}
        border rounded-lg shadow-lg p-4
        flex items-start gap-3
        backdrop-blur-sm
      `}>
        {getIcon()}
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900">
            {title}
          </h4>
          {message && (
            <p className="text-sm text-gray-600 mt-1">
              {message}
            </p>
          )}
          
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

// Toast Manager
class ToastManager {
  private toasts: Map<string, ToastProps> = new Map();
  private container: HTMLElement | null = null;

  constructor() {
    this.createContainer();
  }

  private createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.className = 'fixed top-0 right-0 z-50 p-4 space-y-2 pointer-events-none';
    document.body.appendChild(this.container);
  }

  show(toast: Omit<ToastProps, 'id'>): string {
    const id = Math.random().toString(36).substr(2, 9);
    const fullToast: ToastProps = { ...toast, id };

    this.toasts.set(id, fullToast);

    if (this.container) {
      const toastElement = document.createElement('div');
      toastElement.id = `toast-${id}`;
      this.container.appendChild(toastElement);

      // Render React component
      // Note: In a real app, you'd use ReactDOM.render here
      toastElement.innerHTML = `
        <div class="fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-out">
          <div class="${this.getToastClass(toast.type)} border rounded-lg shadow-lg p-4 flex items-start gap-3">
            ${this.getIconHtml(toast.type)}
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-semibold text-gray-900">${toast.title}</h4>
              ${toast.message ? `<p class="text-sm text-gray-600 mt-1">${toast.message}</p>` : ''}
            </div>
            <button onclick="document.getElementById('toast-${id}').remove()" class="flex-shrink-0 p-1 rounded-md hover:bg-black/5">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      `;
    }

    return id;
  }

  private getToastClass(type: ToastProps['type']): string {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  }

  private getIconHtml(type: ToastProps['type']): string {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'success':
        return `<svg class="${iconClass} text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
      case 'error':
        return `<svg class="${iconClass} text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
      case 'warning':
        return `<svg class="${iconClass} text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>`;
      case 'info':
        return `<svg class="${iconClass} text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
      default:
        return `<svg class="${iconClass} text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    }
  }

  dismiss(id: string) {
    const element = document.getElementById(`toast-${id}`);
    if (element) {
      element.remove();
    }
    this.toasts.delete(id);
  }

  clear() {
    this.toasts.forEach((_, id) => this.dismiss(id));
  }
}

export const toastManager = new ToastManager();

// Convenience functions
export const toast = {
  success: (title: string, message?: string) => 
    toastManager.show({ type: 'success', title, message }),
  
  error: (title: string, message?: string) => 
    toastManager.show({ type: 'error', title, message }),
  
  warning: (title: string, message?: string) => 
    toastManager.show({ type: 'warning', title, message }),
  
  info: (title: string, message?: string) => 
    toastManager.show({ type: 'info', title, message })
};

export default AdvancedToast;
