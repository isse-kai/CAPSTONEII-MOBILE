import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'your-anon-key'; // Use anon key for client-side

export const supabase = createClient(supabaseUrl, supabaseKey);
