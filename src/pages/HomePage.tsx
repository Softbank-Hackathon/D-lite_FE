/**
 * @file HomePage.tsx
 * @description 최초 랜딩 및 서비스를 설명하기 위한 페이지입니다.
 * 시작 버튼을 통해 배포를 시작할 수 있습니다.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { CloudUpload, CheckCircle } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useAuth } from "../contexts/AuthContext";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const { isAuthenticated, loading, login } = useAuth();

  const handleStart = () => {
    if (!loading) {
      if (isAuthenticated) {
        navigate("/aws-assume-role");
      } else {
        login();
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.custom.header }}>
      {/* Section 1: Hero */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 2, // Add some horizontal padding
        }}
      >
        <Box sx={{ mb: "10vh" }}>
          {" "}
          {/* Add margin to push content up */}
          <Typography variant="h2" component="h1" gutterBottom mb={4}>
            {" "}
            {/* Added mb={4} */}
            No DevOps, Just Click.
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: "600px" }}
            mb={8}
          >
            All you need to do is log in with GitHub <br />
            and select a project — then deploy.
          </Typography>
          <Box sx={{ mt: 8 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleStart}
              disabled={loading} // 로딩 중일 때는 버튼 비활성화
            >
              {loading
                ? "Loading..."
                : isAuthenticated
                ? "Continue to Setup"
                : "Get Started"}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Section 2: Features/Description */}
      <Container id="features-section" maxWidth="lg" sx={{ py: 16 }}>
        {" "}
        {/* Increased py for more bottom space */}
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          How It Works
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 10 }}
        >
          Deploy your project in three simple steps.
        </Typography>
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          sx={{ gap: 4 }} // Using gap for spacing between items
        >
          <Box
            sx={{
              flexGrow: 1,
              flexBasis: isMdUp ? "30%" : "100%",
              maxWidth: isMdUp ? "30%" : "100%",
            }}
          >
            <Paper
              data-aos="fade-up"
              sx={{
                p: 4,
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <GitHubIcon sx={{ fontSize: 60, color: "primary.main" }} />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" component="h3">
                  1. Sign in with GitHub
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography>
                  Connect your GitHub account securely. We’ll automatically load
                  your repositories and branches — no manual setup required.
                </Typography>
              </Box>
            </Paper>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              flexBasis: isMdUp ? "30%" : "100%",
              maxWidth: isMdUp ? "30%" : "100%",
            }}
          >
            <Paper
              data-aos="fade-up"
              data-aos-delay="200"
              sx={{
                p: 4,
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CloudUpload sx={{ fontSize: 60, color: "primary.main" }} />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" component="h3">
                  2. One-Click AWS Setup
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography>
                  Create your AWS S3 bucket and IAM Role with a single
                  CloudFormation stack. A built-in Lambda + Webhook
                  automatically sends the Role ARN to our backend for secure
                  integration.
                </Typography>
              </Box>
            </Paper>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              flexBasis: isMdUp ? "30%" : "100%",
              maxWidth: isMdUp ? "30%" : "100%",
            }}
          >
            <Paper
              data-aos="fade-up"
              data-aos-delay="400"
              sx={{
                p: 4,
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CheckCircle sx={{ fontSize: 60, color: "primary.main" }} />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" component="h3">
                  3. Select Repository, <br /> Branch & Framework
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography>
                  Select your GitHub repository and branch. We auto-detect your
                  framework (React, Next.js, Vite, etc.), but you can override
                  it anytime.
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
