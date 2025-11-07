import React from 'react';
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from '../components/Header'; // 새로 만든 Header 컴포넌트 import

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: 'background.default', // 테마의 기본 배경색 적용
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
