const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectToDatabase } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const kifRouter = require('./routes/kif');
const kufRouter = require('./routes/kuf');
const vatRouter = require('./routes/vat');
const cookieParser = require('cookie-parser')

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: 'GET,POST,PUT,DELETE',
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/authentication'));
app.use('/api/users', require('./routes/users'));
app.use('/api/files', require('./routes/uploadedFiles'));
app.use('/api', kifRouter);
app.use('/api', kufRouter);
app.use('/api', vatRouter);

app.use(errorHandler);

const PORT = process.env.PORT;

connectToDatabase();

app.listen(PORT, () => {
  console.log(`🟢 Server is running at port: ${PORT}`);
});