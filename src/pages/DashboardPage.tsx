import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress, Modal, List, ListItem, ListItemText, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const DashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { project, setProjectRepo, clearProject } = useProject();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);

  const handleOpen = async () => {
    setOpen(true);
    setReposLoading(true);
    setReposError(null);
    try {
      const response = await axios.get<Repository[]>('/api/user/repos');
      setRepos(response.data);
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      setReposError('Failed to load repositories. Please try again.');
    } finally {
      setReposLoading(false);
    }
  };

  const handleClose = () => setOpen(false);

  const handleSelectRepo = (repo: Repository) => {
    setProjectRepo(repo);
    handleClose();
    navigate('/project-setup'); // <<<--- 수정된 부분: 프로젝트 설정 페이지로 이동
  };

  const handleDeployExistingProject = () => {
    navigate('/connect'); // 기존 프로젝트 배포를 위해 AWS 연결 페이지로 이동
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      {user && (
        <Typography variant="h6" gutterBottom>
          Welcome, {user.name || user.login}!
        </Typography>
      )}

      <Box sx={{ mt: 4 }}>
        {project ? (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Current Project:
            </Typography>
            <Typography variant="body1">Name: {project.projectName}</Typography>
            <Typography variant="body1">Repository: {project.repo.full_name}</Typography>
            <Typography variant="body1">Type: {project.projectType || 'Not set'}</Typography>
            <Typography variant="body1">Framework: {project.framework || 'Not set'}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, mr: 2 }}
              onClick={handleDeployExistingProject}
            >
              Deploy This Project
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={clearProject}
            >
              Clear Project
            </Button>
          </Paper>
        ) : (
          <Box>
            <Typography variant="h5" gutterBottom>
              No project selected.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Add New Project
            </Button>
          </Box>
        )}
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Select a Repository
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          {reposLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : reposError ? (
            <Typography color="error">{reposError}</Typography>
          ) : (
            <List>
              {repos.map((repo) => (
                <ListItem button key={repo.id} onClick={() => handleSelectRepo(repo)}>
                  <ListItemText primary={repo.full_name} secondary={repo.private ? 'Private' : 'Public'} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default DashboardPage;
