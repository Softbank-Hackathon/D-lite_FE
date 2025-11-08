import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface FrameworkCardProps {
  name: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}

const StyledCard = styled(Card)<{ selected: boolean }>(({ theme, selected }) => ({
  height: '200px',
  border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid #E5E7EB`,
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  ...(selected && {
    boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
  }),
}));

const FrameworkCard: React.FC<FrameworkCardProps> = ({ name, icon, selected, onClick }) => {
  return (
    <StyledCard selected={selected} onClick={onClick} role="radio" aria-checked={selected}>
      <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Box component="img" src={icon} alt={`${name} logo`} sx={{ height: 80, mb: 2 }} />
          <Typography variant="h6" component="div">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

export default FrameworkCard;
