const express = require('express');
require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const { connectToDatabase } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set `secure: true` only if using HTTPS
}));

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Support both ports
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

const PORT = process.env.PORT;
if (!PORT) {
  console.error('❌ PORT is not defined in .env file');
  process.exit(1);
}
connectToDatabase();

app.listen(PORT, () => {
  console.log(`🟢 Server is running at port: ${PORT}`);
});
