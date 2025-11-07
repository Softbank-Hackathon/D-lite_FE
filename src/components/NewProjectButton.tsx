import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface NewProjectButtonProps {
  onClick: () => void;
}

const NewProjectButton: React.FC<NewProjectButtonProps> = ({ onClick }) => {
  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label="add new project"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        borderRadius: '16px', // 큼직한 라운드
        textTransform: 'none', // 텍스트 대문자 변환 방지
        px: 2.5,
      }}
    >
      <AddIcon sx={{ mr: 1 }} />
      New Project
    </Fab>
  );
};

export default NewProjectButton;
