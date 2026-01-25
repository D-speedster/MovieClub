// Mock API Service برای جایگزینی دیتابیس خارجی

// Import JSON data - اگر مشکل داشت، از fetch استفاده می‌کنیم
let dbData;
try {
  dbData = require('../../data/db.json');
} catch (error) {
  Logger.warn('⚠️ نتوانست db.json را import کند، از fetch استفاده می‌کند');
  dbData = null;
}

class MockApiService {
  constructor() {
    this.data = null;
    this.delay = 500; // شبیه‌سازی تاخیر شبکه
    this.initializeData();
  }

  // بارگذاری داده‌ها
  async initializeData() {
    if (dbData) {
      this.data = dbData;
      Logger.log('✅ Mock API: داده‌ها از require بارگذاری شد');
    } else {
      try {
        // تلاش برای fetch کردن فایل JSON
        const response = await fetch('/data/db.json');
        if (response.ok) {
          this.data = await response.json();
          Logger.log('✅ Mock API: داده‌ها از fetch بارگذاری شد');
        } else {
          throw new Error('نتوانست db.json را fetch کند');
        }
      } catch (error) {
        Logger.error('❌ Mock API: خطا در بارگذاری داده‌ها:', error);
        // داده‌های پیش‌فرض
        this.data = {
          Moviez: [],
          Series: []
        };
      }
    }
  }

  // اطمینان از بارگذاری داده‌ها
  async ensureDataLoaded() {
    if (!this.data) {
      await this.initializeData();
    }
    return this.data;
  }

  // شبیه‌سازی تاخیر شبکه
  async simulateNetworkDelay() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  // دریافت تمام فیلم‌ها - مشابه /Moviez
  async getMoviez() {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    return {
      data: this.data.Moviez || [],
      status: 200,
      statusText: 'OK'
    };
  }

  // دریافت تمام سریال‌ها - مشابه /Series
  async getSeries() {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    return {
      data: this.data.Series || [],
      status: 200,
      statusText: 'OK'
    };
  }

  // دریافت فیلم خاص با ID
  async getMovieById(id) {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    const movie = this.data.Moviez?.find(movie => movie.id === id);
    
    if (!movie) {
      throw new Error(`Movie with ID ${id} not found`);
    }
    
    return {
      data: movie,
      status: 200,
      statusText: 'OK'
    };
  }

  // دریافت سریال خاص با ID
  async getSeriesById(id) {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    const series = this.data.Series?.find(series => series.id === id);
    
    if (!series) {
      throw new Error(`Series with ID ${id} not found`);
    }
    
    return {
      data: series,
      status: 200,
      statusText: 'OK'
    };
  }

  // دریافت BoxOffice (اولین فیلم به عنوان نمونه)
  async getBoxOffice() {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    const boxOfficeMovie = this.data.Moviez?.[0] || null;
    
    return {
      data: [boxOfficeMovie], // API اصلی آرایه برمی‌گرداند
      status: 200,
      statusText: 'OK'
    };
  }

  // جستجو در فیلم‌ها و سریال‌ها
  async search(query) {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    const searchQuery = query.toLowerCase();
    
    const movieResults = this.data.Moviez?.filter(movie => 
      movie.name?.toLowerCase().includes(searchQuery) ||
      movie.genre?.some(g => g.toLowerCase().includes(searchQuery))
    ) || [];
    
    const seriesResults = this.data.Series?.filter(series => 
      series.name?.toLowerCase().includes(searchQuery) ||
      series.genre?.toLowerCase().includes(searchQuery)
    ) || [];
    
    return {
      data: {
        movies: movieResults,
        series: seriesResults,
        total: movieResults.length + seriesResults.length
      },
      status: 200,
      statusText: 'OK'
    };
  }

  // فیلتر فیلم‌ها بر اساس ژانر
  async getMoviesByGenre(genre) {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    const filteredMovies = this.data.Moviez?.filter(movie => 
      movie.genre?.includes(genre)
    ) || [];
    
    return {
      data: filteredMovies,
      status: 200,
      statusText: 'OK'
    };
  }

  // فیلتر سریال‌ها بر اساس ژانر
  async getSeriesByGenre(genre) {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    const filteredSeries = this.data.Series?.filter(series => 
      series.genre?.includes(genre)
    ) || [];
    
    return {
      data: filteredSeries,
      status: 200,
      statusText: 'OK'
    };
  }

  // دریافت فیلم‌های محبوب (بر اساس امتیاز)
  async getPopularMovies(limit = 10) {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    const popularMovies = this.data.Moviez
      ?.sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate))
      .slice(0, limit) || [];
    
    return {
      data: popularMovies,
      status: 200,
      statusText: 'OK'
    };
  }

  // دریافت سریال‌های محبوب (بر اساس امتیاز)
  async getPopularSeries(limit = 10) {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    const popularSeries = this.data.Series
      ?.sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate))
      .slice(0, limit) || [];
    
    return {
      data: popularSeries,
      status: 200,
      statusText: 'OK'
    };
  }

  // دریافت آخرین فیلم‌ها (بر اساس سال)
  async getLatestMovies(limit = 10) {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    const latestMovies = this.data.Moviez
      ?.sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, limit) || [];
    
    return {
      data: latestMovies,
      status: 200,
      statusText: 'OK'
    };
  }

  // دریافت آخرین سریال‌ها (بر اساس سال)
  async getLatestSeries(limit = 10) {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    const latestSeries = this.data.Series
      ?.sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, limit) || [];
    
    return {
      data: latestSeries,
      status: 200,
      statusText: 'OK'
    };
  }

  // شبیه‌سازی خطا برای تست
  async simulateError() {
    await this.simulateNetworkDelay();
    throw new Error('Network Error: Unable to fetch data');
  }
}

// ایجاد instance واحد
const mockApiService = new MockApiService();

export default mockApiService;