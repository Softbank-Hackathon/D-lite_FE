/**
 * @file ApiTestPage.tsx
 * @description API 훅 테스트 페이지
 * MSW 및 실제 API 연동 테스트용
 */
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

import { useUserInfo } from '../hooks/api/useAuthApi';
import { useRepositories, useBranches } from '../hooks/api/useGithubApi';
import { useProjects, useCreateProject } from '../hooks/api/useProjectApi';
import {
  useCreateDeployment,
  useDeploymentStatus,
} from '../hooks/api/useDeploymentApi';

function ApiTestPage() {
  // ============================================
  // State
  // ============================================
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [deploymentId, setDeploymentId] = useState('');

  // ============================================
  // API 훅 (조건부 실행)
  // ============================================
  const [enabledApis, setEnabledApis] = useState({
    userInfo: false,
    repositories: false,
    branches: false,
    projects: false,
    deploymentStatus: false,
  });

  const userInfo = useUserInfo(enabledApis.userInfo);
  const repositories = useRepositories(enabledApis.repositories);
  const branches = useBranches(owner, repo, enabledApis.branches);
  const projects = useProjects(enabledApis.projects);
  const deploymentStatus = useDeploymentStatus(
    deploymentId,
    enabledApis.deploymentStatus
  );

  // Mutation 훅
  const createProject = useCreateProject({
    onSuccess: (data) => {
      console.log('프로젝트 생성 성공:', data);
      alert('프로젝트 생성 성공!');
    },
    onError: (error) => {
      console.error('프로젝트 생성 실패:', error);
      alert('프로젝트 생성 실패!');
    },
  });

  const createDeployment = useCreateDeployment({
    onSuccess: (data) => {
      console.log('배포 시작 성공:', data);
      alert('배포 시작 성공!');
      if (data.result) {
        setDeploymentId(data.result);
      }
    },
    onError: (error) => {
      console.error('배포 시작 실패:', error);
      alert('배포 시작 실패!');
    },
  });

  // ============================================
  // 핸들러
  // ============================================
  const handleTestApi = (apiName: keyof typeof enabledApis) => {
    setEnabledApis((prev) => ({
      ...prev,
      [apiName]: true,
    }));
  };

  const handleRefreshApi = (apiName: string) => {
    switch (apiName) {
      case 'userInfo':
        userInfo.refetch();
        break;
      case 'repositories':
        repositories.refetch();
        break;
      case 'branches':
        branches.refetch();
        break;
      case 'projects':
        projects.refetch();
        break;
      case 'deploymentStatus':
        deploymentStatus.refetch();
        break;
    }
  };

  const handleCreateTestProject = () => {
    createProject.mutate({
      projectName: 'test-project-' + Date.now(),
      serviceType: 'FE',
      githubRepoUrl: 'https://github.com/test/repo',
      frameworkType: 'React',
      defaultBranch: 'main',
    });
  };

  const handleCreateTestDeployment = () => {
    createDeployment.mutate({
      githubRepositoryUrl: 'https://github.com/test/repo',
      projectType: 'frontend',
      frameworkType: 'React',
      region: 'ap-northeast-2',
      projectName: 'test-deployment-' + Date.now(),
      roleArn: 'arn:aws:iam::123456789012:role/test-role',
      externalId: 'test-external-id',
    });
  };

  // ============================================
  // 렌더링 유틸
  // ============================================
  const renderApiResult = (
    title: string,
    apiName: keyof typeof enabledApis,
    result: {
      data: unknown;
      error: unknown;
      isLoading: boolean;
      isError: boolean;
      isSuccess: boolean;
      refetch?: () => Promise<void>;
    }
  ) => {
    const { data, error, isLoading, isError, isSuccess, refetch } = result;

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">{title}</Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleTestApi(apiName)}
                disabled={enabledApis[apiName] && isLoading}
              >
                {enabledApis[apiName] ? '재요청' : '테스트'}
              </Button>
              {refetch && enabledApis[apiName] && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleRefreshApi(apiName)}
                  disabled={isLoading}
                  startIcon={<RefreshIcon />}
                >
                  새로고침
                </Button>
              )}
            </Stack>
          </Stack>

          {/* 상태 표시 */}
          <Stack direction="row" spacing={1} mb={2}>
            {isLoading && <Chip icon={<CircularProgress size={16} />} label="로딩 중" />}
            {isSuccess && <Chip icon={<CheckCircleIcon />} label="성공" color="success" />}
            {isError && <Chip icon={<ErrorIcon />} label="에러" color="error" />}
          </Stack>

          {/* 결과 표시 */}
          {isLoading && <CircularProgress />}
          {isSuccess && data !== null && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                maxHeight: 400,
                overflow: 'auto',
              }}
            >
              <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </Paper>
          )}
          {isError && error !== null && (
            <Alert severity="error">
              <pre style={{ margin: 0, fontSize: '12px' }}>
                {JSON.stringify(error, null, 2)}
              </pre>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============================================
  // 렌더
  // ============================================
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        API 테스트 페이지
      </Typography>
      <Alert severity="info" sx={{ mb: 4 }}>
        각 API 엔드포인트를 테스트하고 응답을 확인할 수 있습니다.
        <br />
        현재 MSW 모드: <strong>{import.meta.env.VITE_USE_MSW === 'true' ? '활성화' : '비활성화'}</strong>
      </Alert>

      <Divider sx={{ my: 4 }} />

      {/* 1. 인증 API */}
      <Typography variant="h5" gutterBottom>
        1. 인증 API
      </Typography>
      {renderApiResult('현재 사용자 정보 (GET /api/users/me)', 'userInfo', userInfo)}

      <Divider sx={{ my: 4 }} />

      {/* 2. GitHub API */}
      <Typography variant="h5" gutterBottom>
        2. GitHub API
      </Typography>
      {renderApiResult(
        '레포지토리 목록 (GET /api/v1/github/repos)',
        'repositories',
        repositories
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            브랜치 목록 (GET /api/v1/github/repos/:owner/:repo/branches)
          </Typography>
          <Stack direction="row" spacing={2} mb={2}>
            <TextField
              label="Owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              size="small"
              placeholder="eodudrepublic"
            />
            <TextField
              label="Repo"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              size="small"
              placeholder="my-repo"
            />
            <Button
              variant="outlined"
              onClick={() => handleTestApi('branches')}
              disabled={!owner || !repo || (enabledApis.branches && branches.isLoading)}
            >
              테스트
            </Button>
            {enabledApis.branches && (
              <Button
                variant="outlined"
                onClick={() => handleRefreshApi('branches')}
                disabled={branches.isLoading}
                startIcon={<RefreshIcon />}
              >
                새로고침
              </Button>
            )}
          </Stack>

          {/* 상태 표시 */}
          <Stack direction="row" spacing={1} mb={2}>
            {branches.isLoading && (
              <Chip icon={<CircularProgress size={16} />} label="로딩 중" />
            )}
            {branches.isSuccess && (
              <Chip icon={<CheckCircleIcon />} label="성공" color="success" />
            )}
            {branches.isError && <Chip icon={<ErrorIcon />} label="에러" color="error" />}
          </Stack>

          {/* 결과 표시 */}
          {branches.isLoading && <CircularProgress />}
          {branches.isSuccess && branches.data !== null && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                maxHeight: 400,
                overflow: 'auto',
              }}
            >
              <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(branches.data, null, 2)}
              </pre>
            </Paper>
          )}
          {branches.isError && branches.error !== null && (
            <Alert severity="error">
              <pre style={{ margin: 0, fontSize: '12px' }}>
                {JSON.stringify(branches.error, null, 2)}
              </pre>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* 3. 프로젝트 API */}
      <Typography variant="h5" gutterBottom>
        3. 프로젝트 API
      </Typography>
      {renderApiResult('프로젝트 목록 (GET /api/v1/projects)', 'projects', projects)}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            프로젝트 생성 (POST /api/v1/projects)
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateTestProject}
            disabled={createProject.isLoading}
          >
            테스트 프로젝트 생성
          </Button>

          {createProject.isLoading && (
            <Box mt={2}>
              <CircularProgress />
            </Box>
          )}
          {createProject.isSuccess && createProject.data !== null && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                maxHeight: 400,
                overflow: 'auto',
                mt: 2,
              }}
            >
              <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(createProject.data, null, 2)}
              </pre>
            </Paper>
          )}
          {createProject.isError && createProject.error !== null && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <pre style={{ margin: 0, fontSize: '12px' }}>
                {JSON.stringify(createProject.error, null, 2)}
              </pre>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* 4. 배포 API */}
      <Typography variant="h5" gutterBottom>
        4. 배포 API
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            배포 시작 (POST /api/v1/deployments/deployment-project)
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateTestDeployment}
            disabled={createDeployment.isLoading}
          >
            테스트 배포 시작
          </Button>

          {createDeployment.isLoading && (
            <Box mt={2}>
              <CircularProgress />
            </Box>
          )}
          {createDeployment.isSuccess && createDeployment.data !== null && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                maxHeight: 400,
                overflow: 'auto',
                mt: 2,
              }}
            >
              <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(createDeployment.data, null, 2)}
              </pre>
            </Paper>
          )}
          {createDeployment.isError && createDeployment.error !== null && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <pre style={{ margin: 0, fontSize: '12px' }}>
                {JSON.stringify(createDeployment.error, null, 2)}
              </pre>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            배포 상태 조회 (GET /api/v1/deployments/:deploymentId/status)
          </Typography>
          <Stack direction="row" spacing={2} mb={2}>
            <TextField
              label="Deployment ID"
              value={deploymentId}
              onChange={(e) => setDeploymentId(e.target.value)}
              size="small"
              placeholder="deployment-123"
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={() => handleTestApi('deploymentStatus')}
              disabled={
                !deploymentId ||
                (enabledApis.deploymentStatus && deploymentStatus.isLoading)
              }
            >
              테스트
            </Button>
            {enabledApis.deploymentStatus && (
              <Button
                variant="outlined"
                onClick={() => handleRefreshApi('deploymentStatus')}
                disabled={deploymentStatus.isLoading}
                startIcon={<RefreshIcon />}
              >
                새로고침
              </Button>
            )}
          </Stack>

          {/* 상태 표시 */}
          <Stack direction="row" spacing={1} mb={2}>
            {deploymentStatus.isLoading && (
              <Chip icon={<CircularProgress size={16} />} label="로딩 중" />
            )}
            {deploymentStatus.isSuccess && (
              <Chip icon={<CheckCircleIcon />} label="성공" color="success" />
            )}
            {deploymentStatus.isError && (
              <Chip icon={<ErrorIcon />} label="에러" color="error" />
            )}
          </Stack>

          {/* 결과 표시 */}
          {deploymentStatus.isLoading && <CircularProgress />}
          {deploymentStatus.isSuccess && deploymentStatus.data !== null && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                maxHeight: 400,
                overflow: 'auto',
              }}
            >
              <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(deploymentStatus.data, null, 2)}
              </pre>
            </Paper>
          )}
          {deploymentStatus.isError && deploymentStatus.error !== null && (
            <Alert severity="error">
              <pre style={{ margin: 0, fontSize: '12px' }}>
                {JSON.stringify(deploymentStatus.error, null, 2)}
              </pre>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default ApiTestPage;
