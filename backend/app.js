const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Syntax Squad API is running 🚀', timestamp: new Date() });
});

// Error handler
app.use(errorHandler);

module.exports = app;
