import React from 'react';
import { Chip } from '@mui/material';

interface VisibilityChipProps {
  isPrivate: boolean;
}

const VisibilityChip: React.FC<VisibilityChipProps> = ({ isPrivate }) => {
  const label = isPrivate ? 'Private' : 'Public';
  const styles = isPrivate
    ? {
        backgroundColor: '#F3F4F6', // 연회색 배경
        color: '#4B5563', // 회색 텍스트
      }
    : {
        backgroundColor: '#DBEAFE', // 연파랑 배경
        color: '#2563EB', // 파랑 텍스트
      };

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        ...styles,
        borderRadius: '9999px',
        fontWeight: 500,
        minWidth: 70, // 일관된 크기를 위한 최소 너비
        height: 24,   // 일관된 크기를 위한 높이
        justifyContent: 'center', // 텍스트 가운데 정렬
      }}
    />
  );
};

export default VisibilityChip;
