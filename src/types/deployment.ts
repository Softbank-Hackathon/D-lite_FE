/**
 * @file src/types/deployment.ts
 * @description 배포 요청과 관련된 타입을 정의합니다.
 */

export interface DeploymentFormData {
  githubRepositoryUrl: string;
  projectType: 'frontend' | 'backend';
  frameworkType: string;
  region: string;
  projectName: string;
  roleArn: string;
  externalId: string;
}
