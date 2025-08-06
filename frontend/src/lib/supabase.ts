import { createClient } from "@supabase/supabase-js";

// 環境変数が設定されていない場合のデフォルト値（有効なURL形式）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://demo-project.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

// 環境変数が設定されているかチェック
const isConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

// 環境変数が設定されていない場合の警告
if (!isConfigured) {
  console.warn("⚠️ Supabaseの環境変数が設定されていません。デモモードで動作中です。");
  console.warn("📝 実際のSupabaseプロジェクトに接続するには：");
  console.warn("   1. frontend/.env ファイルを作成");
  console.warn("   2. VITE_SUPABASE_URL=https://your-project.supabase.co");
  console.warn("   3. VITE_SUPABASE_ANON_KEY=your-anon-key");
}

// デモモード用のダミークライアント（実際には接続しない）
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient(supabaseUrl, supabaseAnonKey);
