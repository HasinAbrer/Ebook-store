const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires'],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
// Explicitly handle preflight
app.options('*', cors(corsOptions));
app.use(express.json());

// Static assets (serve uploaded images)
const uploadsDir = path.join(__dirname, 'uploads');
const imagesDir = path.join(__dirname, 'images');
app.use('/uploads', express.static(uploadsDir));
app.use('/images', express.static(imagesDir));

// Routes
const userRoutes = require('./src/users/user.route');
const bookRoutes = require('./src/books/book.route');
const orderRoutes = require('./src/orders/order.route');
const messageRoutes = require('./src/messages/message.route');
const reviewRoutes = require('./src/reviews/review.route');

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Ebook Store Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 Ebook Store Backend API available at http://localhost:${PORT}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`👤 User endpoints: http://localhost:${PORT}/api/users`);
      console.log(`📖 Book endpoints: http://localhost:${PORT}/api/books`);
      console.log(`📦 Order endpoints: http://localhost:${PORT}/api/orders`);
      console.log(`💬 Message endpoints: http://localhost:${PORT}/api/messages`);
      console.log(`⭐ Review endpoints: http://localhost:${PORT}/api/reviews`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

module.exports = app;
