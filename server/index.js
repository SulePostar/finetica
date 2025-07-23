const express = require('express');
const { connectToDatabase } = require('./config/db');
const authRoutes = require('./routes/auth.route');
const { errorMiddleware } = require('./middleware/error.middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorMiddleware);

// Connect to DB
connectToDatabase();

app.listen(PORT, () => {
  console.log(`🟢 Server is running at port: ${PORT}`);
});
