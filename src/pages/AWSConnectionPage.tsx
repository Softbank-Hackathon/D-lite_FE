import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import { useProject } from "../contexts/ProjectContext";
import StepIndicator from "../components/StepIndicator";
import { commonPaperStyles } from "../styles/commonStyles";

// TODO : 해당 페이지 제거해야 함
// --- 1. Props 정의 ---
interface AWSConnectionPageProps {
  stepIndex?: number;
  totalSteps?: number;
}

// --- 2. 메인 페이지 컴포넌트 ---
const AWSConnectionPage: React.FC<AWSConnectionPageProps> = ({
  stepIndex = 3, // 4번째 단계
  totalSteps = 5,
}) => {
  const theme = useTheme();
  const { project, updateProjectSettings } = useProject();
  const navigate = useNavigate();

  const externalId = "dlight-external-id-placeholder"; // 고정값

  const [roleArnInput, setRoleArnInput] = useState(project?.roleArn || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 프로젝트 정보가 불완전하면 이전 단계로 리디렉션 (임시 주석 처리 해제 시 사용)
  useEffect(() => {
    /* if (
      !project ||
      !project.projectName ||
      !project.repo ||
      !project.projectType ||
      !project.framework ||
      !project.region
    ) {
      navigate("/select-framework");
    } */
  }, [project, navigate]);

  const handleNextClick = async () => {
    if (!roleArnInput.trim()) {
      setError("Please enter a Role ARN.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // ProjectContext에 Role ARN과 External ID 저장
    updateProjectSettings({ roleArn: roleArnInput, externalId });

    // 실제 API 검증 로직이 필요하다면 여기에 추가
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsLoading(false);
    navigate("/confirm-project"); // 다음 페이지: 최종 확인
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.custom.header,
        py: 2,
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
      }}
    >
      <Paper elevation={0} sx={commonPaperStyles}>
        {/* 상단 컨텐츠 영역 */}
        <Box sx={{ flexGrow: 1 }}>
          {/* 제목 섹션 */}
          <Box mb={3}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", mb: 0.5 }}
            >
              4. Configure AWS IAM Role
            </Typography>
            <Typography color="text.secondary">
              Follow the steps below to configure your AWS IAM Role.
            </Typography>
          </Box>

          {/* IAM Role 설정 안내 */}
          <Box
            sx={{
              border: `1px solid ${theme.palette.custom.border}`,
              p: 3,
              borderRadius: "12px",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Step 1: Configure IAM Role in AWS
            </Typography>
            <ol style={{ margin: 0, paddingLeft: "20px" }}>
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
                Complete the role creation and copy the{" "}
                <strong>Role ARN</strong>.
              </li>
            </ol>
          </Box>

          {/* Role ARN 입력 필드 */}
          <Box component="form" noValidate>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Step 2: Submit Role ARN
            </Typography>
            <TextField
              required
              fullWidth
              id="roleArn"
              label="AWS Role ARN"
              name="roleArn"
              placeholder="arn:aws:iam::123456789012:role/YourRoleName"
              value={roleArnInput}
              onChange={(e) => setRoleArnInput(e.target.value)}
              disabled={isLoading}
              sx={{ mb: 2, borderRadius: "12px" }}
            />
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Box>

        {/* 푸터 섹션 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Button
            variant="text"
            onClick={() => navigate("/select-region")}
            aria-label="Go back"
            sx={{
              width: "150px",
              height: "40px",
            }}
          >
            &larr; Back
          </Button>
          <StepIndicator count={totalSteps} current={stepIndex} />
          <Button
            variant="contained"
            onClick={handleNextClick}
            disabled={isLoading || !roleArnInput.trim()}
            aria-label="Go to next step"
            startIcon={
              isLoading ? <CircularProgress size={20} color="inherit" /> : null
            }
            sx={{
              width: "150px", // 버튼의 고정 너비
              height: "40px", // 버튼의 고정 높이
            }}
          >
            {isLoading ? "Verifying..." : "Next →"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AWSConnectionPage;
