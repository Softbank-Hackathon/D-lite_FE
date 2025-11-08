import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  IconButton,
  Button,
  useTheme,
  Fade,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

interface UserMeResponse {
  login: string;
}

const AWSRoleAssumePage: React.FC = () => {
  const { loading: authLoading } = useAuth();
  const { data: user, isLoading: userLoading } =
    useQuery<UserMeResponse>("/api/users/me");
  const theme = useTheme();
  const navigate = useNavigate();

  const isLoading = authLoading || userLoading;

  const [showWelcome, setShowWelcome] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer1 = setTimeout(() => setShowWelcome(true), 0);
      const timer2 = setTimeout(() => setShowText(true), 2800);
      const timer3 = setTimeout(() => setShowButton(true), 4800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isLoading]);

  const handleAssumeRole = () => {
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        backgroundColor: theme.palette.custom.header,
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Fade in={showWelcome} timeout={1000}>
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: "bold", mb: 4 }}
            >
              Welcome, {user?.login || "Guest"}!
            </Typography>
          </Fade>
          <Fade in={showText} timeout={3000}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 8 }}>
              <Typography variant="body1" sx={{ fontSize: "0.9rem" }}>
                Please finish creating your stack through the button below
              </Typography>
              <Tooltip
                title={
                  <React.Fragment>
                    <Typography color="inherit">
                      1. Scroll down and check the box that says: “I acknowledge
                      that AWS CloudFormation might create IAM resources.”
                    </Typography>
                    <Typography color="inherit">
                      2. Click “Create Stack”
                    </Typography>
                  </React.Fragment>
                }
                placement="right"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      maxWidth: 330,
                      padding: "15px",
                    },
                  },
                }}
              >
                <IconButton size="small">
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Fade>
          <Fade in={showButton} timeout={2000}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleAssumeRole}
              disabled={isLoading}
            >
              Assume Role
            </Button>
          </Fade>
        </>
      )}
    </Box>
  );
};

export default AWSRoleAssumePage;
