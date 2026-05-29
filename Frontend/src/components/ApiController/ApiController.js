import React, { useState, useEffect } from 'react';
import { 
  testApiConnection,
  getApiConfig 
} from '../../Services/apiConfig';
import './ApiController.css';

const ApiController = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [config] = useState(getApiConfig());

  useEffect(() => {
    // تست اتصال اولیه
    handleTestConnection();
  }, []);

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testApiConnection();
      setConnectionStatus(result);
    } catch (error) {
      setConnectionStatus({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="api-controller">
      <div className="api-controller-header">
        <h3>🔧 کنترل API</h3>
        <div className="api-status">
          <span className="status-indicator real">🌐</span>
          <span className="status-text">
            متصل به API سرور محلی
          </span>
        </div>
      </div>

      <div className="api-controller-content">
        <div className="api-actions">
          <button 
            className="test-button"
            onClick={handleTestConnection}
            disabled={isLoading}
          >
            {isLoading ? '⏳ در حال تست...' : '🔍 تست اتصال'}
          </button>
          
          <button 
            className="reload-button"
            onClick={handleReloadPage}
          >
            🔄 بارگذاری مجدد
          </button>
        </div>

        {connectionStatus && (
          <div className={`connection-status ${connectionStatus.success ? 'success' : 'error'}`}>
            <div className="status-header">
              {connectionStatus.success ? '✅' : '❌'} 
              وضعیت اتصال: {connectionStatus.success ? 'موفق' : 'ناموفق'}
            </div>
            
            <div className="status-details">
              <div>آدرس API: {config.REAL_API_BASE_URL}</div>
              {connectionStatus.success && connectionStatus.dataCount !== undefined && (
                <div>تعداد فیلم‌ها: {connectionStatus.dataCount}</div>
              )}
              {!connectionStatus.success && connectionStatus.error && (
                <div className="error-message">خطا: {connectionStatus.error}</div>
              )}
            </div>
          </div>
        )}

        <div className="api-config">
          <h4>تنظیمات API:</h4>
          <div className="config-item">
            <span>آدرس سرور:</span>
            <span>{config.REAL_API_BASE_URL}</span>
          </div>
          <div className="config-item">
            <span>Timeout:</span>
            <span>{config.TIMEOUT}ms</span>
          </div>
          <div className="config-item">
            <span>لاگ:</span>
            <span className={config.ENABLE_LOGGING ? 'enabled' : 'disabled'}>
              {config.ENABLE_LOGGING ? 'فعال' : 'غیرفعال'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiController;