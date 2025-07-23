const express = require('express');
const { connectToDatabase } = require('./config/db');
const authRoutes = require('./routes/auth.route');
const { errorMiddleware } = require('./middleware/error.middleware');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

connectToDatabase();

app.listen(PORT, () => {
  console.log(`🟢 Server is running at port: ${PORT}`);
});
