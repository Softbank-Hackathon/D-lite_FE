import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Divider,
  useTheme,
} from "@mui/material";
import { useProject } from "../contexts/ProjectContext";
import StepIndicator from "../components/StepIndicator";
import { commonPaperStyles } from "../styles/commonStyles";

// --- 1. Props 정의 ---
interface ConfirmProjectPageProps {
  stepIndex?: number;
  totalSteps?: number;
}

// --- 2. 메인 페이지 컴포넌트 ---
const ConfirmProjectPage: React.FC<ConfirmProjectPageProps> = ({
  stepIndex = 3, // 4번째 단계
  totalSteps = 4,
}) => {
  const theme = useTheme();
  const { project } = useProject();
  const navigate = useNavigate();

  // 프로젝트 정보가 없으면 대시보드로 리디렉션 (임시 주석 처리 해제 시 사용)
  // useEffect(() => {
  //   if (!project?.projectName || !project.repo || !project.framework || !project.region || !project.roleArn) {
  //     navigate("/dashboard");
  //   }
  // }, [project, navigate]);

  const handleDeploy = () => {
    // TODO: 실제 배포를 시작하는 API 호출 로직 추가
    console.log("Deploying project with settings:", project);
    navigate("/deploy"); // 배포 상태/로그 페이지로 이동
  };

  if (!project) {
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
          <Typography>Loading project details...</Typography>
        </Paper>
      </Box>
    );
  }

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
              5. Confirm Project Settings
            </Typography>
            <Typography color="text.secondary">
              Please review the settings below before starting the deployment.
            </Typography>
          </Box>

          {/* 프로젝트 요약 정보 */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Project Name
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 9 }}>
              <Typography>{project.projectName}</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider
                sx={{ my: 1, borderColor: theme.palette.custom.border }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Repository
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 9 }}>
              <Typography>{project.repo?.full_name}</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider
                sx={{ my: 1, borderColor: theme.palette.custom.border }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Framework
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 9 }}>
              <Typography>{project.framework}</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider
                sx={{ my: 1, borderColor: theme.palette.custom.border }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Region
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 9 }}>
              <Typography>{project.region}</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider
                sx={{ my: 1, borderColor: theme.palette.custom.border }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                AWS Role ARN
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 9 }}>
              <Typography sx={{ wordBreak: "break-all" }}>
                {project.roleArn}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider
                sx={{ my: 1, borderColor: theme.palette.custom.border }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                External ID
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 9 }}>
              <Typography>{project.externalId}</Typography>
            </Grid>
          </Grid>
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
            onClick={() => navigate("/connect")}
            aria-label="Go back"
            sx={{
              width: "150px", // 버튼의 고정 너비
              height: "40px", // 버튼의 고정 높이
            }}
          >
            &lt; Back
          </Button>
          <StepIndicator count={totalSteps} current={stepIndex} />

          <Button
            variant="contained"
            onClick={handleDeploy}
            disabled={
              !project.projectName ||
              !project.repo ||
              !project.framework ||
              !project.region ||
              !project.roleArn
            }
            aria-label="Confirm"
            sx={{
              width: "150px", // 버튼의 고정 너비
              height: "40px", // 버튼의 고정 높이
            }}
          >
            Confirm
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConfirmProjectPage;
