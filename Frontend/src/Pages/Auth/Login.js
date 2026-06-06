import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Swal from 'sweetalert2';
import Logger from '../../utils/logger';
import { validateForm, sanitizeInput } from '../../utils/validation';
import { setAuth } from '../../utils/auth';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import '../Auth/Auth.css';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);

  const handleInputChange = (field, value) => {
    const sanitized = field.includes('password') ? value : sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitized }));
    if (validationErrors[field]) setValidationErrors(prev => ({ ...prev, [field]: null }));
    if (error) setError(null);
  };

  const handleLogin = async e => {
    e.preventDefault();
    const rules = { username: { required: true }, password: { required: true } };
    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        Swal.fire({
          icon: 'error',
          title: 'خطا در ورود',
          text: data.message || 'لطفاً دوباره تلاش کنید',
          confirmButtonText: 'باشه',
          background: '#1E293B',
          color: '#FFFFFF',
        });
        return;
      }
      Swal.fire({
        icon: 'success',
        title: 'ورود موفق',
        text: 'به حساب کاربری خود خوش آمدید',
        confirmButtonText: 'باشه',
        background: '#1E293B',
        color: '#FFFFFF',
      });
     
         const userRole = data.role || 'User';
         // Redirect based on role: admin/owner to admin panel, regular user to user dashboard
         const target = (userRole.toLowerCase() === 'admin' || userRole.toLowerCase() === 'owner')
           ? '/admin'
           : '/user/dashboard';
      setAuth(userRole);
      setRedirectTo(target);
    } catch (err) {
      Logger.error('Login failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'خطا در اتصال به سرور',
        text: 'لطفاً دوباره تلاش کنید',
        confirmButtonText: 'باشه',
        background: '#1E293B',
        color: '#FFFFFF',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card-wrapper">
      <div className="auth-card">
        <div className="auth-visual">
          <img src={process.env.PUBLIC_URL + '/img/backi.jpg'} alt="poster" className="poster" />
        </div>
        <div className="auth-form-section">
          <div className="auth-form-container">
            <h2 className="auth-title">ورود</h2>
            {error && <div className="auth-error">{error}</div>}
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">نام کاربری</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={e => handleInputChange('username', e.target.value)}
                    placeholder="نام کاربری خود را وارد کنید"
                    className={validationErrors.username ? 'error' : ''}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
                {validationErrors.username && <span className="error-message">{validationErrors.username}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="password">رمز عبور</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    placeholder="رمز عبور خود را وارد کنید"
                    className={validationErrors.password ? 'error' : ''}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {validationErrors.password && <span className="error-message">{validationErrors.password}</span>}
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading || !formData.username || !formData.password}>
                {loading ? <LoadingSpinner size="small" /> : <><FiUser /> ورود</>}
              </button>
            </form>
            <div className="auth-footer">
              <p>حساب کاربری ندارید؟ <Link to="/auth/register" className="auth-link">ثبت نام کنید</Link></p>
            </div>
          </div>
        </div>
      </div>
      {redirectTo && <Navigate to={redirectTo} />}
    </div>
  );
}

