const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize app
const app = express();

// Middleware
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
  res.json({
    success: true,
    message: 'Welcome to ShakyTails API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      pets: '/api/pets',
      qr: '/api/qr',
      reminders: '/api/reminders',
      admin: '/api/admin',
      public: '/api/public',
    },
  });
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
