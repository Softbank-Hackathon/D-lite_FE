import React from 'react';
import { Box } from '@mui/material';

interface StepIndicatorProps {
  count: number;
  current: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ count, current }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: index === current ? 'primary.main' : 'grey.300',
            transition: 'background-color 0.3s',
          }}
        />
      ))}
    </Box>
  );
};

export default StepIndicator;
