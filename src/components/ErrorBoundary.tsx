import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { captureReactError } from '@/utils/errorMonitoring';
import { analytics } from '@/utils/analytics';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Advanced error monitoring
    captureReactError(error, errorInfo);
    
    // Track in analytics
    analytics.trackError(error, 'ErrorBoundary');

    // Log error to console in development only
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    // Send to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendErrorToService(error, errorInfo);
    }
  }

  sendErrorToService = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });
    } catch (e) {
      console.error('Failed to send error to service:', e);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-4 p-6 bg-card rounded-lg shadow-lg border">
            <div className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Oops! Something went wrong
              </h1>
              
              <p className="text-muted-foreground mb-6">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-2 p-3 bg-muted rounded text-xs font-mono text-destructive overflow-auto max-h-32">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </div>
                </details>
              )}

              <div className="space-y-3">
                <button
                  onClick={this.handleReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                >
                  Go Home
                </button>

                {process.env.NODE_ENV === 'production' && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Error: ${this.state.error?.message}\nStack: ${this.state.error?.stack}`
                      );
                      alert('Error details copied to clipboard');
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/90 transition-colors"
                  >
                    <Bug className="w-4 h-4" />
                    Copy Error Details
                  </button>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-6">
                If this problem persists, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
