import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { supabase } from './lib/supabase';
import InstagramPostsUI from "./components/InstagramPostsUI";
import AutoSyncDashboard from "./components/AutoSyncDashboard";

const App = () => {
  const [currentView, setCurrentView] = useState<'sync' | 'manual'>('sync');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    
    const handleSwitchToAutoSync = () => {
      setCurrentView('sync');
    };

    window.addEventListener('switchToAutoSync', handleSwitchToAutoSync);
    return () => {
      window.removeEventListener('switchToAutoSync', handleSwitchToAutoSync);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
      
      // 認証状態の変更を監視
      supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session?.user);
      });
    } catch (error) {
      console.error('認証状態の確認エラー:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  if (authLoading) {
    return (
      <AppContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>読み込み中...</LoadingText>
        </LoadingContainer>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      {isAuthenticated && (
        <Navigation>
          <NavContent>
            <NavTabs>
              <NavTab
                onClick={() => setCurrentView('sync')}
                active={currentView === 'sync'}
              >
                自動同期
              </NavTab>
              <NavTab
                onClick={() => setCurrentView('manual')}
                active={currentView === 'manual'}
              >
                手動同期
              </NavTab>
            </NavTabs>
          </NavContent>
        </Navigation>
      )}

      <Content>
        {currentView === 'sync' ? (
          <AutoSyncDashboard />
        ) : (
          <ManualSyncContainer hasNav={isAuthenticated}>
            <ManualSyncContent>
              <InstagramPostsUI />
            </ManualSyncContent>
          </ManualSyncContainer>
        )}
      </Content>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

const Navigation = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
`;

const NavContent = styled.div`
  max-width: 84rem;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const NavTabs = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavTab = styled.button<{ active: boolean }>`
  padding: 1rem 0.25rem;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.active ? `
    border-bottom-color: #3b82f6;
    color: #2563eb;
  ` : `
    color: #6b7280;
    
    &:hover {
      color: #374151;
      border-bottom-color: #d1d5db;
    }
  `}
`;

const Content = styled.div``;

const ManualSyncContainer = styled.div<{ hasNav?: boolean }>`
  min-height: ${props => props.hasNav ? 'calc(100vh - 60px)' : '100vh'};
  background: #f9fafb;
  padding: 2rem 0;
`;

const ManualSyncContent = styled.div`
  max-width: 84rem;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

export default App;