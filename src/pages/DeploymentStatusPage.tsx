/**
 * @file DeploymentStatusPage.tsx
 * @description 배포 상황을 나타내기 위한 페이지입니다.
 * 1초마다 배포 상태를 폴링하며 IN_PROGRESS, SUCCESS, FAILED 상태를 처리합니다.
 */
import React, { useState, useEffect } from "react";
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
import axios from "../api/axiosInstance";
import { commonPaperStyles } from "../styles/commonStyles";
import type { DeploymentStatusResponse } from "../types/deployment";

const DeploymentStatusPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const deploymentId = searchParams.get("deploymentId");
  const error = searchParams.get("error");

  const [status, setStatus] = useState<"IN_PROGRESS" | "SUCCESS" | "FAILED">(
    "IN_PROGRESS"
  );
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    // URL에 에러 파라미터가 있으면 즉시 실패 상태로 표시
    if (error) {
      setStatus("FAILED");
      setErrorMessage("Failed to start deployment. Please try again.");
      setPolling(false);
      return;
    }

    if (!deploymentId) {
      setStatus("FAILED");
      setErrorMessage("No deployment ID provided");
      setPolling(false);
      return;
    }

    // 1초마다 배포 상태 확인
    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get<DeploymentStatusResponse>(
          `/api/v1/deployments/${deploymentId}/status`
        );

        const { status: newStatus, deploymentUrl: url, errorMessage: errMsg } = response.data;

        setStatus(newStatus);

        if (newStatus === "SUCCESS") {
          setDeploymentUrl(url || null);
          setPolling(false);
          clearInterval(pollInterval);

          // 2초 후 자동으로 Dashboard로 이동
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else if (newStatus === "FAILED") {
          setErrorMessage(errMsg || "Deployment failed");
          setPolling(false);
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error("Failed to fetch deployment status:", err);
        setStatus("FAILED");
        setErrorMessage("Failed to fetch deployment status");
        setPolling(false);
        clearInterval(pollInterval);
      }
    }, 1000); // 1초마다 폴링

    return () => {
      clearInterval(pollInterval);
    };
  }, [deploymentId, error, navigate]);

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
