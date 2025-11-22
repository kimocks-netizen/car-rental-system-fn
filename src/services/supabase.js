import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadCarImage = async (file, carId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${carId}-${Date.now()}.${fileExt}`;
  const filePath = `${carId}/${fileName}`;

  const { error } = await supabase.storage
    .from('car-images')
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('car-images')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteCarImage = async (imageUrl) => {
  try {
    const url = new URL(imageUrl);
    const filePath = url.pathname.split('/storage/v1/object/public/car-images/')[1];
    
    if (!filePath) {
      throw new Error('Could not extract file path from URL');
    }

    const { error } = await supabase.storage
      .from('car-images')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting car image:', error);
    throw error;
  }
};