import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import Swal from 'sweetalert2';
import ApiRequest from '../../Services/Axios/config';
import Logger from '../../utils/logger';
import { handleApiError, showErrorToUser } from '../../utils/errorHandler';
import { validateForm, sanitizeInput } from '../../utils/validation';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import './Login.css';

export default function Login() {
  const handleLogin2 = async (event) => {
    event.preventDefault();
    let data = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      })
    });
    let res = await data.json();
    console.log(res);
  }
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [checkTrue, setCheckTrue] = useState(false);
  const [userPermission, setUserPermission] = useState('');

  useEffect(() => {
    Logger.log('Login status changed:', checkTrue);
  }, [checkTrue]);

  const handleInputChange = (field, value) => {
    const sanitizedValue = field === 'password' ? value : sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }

    // Clear general error
    if (error) setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    const rules = {
      username: { required: true, minLength: 3 },
      password: { required: true, minLength: 6 }
    };

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setValidationErrors({});

      const response = await ApiRequest.get('/Users');
      const users = Object.entries(response.data).filter(
        ([_, userData]) => userData.user === formData.username
      );

      if (users.length === 0) {
        setError('نام کاربری یافت نشد');
        return;
      }

      const userData = users[0][1];

      if (userData.password === formData.password) {
        setUserPermission(userData.type);

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: '#1E293B',
          color: '#FFFFFF',
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });

        Toast.fire({
          icon: 'success',
          title: 'ورود موفقیت‌آمیز بود'
        });

        setTimeout(() => {
          setCheckTrue(true);
          document.cookie = "checkLogin=True";
        }, 2500);

      } else {
        setError('رمز عبور اشتباه است');
      }
    } catch (err) {
      const handledError = handleApiError(err, 'Login API');
      setError(handledError.message);
      Logger.error('Login error:', handledError);
      showErrorToUser(handledError, false);
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
              <p>به بزرگترین مجموعه فیلم و سریال خوش آمدید</p>
              <div className="auth-visual-decoration"></div>
            </div>
          </div>

          <div className="auth-form-section">
            <div className="auth-form-container">
              <div className="auth-header">
                <h2>ورود به حساب کاربری</h2>
                <p>برای دسترسی به حساب خود وارد شوید</p>
              </div>

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <form method='post' action='http://localhost:3001/auth/login' onSubmit={handleLogin2} className="auth-form">
                <div className="form-group">
                  <label htmlFor="username">نام کاربری</label>
                  <div className="input-wrapper">
                    <FiUser className="input-icon" />
                    <input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="نام کاربری خود را وارد کنید"
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
                  <label htmlFor="password">رمز عبور</label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="رمز عبور خود را وارد کنید"
                      className={validationErrors.password ? 'error' : ''}
                      disabled={loading}
                      autoComplete="current-password"
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

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading || !formData.username || !formData.password}
                >
                  {loading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      <FiLogIn />
                      ورود
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  حساب کاربری ندارید؟{' '}
                  <Link to="/auth/register" className="auth-link">
                    ثبت نام کنید
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {userPermission === 'Owner' && <Navigate to="/admin" />}
      {userPermission === 'User' && <Navigate to="/user" />}
    </div>
  );
}