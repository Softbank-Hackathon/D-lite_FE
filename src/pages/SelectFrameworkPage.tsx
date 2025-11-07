import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  List,
  ListItemButton,
  Select,
  MenuItem,
  FormControl,
  useTheme,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StepIndicator from "../components/StepIndicator"; // StepIndicator 컴포넌트 재사용
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
const REGION_OPTIONS = [
  "ap-northeast-2 (Seoul)",
  "ap-northeast-1 (Tokyo)",
  "us-east-1 (N. Virginia)",
  "us-west-2 (Oregon)",
  "eu-central-1 (Frankfurt)",
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

// 지역 선택기
const RegionSelector: React.FC<{
  options: string[];
  selectedValue: string | null;
  onSelect: (event: SelectChangeEvent<string>) => void;
}> = ({ options, selectedValue, onSelect }) => {
  return (
    <FormControl fullWidth>
      <Select
        value={selectedValue || ""}
        onChange={onSelect}
        displayEmpty
        aria-label="Select a region"
        sx={{ height: "48px", borderRadius: "12px" }}
      >
        <MenuItem disabled value="">
          <em>Select a region…</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

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
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleNextClick = () => {
    if (selectedFramework && selectedRegion) {
      updateProjectSettings({
        framework: selectedFramework,
        region: selectedRegion,
      });
      navigate("/connect");
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
          <Grid container spacing={{ xs: 4, md: 8 }}>
            {/* 좌측 컬럼 */}
            <Grid size={{ xs: 12, md: 6 }}>
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
            </Grid>

            {/* 우측 컬럼 */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: "bold", mb: 0.5 }}
                >
                  3. Select Region
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Select the region where your AWS server will run.
                </Typography>
                <RegionSelector
                  options={REGION_OPTIONS}
                  selectedValue={selectedRegion}
                  onSelect={(e) => setSelectedRegion(e.target.value)}
                />
              </Box>
            </Grid>
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
            disabled={!selectedFramework || !selectedRegion}
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

export default SelectFrameworkPage;
