require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('./models/User');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cloudinaryService = require('./cloudinary');

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 4000;

if (!process.env.MONGO_URL) {
  console.error('Missing required environment variable: MONGO_URL');
  process.exit(1);
}
if (!jwtSecret) {
  console.error('Missing required environment variable: JWT_SECRET');
  process.exit(1);
}

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.PRODUCTION_CLIENT_URL,
].filter(Boolean);

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  credentials: true,
  origin: allowedOrigins,
}));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

if (cloudinaryService.configure()) {
  console.log('Cloudinary configured successfully');
}

function sanitizeUser(user) {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
}

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, (err, userData) => {
      if (err) return reject(err);
      resolve(userData);
    });
  });
}

function getClientBaseUrl() {
  if (process.env.NODE_ENV === 'production') {
    return process.env.PRODUCTION_CLIENT_URL || process.env.CLIENT_URL;
  }
  return process.env.CLIENT_URL || 'http://localhost:5173';
}

function createMailTransporter() {
  if (!process.env.SENDER_GMAIL || !process.env.SENDER_GMAIL_PASSCODE) {
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_GMAIL,
      pass: process.env.SENDER_GMAIL_PASSCODE,
    },
  });
}

function getApiPublicUrl() {
  const url = process.env.API_PUBLIC_URL || process.env.RENDER_EXTERNAL_URL;
  if (url) return url.replace(/\/$/, '');
  return `http://localhost:${PORT}`;
}

function toAbsolutePhotoUrl(photo) {
  if (!photo) return photo;
  const value = String(photo);
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  const normalized = value.replace(/\\/g, '/').replace(/^\/+/, '');
  const encodedPath = normalized.split('/').map(encodeURIComponent).join('/');
  return `${getApiPublicUrl()}/uploads/${encodedPath}`;
}

function withPhotoUrls(place) {
  if (!place) return place;
  const doc = place.toObject ? place.toObject() : { ...place };
  if (Array.isArray(doc.photos)) {
    doc.photos = doc.photos.map(toAbsolutePhotoUrl);
  }
  return doc;
}

function withPhotoUrlsList(places) {
  return places.map(withPhotoUrls);
}

app.get('/test', (req, res) => {
  res.json('test ok');
});

app.get('/', (req, res) => {
  res.send('<h1>Tour Booking System Server</h1>');
});

app.post('/register', async (req, res) => {
  const { name, email, userType, password } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }
  if (!email?.trim()) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const userDoc = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      userType: userType || 'Customer',
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    const transporter = createMailTransporter();
    if (transporter) {
      transporter.sendMail({
        from: process.env.SENDER_GMAIL,
        to: normalizedEmail,
        subject: 'Registration successful',
        text: `Hi ${name.trim()},
Welcome to Tripify, your one-stop point to book outing plans.

Thanks & Regards,
Team Tripify`,
      }, (error) => {
        if (error) console.error('Email send error:', error.message);
      });
    }

    res.status(201).json({ success: true, user: sanitizeUser(userDoc) });
  } catch (e) {
    console.error('Register error:', e);
    if (e.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    res.status(422).json({
      success: false,
      message: e.message || 'Registration failed',
    });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const userDoc = await User.findOne({ email: normalizedEmail });

    if (!userDoc) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(401).json({ success: false, message: 'Password is incorrect' });
    }

    jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      jwtSecret,
      {},
      (err, token) => {
        if (err) {
          console.error('JWT sign error:', err);
          return res.status(500).json({ success: false, message: 'Login failed' });
        }
        res.cookie('token', token, cookieOptions).json({
          success: true,
          userDoc: sanitizeUser(userDoc),
        });
      }
    );
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const genericMessage = 'If that email is registered, you will receive a password reset link shortly.';

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      const resetToken = jwt.sign(
        { id: user._id, purpose: 'password-reset' },
        jwtSecret,
        { expiresIn: '1h' }
      );
      const resetUrl = `${getClientBaseUrl()}/reset-password?token=${resetToken}`;
      const transporter = createMailTransporter();

      if (transporter) {
        await transporter.sendMail({
          from: process.env.SENDER_GMAIL,
          to: normalizedEmail,
          subject: 'Tripify — Reset your password',
          text: `Hi ${user.name || 'there'},

You requested a password reset for your Tripify account.

Click the link below to set a new password (valid for 1 hour):
${resetUrl}

If you did not request this, you can ignore this email.

Team Tripify`,
        });
      } else {
        console.warn('Forgot password: email not configured. Reset URL:', resetUrl);
      }
    }

    res.json({ success: true, message: genericMessage });
  } catch (e) {
    console.error('Forgot password error:', e);
    res.status(500).json({ success: false, message: 'Unable to process request. Try again later.' });
  }
});

