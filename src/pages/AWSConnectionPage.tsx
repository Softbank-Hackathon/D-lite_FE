/**
 * @file AWSConnectionPage.tsx
 * @description 클라이언트 측 AWS 서버 권한을 받는 페이지입니다.
 * AWS Role ARN과 리전을 입력받습니다.
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { useProject } from "../contexts/ProjectContext";

// List of common AWS regions
const awsRegions = [
  { value: "ap-northeast-2", label: "ap-northeast-2 (Seoul)" },
  { value: "us-east-1", label: "us-east-1 (N. Virginia)" },
  { value: "us-west-2", label: "us-west-2 (Oregon)" },
  { value: "eu-central-1", label: "eu-central-1 (Frankfurt)" },
  { value: "ap-southeast-1", label: "ap-southeast-1 (Singapore)" },
];

const AWSConnectionPage: React.FC = () => {
  const { project, updateProjectSettings } = useProject();
  const navigate = useNavigate();

  // externalId는 이 페이지에서 생성되거나 고정값으로 사용됩니다.
  const externalId = "dlight-external-id-placeholder";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      !project ||
      !project.projectName ||
      !project.projectType ||
      !project.framework
    ) {
      // 프로젝트 정보가 불완전하면 대시보드로 리디렉션
      navigate("/dashboard");
    }
  }, [project, navigate]);

  const handleSettingChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    if (name) {
      updateProjectSettings({ [name]: value });
    }
  };

  const handleConnect = async () => {
    if (!project?.roleArn?.trim()) {
      setError("Please enter a Role ARN.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // externalId와 region을 컨텍스트에 저장합니다.
    updateProjectSettings({ 
      externalId,
      region: project.region || awsRegions[0].value // 사용자가 지역을 선택하지 않은 경우 기본값 사용
    });

    // 실제 API 검증 로직이 필요하다면 여기에 추가할 수 있습니다.
    // 지금은 바로 다음 페이지로 이동합니다.
    await new Promise((resolve) => setTimeout(resolve, 500)); 

    navigate("/deploy");
  };

  if (!project) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
        <Typography>Redirecting to dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Connect to AWS
        </Typography>

        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 3, backgroundColor: "#f5f5f5" }}
        >
          <Typography variant="h6" gutterBottom>
            Project Summary
          </Typography>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>Project Name:</strong> {project.projectName}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>Repository:</strong> {project.repo.full_name}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>Project Type:</strong> {project.projectType}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography>
                <strong>Framework:</strong> {project.framework}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="body1" color="text.secondary" gutterBottom>
          Follow the steps below, then paste the generated Role ARN and select
          your region to start the deployment.
        </Typography>

        <Box
          sx={{ border: "1px solid #ccc", p: 2, borderRadius: 1, mt: 3, mb: 3 }}
        >
          <Typography variant="h6">
            Step 1: Configure IAM Role in AWS
          </Typography>
          <ol>
            <li>Sign in to your AWS Console and open the IAM service.</li>
            <li>
              Go to <strong>Roles</strong> and click{" "}
              <strong>Create role</strong>.
            </li>
            <li>
              For trusted entity type, select <strong>AWS account</strong>.
            </li>
            <li>
              Under 'An AWS account', select{" "}
              <strong>Another AWS account</strong> and enter the Account ID:{" "}
              <strong>495236580665</strong>
            </li>
            <li>
              Under 'Options', check <strong>Require external ID</strong> and
              enter: <strong>{externalId}</strong>
            </li>
            <li>Attach the necessary permissions policies for deployment.</li>
            <li>
              Complete the role creation and copy the <strong>Role ARN</strong>.
            </li>
          </ol>
        </Box>

        <Box component="form" noValidate sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Step 2: Submit Role ARN and Select Region
          </Typography>
          <TextField
            required
            fullWidth
            id="roleArn"
            label="AWS Role ARN"
            name="roleArn"
            placeholder="arn:aws:iam::123456789012:role/YourRoleName"
            value={project.roleArn || ''}
            onChange={handleSettingChange}
            disabled={isLoading}
            sx={{ mb: 3 }}
          />
          <FormControl fullWidth required disabled={isLoading} sx={{ mb: 2 }}>
            <InputLabel id="aws-region-select-label">AWS Region</InputLabel>
            <Select
              labelId="aws-region-select-label"
              id="aws-region-select"
              name="region" // name 속성 추가
              value={project.region || awsRegions[0].value}
              label="AWS Region"
              onChange={handleSettingChange as any}
            >
              {awsRegions.map((region) => (
                <MenuItem key={region.value} value={region.value}>
                  {region.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ minHeight: "50px", mb: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => navigate('/project-setup')}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              onClick={handleConnect}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isLoading ? "Saving..." : "Next: Deploy"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AWSConnectionPage;
