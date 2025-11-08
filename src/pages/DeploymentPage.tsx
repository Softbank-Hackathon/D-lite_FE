import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  Paper,
} from "@mui/material";

import { useProject } from "../contexts/ProjectContext";
import { commonPaperStyles } from "../styles/commonStyles";
import { useCreateDeployment } from "../hooks/api/useDeploymentApi";

const DeploymentPage: React.FC = () => {
  const theme = useTheme();
  const { project } = useProject();
  const navigate = useNavigate();
  
  // useCreateDeployment 훅 사용
  const { mutate: createDeployment, data: deploymentResponse, error } = useCreateDeployment();

  // 배포 응답 처리
  useEffect(() => {
    if (deploymentResponse) {
      // API 응답 형식: { message, result, errorCode, success }
      const deploymentId = deploymentResponse.result;
      navigate(`/status?deploymentId=${deploymentId}`);
    }
  }, [deploymentResponse, navigate]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      console.error('Failed to start deployment:', error);
      navigate("/status?error=deployment_failed");
    }
  }, [error, navigate]);

  useEffect(() => {
    // 모든 필수 정보가 context에 있는지 확인
    if (
      !project ||
      !project.repo ||
      !project.projectName ||
      !project.framework ||
      !project.region ||
      !project.roleArn ||
      !project.externalId ||
      !project.branch
    ) {
      // 정보가 불완전하면 dashboard로 리디렉션
      console.error("Project configuration is incomplete");
      navigate("/dashboard");
      return;
    }

    // 자동으로 배포 시작
    const deploymentData = {
      githubRepositoryUrl: project.repo.html_url,
      projectType: (project.projectType || "frontend") as "frontend" | "backend",
      frameworkType: project.framework!,
      branch: project.branch!,
      region: project.region!,
      projectName: project.projectName,
      roleArn: project.roleArn!,
      externalId: project.externalId!,
    };

    createDeployment(deploymentData);
  }, [project, navigate, createDeployment]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.custom.header,
        py: 2,
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper elevation={0} sx={{ ...commonPaperStyles, textAlign: "center" }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Starting Deployment...
        </Typography>
        <Typography color="text.secondary">
          Please wait while we initialize your deployment
        </Typography>
      </Paper>
    </Box>
  );
};

export default DeploymentPage;
