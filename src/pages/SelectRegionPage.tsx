import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  useTheme,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import StepIndicator from "../components/StepIndicator";
import { useProject } from "../contexts/ProjectContext";
import { commonPaperStyles } from "../styles/commonStyles";

// --- 1. Region 옵션 정의 ---
const REGION_OPTIONS = [
  "ap-northeast-2 (Seoul)",
  "ap-northeast-1 (Tokyo)",
  "us-east-1 (N. Virginia)",
  "us-west-2 (Oregon)",
  "eu-central-1 (Frankfurt)",
];

// --- 2. Props 정의 ---
interface SelectRegionPageProps {
  stepIndex?: number;
  totalSteps?: number;
}

// --- 3. 메인 페이지 컴포넌트 ---
const SelectRegionPage: React.FC<SelectRegionPageProps> = ({
  stepIndex = 2,
  totalSteps = 4,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { updateProjectSettings } = useProject();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleRegionChange = (event: SelectChangeEvent<string>) => {
    setSelectedRegion(event.target.value);
  };

  const handleNextClick = () => {
    if (selectedRegion) {
      updateProjectSettings({ region: selectedRegion });
      navigate("/confirm-project");
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
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", mb: 0.5 }}
            >
              3. Select Region
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Select the region where your AWS server will run.
            </Typography>
            <FormControl fullWidth>
              <Select
                value={selectedRegion || ""}
                onChange={handleRegionChange}
                displayEmpty
                aria-label="Select a region"
                sx={{ height: "48px", borderRadius: "12px" }}
              >
                <MenuItem disabled value="">
                  <em>Select a region…</em>
                </MenuItem>
                {REGION_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            onClick={() => navigate("/select-framework")}
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
            disabled={!selectedRegion}
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

export default SelectRegionPage;
