import { createClient } from '@/lib/supabase/server';

export async function SupabaseStatus() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.getSession();
    // getSession works without auth - error would indicate connection issue
    return (
      <p className="text-sm text-green-600 dark:text-green-400">
        Supabase: 接続済み
      </p>
    );
  } catch {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Supabase: 接続エラー
      </p>
    );
  }
}
