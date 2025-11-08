import React, { useState } from 'react';
import { Box, Typography, Avatar, Paper, Button, Popover } from '@mui/material';

import { useAuth } from '../contexts/AuthContext';

const ProfileCard: React.FC = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isAuthenticated) {
      setAnchorEl(event.currentTarget);
    } else {
      login();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Paper
        elevation={0}
        onClick={handleClick}
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          backgroundColor: '#F3F4F6', // 연한 회색 배경
          borderRadius: '9999px', // 캡슐 형태
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          minWidth: 140, // 최소 너비 설정
          '&:hover': {
            backgroundColor: '#E5E7EB',
          },
        }}
      >
        {isAuthenticated && user ? (
          <>
            <Avatar
              alt={user.login}
              src={`https://github.com/${user.login}.png`} // GitHub 프로필 이미지
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {user.login}
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Avatar 
              alt="Profile"
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Log In
              </Typography>
            </Box>
          </>
        )}
      </Paper>

      {/* 로그아웃 Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ mt: 1 }}
        slotProps={{
          paper: {
            sx: {
              width: anchorEl?.offsetWidth || 140, // ProfileCard와 동일한 너비
              borderRadius: '9999px', // ProfileCard와 동일한 borderRadius
            },
          },
        }}
      >
        <Box sx={{ p: 1 }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleLogout}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: '9999px', // 캡슐 형태 유지
              height: 40, // ProfileCard Avatar와 동일한 높이
            }}
          >
            Log out
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default ProfileCard;
