import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const url = process.env.SUPABASE_URL!;
const anon = process.env.SUPABASE_ANON_KEY!;

export const supabasePublic = createClient(url, anon, {
  auth: { persistSession: false },
});
