
import { createClient } from '@supabase/supabase-js'

// Hardcoded fallbacks provided for stability when .env is missing/ignored
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://fxpniulamlfrhghuymva.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cG5pdWxhbWxmcmhnaHV5bXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NDg1NDIsImV4cCI6MjA4MzEyNDU0Mn0.y8W8npZr1rbSPPsaQqEcZ_xpwncdUz1P9Vzd6zKKYDM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
