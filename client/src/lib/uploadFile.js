import { supabase } from './supabase';

export async function uploadFile(file, bucketName = 'files') {
  const filePath = `${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file);

  if (error) {
    throw error;
  }
  return data.path;
}
