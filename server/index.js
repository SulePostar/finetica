const express = require('express');
require('dotenv').config();

const cors = require('cors');
const session = require('express-session');
const { connectToDatabase } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const kifRouter = require('./routes/kif');
const kufRouter = require('./routes/kuf');
const vatRouter = require('./routes/vat');
const cookieParser = require('cookie-parser')
const contractRouter = require('./routes/contract'); // 👈 tvoje
const googleDriveAutoSync = require('./tasks/googleDriveAutoSync'); // 👈 master
const googleDriveRouter = require('./routes/googleDrive'); // 👈 master

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
app.use('/api', kifRouter);
app.use('/api', kufRouter);
app.use('/api', vatRouter);
app.use('/api/contracts', contractRouter);
app.use('/drive', googleDriveRouter);

app.use(errorHandler);

connectToDatabase();

// Start Google Drive auto sync service
googleDriveAutoSync.start();

app.listen(PORT, () => {
  console.log(`🟢 Server is running at port: ${PORT}`);
});
