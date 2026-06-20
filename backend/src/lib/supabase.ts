import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'mock_key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadSelfieToSupabase = async (base64File: string, fileName: string): Promise<string> => {
  try {
    // base64File might come as "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    const base64Data = base64File.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    // In production, SUPABASE_URL and KEY must be set
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase credentials missing. Returning mock URL.");
      return `https://mock-supabase.com/storage/v1/object/public/selfies/${fileName}`;
    }

    const { data, error } = await supabase.storage
      .from('selfies') // Assuming there's a bucket named 'selfies'
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Error uploading to Supabase:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('selfies')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Supabase upload exception:', error);
    throw error;
  }
};
