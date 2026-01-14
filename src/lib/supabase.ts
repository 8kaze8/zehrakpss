/**
 * Supabase Client
 * Browser client for Supabase
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazy initialization - sadece runtime'da oluştur
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") {
    // Server-side rendering veya build sırasında null dön
    return null;
  }
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // Env vars yoksa null dön
    return null;
  }
  
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return _supabase;
}

// Geriye uyumluluk için (USE_SUPABASE false ise bu hiç kullanılmaz)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null as unknown as SupabaseClient;

// Database types
export interface DailyProgressRow {
  id: string;
  date: string;
  tasks: string; // JSON
  routine_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomTaskRow {
  id: string;
  title: string;
  subject: string;
  description: string | null;
  date: string;
  time_slot_start: string | null;
  time_slot_end: string | null;
  type: string;
  completed: boolean;
  created_at: string;
}

export interface ExamRow {
  id: string;
  title: string;
  type: string;
  subject: string | null;
  date: string;
  completed: boolean;
  results: string | null; // JSON
  created_at: string;
}
