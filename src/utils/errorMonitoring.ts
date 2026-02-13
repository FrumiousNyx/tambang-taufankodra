// Advanced Error Monitoring System
interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  language?: string;
}

class ErrorMonitor {
  private errors: ErrorInfo[] = [];
  private maxErrors = 50;

  constructor() {
    this.setupGlobalHandlers();
  }

  private setupGlobalHandlers() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });
  }

  captureError(errorInfo: Partial<ErrorInfo>) {
    const fullErrorInfo: ErrorInfo = {
      message: errorInfo.message || 'Unknown error',
      stack: errorInfo.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(),
      language: this.getLanguage()
    };

    // Add to errors array
    this.errors.unshift(fullErrorInfo);
    
    // Keep only last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', fullErrorInfo);
    }

    // Track in analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.trackError(
        new Error(fullErrorInfo.message),
        fullErrorInfo.url
      );
    }

    // Send to external service (in production)
    if (process.env.NODE_ENV === 'production') {
      this.sendToService(fullErrorInfo);
    }
  }

  private getUserId(): string | undefined {
    // Get user ID from auth context or localStorage
    return localStorage.getItem('userId') || undefined;
  }

  private getLanguage(): string | undefined {
    // Get language from context or localStorage
    return localStorage.getItem('language') || undefined;
  }

  private async sendToService(errorInfo: ErrorInfo) {
    // In production, send to error monitoring service
    try {
      // Example: Send to your error tracking endpoint
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo),
      });
    } catch (e) {
      console.error('Failed to send error to service:', e);
    }
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
  }

  getErrorStats() {
    const total = this.errors.length;
    const byMessage = this.errors.reduce((acc, error) => {
      acc[error.message] = (acc[error.message] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byMessage,
      recent: this.errors.slice(0, 10)
    };
  }
}

export const errorMonitor = new ErrorMonitor();

// React Error Boundary integration
export const captureReactError = (error: Error, errorInfo: React.ErrorInfo) => {
  errorMonitor.captureError({
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack
  });
};
