const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

// Initialize app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for frontend
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiter to API routes only
app.use('/api/', limiter);

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/qr-inventory', qrInventoryRoutes);

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'qr-landing.html'));
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
