import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Snackbar, Alert, CircularProgress, Paper } from '@mui/material';
import { register } from '../api';
import WorkIcon from '@mui/icons-material/Work';

function HRRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register('hr', { name, email, password });
      setToast({ open: true, message: 'Registration successful!', severity: 'success' });
      setTimeout(() => navigate('/hr/login'), 1000);
    } catch (e) {
      setError(e.message);
      setToast({ open: true, message: e.message, severity: 'error' });
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none' }}>
      <Paper sx={{ p: 5, borderRadius: 4, minWidth: 380, boxShadow: 6, position: 'relative', overflow: 'visible', animation: 'fadeInUp 0.7s cubic-bezier(.4,2,.6,1)'}} elevation={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Box sx={{ mb: 1 }}>
            <WorkIcon sx={{ fontSize: 48, color: 'primary.main', boxShadow: 2, borderRadius: '50%', background: '#e3e9f7', p: 1 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} mb={1}>HR Register</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>Create your HR account to post jobs</Typography>
        </Box>
        <form onSubmit={handleRegister}>
          <TextField label="Name" fullWidth value={name} onChange={e => setName(e.target.value)} required sx={{ mb: 2 }} />
          <TextField label="Email" type="email" fullWidth value={email} onChange={e => setEmail(e.target.value)} required sx={{ mb: 2 }} />
          <TextField label="Password" type="password" fullWidth value={password} onChange={e => setPassword(e.target.value)} required sx={{ mb: 2 }} />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ py: 1.2, fontWeight: 600, fontSize: 18 }}>
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </form>
        <Button onClick={() => navigate('/hr/login')} sx={{ mt: 2, fontWeight: 600, fontSize: 16, borderRadius: 2, transition: 'background 0.2s', ':hover': { background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)', color: '#fff' } }} fullWidth>Already have an account? Login</Button>
        {error && <Typography color="error" mt={1}>{error}</Typography>}
        <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; }}`}</style>
      </Paper>
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast(t => ({ ...t, open: false }))}>
        <Alert onClose={() => setToast(t => ({ ...t, open: false }))} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default HRRegister; 