import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import App from "../App";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import SelectRepoPage from "../pages/SelectRepoPage";
import SelectFrameworkPage from "../pages/SelectFrameworkPage";
import SelectRegionPage from "../pages/SelectRegionPage";
import AWSConnectionPage from "../pages/AWSConnectionPage";
import ConfirmProjectPage from "../pages/ConfirmProjectPage";
import DeploymentPage from "../pages/DeploymentPage";
import DeploymentStatusPage from "../pages/DeploymentStatusPage";
import ApiTestPage from "../pages/ApiTestPage";
import AWSRoleAssumePage from "../pages/AWSRoleAssumePage";

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
            element: <DashboardPage />,
          },
          {
            path: "select-repo",
            element: <SelectRepoPage />,
          },
          {
            path: "select-framework",
            element: <SelectFrameworkPage />,
          },
          {
            path: "select-region",
            element: <SelectRegionPage />,
          },
          {
            path: "connect",
            element: <AWSConnectionPage />,
          },
          {
            path: "confirm-project",
            element: <ConfirmProjectPage />,
          },
          {
            path: "status",
            element: <DeploymentStatusPage />,
          },
          {
            path: "deploy",
            element: <DeploymentPage />,
          },
          {
            path: "test",
            element: <ApiTestPage />,
          },
          {
            path: "aws-assume-role",
            element: <AWSRoleAssumePage />,
          },
        ],
      },
    ],
  },
]);
