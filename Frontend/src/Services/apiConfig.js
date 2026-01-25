// تنظیمات API - برای تغییر بین Mock و Real API
import axios from "axios";
import mockApiAdapter from "./MockAPI/mockApiAdapter";
import Logger from "../utils/logger";
import { handleApiError } from "../utils/errorHandler";

// تنظیمات محیط
const API_CONFIG = {
  // تغییر این مقدار برای تغییر بین mock و real API
  USE_MOCK_API: true, // true = Mock API, false = Real API
  
  REAL_API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "https://database-kappa-five.vercel.app/",
  MOCK_API_BASE_URL: "mock://localhost",
  
  // تنظیمات شبکه
  TIMEOUT: 10000, // 10 ثانیه
  RETRY_ATTEMPTS: 3,
  
  // تنظیمات Mock API
  MOCK_DELAY: 500, // میلی‌ثانیه
  ENABLE_LOGGING: true
};

// ایجاد Real API instance
const realApiInstance = axios.create({
  baseURL: API_CONFIG.REAL_API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// اضافه کردن interceptor برای لاگ کردن Real API calls
realApiInstance.interceptors.request.use(
  (config) => {
    if (API_CONFIG.ENABLE_LOGGING) {
      Logger.log(`🌐 Real API Call: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    Logger.error('❌ Real API Request Error:', error);
    return Promise.reject(handleApiError(error, 'Real API Request'));
  }
);

realApiInstance.interceptors.response.use(
  (response) => {
    if (API_CONFIG.ENABLE_LOGGING) {
      Logger.log(`✅ Real API Response: ${response.status} ${response.statusText}`);
    }
    return response;
  },
  (error) => {
    Logger.error('❌ Real API Response Error:', error.response?.status, error.message);
    return Promise.reject(handleApiError(error, 'Real API Response'));
  }
);

// تابع انتخاب API
const getApiInstance = () => {
  if (API_CONFIG.USE_MOCK_API) {
    Logger.log('🎭 Using Mock API');
    return mockApiAdapter;
  } else {
    Logger.log('🌐 Using Real API');
    return realApiInstance;
  }
};

// API instance اصلی که در کل پروژه استفاده می‌شود
const ApiRequest = getApiInstance();

// تابع‌های کمکی برای تغییر تنظیمات
export const switchToMockApi = () => {
  API_CONFIG.USE_MOCK_API = true;
  Logger.log('🎭 Switched to Mock API');
};

export const switchToRealApi = () => {
  API_CONFIG.USE_MOCK_API = false;
  Logger.log('🌐 Switched to Real API');
};

export const getCurrentApiType = () => {
  return API_CONFIG.USE_MOCK_API ? 'Mock' : 'Real';
};

export const getApiConfig = () => ({ ...API_CONFIG });

// تابع تست اتصال
export const testApiConnection = async () => {
  try {
    const response = await ApiRequest.get('/Moviez');
    Logger.log(`✅ API Connection Test Successful (${getCurrentApiType()} API)`);
    return {
      success: true,
      apiType: getCurrentApiType(),
      dataCount: response.data?.length || 0
    };
  } catch (error) {
    const handledError = handleApiError(error, 'API Connection Test');
    Logger.error(`❌ API Connection Test Failed (${getCurrentApiType()} API):`, handledError.message);
    return {
      success: false,
      apiType: getCurrentApiType(),
      error: handledError.message
    };
  }
};

export default ApiRequest;