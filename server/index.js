const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectToDatabase } = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT 

connectToDatabase();

app.listen(PORT, () => {
  console.log(`🟢 Server is running at port: ${PORT}`);
});
