const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectToDatabase } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const getClientInfo = require('./middleware/activityLogMiddleware');
const kifRouter = require('./routes/kif');
const kufRouter = require('./routes/kuf');
const vatRouter = require('./routes/vat');
const activityLogRouter = require('./routes/activityLog');

const app = express();

app.use(cors());
app.use(express.json());
app.use(getClientInfo);

app.use('/api/auth', require('./routes/authentication'));
app.use('/api/users', require('./routes/users'));
app.use('/api/files', require('./routes/uploadedFiles'));
app.use('/api', kifRouter);
app.use('/api', kufRouter);
app.use('/api', vatRouter);
app.use('/api/admin', activityLogRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

connectToDatabase();

app.listen(PORT, () => {
  console.log(`🟢 Server is running at port: ${PORT}`);
});