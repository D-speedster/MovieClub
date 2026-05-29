import React from 'react';
import Logger from '../../utils/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    Logger.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="error-boundary" style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#ffe0e0',
          color: '#d63031',
          textAlign: 'center'
        }}>
          <h2>⚠️ خطایی رخ داده است</h2>
          <p>متأسفانه مشکلی در نمایش این بخش پیش آمده است.</p>
          
          {process.env.NODE_ENV === 'development' && (
            <details style={{ 
              marginTop: '10px', 
              textAlign: 'left',
              backgroundColor: '#fff',
              padding: '10px',
              borderRadius: '4px'
            }}>
              <summary>جزئیات خطا (فقط در حالت توسعه)</summary>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#0984e3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            بارگذاری مجدد صفحه
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;