import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi';
import Swal from 'sweetalert2';
import ApiRequest from '../../Services/Axios/config';
import Logger from '../../utils/logger';
import { validateForm, sanitizeInput } from '../../utils/validation';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import './Register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (field, value) => {
    const sanitizedValue = field.includes('password') ? value : sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    const rules = {
      username: { required: true, minLength: 3 },
      email: { required: true, email: true },
      password: { required: true, minLength: 6 },
      confirmPassword: { required: true }
    };

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationErrors({ confirmPassword: 'رمز عبور و تکرار آن یکسان نیستند' });
      return;
    }

    try {
      setLoading(true);
      setValidationErrors({});

      const userData = {
        user: formData.username,
        email: formData.email,
        password: formData.password,
        type: 'User'
      };

      Logger.log('Registration attempt for user:', formData.username);

      await ApiRequest.post('/Users', userData);
      Logger.log('Registration successful');
      
      Swal.fire({
        icon: 'success',
        title: 'ثبت نام موفق',
        text: 'حساب کاربری شما با موفقیت ایجاد شد',
        confirmButtonText: 'باشه',
        background: '#1E293B',
        color: '#FFFFFF'
      });

      // Clear form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

    } catch (error) {
      Logger.error('Registration failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطا در ثبت نام',
        text: 'لطفاً دوباره تلاش کنید',
        confirmButtonText: 'باشه',
        background: '#1E293B',
        color: '#FFFFFF'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="auth-container"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/backi.jpg)` }}
    >
      <div className="auth-background"></div>
      
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-visual">
            <div className="auth-visual-content">
              <h1>مووی کلاب</h1>
              <p>عضو جامعه بزرگ علاقه‌مندان فیلم و سریال شوید</p>
              <div className="auth-visual-decoration"></div>
            </div>
          </div>
          
          <div className="auth-form-section">
            <div className="auth-form-container">
              <div className="auth-header">
                <h2>ایجاد حساب کاربری</h2>
                <p>برای شروع، اطلاعات خود را وارد کنید</p>
              </div>

              <form onSubmit={handleRegister} className="auth-form">
                <div className="form-group">
                  <label htmlFor="username">نام کاربری</label>
                  <div className="input-wrapper">
                    <FiUser className="input-icon" />
                    <input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="نام کاربری مورد نظر خود را وارد کنید"
                      className={validationErrors.username ? 'error' : ''}
                      disabled={loading}
                      autoComplete="username"
                    />
                  </div>
                  {validationErrors.username && (
                    <span className="error-message">{validationErrors.username}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">ایمیل</label>
                  <div className="input-wrapper">
                    <FiMail className="input-icon" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="آدرس ایمیل خود را وارد کنید"
                      className={validationErrors.email ? 'error' : ''}
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                  {validationErrors.email && (
                    <span className="error-message">{validationErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">رمز عبور</label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="رمز عبور قوی انتخاب کنید"
                      className={validationErrors.password ? 'error' : ''}
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <span className="error-message">{validationErrors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">تکرار رمز عبور</label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="رمز عبور خود را مجدداً وارد کنید"
                      className={validationErrors.confirmPassword ? 'error' : ''}
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <span className="error-message">{validationErrors.confirmPassword}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading || !formData.username || !formData.email || !formData.password || !formData.confirmPassword}
                >
                  {loading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      <FiUserPlus />
                      ثبت نام
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  قبلاً حساب کاربری دارید؟{' '}
                  <Link to="/auth/login" className="auth-link">
                    وارد شوید
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}