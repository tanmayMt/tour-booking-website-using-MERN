export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const UPLOADS_URL = `${API_BASE_URL.replace(/\/$/, '')}/uploads`;

/** Build image URL — supports full URLs from API or local filenames */
export function getPhotoUrl(src) {
  if (!src) return '';
  const value = String(src);
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  const normalized = value.replace(/\\/g, '/').replace(/^\/+/, '');
  const encodedPath = normalized.split('/').map(encodeURIComponent).join('/');
  return `${UPLOADS_URL}/${encodedPath}`;
}
