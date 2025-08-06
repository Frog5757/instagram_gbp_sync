// src/components/Header.tsx
import React from "react";

interface HeaderProps {
  fetchPosts: () => void;
}

const Header: React.FC<HeaderProps> = ({ fetchPosts }) => {
  const isConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return (
    <header className="header">
      <div className="header-container">
        <div>
          <h1 className="header-title">Instagram → GBP 同期管理</h1>
          <p className="header-description">
            Instagram投稿をGoogle ビジネスプロフィールに同期
          </p>
          {!isConfigured && (
            <div style={{ 
              backgroundColor: '#fef3c7', 
              color: '#92400e', 
              padding: '0.5rem', 
              borderRadius: '0.25rem', 
              marginTop: '0.5rem',
              fontSize: '0.875rem'
            }}>
              ⚠️ Supabase未設定 - デモモードで動作中。env.exampleを参考に.envファイルを作成してください。
            </div>
          )}
        </div>
        <button onClick={fetchPosts} className="refresh-button">
          更新
        </button>
      </div>
    </header>
  );
};

export default Header;
