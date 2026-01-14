/**
 * Supabase Client
 * Browser client for Supabase
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
