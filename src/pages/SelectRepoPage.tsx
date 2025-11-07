import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, useTheme } from "@mui/material";

// 컴포넌트 임포트
import RepoSearchInput from "../components/RepoSearchInput";
import RepoList, { type Repo } from "../components/RepoList";
import StepIndicator from "../components/StepIndicator";
import { useProject } from "../contexts/ProjectContext"; // useProject import 추가
import { commonPaperStyles } from "../styles/commonStyles";

// --- 1. 더미 데이터 ---
const dummyRepos: Repo[] = [
  { id: 1, fullName: "angkmfirefoxgal/repository-a", isPrivate: false },
  { id: 2, fullName: "angkmfirefoxgal/repository-b", isPrivate: true },
  { id: 3, fullName: "another-org/dlight-frontend", isPrivate: false },
  { id: 4, fullName: "angkmfirefoxgal/personal-portfolio", isPrivate: true },
];

// --- 2. Props 정의 (이제 내부에서 navigate를 사용하므로 props는 step 관련만 남김) ---
interface SelectRepoPageProps {
  stepIndex?: number;
  totalSteps?: number;
}

// --- 3. 메인 페이지 컴포넌트 ---
const SelectRepoPage: React.FC<SelectRepoPageProps> = ({
  stepIndex = 0,
  totalSteps = 4,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setProjectRepo } = useProject();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);

  const filteredRepos = useMemo(() => {
    if (!searchQuery) {
      return dummyRepos;
    }
    return dummyRepos.filter((repo) =>
      repo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleNextClick = () => {
    if (selectedRepo) {
      setProjectRepo(selectedRepo as any); // 타입 호환성을 위해 any 사용, 실제로는 Repo 타입 일치 필요
      navigate("/select-framework");
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
          {/* 제목 섹션 */}
          <Box mb={3}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", mb: 0.5 }}
            >
              1. Select Repository to Deploy
            </Typography>
            <Typography color="text.secondary">
              Select a repository from your Github
            </Typography>
          </Box>

          {/* 컨텐츠 섹션 */}
          <RepoSearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <RepoList
            repos={filteredRepos}
            selectedId={selectedRepo?.id || null}
            onSelect={setSelectedRepo}
          />
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
            onClick={() => navigate("/dashboard")}
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
            disabled={!selectedRepo}
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

export default SelectRepoPage;
