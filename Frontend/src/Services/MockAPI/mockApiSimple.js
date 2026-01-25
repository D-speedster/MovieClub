// Mock API Service ساده - بدون وابستگی به import JSON
import Logger from '../../utils/logger';

class MockApiService {
  constructor() {
    // Singleton pattern
    if (MockApiService.instance) {
      return MockApiService.instance;
    }
    
    this.data = null;
    this.delay = 500;
    this.isLoading = false;
    
    MockApiService.instance = this;
  }

  // داده‌های نمونه برای تست
  getDefaultData() {
    return {
      Moviez: [
        {
          id: "tt0800369",
          name: "Thor",
          year: "2011",
          genre: ["اکشن", "فانتزی"],
          rate: "7.0",
          poster: "https://m.media-amazon.com/images/M/MV5BOGE4NzU1YTAtNzA3Mi00ZTA2LTg2YmYtMDJmMThiMjlkYjg2XkEyXkFqcGdeQXVyNTgzMDMzMTg@._V1_SX300.jpg",
          time: "115 min",
          story: "The warrior Thor is cast out of Asgard and sent to Earth.",
          TranslateText: "ثور جنگجو از آسگارد رانده شده و به زمین فرستاده می‌شود.",
          awards: "5 wins & 30 nominations",
          director: "Kenneth Branagh",
          stars: "Chris Hemsworth, Anthony Hopkins, Natalie Portman",
          countries: "United States",
          writers: "Ashley Miller, Zack Stentz, Don Payne",
          CreatedAt: "2023-08-24"
        },
        {
          id: "tt7286456",
          name: "Joker",
          year: "2019",
          genre: ["جنایی", "درام", "دلهره آور"],
          rate: "8.4",
          poster: "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
          time: "122 min",
          story: "Arthur Fleck works as a clown and becomes the Joker.",
          TranslateText: "آرتور فلک به عنوان دلقک کار می‌کند و تبدیل به جوکر می‌شود.",
          awards: "Won 2 Oscars. 122 wins & 239 nominations total",
          director: "Todd Phillips",
          stars: "Joaquin Phoenix, Robert De Niro, Zazie Beetz",
          countries: "United States, Canada",
          writers: "Todd Phillips, Scott Silver, Bob Kane",
          CreatedAt: "2023-08-24"
        },
        {
          id: "tt0816692",
          name: "میان ستاره ای",
          year: "2014",
          genre: ["ماجراجویی", "درام", "تخیلی"],
          rate: "8.7",
          poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
          time: "169 min",
          story: "Earth's future has been riddled by disasters, famines, and droughts.",
          TranslateText: "آینده زمین با بلایا، قحطی و خشکسالی پر شده است.",
          awards: "Won 1 Oscar. 44 wins & 148 nominations total",
          director: "Christopher Nolan",
          stars: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
          countries: "United States, United Kingdom, Canada",
          writers: "Jonathan Nolan, Christopher Nolan",
          CreatedAt: "2023-08-24"
        }
      ],
      Series: [
        {
          id: "tt0903747",
          name: "Breaking Bad",
          year: "2008",
          genre: "جنایی، درام، دلهره آور",
          rate: "9.5",
          poster: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_Ratio0.6762_AL_.jpg",
          TranslateText: "یک معلم شیمی مبتلا به سرطان شروع به تولید مواد مخدر می‌کند.",
          type: "TVSeries",
          awards: "Top rated TV #2 | Won 16 Primetime Emmys",
          director: "",
          stars: "Bryan Cranston, Aaron Paul, Anna Gunn",
          countries: "ایالات متحده آمریکا",
          writers: "",
          CreatedAt: "2023-06-11"
        },
        {
          id: "tt2306299",
          name: "Vikings",
          year: "2013",
          genre: "اکشن، ماجراجویی، درام",
          rate: "8.5",
          poster: "https://m.media-amazon.com/images/M/MV5BODk4ZjU0NDUtYjdlOS00OTljLTgwZTUtYjkyZjk1NzExZGIzXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_Ratio0.6762_AL_.jpg",
          TranslateText: "داستان راگنار لوثبروک و وایکینگ‌ها.",
          type: "TVSeries",
          awards: "Won 1 Primetime Emmy",
          director: "",
          stars: "Katheryn Winnick, Gustaf Skarsgård, Alexander Ludwig",
          countries: "ایرلند، کانادا",
          writers: "",
          CreatedAt: "2023-06-11"
        }
      ],
      BoxOffice: [
        {
          id: "tt7286456",
          name: "Joker",
          year: "2019",
          genre: ["جنایی", "درام", "دلهره آور"],
          rate: "8.4",
          poster: "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
          time: "122 min",
          story: "Arthur Fleck works as a clown and becomes the Joker.",
          TranslateText: "آرتور فلک به عنوان دلقک کار می‌کند و تبدیل به جوکر می‌شود."
        }
      ],
      Comments: []
    };
  }

