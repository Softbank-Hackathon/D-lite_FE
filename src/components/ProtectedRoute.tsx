import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// 인증이 필요한 라우트를 보호하는 컴포넌트 (임시로 비활성화)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const { isAuthenticated, loading } = useAuth();

  // if (loading) {
  //   return <p>Loading authentication...</p>; // 또는 로딩 스피너
  // }

  // if (!isAuthenticated) {
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export default ProtectedRoute;
