const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectToDatabase } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const kifRouter = require('./routes/kif');
const kufRouter = require('./routes/kuf');
const vatRouter = require('./routes/vat');

const googleDriveAutoSync = require('./services/googleDriveAutoSync');

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
// app.use(cors());
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', require('./routes/authentication'));
app.use('/api/users', require('./routes/users'));
app.use('/api/files', require('./routes/uploadedFiles'));
app.use('/api', kifRouter);
app.use('/api', kufRouter);
app.use('/api', vatRouter);
app.use('/admin', require('./routes/googleDrive/driveAdmin'));

app.use(errorHandler);

const PORT = process.env.PORT;

connectToDatabase();

// Start Google Drive auto sync service
googleDriveAutoSync.start();

app.listen(process.env.PORT, () => {
  console.log(`🟢 Server is running at port: ${process.env.PORT}`);
  console.log(`🔄 Google Drive auto sync service is active`);
});