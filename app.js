const express = require('express');
const { default: mongoose, connect } = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const httpStatusText = require('./utils/httpStatusText')
const app = express()

// Connect to database
const url = process.env.MONGO_URL
mongoose.connect(url).then(() => { console.log('Connected to database')}).catch(err => {console.error('Connection Error : ', err)})

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
  });
  app.use(limiter);
  
  // CORS
  app.use(cors({ 
    origin: process.env.CLIENT_URL || 'http://localhost:3000' 
  }));

// Middleware
app.use(express.json())

// Auth Route
const UserRoute = require('./routers/users.routes')
app.use('/api/auth', UserRoute)

// routes
const ProductRoute = require('./routers/products.routes')
app.use('/api', ProductRoute)

// 404 Error handling
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: httpStatusText.ERROR,
        message: err.message,
        code: err.statusCode || 500
    });
});
// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is started at http://localhost:${process.env.PORT}`)
});

