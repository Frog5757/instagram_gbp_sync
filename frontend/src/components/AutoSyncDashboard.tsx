import { useState } from 'react';
import styled from '@emotion/styled';
import type { User } from '@supabase/supabase-js';
import InstagramAuth from './InstagramAuth';
import AutoSyncSettings from './AutoSyncSettings';
import TestInstagramAPI from './TestInstagramAPI';

const AutoSyncDashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <HeaderText>
            <Title>Instagram自動同期</Title>
            <Description>
              Instagram投稿を自動的にGoogle Business Profileと同期します
            </Description>
          </HeaderText>
          {user && (
            <UserInfo>
              <UserIcon>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                  <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </UserIcon>
              <UserName>
                {user.user_metadata?.username || user.email}
              </UserName>
            </UserInfo>
          )}
        </HeaderContent>
      </Header>

      <MainContent>
        <ContentWrapper>
          <StepsContainer>
            <StepsHeader>
              <StepsTitle>セットアップ手順</StepsTitle>
            </StepsHeader>
            <StepsContent>
              <StepItem completed={!!user}>
                <StepCircle completed={!!user}>
                  {user ? '✓' : '1'}
                </StepCircle>
                <StepLabel completed={!!user}>
                  Instagram連携
                </StepLabel>
              </StepItem>
              
              <StepConnector completed={!!user} />
              
              <StepItem completed={false}>
                <StepCircle completed={false} enabled={!!user}>
                  2
                </StepCircle>
                <StepLabel completed={false} enabled={!!user}>
                  自動同期設定
                </StepLabel>
              </StepItem>
            </StepsContent>
          </StepsContainer>

          <Section>
            <SectionHeader>
              <SectionTitle>1. Instagram アカウント連携</SectionTitle>
            </SectionHeader>
            <InstagramAuth onAuthSuccess={handleAuthSuccess} />
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>2. 自動同期設定</SectionTitle>
            </SectionHeader>
            <AutoSyncSettings isAuthenticated={!!user} />
          </Section>

          {user && (
            <>
              <Section>
                <SectionHeader>
                  <SectionTitle>API テスト</SectionTitle>
                </SectionHeader>
                <TestInstagramAPI />
              </Section>
              
              <Section>
                <SectionHeader>
                  <SectionTitle>同期履歴</SectionTitle>
                </SectionHeader>
                <HistoryContainer>
                  <HistoryContent>
                    <HistoryIcon>
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </HistoryIcon>
                    <HistoryTitle>まだ同期履歴がありません</HistoryTitle>
                    <HistoryDescription>
                      自動同期を有効にすると、ここに同期履歴が表示されます
                    </HistoryDescription>
                  </HistoryContent>
                </HistoryContainer>
              </Section>
            </>
          )}
        </ContentWrapper>
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: #f9fafb;
`;

const Header = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderContent = styled.div`
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

const HeaderText = styled.div`
  padding: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const Description = styled.p`
  color: #6b7280;
  margin: 0.25rem 0 0 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background: linear-gradient(45deg, #fde047, #ef4444, #a855f7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const UserName = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const MainContent = styled.div`
  max-width: 84rem;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  @media (min-width: 640px) {
    padding: 2rem 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 2rem 2rem;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StepsContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
`;

const StepsHeader = styled.div`
  margin-bottom: 1rem;
`;

const StepsTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
`;

const StepsContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StepItem = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepCircle = styled.div<{ completed: boolean; enabled?: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    if (props.completed) return '#dcfce7';
    if (props.enabled) return '#dbeafe';
    return '#f3f4f6';
  }};
  color: ${props => {
    if (props.completed) return '#166534';
    if (props.enabled) return '#1e40af';
    return '#9ca3af';
  }};
`;

const StepLabel = styled.span<{ completed: boolean; enabled?: boolean }>`
  font-size: 0.875rem;
  color: ${props => {
    if (props.completed) return '#15803d';
    if (props.enabled) return '#374151';
    return '#9ca3af';
  }};
`;

const StepConnector = styled.div<{ completed: boolean }>`
  flex: 1;
  height: 2px;
  background: ${props => props.completed ? '#bbf7d0' : '#e5e7eb'};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionHeader = styled.div``;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
`;

const HistoryContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
`;

const HistoryContent = styled.div`
  text-align: center;
  padding: 2rem 0;
`;

const HistoryIcon = styled.div`
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;

const HistoryTitle = styled.h3`
  color: #6b7280;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
`;

const HistoryDescription = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
`;

export default AutoSyncDashboard;