import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Grid, useTheme } from "@mui/material";
import StepIndicator from "../components/StepIndicator";
import FrameworkCard from "../components/FrameworkCard";
import { useProject } from "../contexts/ProjectContext";
import { commonPaperStyles } from "../styles/commonStyles";

// --- 1. 아이콘 임포트 ---
import reactIcon from "../assets/react-icon.svg";
import vueIcon from "../assets/vue-icon.svg";
import angularIcon from "../assets/angular-icon.svg";
import jsIcon from "../assets/vanilla-icon.svg";
import svelteIcon from "../assets/svelte-icon.svg";

// --- 2. 프레임워크 데이터 ---
const frameworks = [
  { name: "React", icon: reactIcon },
  { name: "Vue.js", icon: vueIcon },
  { name: "Angular", icon: angularIcon },
  { name: "Vanilla JS", icon: jsIcon },
  { name: "Svelte", icon: svelteIcon },
];

// --- 3. Props 정의 ---
interface SelectFrameworkPageProps {
  stepIndex?: number;
  totalSteps?: number;
}

// --- 4. 메인 페이지 컴포넌트 ---

const SelectFrameworkPage: React.FC<SelectFrameworkPageProps> = ({
  stepIndex = 1, // 2번째 단계
  totalSteps = 4,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { updateProjectSettings } = useProject();
  const [selectedFramework, setSelectedFramework] = useState<string | null>(
    null
  );

  const handleNextClick = () => {
    if (selectedFramework) {
      updateProjectSettings({
        framework: selectedFramework,
      });
      navigate("/select-region");
    }
  };

  const handleSelect = (name: string) => {
    setSelectedFramework(name);
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
          <Box mb={3}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", mb: 0.5 }}
            >
              2. Select Framework
            </Typography>
            <Typography color="text.secondary">
              Select the framework of your project, between React, Vue.js,
              Angular, Vanilla JS, Svelte
            </Typography>
          </Box>

          <Grid container spacing={3} role="radiogroup">
            {frameworks.map((framework) => (
              <Grid
                key={framework.name}
                size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}
              >
                <FrameworkCard
                  name={framework.name}
                  icon={framework.icon}
                  selected={selectedFramework === framework.name}
                  onClick={() => handleSelect(framework.name)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 푸터 섹션 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Button
            variant="text"
            onClick={() => navigate("/select-repo")}
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
            disabled={!selectedFramework}
            aria-label="Go to next step"
            sx={{
              width: "150px",
              height: "40px",
            }}
          >
            Next &rarr;
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SelectFrameworkPage;
