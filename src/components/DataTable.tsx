import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme
} from '@mui/material';
import StatusChip from './StatusChip';

export interface ProjectData {
  id: number;
  name: string;
  repository: string;
  repositoryUrl: string;
  framework: string;
  region: string;
  deploymentUrl: string;
  recentDate: string;
  status: 'Completed' | 'Failed' | 'Running';
}

interface DataTableProps {
  data: ProjectData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const theme = useTheme();

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.custom.border}` }}>
      <Table sx={{ minWidth: 650 }} aria-label="project summary table">
        <TableHead sx={{ backgroundColor: theme.palette.custom.header }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Repository</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Framework</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Region</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Deployment URL</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Recent Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>
                <a
                  href={row.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                  }}
                >
                  {row.repository}
                </a>
              </TableCell>
              <TableCell>{row.framework}</TableCell>
              <TableCell>{row.region}</TableCell>
              <TableCell>
                {row.deploymentUrl ? (
                  <a
                    href={row.deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                    }}
                  >
                    View Site
                  </a>
                ) : (
                  <span style={{ color: theme.palette.text.secondary }}>-</span>
                )}
              </TableCell>
              <TableCell>{row.recentDate}</TableCell>
              <TableCell>
                <StatusChip status={row.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
