import { supabase } from '../lib/supabase';

// Facebookアクセストークンを取得
export const getFacebookAccessToken = async () => {
  try {
    // まずセッションから取得を試す
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.provider_token) {
      return session.provider_token;
    }
    
    // localStorageから取得を試す
    const storedToken = localStorage.getItem('facebook_access_token');
    
    if (storedToken) {
      return storedToken;
    }
    
    throw new Error('Facebookアクセストークンが見つかりません');
  } catch (error) {
    console.error('アクセストークン取得エラー:', error);
    throw error;
  }
};

// Instagramビジネスアカウント一覧を取得
export const getInstagramBusinessAccounts = async () => {
  try {
    const accessToken = await getFacebookAccessToken();
    
    // Facebookページ一覧を取得
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    );
    
    if (!pagesResponse.ok) {
      throw new Error('Facebookページの取得に失敗しました');
    }
    
    const pagesData = await pagesResponse.json();
    
    // 各ページのInstagramビジネスアカウントを取得
    const instagramAccounts = [];
    
    for (const page of pagesData.data) {
      try {
        const igResponse = await fetch(
          `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
        );
        
        if (igResponse.ok) {
          const igData = await igResponse.json();
          if (igData.instagram_business_account) {
            instagramAccounts.push({
              pageId: page.id,
              pageName: page.name,
              instagramAccountId: igData.instagram_business_account.id,
              accessToken: page.access_token
            });
          }
        }
      } catch (error) {
        console.error(`ページ ${page.name} のInstagramアカウント取得エラー:`, error);
      }
    }
    
    return instagramAccounts;
  } catch (error) {
    console.error('Instagramビジネスアカウント取得エラー:', error);
    throw error;
  }
};

// Instagram投稿一覧を取得
export const getInstagramMedia = async (instagramAccountId: string, accessToken: string) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,permalink&access_token=${accessToken}`
    );
    
    if (!response.ok) {
      throw new Error('Instagram投稿の取得に失敗しました');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Instagram投稿取得エラー:', error);
    throw error;
  }
};