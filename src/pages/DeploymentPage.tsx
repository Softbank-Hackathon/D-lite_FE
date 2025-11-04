import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper, CircularProgress, Alert, List, ListItem, ListItemText, Divider } from '@mui/material';
import axios, { isAxiosError } from '../api/axiosInstance';
import { useProject } from '../contexts/ProjectContext';

const DeploymentPage: React.FC = () => {
  const { project } = useProject();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 모든 필수 정보가 context에 있는지 확인
    if (!project || !project.repo || !project.projectName || !project.projectType || !project.framework || !project.region || !project.roleArn || !project.externalId) {
      // 정보가 불완전하면 설정 시작 페이지로 리디렉션
      alert('Project configuration is incomplete. Redirecting to dashboard.');
      navigate('/dashboard');
    }
  }, [project, navigate]);

  const handleDeploy = async () => {
    if (!project) return;

    setLoading(true);
    setError(null);

    // API 요청 본문 구성
    const deploymentData = {
      githubRepositoryUrl: project.repo.html_url,
      projectType: project.projectType,
      frameworkType: project.framework,
      region: project.region,
      projectName: project.projectName,
      roleArn: project.roleArn,
      externalId: project.externalId,
    };

    try {
      await axios.post('/api/v1/deployments/deployment-project', deploymentData);
      // 배포 상태 페이지로 이동 (추후 실제 배포 ID 등을 전달할 수 있음)
      navigate('/status');
    } catch (err: any) {
      if (isAxiosError(err) && err.response) {
        setError(err.response.data.error || 'An unexpected error occurred during deployment.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    // useEffect에서 리디렉션하기 전 잠시 보여줄 로딩 상태
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Confirm & Deploy
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Please review your project settings below and click the deploy button to start the process.
        </Typography>

        <List disablePadding>
          <ListItem>
            <ListItemText primary="Project Name" secondary={project.projectName} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="GitHub Repository" secondary={project.repo.full_name} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Project Type" secondary={project.projectType} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Framework" secondary={project.framework} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="AWS Region" secondary={project.region} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="AWS Role ARN" secondary={project.roleArn} />
          </ListItem>
        </List>

        <Box sx={{ minHeight: "50px", mt: 3, mb: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => navigate('/connect')}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            onClick={handleDeploy}
          >
            {loading ? 'Deploying...' : 'Confirm & Deploy'}
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default DeploymentPage;
