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
  TextField,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import {
  useRegistrationToken,
  useQuickCreateLink,
  useAssumeRole,
} from "../hooks/api/useAuthApi";

interface UserMeResponse {
  login: string;
}

// Helper function to generate a random 12-character string
const generateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const AWSRoleAssumePage: React.FC = () => {
  const { loading: authLoading } = useAuth();
  const { data: user, isLoading: userLoading } =
    useQuery<UserMeResponse>("/api/users/me");
  const theme = useTheme();
  const navigate = useNavigate();

  // const [externalIdInput, setExternalIdInput] = useState<string>(""); // externalId is now from backend
  const [roleArnInput, setRoleArnInput] = useState<string>("");

  const {
    mutate: registrationTokenMutate,
    isLoading: registrationTokenLoading,
    isError: registrationTokenError,
    data: registrationTokenData,
  } = useRegistrationToken();

  const {
    mutate: quickCreateLinkMutate,
    isLoading: quickCreateLinkLoading,
    isError: quickCreateLinkError,
    data: quickCreateLinkData,
  } = useQuickCreateLink();

  const {
    mutate: assumeRoleMutate,
    isLoading: assumeRoleLoading,
    isError: assumeRoleError,
    isSuccess: assumeRoleSuccess,
  } = useAssumeRole();

  const isLoading =
    authLoading ||
    userLoading ||
    registrationTokenLoading ||
    quickCreateLinkLoading ||
    assumeRoleLoading;

  useEffect(() => {
    if (
      registrationTokenData?.registrationToken &&
      registrationTokenData?.externalId
    ) {
      const stackName = generateRandomString(12);
      quickCreateLinkMutate({
        externalId: registrationTokenData.externalId, // Use externalId from backend
        registrationToken: registrationTokenData.registrationToken,
        region: "ap-northeast-2",
        stackName: stackName,
      });
    }
  }, [registrationTokenData, quickCreateLinkMutate]); // Removed externalIdInput from dependency array

  useEffect(() => {
    if (quickCreateLinkData?.quickCreateUrl) {
      window.location.href = quickCreateLinkData.quickCreateUrl;
    }
  }, [quickCreateLinkData]);

  useEffect(() => {
    if (assumeRoleSuccess) {
      navigate("/dashboard");
    }
  }, [assumeRoleSuccess, navigate]);

  const handleCreateRoleArn = () => {
    registrationTokenMutate({ ttlSeconds: 3600 });
  };

  const handleAssumeRole = () => {
    if (roleArnInput) {
      assumeRoleMutate({ roleArn: roleArnInput, externalId: undefined }); // externalId is not provided by user for direct assume
    }
  };

  // const hasError = registrationTokenError || quickCreateLinkError || assumeRoleError; // Removed hasError

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
        <Fade in={!isLoading} timeout={1000}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: "bold", mb: 4 }}
            >
              Welcome, {user?.login || "Guest"}!
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography variant="body1" sx={{ fontSize: "0.9rem" }}>
                To create an AWS Role for D-light, click the button below.
              </Typography>
              {/* Tooltip for Create Role ARN flow removed from here */}
            </Box>

            {/* Removed TextField for External ID input */}

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleCreateRoleArn}
              disabled={isLoading}
              sx={{ mb: 4 }}
            >
              Create Role ARN
            </Button>
            <Typography
              color="error"
              variant="body2"
              sx={{ mb: 2, height: "1.5em" }} // Reserve space for one line of text
            >
              {(registrationTokenError || quickCreateLinkError) &&
                "Failed to generate link. Please try again."}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography variant="body1" sx={{ fontSize: "0.9rem" }}>
                Please copy your AWS Role ARN and paste it below.
              </Typography>
              <Tooltip
                title={
                  <React.Fragment>
                    <Typography color="inherit">
                      The Role ARN can be found in the Outputs section of the
                      created CloudFormation Stack.
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

            <TextField
              label="AWS Role ARN"
              variant="outlined"
              value={roleArnInput}
              onChange={(e) => setRoleArnInput(e.target.value)}
              sx={{ mb: 2, width: "400px" }}
              error={assumeRoleError}
              helperText={
                assumeRoleError
                  ? "Failed to assume role. Please check the ARN."
                  : ""
              }
            />

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleAssumeRole}
              disabled={!roleArnInput || isLoading}
            >
              Assume Role
            </Button>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default AWSRoleAssumePage;
