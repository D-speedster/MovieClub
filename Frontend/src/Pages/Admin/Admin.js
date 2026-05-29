import { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import AdminDashboard from '../../components/Admin/Dashboard/AdminDashboard';
import './Admin.css';

export default function Admin() {
    const location = useLocation();
    
    useEffect(() => {
        document.body.style.backgroundColor = '#0F172A';
        
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, [])

    // اگر در مسیر اصلی admin هستیم، داشبورد جدید را نمایش دهیم
    // در غیر این صورت، از Outlet برای نمایش کامپوننت‌های فرعی استفاده کنیم
    const isMainAdminPath = location.pathname === '/admin' || location.pathname === '/admin/';
    
    if (isMainAdminPath) {
        return <AdminDashboard />;
    }

    // برای مسیرهای فرعی، از Outlet استفاده می‌کنیم
    return (
        <div className="admin-legacy-wrapper">
            <AdminDashboard />
        </div>
    );
}
