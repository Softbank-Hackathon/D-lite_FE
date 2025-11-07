import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface RepoSearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RepoSearchInput: React.FC<RepoSearchInputProps> = ({ value, onChange }) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Find a repository..."
      value={value}
      onChange={onChange}
      aria-label="Find a repository"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ),
        sx: {
          borderRadius: '12px',
          height: '48px',
        },
      }}
    />
  );
};

export default RepoSearchInput;
