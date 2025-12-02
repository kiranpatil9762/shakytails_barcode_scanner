require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const cron = require('node-cron');
const { sendVaccineReminders } = require('./controllers/reminderController');

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║      🐾 ShakyTails Backend API is running! 🐾       ║
  ║                                                       ║
  ║   Server: http://localhost:${PORT}                     ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);
});

// Cron job: Send vaccine reminders daily at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('⏰ Running daily vaccine reminder job...');
  await sendVaccineReminders();
});

// For development: Also check every hour
if (process.env.NODE_ENV === 'development') {
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running hourly vaccine reminder check (dev mode)...');
    await sendVaccineReminders();
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});
