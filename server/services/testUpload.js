//file for testing

const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { uploadDownloadsToBucket } = require('./supabaseUploader.js');

const folderPath = path.join('services', 'downloads');
const bucketName = 'invoices';

uploadDownloadsToBucket(folderPath, bucketName)
  .then(() => {
    console.log('All files processed.');
  })
  .catch((err) => {
    console.error('An error occurred.', err);
  });
