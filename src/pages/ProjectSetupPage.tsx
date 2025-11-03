import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject, FRAMEWORK_OPTIONS, PROJECT_TYPE_OPTIONS } from '../contexts/ProjectContext';
import { Box, Button, Container, TextField, Typography, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Select, MenuItem, InputLabel } from '@mui/material';

const ProjectSetupPage: React.FC = () => {
  const { project, updateProjectSettings } = useProject();
  const navigate = useNavigate();

  useEffect(() => {
    // 만약 프로젝트(레포)가 선택되지 않았다면, 대시보드로 돌려보냅니다.
    if (!project) {
      navigate('/dashboard');
    }
  }, [project, navigate]);

  const handleSettingChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    if (name) {
      updateProjectSettings({ [name]: value });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // 모든 설정이 완료되었으므로 AWS 연결 페이지로 이동합니다.
    navigate('/connect');
  };

  if (!project) {
    return <p>Loading project...</p>; // 또는 리디렉션 중 로딩 스피너
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project Setup
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Repository: {project.repo.full_name}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            required
            fullWidth
            id="projectName"
            label="Project Name"
            name="projectName"
            value={project.projectName}
            onChange={handleSettingChange}
            sx={{ mb: 3 }}
          />

          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Project Type</FormLabel>
            <RadioGroup
              row
              aria-label="projectType"
              name="projectType"
              value={project.projectType || ''}
              onChange={handleSettingChange}
            >
              <FormControlLabel value={PROJECT_TYPE_OPTIONS.FRONTEND} control={<Radio />} label="Frontend Only" />
              <FormControlLabel value={PROJECT_TYPE_OPTIONS.FULLSTACK} control={<Radio />} label="Frontend + Backend" />
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth required sx={{ mb: 3 }}>
            <InputLabel id="framework-select-label">Frontend Framework</InputLabel>
            <Select
              labelId="framework-select-label"
              id="framework"
              name="framework"
              value={project.framework || ''}
              label="Frontend Framework"
              onChange={handleSettingChange as any} // MUI Select와 React.ChangeEvent 타입 불일치 문제
            >
              {FRAMEWORK_OPTIONS.map((fw) => (
                <MenuItem key={fw} value={fw}>
                  {fw}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={!project.projectName || !project.projectType || !project.framework}
            >
              Next: Connect AWS
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProjectSetupPage;
