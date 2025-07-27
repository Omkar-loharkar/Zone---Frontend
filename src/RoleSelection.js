import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Stack } from '@mui/material';

function RoleSelection() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none' }}>
      <Paper elevation={4} sx={{ p: 6, borderRadius: 4, minWidth: 340, textAlign: 'center', background: 'rgba(255,255,255,0.95)' }}>
        <Typography variant="h4" mb={3} fontWeight={700} color="primary.main">Welcome to Job Platform</Typography>
        <Typography variant="h6" mb={4} color="text.secondary">Choose your role to continue</Typography>
        <Stack spacing={3} direction="column">
          <Button size="large" variant="contained" color="primary" onClick={() => navigate('/candidate/login')} sx={{ fontSize: 20, py: 1.5 }}>
            Candidate
          </Button>
          <Button size="large" variant="outlined" color="primary" onClick={() => navigate('/hr/login')} sx={{ fontSize: 20, py: 1.5 }}>
            HR
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default RoleSelection; 