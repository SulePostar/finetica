const express = require('express');
const { connectToDatabase } = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/auth', authRoutes); // api/auth/verify-token

// Connect to DB
connectToDatabase();

app.listen(PORT, () => {
  console.log(`🟢 Server is running at port: ${PORT}`);
});