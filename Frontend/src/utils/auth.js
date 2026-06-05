const TOKEN_KEY = 'token';
const ROLE_KEY  = 'role';

export const setAuth = (role) => {
  localStorage.setItem(TOKEN_KEY, 'authenticated');
  localStorage.setItem(ROLE_KEY, role);
  window.dispatchEvent(new Event('auth-change'));
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  window.dispatchEvent(new Event('auth-change'));
};

export const getToken  = () => localStorage.getItem(TOKEN_KEY);
export const getRole   = () => localStorage.getItem(ROLE_KEY);
export const isLoggedIn = () => !!localStorage.getItem(TOKEN_KEY);