app.get('/reset-password/verify', (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ valid: false, message: 'Reset token is required' });
  }
  try {
    const payload = jwt.verify(token, jwtSecret);
    if (payload.purpose !== 'password-reset') {
      return res.status(400).json({ valid: false, message: 'Invalid reset token' });
    }
    res.json({ valid: true });
  } catch (e) {
    res.status(400).json({
      valid: false,
      message: e.name === 'TokenExpiredError' ? 'Reset link has expired' : 'Invalid reset token',
    });
  }
});

app.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Reset token is required' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    if (payload.purpose !== 'password-reset') {
      return res.status(400).json({ success: false, message: 'Invalid reset token' });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid reset token' });
    }

    user.password = bcrypt.hashSync(password, bcryptSalt);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully. You can login now.' });
  } catch (e) {
    console.error('Reset password error:', e);
    const message = e.name === 'TokenExpiredError'
      ? 'Reset link has expired. Please request a new one.'
      : 'Invalid or expired reset token';
    res.status(400).json({ success: false, message });
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) return res.json(null);
      const user = await User.findById(userData.id);
      if (!user) return res.json(null);
      const { name, userType, email, _id } = sanitizeUser(user);
      res.json({ name, userType, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post('/logout', (req, res) => {
  res.cookie('token', '', { ...cookieOptions, maxAge: 0 }).json(true);
});

app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  if (!link?.trim()) {
    return res.status(400).json({ success: false, message: 'Image link is required' });
  }
  if (!cloudinaryService.isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Cloudinary is not configured on the server',
    });
  }
  try {
    const secureUrl = await cloudinaryService.uploadFromUrl(link.trim());
    res.json(secureUrl);
  } catch (e) {
    console.error('Cloudinary upload-by-link error:', e);
    res.status(422).json({ success: false, message: 'Failed to upload image from link' });
  }
});

app.get('/account/bookings/cancel/:id', async (req, res) => {
  res.status(501).json({ message: 'Cancel booking not implemented yet' });
});

const photosMiddleware = multer({ storage: multer.memoryStorage() });
app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  if (!cloudinaryService.isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Cloudinary is not configured on the server',
    });
  }
  if (!req.files?.length) {
    return res.status(400).json({ success: false, message: 'No photos uploaded' });
  }
  try {
    const uploadedUrls = [];
    for (const file of req.files) {
      const secureUrl = await cloudinaryService.uploadFromBuffer(file.buffer);
      uploadedUrls.push(secureUrl);
    }
    res.json(uploadedUrls);
  } catch (e) {
    console.error('Cloudinary upload error:', e);
    res.status(422).json({ success: false, message: 'Failed to upload photos' });
  }
});

app.post('/places', (req, res) => {
  const { token } = req.cookies;
  const {
    title, address, addedPhotos, description, price,
    perks, extraInfo, checkIn, checkOut, maxGuests,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      price,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    });
    res.json(withPhotoUrls(placeDoc));
  });
});

app.get('/user-places', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { id } = userData;
    const places = await Place.find({ owner: id });
    res.json(withPhotoUrlsList(places));
  });
});

app.get('/places', async (req, res) => {
  const places = await Place.find();
  res.json(withPhotoUrlsList(places));
});

app.get('/places/:id', async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    return res.status(404).json({ message: 'Place not found' });
  }
  res.json(withPhotoUrls(place));
});

app.put('/places', async (req, res) => {
  const { token } = req.cookies;
  const {
    id, title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const {
    place, checkIn, checkOut, numberOfGuests, name, phone, price,
  } = req.body;
  Booking.create({
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
    user: userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});

app.get('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const bookings = await Booking.find({ user: userData.id }).populate('place');
  const result = bookings.map((booking) => {
    const doc = booking.toObject();
    if (doc.place) doc.place = withPhotoUrls(doc.place);
    return doc;
  });
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API public URL: ${getApiPublicUrl()}`);
  console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
});
