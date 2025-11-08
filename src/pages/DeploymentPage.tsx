import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  Paper,
} from "@mui/material";
import axios from "../api/axiosInstance";
import { useProject } from "../contexts/ProjectContext";
import { commonPaperStyles } from "../styles/commonStyles";

const DeploymentPage: React.FC = () => {
  const theme = useTheme();
  const { project } = useProject();
  const navigate = useNavigate();

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
    const startDeployment = async () => {
      // API 요청 본문 구성
      const deploymentData = {
        githubRepositoryUrl: project.repo.html_url,
        projectType: project.projectType || "frontend",
        frameworkType: project.framework!,
        branch: project.branch!,
        region: project.region!,
        projectName: project.projectName,
        roleArn: project.roleArn!,
        externalId: project.externalId!,
      };

      try {
        const response = await axios.post(
          "/api/v1/deployments/deployment-project",
          deploymentData
        );
        // API 응답 형식: { message, result, errorCode, success }
        // result에 deploymentId가 들어있음
        const deploymentId = response.data.result;

        // 배포 상태 페이지로 이동
        navigate(`/status?deploymentId=${deploymentId}`);
      } catch (error) {
        console.error("Failed to start deployment:", error);
        // 에러 발생 시에도 status 페이지로 이동 (에러 처리는 status 페이지에서)
        navigate("/status?error=deployment_failed");
      }
    };

    startDeployment();
  }, [project, navigate]);

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
