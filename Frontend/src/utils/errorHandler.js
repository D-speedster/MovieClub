import Logger from './logger';

/**
 * Error Handler utility برای مدیریت خطاهای API و UI
 */

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const handleApiError = (error, context = 'API Call') => {
  Logger.error(`${context} Error:`, error);

  if (error.response) {
    // خطای HTTP response
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    
    switch (status) {
      case 404:
        return new ApiError('داده‌ای یافت نشد', status, error.response.data);
      case 500:
        return new ApiError('خطای سرور. لطفاً بعداً تلاش کنید', status, error.response.data);
      case 403:
        return new ApiError('دسترسی غیرمجاز', status, error.response.data);
      default:
        return new ApiError(message || 'خطای ناشناخته', status, error.response.data);
    }
  } else if (error.request) {
    // خطای شبکه
    return new ApiError('خطای اتصال. اتصال اینترنت خود را بررسی کنید', 0);
  } else {
    // خطای عمومی
    return new ApiError(error.message || 'خطای ناشناخته');
  }
};

export const showErrorToUser = (error, showAlert = true) => {
  const errorMessage = error instanceof ApiError ? error.message : 'خطای ناشناخته رخ داده است';
  
  if (showAlert && typeof window !== 'undefined') {
    // می‌توانید از SweetAlert2 یا notification library استفاده کنید
    alert(errorMessage);
  }
  
  return errorMessage;
};