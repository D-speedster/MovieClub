// Adapter برای سازگاری با API calls موجود
import mockApiService from './mockApiSimple';
import Logger from '../../utils/logger';

// شبیه‌سازی axios response structure
const createAxiosResponse = (data, status = 200, statusText = 'OK') => ({
  data,
  status,
  statusText,
  headers: {},
  config: {},
  request: {}
});

// Mock API Adapter که مشابه axios.create عمل می‌کند
class MockApiAdapter {
  constructor() {
    this.baseURL = 'mock://localhost';
  }

  // شبیه‌سازی axios.get
  async get(endpoint) {
    try {
      Logger.log(`🔄 Mock API Call: GET ${endpoint}`);
      
      switch (endpoint) {
        case '/Moviez':
          const moviesResponse = await mockApiService.getMoviez();
          return createAxiosResponse(moviesResponse.data);
          
        case '/Series':
          const seriesResponse = await mockApiService.getSeries();
          return createAxiosResponse(seriesResponse.data);
          
        case '/BoxOffice':
          const boxOfficeResponse = await mockApiService.getBoxOffice();
          return createAxiosResponse(boxOfficeResponse.data);
          
        case '/Comments':
          const commentsResponse = await mockApiService.getComments();
          return createAxiosResponse(commentsResponse.data);
          
        default:
          // بررسی اگر endpoint شامل ID باشد
          if (endpoint.startsWith('/Movie/')) {
            const id = endpoint.replace('/Movie/', '');
            const movieResponse = await mockApiService.getMovieById(id);
            return createAxiosResponse(movieResponse.data);
          }
          
          if (endpoint.startsWith('/Series/')) {
            const id = endpoint.replace('/Series/', '');
            const seriesResponse = await mockApiService.getSeriesById(id);
            return createAxiosResponse(seriesResponse.data);
          }
          
          // اگر endpoint شناخته نشد
          Logger.warn(`⚠️ Unknown endpoint: ${endpoint}`);
          return createAxiosResponse([], 404, 'Not Found');
      }
    } catch (error) {
      Logger.error(`❌ Mock API Error for ${endpoint}:`, error.message);
      throw {
        response: {
          data: { message: error.message },
          status: 500,
          statusText: 'Internal Server Error'
        },
        message: error.message
      };
    }
  }

  // شبیه‌سازی axios.post (برای آینده)
  async post(endpoint, data) {
    Logger.log(`🔄 Mock API Call: POST ${endpoint}`, data);
    
    try {
      switch (endpoint) {
        case '/Comments':
          const commentResponse = await mockApiService.postComment(data);
          return createAxiosResponse(commentResponse.data, 201, 'Created');
          
        default:
          // در حال حاضر فقط Comments پشتیبانی می‌شود
          return createAxiosResponse({ message: 'POST endpoint not implemented' }, 501);
      }
    } catch (error) {
      Logger.error(`❌ Mock API POST Error for ${endpoint}:`, error.message);
      throw {
        response: {
          data: { message: error.message },
          status: 500,
          statusText: 'Internal Server Error'
        },
        message: error.message
      };
    }
  }

  // شبیه‌سازی axios.put (برای آینده)
  async put(endpoint, data) {
    Logger.log(`🔄 Mock API Call: PUT ${endpoint}`, data);
    return createAxiosResponse({ message: 'PUT not implemented in mock' }, 501);
  }

  // شبیه‌سازی axios.delete (برای آینده)
  async delete(endpoint) {
    Logger.log(`🔄 Mock API Call: DELETE ${endpoint}`);
    return createAxiosResponse({ message: 'DELETE not implemented in mock' }, 501);
  }

  // متدهای اضافی برای دسترسی مستقیم به mock service
  async searchMovies(query) {
    const response = await mockApiService.search(query);
    return createAxiosResponse(response.data);
  }

  async getMoviesByGenre(genre) {
    const response = await mockApiService.getMoviesByGenre(genre);
    return createAxiosResponse(response.data);
  }

  async getPopularMovies(limit) {
    const response = await mockApiService.getPopularMovies(limit);
    return createAxiosResponse(response.data);
  }

  async getLatestMovies(limit) {
    const response = await mockApiService.getLatestMovies(limit);
    return createAxiosResponse(response.data);
  }
}

// ایجاد instance واحد
const mockApiAdapter = new MockApiAdapter();

export default mockApiAdapter;