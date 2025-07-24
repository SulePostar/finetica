const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { connectToDatabase } = require('./config/db');

dotenv.config();

app.use(express.json());

connectToDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Server is running on port ${PORT}`);
});
