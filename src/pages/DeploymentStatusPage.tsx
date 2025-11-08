/**
 * @file DeploymentStatusPage.tsx
 * @description 배포 상황을 나타내기 위한 페이지입니다.
 * 1초마다 배포 상태를 폴링하며 IN_PROGRESS, SUCCESS, FAILED 상태를 처리합니다.
 */
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Alert,
  Link,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import { useDeploymentPolling } from "../hooks/useDeploymentPolling";
import { commonPaperStyles } from "../styles/commonStyles";

const DeploymentStatusPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 커스텀 훅을 사용하여 배포 상태 폴링
  const { status, deploymentUrl, errorMessage, polling } = useDeploymentPolling({
    deploymentId: searchParams.get("deploymentId"),
    errorParam: searchParams.get("error"),
    autoRedirect: true,
    redirectDelay: 2000,
  });

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

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
        {/* IN_PROGRESS 상태 */}
        {status === "IN_PROGRESS" && polling && (
          <>
            <CircularProgress size={80} sx={{ mb: 3 }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              Deployment In Progress
            </Typography>
            <Typography color="text.secondary">
              Please wait while we deploy your project...
            </Typography>
          </>
        )}

        {/* SUCCESS 상태 */}
        {status === "SUCCESS" && (
          <>
            <CheckCircleIcon
              sx={{ fontSize: 80, color: "success.main", mb: 3 }}
            />
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              Deployment Successful!
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Your project has been deployed successfully
            </Typography>
            {deploymentUrl && (
              <Alert severity="success" sx={{ mb: 3, textAlign: "left" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Deployment URL:</strong>
                </Typography>
                <Link
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ wordBreak: "break-all" }}
                >
                  {deploymentUrl}
                </Link>
              </Alert>
            )}
            <Typography variant="body2" color="text.secondary">
              Redirecting to dashboard in 2 seconds...
            </Typography>
          </>
        )}

        {/* FAILED 상태 */}
        {status === "FAILED" && (
          <>
            <ErrorIcon sx={{ fontSize: 80, color: "error.main", mb: 3 }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              Deployment Failed
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              An error occurred during deployment
            </Typography>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>
                <Typography variant="body2">
                  <strong>Error:</strong> {errorMessage}
                </Typography>
              </Alert>
            )}
            <Button
              variant="contained"
              onClick={handleGoToDashboard}
              sx={{ mt: 2 }}
            >
              Go to Dashboard
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default DeploymentStatusPage;
