import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://uoyzcboehvwxcadrqqfq.supabase.co"
const supabasePublishableKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVveXpjYm9laHZ3eGNhZHJxcWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODE4MzcsImV4cCI6MjA2ODg1NzgzN30.09tdQtyneRfAbQJRoVy5J9YpsuLTwn-EDF0tt2hUosg"

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})