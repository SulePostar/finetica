const app = require('./express');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🟢 Server is running at port: ${PORT}`);
});
