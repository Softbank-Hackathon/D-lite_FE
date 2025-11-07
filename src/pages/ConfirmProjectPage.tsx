import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
} from '@mui/material';

const ConfirmProjectPage: React.FC = () => {
  const { project } = useProject();
  const navigate = useNavigate();

  // useEffect를 사용하여 프로젝트 정보가 완전한지 확인하고, 그렇지 않으면 적절한 페이지로 리디렉션할 수 있습니다.
  // 예: if (!project?.roleArn) navigate('/connect');

  const handleDeploy = () => {
    // TODO: 배포를 시작하는 API 호출 로직 추가
    console.log('Deploying project with settings:', project);
    navigate('/deploy'); // 배포 상태/로그 페이지로 이동
  };

  if (!project) {
    return <p>Loading project details...</p>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Confirm Your Project Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Please review the settings below before starting the deployment.
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 3 }}><Typography variant="subtitle1"><strong>Project Name</strong></Typography></Grid>
          <Grid size={{ xs: 12, sm: 9 }}><Typography>{project.projectName}</Typography></Grid>

          <Grid size={{ xs: 12 }}><Divider /></Grid>

          <Grid size={{ xs: 12, sm: 3 }}><Typography variant="subtitle1"><strong>Repository</strong></Typography></Grid>
          <Grid size={{ xs: 12, sm: 9 }}><Typography>{project.repo?.full_name}</Typography></Grid>

          <Grid size={{ xs: 12 }}><Divider /></Grid>

          <Grid size={{ xs: 12, sm: 3 }}><Typography variant="subtitle1"><strong>Project Type</strong></Typography></Grid>
          <Grid size={{ xs: 12, sm: 9 }}><Typography>{project.projectType}</Typography></Grid>

          <Grid size={{ xs: 12 }}><Divider /></Grid>

          <Grid size={{ xs: 12, sm: 3 }}><Typography variant="subtitle1"><strong>Framework</strong></Typography></Grid>
          <Grid size={{ xs: 12, sm: 9 }}><Typography>{project.framework}</Typography></Grid>

          <Grid size={{ xs: 12 }}><Divider /></Grid>

          <Grid size={{ xs: 12, sm: 3 }}><Typography variant="subtitle1"><strong>Region</strong></Typography></Grid>
          <Grid size={{ xs: 12, sm: 9 }}><Typography>{project.region}</Typography></Grid>

          <Grid size={{ xs: 12 }}><Divider /></Grid>

          <Grid size={{ xs: 12, sm: 3 }}><Typography variant="subtitle1"><strong>AWS Role ARN</strong></Typography></Grid>
          <Grid size={{ xs: 12, sm: 9 }}><Typography sx={{ wordBreak: 'break-all' }}>{project.roleArn}</Typography></Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => navigate('/connect')} // 이전 단계(ARN 입력)로 돌아가기
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleDeploy}
          >
            Confirm & Deploy
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ConfirmProjectPage;
