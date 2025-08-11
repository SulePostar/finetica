//file for testing
require('dotenv').config();
const path = require('path');
const supabaseService = require('../utils/supabase/supabaseService');

const folderPath = path.join(__dirname, 'downloads');
const bucketName = 'invoices';

supabaseService
  .uploadFolder(folderPath, bucketName, { allowedTypes: ['application/pdf'] })
  .then(() => {
    console.log('All files processed.');
  })
  .catch((err) => {
    console.error('An error occurred:', err);
  });
