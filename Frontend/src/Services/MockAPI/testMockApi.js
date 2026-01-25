// فایل تست برای Mock API
import mockApiService from './mockApi';
import mockApiAdapter from './mockApiAdapter';
import Logger from '../../utils/logger';

// تست‌های Mock API Service
export const testMockApiService = async () => {
  Logger.log('🧪 شروع تست Mock API Service...');
  
  try {
    // تست دریافت فیلم‌ها
    Logger.log('📽️ تست دریافت فیلم‌ها...');
    const moviesResponse = await mockApiService.getMoviez();
    Logger.log(`✅ فیلم‌ها: ${moviesResponse.data.length} فیلم دریافت شد`);
    
    // تست دریافت سریال‌ها
    Logger.log('📺 تست دریافت سریال‌ها...');
    const seriesResponse = await mockApiService.getSeries();
    Logger.log(`✅ سریال‌ها: ${seriesResponse.data.length} سریال دریافت شد`);
    
    // تست BoxOffice
    Logger.log('🏆 تست BoxOffice...');
    const boxOfficeResponse = await mockApiService.getBoxOffice();
    Logger.log(`✅ BoxOffice: ${boxOfficeResponse.data.length} آیتم دریافت شد`);
    
    // تست جستجو
    Logger.log('🔍 تست جستجو...');
    const searchResponse = await mockApiService.search('batman');
    Logger.log(`✅ جستجو: ${searchResponse.data.movies.length} فیلم و ${searchResponse.data.series.length} سریال یافت شد`);
    
    // تست فیلتر ژانر
    Logger.log('🎭 تست فیلتر ژانر...');
    const genreResponse = await mockApiService.getMoviesByGenre('اکشن');
    Logger.log(`✅ ژانر اکشن: ${genreResponse.data.length} فیلم یافت شد`);
    
    Logger.log('🎉 تمام تست‌های Mock API Service موفق بود!');
    return true;
    
  } catch (error) {
    Logger.error('❌ خطا در تست Mock API Service:', error);
    return false;
  }
};

// تست‌های Mock API Adapter
export const testMockApiAdapter = async () => {
  Logger.log('🧪 شروع تست Mock API Adapter...');
  
  try {
    // تست endpoint های اصلی
    const endpoints = ['/Moviez', '/Series', '/BoxOffice'];
    
    for (const endpoint of endpoints) {
      Logger.log(`🔗 تست endpoint: ${endpoint}`);
      const response = await mockApiAdapter.get(endpoint);
      Logger.log(`✅ ${endpoint}: ${response.data.length} آیتم دریافت شد`);
    }
    
    // تست endpoint نامعتبر
    Logger.log('❓ تست endpoint نامعتبر...');
    const invalidResponse = await mockApiAdapter.get('/invalid-endpoint');
    Logger.log(`✅ Endpoint نامعتبر: status ${invalidResponse.status} دریافت شد`);
    
    Logger.log('🎉 تمام تست‌های Mock API Adapter موفق بود!');
    return true;
    
  } catch (error) {
    Logger.error('❌ خطا در تست Mock API Adapter:', error);
    return false;
  }
};

// تست کامل
export const runAllTests = async () => {
  Logger.log('🚀 شروع تست‌های کامل Mock API...');
  Logger.log('=' .repeat(50));
  
  const serviceTest = await testMockApiService();
  Logger.log('=' .repeat(50));
  
  const adapterTest = await testMockApiAdapter();
  Logger.log('=' .repeat(50));
  
  if (serviceTest && adapterTest) {
    Logger.log('🎊 تمام تست‌ها موفق بود! Mock API آماده استفاده است.');
  } else {
    Logger.log('⚠️ برخی تست‌ها ناموفق بود. لطفاً مشکلات را بررسی کنید.');
  }
  
  return serviceTest && adapterTest;
};

// اجرای خودکار تست‌ها در محیط development
if (process.env.NODE_ENV === 'development') {
  // تست‌ها را فقط یک بار اجرا کن
  if (!window.mockApiTested) {
    window.mockApiTested = true;
    setTimeout(() => {
      runAllTests();
    }, 1000);
  }
}