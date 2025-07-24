const express = require('express');
const { connectToDatabase } = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to DB
connectToDatabase();

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});