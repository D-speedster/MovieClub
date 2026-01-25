import React, { useState, useEffect } from 'react';
import { 
  switchToMockApi, 
  switchToRealApi, 
  getCurrentApiType, 
  testApiConnection,
  getApiConfig 
} from '../../Services/apiConfig';
import './ApiController.css';

const ApiController = () => {
  const [currentApi, setCurrentApi] = useState(getCurrentApiType());
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState(getApiConfig());

  useEffect(() => {
    // تست اتصال اولیه
    handleTestConnection();
  }, []);

  const handleSwitchToMock = () => {
    switchToMockApi();
    setCurrentApi(getCurrentApiType());
    setConfig(getApiConfig());
    handleTestConnection();
  };

  const handleSwitchToReal = () => {
    switchToRealApi();
    setCurrentApi(getCurrentApiType());
    setConfig(getApiConfig());
    handleTestConnection();
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testApiConnection();
      setConnectionStatus(result);
    } catch (error) {
      setConnectionStatus({
        success: false,
        apiType: getCurrentApiType(),
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
          <span className={`status-indicator ${currentApi.toLowerCase()}`}>
            {currentApi === 'Mock' ? '🎭' : '🌐'}
          </span>
          <span className="status-text">
            در حال استفاده از {currentApi === 'Mock' ? 'Mock API' : 'Real API'}
          </span>
        </div>
      </div>

      <div className="api-controller-content">
        <div className="api-switches">
          <button 
            className={`api-switch ${currentApi === 'Mock' ? 'active' : ''}`}
            onClick={handleSwitchToMock}
            disabled={isLoading}
          >
            🎭 Mock API
            <small>داده‌های محلی</small>
          </button>
          
          <button 
            className={`api-switch ${currentApi === 'Real' ? 'active' : ''}`}
            onClick={handleSwitchToReal}
            disabled={isLoading}
          >
            🌐 Real API
            <small>دیتابیس خارجی</small>
          </button>
        </div>

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
              <div>نوع API: {connectionStatus.apiType}</div>
              {connectionStatus.success && connectionStatus.dataCount !== undefined && (
                <div>تعداد داده‌ها: {connectionStatus.dataCount}</div>
              )}
              {!connectionStatus.success && connectionStatus.error && (
                <div className="error-message">خطا: {connectionStatus.error}</div>
              )}
            </div>
          </div>
        )}

        <div className="api-config">
          <h4>تنظیمات فعلی:</h4>
          <div className="config-item">
            <span>Mock API:</span>
            <span className={config.USE_MOCK_API ? 'enabled' : 'disabled'}>
              {config.USE_MOCK_API ? 'فعال' : 'غیرفعال'}
            </span>
          </div>
          <div className="config-item">
            <span>تاخیر Mock:</span>
            <span>{config.MOCK_DELAY}ms</span>
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