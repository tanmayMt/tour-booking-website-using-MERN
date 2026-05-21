require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

function normalizeOrigin(url) {
  if (!url) return null;
  return url.trim().replace(/\/$/, '');
}

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.PRODUCTION_CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://tour-booking-website-using-mern.vercel.app',
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : []),
]
  .map(normalizeOrigin)
  .filter(Boolean);

const uniqueOrigins = [...new Set(allowedOrigins)];

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    const normalized = normalizeOrigin(origin);
    if (uniqueOrigins.includes(normalized)) {
      return callback(null, origin);
    }
    console.warn('CORS blocked origin:', origin);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

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

function getTokenFromReq(req) {
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    const token = getTokenFromReq(req);
    if (!token) {
      return reject(new Error('No token'));
    }
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
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

function toAbsolutePhotoUrl(photo) {
  if (!photo) return photo;
  const value = String(photo);
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  return value;
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
          token,
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

app.get('/profile', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const user = await User.findById(userData.id);
    if (!user) return res.json(null);
    const { name, userType, email, _id } = sanitizeUser(user);
    res.json({ name, userType, email, _id });
  } catch {
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

app.post('/places', async (req, res) => {
  const token = getTokenFromReq(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Login required' });
  }

  const {
    title, address, addedPhotos, description, price,
    perks, extraInfo, checkIn, checkOut, maxGuests,
  } = req.body;

  try {
    const userData = await getUserDataFromReq(req);
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
  } catch (e) {
    console.error('Create place error:', e);
    res.status(401).json({ success: false, message: 'Invalid or expired session' });
  }
});

app.get('/user-places', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const places = await Place.find({ owner: userData.id });
    res.json(withPhotoUrlsList(places));
  } catch (e) {
    res.status(401).json({ success: false, message: 'Login required' });
  }
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

app.delete('/places/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const userData = await getUserDataFromReq(req);
    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }
    if (userData.id !== place.owner.toString()) {
      return res.status(403).json({ success: false, message: 'Not allowed' });
    }

    await Place.findByIdAndDelete(id);
    res.json({ success: true, message: 'Place deleted successfully' });
  } catch (e) {
    console.error('Delete place error:', e);
    res.status(401).json({ success: false, message: 'Login required' });
  }
});

app.put('/places', async (req, res) => {
  const {
    id, title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price,
  } = req.body;

  try {
    const userData = await getUserDataFromReq(req);
    const placeDoc = await Place.findById(id);
    if (!placeDoc) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }
    if (userData.id !== placeDoc.owner.toString()) {
      return res.status(403).json({ success: false, message: 'Not allowed' });
    }
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
  } catch (e) {
    res.status(401).json({ success: false, message: 'Login required' });
  }
});

function calendarNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

app.post('/bookings', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const {
      place: placeId,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
    } = req.body;

    if (!placeId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Place, check-in, and check-out are required.',
      });
    }

    if (!name?.trim() || !phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Guest name and phone number are required.',
      });
    }

    const guests = Number(numberOfGuests);
    if (!Number.isFinite(guests) || guests < 1) {
      return res.status(400).json({
        success: false,
        message: 'Number of guests must be at least 1.',
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid check-in or check-out date.',
      });
    }

    const nights = calendarNights(checkInDate, checkOutDate);
    if (nights <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Check-out must be after check-in.',
      });
    }

    const placeDoc = await Place.findById(placeId);
    if (!placeDoc) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    const maxGuests = placeDoc.maxGuests || 1;
    if (guests > maxGuests) {
      return res.status(400).json({
        success: false,
        message: `This place allows a maximum of ${maxGuests} guest(s).`,
      });
    }

    const pricePerNight = placeDoc.price || 0;
    const totalPrice = nights * pricePerNight;

    const booking = await Booking.create({
      place: placeId,
      user: userData.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      numberOfGuests: guests,
      name: name.trim(),
      phone: phone.trim(),
      price: totalPrice,
      status: 'confirmed',
    });

    res.status(201).json(booking);
  } catch (e) {
    if (e.message === 'No token' || e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Login required to book.' });
    }
    console.error('POST /bookings error:', e);
    res.status(500).json({ success: false, message: 'Could not create booking.' });
  }
});

app.get('/bookings', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const bookings = await Booking.find({ user: userData.id })
      .sort({ createdAt: -1 })
      .populate('place');
    const result = bookings.map((booking) => {
      const doc = booking.toObject();
      if (doc.place) doc.place = withPhotoUrls(doc.place);
      return doc;
    });
    res.json(result);
  } catch (e) {
    if (e.message === 'No token' || e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Login required.' });
    }
    console.error('GET /bookings error:', e);
    res.status(500).json({ success: false, message: 'Could not load bookings.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS allowed origins: ${uniqueOrigins.join(', ')}`);
});
