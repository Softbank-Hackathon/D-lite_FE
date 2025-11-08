import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, useTheme, Grid } from "@mui/material";
import FrameworkCard from "../components/FrameworkCard";
import StepIndicator from "../components/StepIndicator";
import { useProject } from "../contexts/ProjectContext";
import { commonPaperStyles } from "../styles/commonStyles";

// Assume these icons exist in the assets folder
import reactIcon from "../assets/react-icon.png";
import vueIcon from "../assets/vue-icon.png";
import angularIcon from "../assets/angular-icon.png";
import jsIcon from "../assets/vanilla-icon.png";
import svelteIcon from "../assets/svelte-icon.png";

const frameworks = [
  { name: "React", icon: reactIcon },
  { name: "Vue.js", icon: vueIcon },
  { name: "Angular", icon: angularIcon },
  { name: "Vanilla JS", icon: jsIcon },
  { name: "Svelte", icon: svelteIcon },
];

const SelectFrameworkPageNew: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { updateProjectSettings } = useProject();
  const [selectedFramework, setSelectedFramework] = useState<string | null>(
    null
  );
  const gridRef = useRef<HTMLDivElement>(null);

  const stepIndex = 1;
  const totalSteps = 4;

  const handleSelect = (name: string) => {
    setSelectedFramework(name);
  };

  const handleNextClick = () => {
    if (selectedFramework) {
      updateProjectSettings({
        framework: selectedFramework,
      });
      navigate("/connect");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gridRef.current) return;

      const focusableElements = Array.from(
        gridRef.current.querySelectorAll('[role="radio"]')
      ) as HTMLElement[];

      if (focusableElements.length === 0) return;

      const currentIndex = focusableElements.findIndex(
        (el) => el.getAttribute("aria-checked") === "true"
      );

      let nextIndex = -1;

      switch (event.key) {
        case "ArrowRight":
          nextIndex = (currentIndex + 1) % focusableElements.length;
          break;
        case "ArrowLeft":
          nextIndex =
            (currentIndex - 1 + focusableElements.length) %
            focusableElements.length;
          break;
        case "ArrowDown":
          // This logic might need to be adjusted based on the actual grid layout
          nextIndex = Math.min(currentIndex + 3, focusableElements.length - 1);
          break;
        case "ArrowUp":
          // This logic might need to be adjusted based on the actual grid layout
          nextIndex = Math.max(currentIndex - 3, 0);
          break;
        default:
          return;
      }

      if (nextIndex !== -1) {
        event.preventDefault();
        const frameworkName = frameworks[nextIndex].name;
        setSelectedFramework(frameworkName);
        focusableElements[nextIndex].focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedFramework]);

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
              2. Select Framework
            </Typography>
            <Typography color="text.secondary">
              Select the framework of your project, between React, Vue.js,
              Angular, Vanilla JS, Svelte
            </Typography>
          </Box>
          {/* 컨텐츠 섹션 */}
          <Grid container spacing={3} ref={gridRef} role="radiogroup">
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
              width: "150px", // 버튼의 고정 너비
              height: "40px", // 버튼의 고정 높이
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
              width: "150px", // 버튼의 고정 너비
              height: "40px", // 버튼의 고정 높이
            }}
          >
            Next &rarr;
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SelectFrameworkPageNew;
