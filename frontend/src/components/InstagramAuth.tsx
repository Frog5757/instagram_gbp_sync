import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface InstagramAuthProps {
  onAuthSuccess: (user: User) => void;
}

const InstagramAuth = ({ onAuthSuccess }: InstagramAuthProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // 初期認証状態を取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        onAuthSuccess(session.user);
        // アクセストークンのテスト
        console.log('Provider Token:', session.provider_token);
        console.log('Session:', session);
      }
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        onAuthSuccess(session.user);
        console.log('Auth event:', _event);
        console.log('Session with token:', session);
        
        // アクセストークンを手動で保存
        if (session.provider_token) {
          localStorage.setItem('facebook_access_token', session.provider_token);
          console.log('Access token saved:', session.provider_token);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [onAuthSuccess]);

  const signInWithInstagram = async () => {
    setIsConnecting(true);
    try {
      // Facebook OAuth経由でInstagram Graph APIにアクセス
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: window.location.origin,
          scopes: 'instagram_basic,pages_show_list,business_management,instagram_manage_insights'
        }
      });
      
      if (error) {
        console.error('Instagram Graph API認証エラー:', error.message);
      }
    } catch (error) {
      console.error('Instagram Graph API認証エラー:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  if (user) {
    return (
      <ConnectedContainer>
        <ConnectedContent>
          <StatusIndicator>
            <StatusDot />
            <div>
              <ConnectedTitle>Instagram連携済み</ConnectedTitle>
              <ConnectedEmail>{user.email}</ConnectedEmail>
            </div>
          </StatusIndicator>
          <DisconnectButton onClick={signOut}>
            切断
          </DisconnectButton>
        </ConnectedContent>
      </ConnectedContainer>
    );
  }

  return (
    <AuthContainer>
      <AuthContent>
        <InstagramIcon>
          <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </InstagramIcon>
        <AuthTitle>
          Instagramアカウントと連携
        </AuthTitle>
        <AuthDescription>
          自動投稿同期を開始するにはInstagramアカウントでログインしてください
        </AuthDescription>
        <ConnectButton
          onClick={signInWithInstagram}
          disabled={isConnecting}
          isConnecting={isConnecting}
        >
          {isConnecting ? (
            <ButtonContent>
              <ButtonSpinner />
              接続中...
            </ButtonContent>
          ) : (
            'Instagramで連携する'
          )}
        </ConnectButton>
      </AuthContent>
    </AuthContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ConnectedContainer = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.5rem;
  padding: 1.5rem;
`;

const ConnectedContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StatusDot = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  background: #4ade80;
  border-radius: 50%;
`;

const ConnectedTitle = styled.h3`
  color: #166534;
  font-weight: 500;
  margin: 0;
`;

const ConnectedEmail = styled.p`
  color: #16a34a;
  font-size: 0.875rem;
  margin: 0;
`;

const DisconnectButton = styled.button`
  color: #15803d;
  font-size: 0.875rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  
  &:hover {
    color: #14532d;
  }
`;

const AuthContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
`;

const AuthContent = styled.div`
  text-align: center;
`;

const InstagramIcon = styled.div`
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  background: linear-gradient(45deg, #fde047, #ef4444, #a855f7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const AuthTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin: 0 0 0.5rem 0;
`;

const AuthDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 1.5rem 0;
`;

const ConnectButton = styled.button<{ isConnecting: boolean }>`
  width: 100%;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: ${props => props.isConnecting ? 'not-allowed' : 'pointer'};
  background: ${props => props.isConnecting 
    ? '#f3f4f6' 
    : 'linear-gradient(to right, #8b5cf6, #ec4899)'};
  color: ${props => props.isConnecting ? '#9ca3af' : 'white'};
  transition: all 0.2s;
  
  &:hover {
    background: ${props => !props.isConnecting 
      ? 'linear-gradient(to right, #7c3aed, #db2777)' 
      : '#f3f4f6'};
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ButtonSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export default InstagramAuth;