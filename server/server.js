const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS — fixes ISP SRV record blocking

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { startReminderJob } = require('./jobs/reminderJob');

const app = express();

// Security headers (Bug Fix: missing helmet.js)
app.use(helmet());

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL,
  'https://blood-donation-platform-one.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Route imports
const donorRoutes = require('./routes/donorRoutes');
const requestRoutes = require('./routes/requestRoutes');
const communityRoutes = require('./routes/communityRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount routes
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 catch-all handler (Bug Fix: no 404 handler)
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler (Bug Fix: no global error middleware)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// MongoDB connection
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    startReminderJob();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
