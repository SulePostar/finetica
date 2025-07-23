const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./config/db');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectToDatabase();


app.use('/api/auth', require('./routes/auth.routes'));


app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});


app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
  });
});

module.exports = app;
