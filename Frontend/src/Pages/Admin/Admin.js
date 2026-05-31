import { useEffect } from 'react';
import AdminDashboard from '../../components/Admin/Dashboard/AdminDashboard';
import './Admin.css';

export default function Admin() {
    useEffect(() => {
        document.body.style.backgroundColor = '#0F172A';
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    return <AdminDashboard />;
}
