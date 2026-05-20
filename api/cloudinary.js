const cloudinary = require('cloudinary').v2;

const FOLDER = 'tripify';

function isConfigured() {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

function configure() {
  if (!isConfigured()) {
    console.warn('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.');
    return false;
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return true;
}

function uploadFromBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: FOLDER, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

async function uploadFromUrl(url) {
  const result = await cloudinary.uploader.upload(url, {
    folder: FOLDER,
    resource_type: 'image',
  });
  return result.secure_url;
}

module.exports = {
  isConfigured,
  configure,
  uploadFromBuffer,
  uploadFromUrl,
};
