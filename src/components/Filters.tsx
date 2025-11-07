import React, { useState } from 'react';
import { Select, MenuItem, FormControl, Grid } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

export interface FilterValues {
  framework: string;
  date: string;
  status: string;
}

interface FiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterValues>({
    framework: 'all',
    date: 'recent',
    status: 'all',
  });

  const handleChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    const newFilters = { ...filters, [name as string]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const renderSelect = (name: keyof FilterValues, label: string, options: { value: string; label: string }[]) => (
    <FormControl size="small" sx={{ minWidth: 120, width: '100%' }}>
      <Select
        name={name}
        value={filters[name]}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': label }}
        sx={{
          borderRadius: '14px',
          color: filters[name] === 'all' || filters[name] === 'recent' ? 'text.secondary' : 'text.primary',
        }}
      >
        {options.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
      <Grid size={{ xs: 12, sm: 4, md: 'auto' }}>
        {renderSelect('framework', 'Framework', [
          { value: 'all', label: 'All Frameworks' },
          { value: 'React', label: 'React' },
          { value: 'Vue', label: 'Vue' },
          { value: 'Vanila', label: 'Vanila' },
          { value: 'Angular', label: 'Angular' },
          { value: 'Svelte', label: 'Svelte' },
        ])}
      </Grid>
      <Grid size={{ xs: 12, sm: 4, md: 'auto' }}>
        {renderSelect('date', 'Recent Date', [
          { value: 'recent', label: 'Recent Date' },
          { value: 'oldest', label: 'Oldest Date' },
        ])}
      </Grid>
      <Grid size={{ xs: 12, sm: 4, md: 'auto' }}>
        {renderSelect('status', 'Status', [
          { value: 'all', label: 'All Statuses' },
          { value: 'Completed', label: 'Completed' },
          { value: 'Failed', label: 'Failed' },
          { value: 'Running', label: 'Running' },
        ])}
      </Grid>
    </Grid>
  );
};

export default Filters;
