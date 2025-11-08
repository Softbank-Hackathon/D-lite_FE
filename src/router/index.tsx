import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import App from "../App";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import SelectRepoPage from "../pages/SelectRepoPage";
import SelectFrameworkPage from "../pages/SelectFrameworkPage";
import SelectRegionPage from "../pages/SelectRegionPage";
import SelectFrameworkPageNew from "../pages/SelectFrameworkPage-new";
import AWSConnectionPage from "../pages/AWSConnectionPage";
import ConfirmProjectPage from "../pages/ConfirmProjectPage";
import DeploymentPage from "../pages/DeploymentPage";
import DeploymentStatusPage from "../pages/DeploymentStatusPage";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
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
            path: "select-repo",
            element: (
              <ProtectedRoute>
                <SelectRepoPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "select-framework",
            element: (
              <ProtectedRoute>
                <SelectFrameworkPage />
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
            path: "confirm-project",
            element: (
              <ProtectedRoute>
                <ConfirmProjectPage />
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
          {
            path: "deploy",
            element: (
              <ProtectedRoute>
                <DeploymentPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);
