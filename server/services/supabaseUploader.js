const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
require('dotenv').config();

// Create a Supabase client using the URL and service role key from the .env file

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Uploads all files from a specified folder to a given Supabase storage bucket
async function uploadDownloadsToBucket(folderPath, bucketName) {
  const files = fs.readdirSync(folderPath);

  for (const fileName of files) {
    const filePath = path.join(folderPath, fileName);
    const fileBuffer = fs.readFileSync(filePath);

    const contentType = mime.lookup(filePath) || 'application/octet-stream'; // <- MIME file type

    const { data: existing, error: headError } = await supabase.storage
      .from(bucketName)
      .list('', { search: fileName });

    if (existing && existing.length > 0) {
      console.log(`File already exists: ${fileName}, skipping.`);
      continue;
    }

    const { data, error } = await supabase.storage.from(bucketName).upload(fileName, fileBuffer, {
      contentType: contentType,
      upsert: false,
    });

    if (error) {
      console.error(`Error during upload ${fileName}:`, error);
    } else {
      console.log(`Successfully uploaded: ${fileName}`);
    }
  }
}

module.exports = { uploadDownloadsToBucket };
