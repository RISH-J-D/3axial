import React from 'react';

interface Props {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<Props, {hasError: boolean}> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(_: Error) {
    return {hasError: true};
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In a real project, log to an external service
    console.error('ErrorBoundary caught', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex h-screen items-center justify-center bg-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-ink mb-4">Something went wrong</h1>
            <p className="text-muted">Please try refreshing the page or contact support.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

