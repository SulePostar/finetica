const express = require('express');
const { connectToDatabase } = require('./config/db');
import authRoutes from './routes/auth.route.js';
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/auth', authRoutes);

// Connect to DB
connectToDatabase();

app.listen(PORT, () => {
  console.log(`🟢 Server is running at port: ${PORT}`);
});
