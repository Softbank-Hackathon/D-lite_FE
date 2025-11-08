/**
 * @file useDeploymentPolling.ts
 * @description 배포 상태를 1초 간격으로 폴링하는 커스텀 훅
 * IN_PROGRESS, SUCCESS, FAILED 상태를 처리하며, SUCCESS 시 자동 리다이렉트 지원
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from '../api/axiosInstance';

import type { DeploymentStatusResponse } from '../types/deployment';

interface UseDeploymentPollingOptions {
  deploymentId: string | null;
  errorParam: string | null;
  onSuccess?: (deploymentUrl: string | null) => void;
  autoRedirect?: boolean;
  redirectDelay?: number;
}

interface UseDeploymentPollingReturn {
  status: 'IN_PROGRESS' | 'SUCCESS' | 'FAILED';
  deploymentUrl: string | null;
  errorMessage: string | null;
  polling: boolean;
}

/**
 * 배포 상태를 폴링하는 커스텀 훅
 * @param options - 폴링 옵션
 * @param options.deploymentId - 배포 ID
 * @param options.errorParam - URL 에러 파라미터
 * @param options.onSuccess - SUCCESS 시 실행할 콜백
 * @param options.autoRedirect - SUCCESS 시 자동으로 대시보드로 이동할지 여부 (기본: true)
 * @param options.redirectDelay - 리다이렉트 지연 시간(ms) (기본: 2000)
 * @returns 배포 상태 정보
 */
export const useDeploymentPolling = ({
  deploymentId,
  errorParam,
  onSuccess,
  autoRedirect = true,
  redirectDelay = 2000,
}: UseDeploymentPollingOptions): UseDeploymentPollingReturn => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'IN_PROGRESS' | 'SUCCESS' | 'FAILED'>('IN_PROGRESS');
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    // URL에 에러 파라미터가 있으면 즉시 실패 상태로 표시
    if (errorParam) {
      setStatus('FAILED');
      setErrorMessage('Failed to start deployment. Please try again.');
      setPolling(false);
      return;
    }

    if (!deploymentId) {
      setStatus('FAILED');
      setErrorMessage('No deployment ID provided');
      setPolling(false);
      return;
    }

    // 1초마다 배포 상태 확인
    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get<DeploymentStatusResponse>(
          `/api/v1/deployments/${deploymentId}/status`
        );

        const { status: newStatus, deploymentUrl: url, errorMessage: errMsg } = response.data;

        setStatus(newStatus);

        if (newStatus === 'SUCCESS') {
          setDeploymentUrl(url || null);
          setPolling(false);
          clearInterval(pollInterval);

          // onSuccess 콜백 실행
          if (onSuccess) {
            onSuccess(url || null);
          }

          // 자동 리다이렉트 설정이 활성화되어 있으면 대시보드로 이동
          if (autoRedirect) {
            setTimeout(() => {
              navigate('/dashboard');
            }, redirectDelay);
          }
        } else if (newStatus === 'FAILED') {
          setErrorMessage(errMsg || 'Deployment failed');
          setPolling(false);
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Failed to fetch deployment status:', err);
        setStatus('FAILED');
        setErrorMessage('Failed to fetch deployment status');
        setPolling(false);
        clearInterval(pollInterval);
      }
    }, 1000); // 1초마다 폴링

    return () => {
      clearInterval(pollInterval);
    };
  }, [deploymentId, errorParam, navigate, onSuccess, autoRedirect, redirectDelay]);

  return {
    status,
    deploymentUrl,
    errorMessage,
    polling,
  };
};
