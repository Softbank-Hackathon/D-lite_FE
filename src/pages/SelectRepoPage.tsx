import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, useTheme } from "@mui/material";

// 컴포넌트 임포트
import RepoSearchInput from "../components/RepoSearchInput";
import RepoList, { type Repo } from "../components/RepoList";
import BranchList from "../components/BranchList";
import StepIndicator from "../components/StepIndicator";
import { useProject } from "../contexts/ProjectContext";
import { commonPaperStyles } from "../styles/commonStyles";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { useBranchLoader } from "../hooks/useBranchLoader";

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
  totalSteps = 5,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setProjectRepo, updateProjectSettings } = useProject();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);

  // 커스텀 훅 사용: 레포지토리 검색 필터링
  const filteredRepos = useSearchFilter(dummyRepos, searchQuery, "fullName");

  // 커스텀 훅 사용: 브랜치 로딩
  const { branches, loading: loadingBranches, selectedBranch, setSelectedBranch } = useBranchLoader(
    selectedRepo?.id || null
  );

  const handleRepoSelect = (repo: Repo) => {
    setSelectedRepo(repo);
  };

  const handleNextClick = () => {
    if (selectedRepo && selectedBranch) {
      // Repository 타입을 ProjectContext의 Repository에 맞게 변환
      const repository = {
        id: selectedRepo.id,
        name: selectedRepo.fullName.split("/")[1] || selectedRepo.fullName,
        full_name: selectedRepo.fullName,
        private: selectedRepo.isPrivate,
        html_url: `https://github.com/${selectedRepo.fullName}`,
      };

      setProjectRepo(repository);
      updateProjectSettings({ branch: selectedBranch.name });
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
              1. Select Repository & Branch
            </Typography>
            <Typography color="text.secondary">
              Select a repository and branch from your GitHub
            </Typography>
          </Box>

          {/* 레포지토리 선택 섹션 */}
          {!selectedRepo ? (
            <>
              <RepoSearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <RepoList
                repos={filteredRepos}
                selectedId={null}
                onSelect={handleRepoSelect}
              />
            </>
          ) : (
            <>
              {/* 선택된 레포지토리 표시 (간략하게) */}
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: "12px",
                  border: `2px solid ${theme.palette.primary.main}`,
                  backgroundColor: theme.palette.action.hover,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Selected Repository
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {selectedRepo.fullName}
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  onClick={() => {
                    setSelectedRepo(null);
                  }}
                  size="small"
                >
                  Change
                </Button>
              </Box>

              {/* 브랜치 선택 섹션 */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Select Branch
                </Typography>
                <BranchList
                  branches={branches}
                  selectedBranch={selectedBranch?.name || null}
                  onSelect={setSelectedBranch}
                  loading={loadingBranches}
                />
              </Box>
            </>
          )}
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
            disabled={!selectedRepo || !selectedBranch}
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

export default SelectRepoPage;
