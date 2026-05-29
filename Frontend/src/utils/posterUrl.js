/**
 * تبدیل نام فایل poster به URL کامل
 * - فایل‌های آپلود شده (با timestamp): از backend/uploads
 * - بقیه: از public/img
 */
export const getPosterUrl = (posterPath) => {
    if (!posterPath) return '';
    if (posterPath.startsWith('http')) return posterPath;
    if (/^\d{13}-/.test(posterPath)) {
        return `http://localhost:3001/uploads/${posterPath}`;
    }
    return `${process.env.PUBLIC_URL}/img/${posterPath}`;
};
