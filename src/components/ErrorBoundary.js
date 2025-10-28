import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4">
          <div className="max-w-2xl w-full bg-dark-800 rounded-2xl p-8 border border-red-500/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-red-500/10 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  حدث خطأ غير متوقع
                </h1>
                <p className="text-gray-400">
                  عذلاً، حدث خطأ في التطبيق
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="mb-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-red-400 font-mono text-sm">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.href = '/';
                }}
                className="btn-primary flex-1"
              >
                العودة للصفحة الرئيسية
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary flex-1"
              >
                إعادة تحميل الصفحة
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-6">
                <summary className="cursor-pointer text-gray-400 hover:text-gray-300 mb-2">
                  تفاصيل الخطأ (Development Mode)
                </summary>
                <pre className="text-xs text-gray-500 overflow-auto p-4 bg-dark-900 rounded">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
