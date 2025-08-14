const express = require('express');
require('dotenv').config();

const cors = require('cors');
const session = require('express-session');
const { connectToDatabase } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const kifRouter = require('./routes/kif');
const kufRouter = require('./routes/kuf');
const vatRouter = require('./routes/vat');
const mailRoute = require("./routes/mailRoute");

const { processEmailQueue } = require('./services/emailQueueService');

const contractRouter = require('./routes/contract'); // 👈 tvoje
const googleDriveAutoSync = require('./tasks/googleDriveAutoSync'); // 👈 master
const googleDriveRouter = require('./routes/googleDrive'); // 👈 master

const PORT = process.env.PORT;
const SECRET = process.env.SESSION_SECRET;

const app = express();

app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set `secure: true` only if using HTTPS
    maxAge: 30 * 24 * 60 * 60 * 1000 // 1 month in milliseconds 
  }
}));

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authentication'));
app.use('/api/users', require('./routes/users'));
app.use('/api/files', require('./routes/uploadedFiles'));
app.use('/api', kifRouter);
app.use('/api', kufRouter);
app.use('/api', vatRouter);
app.use(mailRoute);
app.use('/api/contracts', contractRouter);
app.use('/drive', googleDriveRouter);

app.use(errorHandler);

connectToDatabase();

// Start Google Drive auto sync service
googleDriveAutoSync.start();

app.listen(PORT, () => {
  console.log(`🟢 Server is running at port: ${PORT}`);

  setInterval(() => {
    processEmailQueue().catch(err => console.error('Error in email queue processor:', err));
  }, 1000 * 60);
});
