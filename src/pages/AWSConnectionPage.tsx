/**
 * @file AWSConnectionPage.tsx
 * @description 클라이언트 측 AWS 서버 권한을 받는 페이지입니다.
 * AWS Role ARN과 리전을 입력받습니다.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

// List of common AWS regions
const awsRegions = [
  { value: 'ap-northeast-2', label: 'ap-northeast-2 (Seoul)' },
  { value: 'us-east-1', label: 'us-east-1 (N. Virginia)' },
  { value: 'us-west-2', label: 'us-west-2 (Oregon)' },
  { value: 'eu-central-1', label: 'eu-central-1 (Frankfurt)' },
  { value: 'ap-southeast-1', label: 'ap-southeast-1 (Singapore)' },
];

const AWSConnectionPage: React.FC = () => {
  const [roleArn, setRoleArn] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(awsRegions[0].value); // Default to Seoul
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const externalId = 'dlight-external-id-placeholder'; 

  const handleConnect = async () => {
    if (roleArn.trim() === '') {
      setError('Please enter a Role ARN.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call to backend for verification
      console.log(`Verifying connection for Role ARN: ${roleArn} in region: ${selectedRegion}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success or failure based on input
      if (roleArn.includes('success')) {
        navigate('/status');
      } else {
        setError('Failed to connect. Please check your Role ARN and IAM role settings.');
      }
    } catch (e) {
      setError('An unexpected error occurred during connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Connect to AWS
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Follow the steps below, then paste the generated Role ARN and select your region to start the deployment.
        </Typography>

        <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 1, mt: 3, mb: 3 }}>
          <Typography variant="h6">Step 1: Configure IAM Role in AWS</Typography>
          <ol>
            <li>Sign in to your AWS Console and open the IAM service.</li>
            <li>Go to <strong>Roles</strong> and click <strong>Create role</strong>.</li>
            <li>For trusted entity type, select <strong>AWS account</strong>.</li>
            <li>Under 'An AWS account', select <strong>Another AWS account</strong> and enter the Account ID: <strong>495236580665</strong></li>
            <li>Under 'Options', check <strong>Require external ID</strong> and enter: <strong>{externalId}</strong></li>
            <li>Attach the necessary permissions policies for deployment.</li>
            <li>Complete the role creation and copy the <strong>Role ARN</strong>.</li>
          </ol>
        </Box>

        <Box component="form" noValidate sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Step 2: Submit Role ARN and Select Region</Typography> {/* Added mb={3} */}
          <TextField
            required
            fullWidth
            id="roleArn"
            label="AWS Role ARN"
            name="roleArn"
            placeholder="arn:aws:iam::123456789012:role/YourRoleName"
            value={roleArn}
            onChange={(e) => setRoleArn(e.target.value)}
            disabled={isLoading}
            sx={{ mb: 3 }} // Increased mb for spacing
          />
          <FormControl fullWidth required disabled={isLoading} sx={{ mb: 2 }}>
            <InputLabel id="aws-region-select-label">AWS Region</InputLabel>
            <Select
              labelId="aws-region-select-label"
              id="aws-region-select"
              value={selectedRegion}
              label="AWS Region"
              onChange={(e) => setSelectedRegion(e.target.value as string)}
            >
              {awsRegions.map((region) => (
                <MenuItem key={region.value} value={region.value}>
                  {region.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Consistent error message space */} 
          <Box sx={{ minHeight: '50px', mb: 2 }}> {/* Added Box with minHeight */} 
            {error && <Alert severity="error">{error}</Alert>} {/* Removed mb from Alert */} 
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              onClick={handleConnect}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? 'Verifying...' : 'Verify & Start Deployment'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AWSConnectionPage;
