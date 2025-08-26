const express = require('express');
require('dotenv').config();

const cors = require('cors');
const session = require('express-session');
const { connectToDatabase } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const kifRouter = require('./routes/kif');
const kufRouter = require('./routes/kuf');
const bankTransactionRouter = require('./routes/bankTransaction');
const mailRoute = require("./routes/mailRoute");

const { processEmailQueue } = require('./services/emailQueueService');

const cookieParser = require('cookie-parser')
const contractRouter = require('./routes/contract');
const businessPartnerRouter = require('./routes/businessPartner');
const googleDriveAutoSync = require('./tasks/googleDriveAutoSync');
const googleDriveRouter = require('./routes/googleDrive');

const PORT = process.env.PORT;
const SECRET = process.env.SESSION_SECRET;

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
};
app.use(cors(corsOptions));
app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set `secure: true` only if using HTTPS
    maxAge: 30 * 24 * 60 * 60 * 1000 // 1 month in milliseconds 
  }
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/authentication'));
app.use('/api/users', require('./routes/users'));
app.use('/api/files', require('./routes/uploadedFiles'));
app.use('/api/kif', kifRouter);
app.use('/api', kufRouter);
app.use('/api/transactions', bankTransactionRouter);
app.use(mailRoute);
app.use('/api/contracts', contractRouter);
app.use('/api/business-partners', businessPartnerRouter);
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
