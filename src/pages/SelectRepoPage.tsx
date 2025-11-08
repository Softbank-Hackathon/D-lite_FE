import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, useTheme, CircularProgress, Alert } from "@mui/material";

// 컴포넌트 임포트
import RepoSearchInput from "../components/RepoSearchInput";
import RepoList, { type Repo } from "../components/RepoList";
import BranchList from "../components/BranchList";
import StepIndicator from "../components/StepIndicator";
import { useProject } from "../contexts/ProjectContext";
import { commonPaperStyles } from "../styles/commonStyles";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { useBranchLoader } from "../hooks/useBranchLoader";
import { useRepositories } from "../hooks/api/useGithubApi";

// --- 1. Props 정의 (이제 내부에서 navigate를 사용하므로 props는 step 관련만 남김) ---
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

  // useRepositories 훅으로 레포지토리 목록 조회
  const { data: repositories, isLoading, error } = useRepositories();

  // API 응답을 Repo 형식으로 변환
  const repos: Repo[] = useMemo(() => {
    if (!repositories) return [];
    
    return repositories.map((repo) => ({
      id: repo.id,
      fullName: repo.full_name,
      isPrivate: repo.private,
    }));
  }, [repositories]);

  // 커스텀 훅 사용: 레포지토리 검색 필터링
  const filteredRepos = useSearchFilter(repos, searchQuery, "fullName");

  // 선택된 레포지토리에서 owner/repo 추출
  const repoIdentifier = useMemo(() => {
    if (!selectedRepo) return null;
    
    const parts = selectedRepo.fullName.split("/");
    if (parts.length !== 2) return null;
    
    return {
      owner: parts[0],
      repo: parts[1],
    };
  }, [selectedRepo]);

  // 커스텀 훅 사용: 브랜치 로딩
  const {
    branches,
    loading: loadingBranches,
    selectedBranch,
    setSelectedBranch,
  } = useBranchLoader(repoIdentifier);

  const handleRepoSelect = (repo: Repo) => {
    setSelectedRepo(repo);
  };

  const handleNextClick = () => {
    if (selectedRepo && selectedBranch) {
      const ownerName = selectedRepo.fullName.split("/")[0] || "unknown";
      const repoName = selectedRepo.fullName.split("/")[1] || selectedRepo.fullName;
      
      // Repository 타입을 ProjectContext의 GithubRepository에 맞게 변환
      const repository = {
        id: selectedRepo.id,
        name: repoName,
        full_name: selectedRepo.fullName,
        private: selectedRepo.isPrivate,
        description: null,
        html_url: `https://github.com/${selectedRepo.fullName}`,
        clone_url: `https://github.com/${selectedRepo.fullName}.git`,
        ssh_url: `git@github.com:${selectedRepo.fullName}.git`,
        default_branch: selectedBranch.name,
        owner: {
          login: ownerName,
          avatar_url: "",
          html_url: `https://github.com/${ownerName}`,
        },
        pushed_at: new Date().toISOString(),
        language: null,
        stargazers_count: 0,
        watchers_count: 0,
        forks_count: 0,
        createdAt: null,
        updatedAt: null,
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

          {/* 로딩 상태 */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* 에러 상태 */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              레포지토리 목록을 불러오는데 실패했습니다.
            </Alert>
          )}

          {/* 레포지토리 선택 섹션 */}
          {!isLoading && !error && !selectedRepo ? (
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
          ) : selectedRepo ? (
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
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
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
          ) : null}
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
