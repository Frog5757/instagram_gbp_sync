import { useState } from 'react';
import styled from '@emotion/styled';
import { getFacebookAccessToken, getInstagramBusinessAccounts } from '../utils/instagram';

const TestInstagramAPI = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: アクセストークン確認
      console.log('Step 1: Getting access token...');
      const token = await getFacebookAccessToken();
      console.log('Access Token found:', !!token);

      // Step 2: Facebook Pages取得
      console.log('Step 2: Getting Facebook pages...');
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${token}`
      );
      
      if (!pagesResponse.ok) {
        throw new Error(`Facebook API Error: ${pagesResponse.status}`);
      }
      
      const pagesData = await pagesResponse.json();
      console.log('Facebook Pages:', pagesData);

      // Step 3: Instagram Business Accounts取得
      console.log('Step 3: Getting Instagram business accounts...');
      const instagramAccounts = await getInstagramBusinessAccounts();
      console.log('Instagram Accounts:', instagramAccounts);

      // Step 4: Instagram投稿データ取得（最初のアカウントで）
      let mediaPosts = null;
      if (instagramAccounts.length > 0) {
        console.log('Step 4: Getting Instagram media...');
        const firstAccount = instagramAccounts[0];
        try {
          const mediaResponse = await fetch(
            `https://graph.facebook.com/v18.0/${firstAccount.instagramAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,permalink&access_token=${firstAccount.accessToken}&limit=5`
          );
          
          if (mediaResponse.ok) {
            const mediaData = await mediaResponse.json();
            mediaPosts = mediaData.data;
            console.log('Instagram Posts:', mediaPosts);
          }
        } catch (mediaError) {
          console.error('Instagram Media Error:', mediaError);
        }
      }

      setResult({
        accessToken: token.substring(0, 20) + '...',
        facebookPages: pagesData,
        instagramAccounts: instagramAccounts,
        instagramPosts: mediaPosts
      });

    } catch (err: any) {
      console.error('API Test Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Instagram API テスト</Title>
      
      <TestButton onClick={testAPI} disabled={loading}>
        {loading ? 'テスト実行中...' : 'Instagram API をテスト'}
      </TestButton>

      {error && (
        <ErrorContainer>
          <ErrorTitle>エラー:</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
        </ErrorContainer>
      )}

      {result && (
        <ResultContainer>
          <ResultTitle>結果:</ResultTitle>
          <ResultContent>
            <div><strong>Access Token:</strong> {result.accessToken}</div>
            <div><strong>Facebook Pages:</strong> {JSON.stringify(result.facebookPages, null, 2)}</div>
            <div><strong>Instagram Accounts:</strong> {JSON.stringify(result.instagramAccounts, null, 2)}</div>
            {result.instagramPosts && (
              <div><strong>Instagram Posts:</strong> {JSON.stringify(result.instagramPosts, null, 2)}</div>
            )}
          </ResultContent>
        </ResultContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: #111827;
  margin-bottom: 1rem;
`;

const TestButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 2rem;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ErrorContainer = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h3`
  color: #dc2626;
  margin: 0 0 0.5rem 0;
`;

const ErrorMessage = styled.p`
  color: #b91c1c;
  margin: 0;
`;

const ResultContainer = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const ResultTitle = styled.h3`
  color: #0c4a6e;
  margin: 0 0 0.5rem 0;
`;

const ResultContent = styled.pre`
  color: #0369a1;
  font-size: 0.875rem;
  white-space: pre-wrap;
  word-break: break-all;
`;

export default TestInstagramAPI;