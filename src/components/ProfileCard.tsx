import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';

const ProfileCard: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        backgroundColor: '#F3F4F6', // 연한 회색 배경
        borderRadius: '9999px', // 캡슐 형태
      }}
    >
      <Avatar
        alt="MOON WON"
        // src="/path-to-avatar.jpg" // 실제 이미지 경로
        sx={{ width: 40, height: 40 }}
      />
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          MOON WON
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          juliasc@naver.com
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProfileCard;
