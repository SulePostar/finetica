const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectToDatabase } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const kifRouter = require('./routes/kif');
const kufRouter = require('./routes/kuf');
const vatRouter = require('./routes/vat');
const userRoleRouter = require('./routes/userRoles');
const userStatusRouter = require('./routes/userStatus');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authentication'));
app.use('/api/users', require('./routes/users'));
app.use('/api/files', require('./routes/uploadedFiles'));
app.use('/api', kifRouter);
app.use('/api', kufRouter);
app.use('/api', vatRouter);
app.use('/api/user-roles', userRoleRouter);
app.use('/api/user-statuses', userStatusRouter);

app.use(errorHandler);

const PORT = process.env.PORT;

connectToDatabase();

app.listen(PORT, () => {
  console.log(`🟢 Server is running at port: ${PORT}`);
});