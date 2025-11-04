import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const GithubCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading, handleLoginSuccess } = useAuth();

  useEffect(() => {
    const handleGithubCallback = async () => {
      const code = searchParams.get('code');

      if (code) {
        try {
          // 실제 백엔드에서는 이 코드를 백엔드로 보내 토큰을 교환합니다.
          // MSW 환경에서는 /api/auth/github/callback 핸들러가 이를 처리합니다.
          const response = await axios.get(`/api/auth/github/callback?code=${code}`);
          if (response.data.success) {
            // 1. AuthContext의 상태를 명시적으로 업데이트
            handleLoginSuccess(response.data.user);
            // 2. 대시보드 페이지로 리디렉션
            navigate('/dashboard', { replace: true });
          } else {
            // 에러 처리
            console.error('GitHub callback failed:', response.data.message);
            navigate('/', { replace: true }); // 홈으로 리디렉션 또는 에러 페이지
          }
        } catch (error) {
          console.error('Error during GitHub callback:', error);
          navigate('/', { replace: true }); // 홈으로 리디렉션 또는 에러 페이지
        }
      } else {
        console.error('No code found in callback URL');
        navigate('/', { replace: true }); // 홈으로 리디렉션 또는 에러 페이지
      }
    };

    // AuthContext의 로딩이 완료되고, 아직 인증되지 않았다면 콜백 처리 시작
    // 이미 인증되었다면 (예: 새로고침 후) 대시보드로 바로 이동
    if (!loading && !isAuthenticated) {
      handleGithubCallback();
    } else if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate, isAuthenticated, loading, handleLoginSuccess]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h6">Authenticating with GitHub...</Typography>
    </Box>
  );
};

export default GithubCallbackPage;
