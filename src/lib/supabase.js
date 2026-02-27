// src/lib/supabase.js - TRUE SINGLETON (COMPLETELY REPLACE)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// GLOBAL SINGLETON (eliminates ALL GoTrueClient warnings)
if (!window.xistSupabase) {
  window.xistSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

export const supabase = window.xistSupabase;

export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('communityposts').select('count');
    if (error) throw error;
    console.log('✅ Supabase connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
};

export default supabase;
