const express = require('express');
require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const { connectToDatabase } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const backgroundSyncService = require('./services/backgroundSyncService');

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set `secure: true` only if using HTTPS
    maxAge: 30 * 24 * 60 * 60 * 1000 // 1 month in milliseconds (30 days * 24 hours * 60 minutes * 60 seconds * 1000 ms)
  }
}));

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', require('./routes/authentication'));
app.use('/api/users', require('./routes/users'));
app.use('/api/files', require('./routes/uploadedFiles'));
app.use('/', require('./routes/googleDrive/googleDrive'));
app.use('/api', require('./routes/googleDrive/drive'));

app.use(errorHandler);

connectToDatabase();

// Start background sync service
backgroundSyncService.start();

app.listen(process.env.PORT, () => {
  console.log(`🟢 Server is running at port: ${process.env.PORT}`);
  console.log(`🔄 Background file sync service is active`);
});
