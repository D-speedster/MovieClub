import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Stack, CircularProgress, Alert,
    Select, MenuItem, FormControl
} from '@mui/material';
import { FiUsers, FiTrash2 } from 'react-icons/fi';
import ApiRequest from '../../../Services/Axios/config';
import Swal from 'sweetalert2';
import Logger from '../../../utils/logger';

const ROLES = ['User', 'Admin', 'Owner'];

const roleColor = (role) => {
    if (role === 'Owner') return { bg: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: 'rgba(239,68,68,0.25)' };
    if (role === 'Admin') return { bg: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: 'rgba(124,58,237,0.25)' };
    return { bg: 'rgba(59,130,246,0.1)', color: '#93c5fd', border: 'rgba(59,130,246,0.2)' };
};

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', username: '', email: '', password: '', role: 'User' });
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await ApiRequest.get('/users');
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            Logger.error('خطا در دریافت کاربران:', err);
            setError('خطا در دریافت لیست کاربران');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleRoleChange = async (userId, newRole, username) => {
        // Prevent self‑editing
        const loggedUsername = localStorage.getItem('username');
        if (loggedUsername && loggedUsername === username) {
            Swal.fire({ icon: 'warning', title: 'نقش خود را نمی‌توانید تغییر دهید', background: 'var(--adm-surface)', color: 'var(--adm-text)' });
            return;
        }
        try {
        await ApiRequest.put(`/users/${userId}`, { role: newRole });
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
            Swal.fire({ icon: 'success', title: 'نقش کاربر تغییر کرد', timer: 1500, showConfirmButton: false, background: 'var(--adm-surface)', color: 'var(--adm-text)' });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'خطا در تغییر نقش', background: 'var(--adm-surface)', color: 'var(--adm-text)' });
        }
    };

    const handleDelete = async (userId, username) => {
        const loggedUsername = localStorage.getItem('username');
        if (loggedUsername && loggedUsername === username) {
            Swal.fire({ icon: 'warning', title: 'نمی‌توانید خودتان را حذف کنید', background: 'var(--adm-surface)', color: 'var(--adm-text)' });
            return;
        }
        const result = await Swal.fire({
            title: `حذف کاربر "${username}"؟`,
            text: 'این عملیات قابل بازگشت نیست',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'بله، حذف شود',
            cancelButtonText: 'انصراف',
            background: 'var(--adm-surface)',
            color: 'var(--adm-text)',
            confirmButtonColor: '#ef4444',
        });
        if (!result.isConfirmed) return;
        try {
            await ApiRequest.delete(`/users/${userId}`);
            setUsers(prev => prev.filter(u => u._id !== userId));
            Swal.fire({ icon: 'success', title: 'کاربر حذف شد', timer: 1500, showConfirmButton: false, background: 'var(--adm-surface)', color: 'var(--adm-text)' });
        } catch (err) {
            Swal.fire({ icon: 'error', title: err.response?.data?.message || 'خطا در حذف کاربر', background: 'var(--adm-surface)', color: 'var(--adm-text)' });
        }
    };

    const handleAddUser = async () => {
        try {
            // Backend registration endpoint is /auth/register
            await ApiRequest.post('/auth/register', newUser, { withCredentials: true });
            Swal.fire({ icon: 'success', title: 'کاربر جدید اضافه شد', timer: 1500, showConfirmButton: false, background: 'var(--adm-surface)', color: 'var(--adm-text)' });
            setShowAddModal(false);
            setNewUser({ name: '', username: '', email: '', password: '', role: 'User' });
            fetchUsers();
        } catch (err) {
            Swal.fire({ icon: 'error', title: err.response?.data?.message || 'خطا در افزودن کاربر', background: 'var(--adm-surface)', color: 'var(--adm-text)' });
        }
    };

    return (
        <>
        <Box dir="rtl">
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                <Box sx={{ width: 36, height: 36, borderRadius: '9px', bgcolor: 'var(--adm-accent-subtle)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiUsers style={{ fontSize: 18, color: 'var(--adm-accent)' }} />
                </Box>
                <Box>
                <Typography fontWeight={700} sx={{ color: 'var(--adm-text)', fontSize: 16 }}>مدیریت کاربران</Typography>
                <Typography variant="caption" sx={{ color: 'var(--adm-text-3)' }}>{users.length} کاربر ثبت‌نام شده</Typography>
            </Box>
            <Box ml="auto">
                <button onClick={() => setShowAddModal(true)} style={{ background: 'var(--adm-accent)', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>افزودن کاربر جدید</button>
            </Box>
        </Stack>

            {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(239,68,68,0.08)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</Alert>}

            {loading ? (
                <Box display="flex" justifyContent="center" py={6}>
                    <CircularProgress sx={{ color: 'var(--adm-accent)' }} />
                </Box>
            ) : users.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6, color: 'var(--adm-text-3)' }}>
                    <FiUsers style={{ fontSize: 40, opacity: 0.3, marginBottom: 12 }} />
                    <Typography>هیچ کاربری یافت نشد</Typography>
                </Box>
            ) : (
                <Box sx={{ bgcolor: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '10px', overflow: 'hidden' }}>
                    {/* Table Header */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 140px 80px', gap: 2, px: 2.5, py: 1.5, bgcolor: 'var(--adm-surface-2)', borderBottom: '1px solid var(--adm-border)' }}>
                        {['نام', 'نام کاربری', 'ایمیل', 'نقش', 'عملیات'].map(h => (
                            <Typography key={h} variant="caption" sx={{ color: 'var(--adm-text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</Typography>
                        ))}
                    </Box>

                    {/* Rows */}
                    {users.map((user, idx) => {
                        const rc = roleColor(user.role);
                        return (
                            <Box key={user._id} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 140px 80px', gap: 2, px: 2.5, py: 1.5, alignItems: 'center', borderBottom: idx < users.length - 1 ? '1px solid var(--adm-border)' : 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                <Typography sx={{ color: 'var(--adm-text)', fontSize: 14, fontWeight: 500 }}>{user.name || '—'}</Typography>
                                <Typography sx={{ color: 'var(--adm-text-2)', fontSize: 13 }}>{user.username}</Typography>
                                <Typography sx={{ color: 'var(--adm-text-3)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</Typography>

                                {/* Role Selector */}
                    <FormControl size="small" disabled={localStorage.getItem('username') === user.username}>
                        <Select
                            value={user.role || 'User'}
                            onChange={e => handleRoleChange(user._id, e.target.value, user.username)}
                            sx={{ color: rc.color, bgcolor: rc.bg, border: `1px solid ${rc.border}`, borderRadius: '6px', fontSize: 12, fontWeight: 600, '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiSvgIcon-root': { color: rc.color } }}
                        >
                            {ROLES.map(r => <MenuItem key={r} value={r} sx={{ fontSize: 13 }}>{r}</MenuItem>)}
                        </Select>
                    </FormControl>

                                {/* Delete */}
                {localStorage.getItem('username') !== user.username && (
                <button
                    onClick={() => handleDelete(user._id, user.username)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', transition: 'background 0.2s' }}
                    title="حذف کاربر"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                    <FiTrash2 size={16} />
                </button>
                )}
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Box>
        {/* Add User Modal */}
        {showAddModal && (
            <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ bgcolor: 'var(--adm-surface)', p: 4, borderRadius: '8px', width: 400 }}>
                    <Typography variant="h6" mb={2}>افزودن کاربر جدید</Typography>
                    {['name','username','email','password'].map(field => (
                        <Box key={field} mb={2}>
                            <input
                                placeholder={field === 'password' ? 'رمز عبور' : field}
                                type={field === 'password' ? 'password' : 'text'}
                                value={newUser[field]}
                                onChange={e => setNewUser(prev => ({ ...prev, [field]: e.target.value }))}
                                style={{ width: '100%', height: 46, padding: '0 12px', background: 'var(--adm-surface-2)', border: '1px solid var(--adm-border)', borderRadius: '6px', color: 'var(--adm-text)' }}
                            />
                        </Box>
                    ))}
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <Select value={newUser.role} onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value }))} sx={{ height: 46, bgcolor: 'var(--adm-surface-2)', color: 'var(--adm-text)' }}>
                            {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--adm-text-3)', cursor: 'pointer' }}>لغو</button>
                        <button onClick={handleAddUser} style={{ background: 'var(--adm-accent)', border: 'none', color: '#fff', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>ثبت</button>
                    </Stack>
                </Box>
            </Box>
        )}
    </>
    );
}
