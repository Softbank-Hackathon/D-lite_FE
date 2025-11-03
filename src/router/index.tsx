import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AWSConnectionPage from "../pages/AWSConnectionPage";
import HomePage from "../pages/HomePage";
import DeploymentStatusPage from "../pages/DeploymentStatusPage";
import GithubCallbackPage from "../pages/GithubCallbackPage";
import DashboardPage from "../pages/DashboardPage";
import ProjectSetupPage from "../pages/ProjectSetupPage"; // ProjectSetupPage import 추가
import { useAuth } from "../contexts/AuthContext";

// 인증이 필요한 라우트를 보호하는 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p>Loading authentication...</p>; // 또는 로딩 스피너
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "auth/github/callback",
        element: <GithubCallbackPage />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "project-setup", // 새로운 프로젝트 설정 라우트 추가
        element: (
          <ProtectedRoute>
            <ProjectSetupPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "connect",
        element: (
          <ProtectedRoute>
            <AWSConnectionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "status",
        element: (
          <ProtectedRoute>
            <DeploymentStatusPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
