/** Build image URL — Cloudinary URLs from API are used as-is */
export function getPhotoUrl(src) {
  if (!src) return '';
  return String(src);
}
