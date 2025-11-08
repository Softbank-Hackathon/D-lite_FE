import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItemButton,
  useTheme,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StepIndicator from "../components/StepIndicator";
import { useProject } from "../contexts/ProjectContext";
import { commonPaperStyles } from "../styles/commonStyles";

// --- 1. 타입 정의 및 더미 데이터 ---
const FRAMEWORK_OPTIONS = [
  "React",
  "Vue.js",
  "Vanilla JS",
  "Angular",
  "Svelte",
];

// --- 2. Props 정의 ---
interface SelectFrameworkPageProps {
  stepIndex?: number;
  totalSteps?: number;
}

// --- 3. 하위 컴포넌트 구현 ---

// 프레임워크 선택기
const FrameworkSelector: React.FC<{
  options: string[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}> = ({ options, selectedValue, onSelect }) => {
  const theme = useTheme();
  return (
    <List
      role="radiogroup"
      sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option;
        return (
          <ListItemButton
            key={option}
            role="radio"
            aria-checked={isSelected}
            selected={isSelected}
            onClick={() => onSelect(option)}
            sx={{
              height: "48px",
              borderRadius: "12px",
              border: `1px solid ${theme.palette.custom.border}`,
              justifyContent: "space-between",
              "&.Mui-selected": {
                border: `2px solid ${theme.palette.primary.main}`,
                backgroundColor: "action.hover",
              },
            }}
          >
            <Typography>{option}</Typography>
            {isSelected && <CheckCircleRoundedIcon color="primary" />}
          </ListItemButton>
        );
      })}
    </List>
  );
};

// --- 4. 메인 페이지 컴포넌트 ---

const SelectFrameworkPage: React.FC<SelectFrameworkPageProps> = ({
  stepIndex = 1, // 2번째 단계
  totalSteps = 5,
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
          <Box>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: "bold", mb: 0.5 }}
            >
              2. Select Framework
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Select the framework of your project, between React, Vue.js,
              Angular, Vanilla JS, Svelte
            </Typography>
            <FrameworkSelector
              options={FRAMEWORK_OPTIONS}
              selectedValue={selectedFramework}
              onSelect={setSelectedFramework}
            />
          </Box>
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
