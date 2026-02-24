/**
 * Supabase Database 型定義
 * テーブル構造に合わせた型
 * @see docs/web-data-structure.md
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          name: string;
          order: number;
          status: 'active' | 'archived';
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          order?: number;
          status?: 'active' | 'archived';
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          order?: number;
          status?: 'active' | 'archived';
          created_at?: string | null;
        };
      };
      session_logs: {
        Row: {
          id: string;
          task_id: string;
          date: string;
          start_time: string;
          end_time: string;
          duration_minutes: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          task_id: string;
          date: string;
          start_time: string;
          end_time: string;
          duration_minutes: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          task_id?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          duration_minutes?: number;
          created_at?: string | null;
        };
      };
    };
  };
}
