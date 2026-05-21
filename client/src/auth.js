const TOKEN_KEY = 'tripify_token';
const REDIRECT_KEY = 'tripify_redirect';

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setRedirectAfterLogin(path) {
  if (path) {
    sessionStorage.setItem(REDIRECT_KEY, path);
  }
}

export function consumeRedirectAfterLogin() {
  const path = sessionStorage.getItem(REDIRECT_KEY);
  sessionStorage.removeItem(REDIRECT_KEY);
  return path || null;
}
