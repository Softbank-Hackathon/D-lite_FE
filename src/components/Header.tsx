import React from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProfileCard from './ProfileCard';

const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        height: '80px',
        backgroundColor: theme.palette.custom.header, // --bg: #F5FAFF
        justifyContent: 'center',
        borderRadius: 0, // 테두리를 각지게
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main, // 파랑 #2563EB
            }}
          >
            Dlite
          </Typography>
        </Box>
        <ProfileCard />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
