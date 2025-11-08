import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Modal, TextField, Button, Paper, CircularProgress, Alert
} from '@mui/material';

// 컴포넌트 임포트
import Filters, { type FilterValues } from '../components/Filters';
import DataTable, { type ProjectData } from '../components/DataTable';
import NewProjectButton from '../components/NewProjectButton';
import { useProject } from '../contexts/ProjectContext';
import { useDataFilter } from '../hooks/useDataFilter';
import { useProjects } from '../hooks/api/useProjectApi';

const modalStyle = {
  position: 'absolute' as const,
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

  // useProjects 훅으로 프로젝트 목록 조회
  const { data: projectsResponse, isLoading, error } = useProjects();

  // API 응답을 ProjectData 형식으로 변환
  const projectData: ProjectData[] = React.useMemo(() => {
    if (!projectsResponse?.result) return [];
    
    return projectsResponse.result.map((project) => ({
      id: project.id,
      name: project.projectName,
      repository: project.githubRepoUrl.split('/').pop() || project.githubRepoUrl,
      repositoryUrl: project.githubRepoUrl,
      framework: project.frameworkType,
      region: 'N/A', // API에 region 정보가 없으므로 기본값
      deploymentUrl: 'N/A', // API에 deploymentUrl 정보가 없으므로 기본값
      recentDate: new Date().toISOString().split('T')[0], // 임시값
      status: project.isActive ? 'Completed' : 'Failed', // isActive를 Completed/Failed로 매핑
    }));
  }, [projectsResponse]);

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

  // 커스텀 훅 사용: 데이터 필터링 및 정렬
  const filteredAndSortedData = useDataFilter(projectData, filters);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container sx={{ py: 4 }}>
        {/* 로딩 상태 */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* 에러 상태 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            프로젝트 목록을 불러오는데 실패했습니다.
          </Alert>
        )}

        {/* 데이터 표시 */}
        {!isLoading && !error && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                Project summary
              </Typography>
              <Filters onFilterChange={handleFilterChange} />
            </Box>
            <DataTable data={filteredAndSortedData} />
          </>
        )}
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