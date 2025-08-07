import { useState, useEffect } from "react";
import styled from '@emotion/styled';
import { supabase } from "../lib/supabase";
import type { InstaPost, Stats } from "../types/insta";
import type { User } from '@supabase/supabase-js';
import Header from "./Header";
import StatsCard from "./StatsCard";
import Filter from "./Filter";
import PostList from "./PostList";
import LoadingSpinner from "./LoadingSpinner";

const InstagramPostsUI = () => {
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "synced" | "unsynced">("all");
  const [stats, setStats] = useState<Stats>({
    total: 0,
    synced: 0,
    unsynced: 0,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchPosts();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('認証状態の確認エラー:', error);
      setLoading(false);
    } finally {
      setAuthLoading(false);
    }
  };

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

  if (authLoading || (user && loading)) {
    return <LoadingSpinner message={authLoading ? "認証状態を確認中..." : "投稿を読み込み中..."} />;
  }

  if (!user) {
    return (
      <UnauthenticatedContainer>
        <UnauthenticatedContent>
          <UnauthenticatedIcon>
            <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </UnauthenticatedIcon>
          <UnauthenticatedTitle>
            Instagram連携が必要です
          </UnauthenticatedTitle>
          <UnauthenticatedDescription>
            手動同期を利用するには、まずInstagramアカウントでログインしてください。<br />
            「自動同期」タブからInstagramアカウントと連携できます。
          </UnauthenticatedDescription>
          <AuthPromptButton onClick={() => {
            const event = new CustomEvent('switchToAutoSync');
            window.dispatchEvent(event);
          }}>
            自動同期タブに移動
          </AuthPromptButton>
        </UnauthenticatedContent>
      </UnauthenticatedContainer>
    );
  }

  return (
    <MainContainer>
      <Header fetchPosts={fetchPosts} />
      <ContentContainer>
        <StatsCard stats={stats} />
        <Filter filter={filter} setFilter={setFilter} stats={stats} />
        <PostList
          posts={filteredPosts}
          filter={filter}
          handleSync={handleSync}
          formatDate={formatDate}
        />
      </ContentContainer>
    </MainContainer>
  );
};

const UnauthenticatedContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
`;

const UnauthenticatedContent = styled.div`
  text-align: center;
  max-width: 28rem;
`;

const UnauthenticatedIcon = styled.div`
  width: 6rem;
  height: 6rem;
  margin: 0 auto 2rem;
  background: linear-gradient(45deg, #fde047, #ef4444, #a855f7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0.8;
`;

const UnauthenticatedTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`;

const UnauthenticatedDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 2rem 0;
`;

const AuthPromptButton = styled.button`
  background: linear-gradient(to right, #8b5cf6, #ec4899);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: linear-gradient(to right, #7c3aed, #db2777);
    transform: translateY(-1px);
  }
`;

const MainContainer = styled.div`
  .main-container {
    /* 既存のスタイルを保持 */
  }
`;

const ContentContainer = styled.main`
  .content-container {
    /* 既存のスタイルを保持 */
  }
`;

export default InstagramPostsUI;
