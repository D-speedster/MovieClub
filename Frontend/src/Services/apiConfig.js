// تنظیمات API - برای اتصال به Real API
import axios from "axios";
import Logger from "../utils/logger";
import { handleApiError } from "../utils/errorHandler";

// تنظیمات محیط
const API_CONFIG = {
  REAL_API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "",
  
  // تنظیمات شبکه
  TIMEOUT: 10000, // 10 ثانیه
  RETRY_ATTEMPTS: 3,
  
  // تنظیمات لاگ
  ENABLE_LOGGING: true
};

// ایجاد API instance
const apiInstance = axios.create({
  baseURL: API_CONFIG.REAL_API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // ارسال cookie در همه درخواست‌ها (برای isAdmin middleware)
  headers: {
    'Content-Type': 'application/json'
  }
});

// اضافه کردن interceptor برای لاگ کردن API calls
apiInstance.interceptors.request.use(
  (config) => {
    if (API_CONFIG.ENABLE_LOGGING) {
      Logger.log(`🌐 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    Logger.error('❌ API Request Error:', error);
    return Promise.reject(handleApiError(error, 'API Request'));
  }
);

apiInstance.interceptors.response.use(
  (response) => {
    if (API_CONFIG.ENABLE_LOGGING) {
      Logger.log(`✅ API Response: ${response.status} ${response.statusText}`);
    }
    return response;
  },
  (error) => {
    Logger.error('❌ API Response Error:', error.response?.status, error.message);
    return Promise.reject(handleApiError(error, 'API Response'));
  }
);

// API instance اصلی که در کل پروژه استفاده می‌شود
const ApiRequest = apiInstance;

export const getApiConfig = () => ({ ...API_CONFIG });

// تابع تست اتصال
export const testApiConnection = async () => {
  try {
    const response = await ApiRequest.get('/content/movieList');
    Logger.log(`✅ API Connection Test Successful`);
    return {
      success: true,
      dataCount: response.data?.length || 0
    };
  } catch (error) {
    const handledError = handleApiError(error, 'API Connection Test');
    Logger.error(`❌ API Connection Test Failed:`, handledError.message);
    return {
      success: false,
      error: handledError.message
    };
  }
};

export default ApiRequest;