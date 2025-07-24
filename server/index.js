const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { connectToDatabase } = require('./config/db');
const authRoutes = require('./routes/authRoutes.js');

dotenv.config();

app.use(express.json());

connectToDatabase();

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Server is running on port ${PORT}`);
});