  // بارگذاری داده‌ها
  async loadData() {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      Logger.log('🔄 تلاش برای بارگذاری داده‌ها از /data/db.json...');
      
      // تست اینکه آیا فایل در دسترس است
      const testResponse = await fetch('/data/db.json', { method: 'HEAD' });
      Logger.log('📁 فایل db.json status:', testResponse.status);
      
      // تلاش برای بارگذاری از فایل JSON
      const response = await fetch('/data/db.json');
      Logger.log('📥 Response status:', response.status, response.statusText);
      
      if (response.ok) {
        const jsonData = await response.json();
        Logger.log('📊 JSON data keys:', Object.keys(jsonData));
        Logger.log('🎬 Moviez count:', jsonData.Moviez?.length || 0);
        
        this.data = jsonData;
        Logger.log('✅ Mock API: داده‌ها از فایل JSON بارگذاری شد');
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      Logger.warn('⚠️ Mock API: خطا در بارگذاری فایل JSON:', error.message);
      Logger.log('🔄 استفاده از داده‌های پیش‌فرض...');
      this.data = this.getDefaultData();
      Logger.log('✅ داده‌های پیش‌فرض بارگذاری شد، Moviez count:', this.data.Moviez.length);
    } finally {
      this.isLoading = false;
    }
  }

  // اطمینان از بارگذاری داده‌ها
  async ensureDataLoaded() {
    if (!this.data) {
      Logger.log('🔄 داده‌ها موجود نیست، شروع بارگذاری...');
      await this.loadData();
    }
    Logger.log('📊 ensureDataLoaded - data exists:', !!this.data);
    Logger.log('📊 ensureDataLoaded - Moviez exists:', !!this.data?.Moviez);
    return this.data;
  }

  // شبیه‌سازی تاخیر شبکه
  async simulateNetworkDelay() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  // دریافت تمام فیلم‌ها
  async getMoviez() {
    try {
      await this.simulateNetworkDelay();
      const data = await this.ensureDataLoaded();
      
      Logger.log('Mock API getMoviez - data loaded:', !!data);
      Logger.log('Mock API getMoviez - Moviez exists:', !!data?.Moviez);
      Logger.log('Mock API getMoviez - Moviez length:', data?.Moviez?.length || 0);
      
      // اگر داده‌ها موجود هستند
      if (data && data.Moviez && Array.isArray(data.Moviez) && data.Moviez.length > 0) {
        Logger.log('✅ بازگشت داده‌های اصلی Moviez');
        return {
          data: data.Moviez,
          status: 200,
          statusText: 'OK'
        };
      }
      
      // اگر داده‌ها موجود نیستند، از default استفاده کن
      Logger.warn('⚠️ داده‌های Moviez موجود نیست، استفاده از default data');
      const defaultData = this.getDefaultData();
      return {
        data: defaultData.Moviez,
        status: 200,
        statusText: 'OK'
      };
      
    } catch (error) {
      Logger.error('❌ خطا در getMoviez:', error);
      // در صورت خطا، حتماً default data برگردان
      const defaultData = this.getDefaultData();
      return {
        data: defaultData.Moviez,
        status: 200,
        statusText: 'OK'
      };
    }
  }

  // دریافت تمام سریال‌ها
  async getSeries() {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    return {
      data: this.data.Series || [],
      status: 200,
      statusText: 'OK'
    };
  }

  // دریافت BoxOffice
  async getBoxOffice() {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    // اگر BoxOffice در داده‌ها موجود است، از آن استفاده کن
    if (this.data.BoxOffice && this.data.BoxOffice.length > 0) {
      return {
        data: this.data.BoxOffice,
        status: 200,
        statusText: 'OK'
      };
    }
    
    // در غیر این صورت از اولین فیلم استفاده کن
    const boxOfficeMovie = this.data.Moviez?.[0] || this.getDefaultData().Moviez[0];
    
    return {
      data: [boxOfficeMovie],
      status: 200,
      statusText: 'OK'
    };
  }

  // دریافت فیلم با ID
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

  // دریافت سریال با ID
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

  // دریافت نظرات
  async getComments() {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    return {
      data: this.data.Comments || [],
      status: 200,
      statusText: 'OK'
    };
  }

  // اضافه کردن نظر
  async postComment(commentData) {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    if (!this.data.Comments) {
      this.data.Comments = [];
    }
    
    const newComment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.data.Comments.push(newComment);
    
    return {
      data: newComment,
      status: 201,
      statusText: 'Created'
    };
  }

  // جستجو
  async search(query) {
    await this.simulateNetworkDelay();
    await this.ensureDataLoaded();
    
    const searchQuery = query.toLowerCase();
    
    const movieResults = this.data.Moviez?.filter(movie => 
      movie.name?.toLowerCase().includes(searchQuery)
    ) || [];
    
    const seriesResults = this.data.Series?.filter(series => 
      series.name?.toLowerCase().includes(searchQuery)
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
}

// Static property for singleton
MockApiService.instance = null;

// ایجاد instance واحد
const mockApiService = new MockApiService();

export default mockApiService;