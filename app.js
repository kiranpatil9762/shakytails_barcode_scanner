const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');

// Initialize app
const app = express();

// Trust proxy - important for Railway
app.set('trust proxy', 1);

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com"
      ],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: [
        "'self'", 
        "data:", 
        "https:",
        "https://res.cloudinary.com"
      ],
      connectSrc: [
        "'self'", 
        "https://shakytails.com", 
        "https://web-production-d424.up.railway.app"
      ],
      fontSrc: [
        "'self'", 
        "data:",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting - very lenient for production use
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per 15 minutes
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Extra lenient for auth (login, register, forgot password)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 login attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Very lenient for public QR scanning
const publicLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 200, // 200 requests per 5 minutes
  message: 'Too many QR scans from this IP, please try again in a few minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Compression middleware
app.use(compression());

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined')); // Production logging
}

// CORS middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use((req, res, next) => {
  // Remove duplicate query parameters
  for (let key in req.query) {
    if (Array.isArray(req.query[key])) {
      req.query[key] = req.query[key][0];
    }
  }
  next();
});

// Serve static files
app.use('/qrcodes', express.static(path.join(__dirname, 'public/qrcodes')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const qrRoutes = require('./routes/qrRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const qrInventoryRoutes = require('./routes/qrInventoryRoutes');

// Apply rate limiters to specific routes (order matters - specific before general)
app.use('/api/public', publicLimiter, publicRoutes); // Very lenient for QR scanning
app.use('/api/auth', authLimiter, authRoutes); // Lenient for auth operations
app.use('/api/pets', generalLimiter, petRoutes);
app.use('/api/qr', generalLimiter, qrRoutes);
app.use('/api/reminders', generalLimiter, reminderRoutes);
app.use('/api/admin', generalLimiter, adminRoutes);
app.use('/api/qr-inventory', generalLimiter, qrInventoryRoutes);

// Main user page - QR scanner and pet registration
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'qr-landing.html'));
});

// Admin page - Admin dashboard only
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

module.exports = app;
