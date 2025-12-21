import React, { Component, ErrorInfo, ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch React errors and display a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-screen w-full flex items-center justify-center p-6"
          style={{ backgroundColor: '#d3d3d3', color: '#111111' }}
        >
          <div className="max-w-2xl w-full bg-white border border-black p-8 font-mono">
            <div className="flex items-start justify-between mb-6">
              <h1 className="text-xl font-bold uppercase tracking-widest">
                Er is een fout opgetreden
              </h1>
              <button
                onClick={this.handleReset}
                className="p-2 hover:bg-gray-100 transition-colors"
                aria-label="Probeer opnieuw"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <p className="text-gray-700">
                Er is iets misgegaan bij het laden van deze pagina. Probeer de pagina te vernieuwen.
              </p>

              {(process.env.NODE_ENV === 'development') && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-xs uppercase tracking-widest mb-2">
                    Technische details (alleen in development)
                  </summary>
                  <pre className="bg-gray-100 p-4 text-xs overflow-auto max-h-64">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-3 bg-black text-white font-mono text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Pagina vernieuwen
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

