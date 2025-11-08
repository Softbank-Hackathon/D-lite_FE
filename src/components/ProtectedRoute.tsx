import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress } from "@mui/material";

// 인증이 필요한 라우트를 보호하는 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // 로딩 중일 때 중앙에 스피너 표시
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // 인증되지 않았으면 홈페이지로 리다이렉트
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
