import React from 'react';
import { Chip, useTheme } from '@mui/material';
import type { Theme } from '@mui/material/styles'; // Import Theme type

// 상태별 스타일 맵
const statusStyles = (theme: Theme) => ({
  Completed: {
    backgroundColor: theme.palette.custom.success.bg,
    color: theme.palette.custom.success.text,
  },
  Failed: {
    backgroundColor: theme.palette.custom.danger.bg,
    color: theme.palette.custom.danger.text,
  },
  Running: {
    backgroundColor: theme.palette.custom.chip.bg,
    color: theme.palette.text.primary,
  },
});

interface StatusChipProps {
  status: 'Completed' | 'Failed' | 'Running';
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const theme = useTheme();
  const styles = statusStyles(theme);

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        ...styles[status],
        borderRadius: '9999px',
        fontWeight: 500,
        minWidth: 90, // 일관된 크기를 위한 최소 너비
        height: 28,   // 일관된 크기를 위한 높이
        justifyContent: 'center', // 텍스트 가운데 정렬
      }}
    />
  );
};

export default StatusChip;
