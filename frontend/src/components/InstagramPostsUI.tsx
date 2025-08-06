// InstagramPostsUI.tsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { InstaPost, Stats } from "../types/insta";
import Header from "./Header";
import StatsCard from "./StatsCard";
import Filter from "./Filter";
import PostList from "./PostList";
import LoadingSpinner from "./LoadingSpinner";

const InstagramPostsUI = () => {
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "synced" | "unsynced">("all");
  const [stats, setStats] = useState<Stats>({
    total: 0,
    synced: 0,
    unsynced: 0,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // 環境変数が設定されていない場合はダミーデータを表示
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // ダミーデータ
        const dummyData = [
          {
            id: "1",
            instagram_id: "demo_1",
            media_url: "https://picsum.photos/400/400?random=1",
            caption: "これはデモ投稿です。実際のSupabaseに接続するには環境変数を設定してください。",
            timestamp: new Date().toISOString(),
            is_synced: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            media_type: "IMAGE",
            permalink: "https://instagram.com/demo"
          },
          {
            id: "2",
            instagram_id: "demo_2",
            media_url: "https://picsum.photos/400/400?random=2",
            caption: "2番目のデモ投稿です。env.exampleを参考に.envファイルを作成してください。",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            is_synced: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            media_type: "IMAGE",
            permalink: "https://instagram.com/demo"
          }
        ];
        
        setPosts(dummyData);
        setStats({
          total: dummyData.length,
          synced: dummyData.filter((p) => p.is_synced).length,
          unsynced: dummyData.filter((p) => !p.is_synced).length,
        });
        return;
      }

      const { data, error } = await supabase
        .from("instagram_posts")
        .select("*")
        .eq("media_type", "IMAGE") // media_typeが"IMAGE"
        .not("caption", "is", null) // captionがnullでない
        .order("timestamp", { ascending: false });

      if (error) throw error;

      if (data) {
        setPosts(data);
        setStats({
          total: data.length,
          synced: data.filter((p) => p.is_synced).length,
          unsynced: data.filter((p) => !p.is_synced).length,
        });
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      // エラーが発生した場合もダミーデータを表示
      const errorData = [
        {
          id: "error_1",
          instagram_id: "error_demo",
          media_url: "https://picsum.photos/400/400?random=error",
          caption: "Supabaseへの接続でエラーが発生しました。設定を確認してください。",
          timestamp: new Date().toISOString(),
          is_synced: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          media_type: "IMAGE",
          permalink: "https://instagram.com/error"
        }
      ];
      
      setPosts(errorData);
      setStats({
        total: errorData.length,
        synced: 0,
        unsynced: errorData.length,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (post.media_type !== "IMAGE") return false;
    if (!post.caption || post.caption.trim() === "") return false;
    if (filter === "synced") return post.is_synced;
    if (filter === "unsynced") return !post.is_synced;
    return true;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "日付不明";
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSync = async (postId: string) => {
    console.log("Sync post:", postId);
    alert("GBP APIの審査承認後に同期機能が利用可能になります");
  };

  if (loading) {
    return <LoadingSpinner message="投稿を読み込み中..." />;
  }

  return (
    <div className="main-container">
      <Header fetchPosts={fetchPosts} />
      <main className="content-container">
        <StatsCard stats={stats} />
        <Filter filter={filter} setFilter={setFilter} stats={stats} />
        <PostList
          posts={filteredPosts}
          filter={filter}
          handleSync={handleSync}
          formatDate={formatDate}
        />
      </main>
    </div>
  );
};

export default InstagramPostsUI;
