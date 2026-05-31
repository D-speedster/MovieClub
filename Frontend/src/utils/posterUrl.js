/**
 * تبدیل نام فایل poster به URL کامل
 * - همه فایل‌های poster از backend/uploads سرو می‌شن
 */
export const getPosterUrl = (posterPath) => {
    if (!posterPath) return '';
    if (posterPath.startsWith('http')) return posterPath;
    const backendUrl = process.env.REACT_APP_API_BASE_URL
        ? process.env.REACT_APP_API_BASE_URL.replace(/\/api$/, '')
        : 'http://localhost:3001';
    return `${backendUrl}/uploads/${posterPath}`;
};
