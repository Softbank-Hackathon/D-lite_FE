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
import { Storage, CloudUpload, CheckCircle } from "@mui/icons-material";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const handleStart = () => {
    navigate("/new");
  };

  return (
    <Box>
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
        <Box sx={{ mb: "20vh" }}>
          {" "}
          {/* Add margin to push content up */}
          <Typography variant="h2" component="h1" gutterBottom mb={4}>
            {" "}
            {/* Added mb={4} */}
            Welcome to D-Light!
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: "600px" }}
            mb={8}
          >
            {" "}
            {/* Added mb={4} */}
            Your ultimate solution for seamless and automated deployments
            directly from a Git repository.
          </Typography>
          <Box sx={{ mt: 8 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleStart}
            >
              Get Started
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
              sx={{ p: 4, textAlign: "center", height: "100%" }}
            >
              <Storage sx={{ fontSize: 60, color: "primary.main" }} />
              <Typography variant="h5" component="h3" sx={{ mt: 2, mb: 1 }}>
                1. Provide Repository
              </Typography>
              <Typography>
                Just give us the URL of your Git repository. No complex setup,
                no authentication needed.
              </Typography>
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
              sx={{ p: 4, textAlign: "center", height: "100%" }}
            >
              <CloudUpload sx={{ fontSize: 60, color: "primary.main" }} />
              <Typography variant="h5" component="h3" sx={{ mt: 2, mb: 1 }}>
                2. Connect AWS
              </Typography>
              <Typography>
                Create a secure role in your AWS account and provide us with the
                Role ARN. Your credentials are never shared.
              </Typography>
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
              sx={{ p: 4, textAlign: "center", height: "100%" }}
            >
              <CheckCircle sx={{ fontSize: 60, color: "primary.main" }} />
              <Typography variant="h5" component="h3" sx={{ mt: 2, mb: 1 }}>
                3. Deploy!
              </Typography>
              <Typography>
                We handle the rest. We clone your repository, build your
                project, and deploy it seamlessly.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
