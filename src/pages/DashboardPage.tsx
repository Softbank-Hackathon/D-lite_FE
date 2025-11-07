import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Modal, TextField, Button, Paper
} from '@mui/material';

// 컴포넌트 임포트
import Filters, { type FilterValues } from '../components/Filters';
import DataTable, { type ProjectData } from '../components/DataTable';
import NewProjectButton from '../components/NewProjectButton';
import { useProject } from '../contexts/ProjectContext'; // ProjectContext import

// 더미 데이터 정의
const dummyData: ProjectData[] = [
  { id: 1, name: "Nelsa web", repository: "my-repository-a", framework: "React", recentDate: "2023-05-25", status: "Completed" },
  { id: 2, name: "Website builder", repository: "my-repository-b", framework: "Vue", recentDate: "2023-07-13", status: "Failed" },
  { id: 3, name: "E-commerce Platform", repository: "my-repository-c", framework: "Angular", recentDate: "2023-11-01", status: "Running" },
  { id: 4, name: "Portfolio Site", repository: "my-repository-d", framework: "React", recentDate: "2022-12-20", status: "Completed" },
];

// 날짜 포맷팅 유틸
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateProjectSettings, clearProject } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [filters, setFilters] = useState<FilterValues>({ framework: 'all', date: 'recent', status: 'all' });

  const handleOpenModal = () => {
    clearProject();
    setNewProjectName('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleConfirmCreation = () => {
    if (!newProjectName.trim()) return; // 이름이 비어있으면 진행 안함
    updateProjectSettings({ projectName: newProjectName });
    handleCloseModal();
    navigate('/select-repo');
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const filteredAndSortedData = useMemo(() => {
    let data = [...dummyData];
    if (filters.framework !== 'all') {
      data = data.filter(item => item.framework === filters.framework);
    }
    if (filters.status !== 'all') {
      data = data.filter(item => item.status === filters.status);
    }
    data.sort((a, b) => {
      const dateA = new Date(a.recentDate).getTime();
      const dateB = new Date(b.recentDate).getTime();
      return filters.date === 'recent' ? dateB - dateA : dateA - dateB;
    });
    return data.map(item => ({ ...item, recentDate: formatDate(item.recentDate) }));
  }, [filters]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Project summary
          </Typography>
          <Filters onFilterChange={handleFilterChange} />
        </Box>
        <DataTable data={filteredAndSortedData} />
      </Container>
      <NewProjectButton onClick={handleOpenModal} />

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="create-project-modal-title"
      >
        <Paper sx={modalStyle}>
          <Typography id="create-project-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            New Project
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Project Name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            variant="outlined"
            onKeyPress={(e) => e.key === 'Enter' && handleConfirmCreation()}
          />
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Button variant="text" color="error" onClick={handleCloseModal}>Cancel</Button>
            <Button variant="text" color="primary" onClick={handleConfirmCreation} disabled={!newProjectName.trim()}>Confirm</Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default DashboardPage;