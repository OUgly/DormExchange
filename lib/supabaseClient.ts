// lib/supabaseClient.ts
// This file initializes the Supabase client which we can use
// throughout the app to interact with our database and auth.

import { createClient } from '@supabase/supabase-js'

// Read the Supabase URL and anon key from environment variables.
// In a real project, define these in a .env.local file.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Export a single instance of the client to be used across the app.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
