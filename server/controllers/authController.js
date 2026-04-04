import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc  Register user
// @route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, totalSessions: 0, averageScore: 0 },
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Login user
// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, totalSessions: user.totalSessions, averageScore: user.averageScore },
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get current user
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @desc  Google OAuth sign-in
// @route POST /api/auth/google
export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find or create the user
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Link Google account if signed up via email before
      if (!user.googleId) {
        user.googleId = googleId;
        if (picture && !user.avatar) user.avatar = picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture || '',
      });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        totalSessions: user.totalSessions,
        averageScore: user.averageScore,
      },
    });
  } catch (error) {
    next(error);
  }
};
