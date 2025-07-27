import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Grid, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, CircularProgress, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { getMyJobs, addJob, getProfile, getJobApplications, updateApplicationStatus } from '../api';

function HRHome() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', company: '', location: '' });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [appLoading, setAppLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const [statusUpdating, setStatusUpdating] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [jobsData, profileData] = await Promise.all([
        getMyJobs(),
        getProfile('hr')
      ]);
      setJobs(jobsData);
      setProfile(profileData);
    } catch (e) {
      setToast({ open: true, message: e.message, severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, []);

  const handleAddJob = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addJob({ ...form, postedBy: profile.id });
      setToast({ open: true, message: 'Job added!', severity: 'success' });
      setForm({ title: '', description: '', company: '', location: '' });
      fetchAll();
    } catch (e) {
      setToast({ open: true, message: e.message, severity: 'error' });
    }
    setAdding(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('hrToken');
    localStorage.removeItem('hr');
    window.location.href = '/hr/login';
  };

  const handleViewApplications = async (job) => {
    setSelectedJob(job);
    setAppLoading(true);
    // try {
      const apps = await getJobApplications(job.id);
      setApplications(apps);
    // } catch (e) {
    //   setToast({ open: true, message: e.message, severity: 'error' });
    //   setApplications([]);
    // }
    setAppLoading(false);
  };

  const handleStatusUpdate = async (applicationId, status) => {
    setStatusUpdating(applicationId + status);
    // try {
      await updateApplicationStatus(applicationId, status);
      setToast({ open: true, message: 'Status updated!', severity: 'success' });
      // Refresh applications
      if (selectedJob) handleViewApplications(selectedJob);
    // } catch (e) {
    //   setToast({ open: true, message: e.message, severity: 'error' });
    // }
    setStatusUpdating(null);
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">HR Job Portal</Typography>
      {profile && (
          <Box>
            <Typography variant="subtitle1" component="span">Welcome, {profile.name}</Typography>
            <Button onClick={handleLogout} sx={{ ml: 2 }} color="secondary" variant="outlined">Logout</Button>
          </Box>
        )}
      </Box>
      <Box mb={3}>
        <form onSubmit={handleAddJob}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField label="Title" fullWidth value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Company" fullWidth value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} required />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Location" fullWidth value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Description" fullWidth value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
            </Grid>
          </Grid>
          <Button type="submit" sx={{ mt: 2 }} variant="contained" disabled={adding}>Add Job</Button>
        </form>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {jobs.map(job => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card>
                <CardContent onClick={() => handleViewApplications(job)} sx={{ cursor: 'pointer' }}>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{job.company} - {job.location}</Typography>
                  <Typography variant="body2" mt={1}>{job.description.slice(0, 80)}{job.description.length > 80 ? '...' : ''}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/* Applications Modal */}
      <Dialog open={!!selectedJob} onClose={() => setSelectedJob(null)} maxWidth="md" fullWidth>
        <DialogTitle>Applications for {selectedJob?.title}</DialogTitle>
        <DialogContent>
          {appLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
              <CircularProgress />
            </Box>
          ) : applications.length === 0 ? (
            <Typography>No applications yet.</Typography>
          ) : (
            <Grid container spacing={2}>
              {applications.map(app => (
                <Grid item xs={12} key={app.id}>
                  <Card>
                    <CardContent>
                      <Typography><b>Candidate ID:</b> {app.candidateId}</Typography>
                      <Typography><b>Status:</b> {app.status}</Typography>
                    </CardContent>
                    <CardActions>
                      <FormControl sx={{ minWidth: 120 }} size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={app.status}
                          label="Status"
                          onChange={e => handleStatusUpdate(app.id, e.target.value)}
                          disabled={statusUpdating === app.id + app.status}
                        >
                          <MenuItem value="PENDING">Pending</MenuItem>
                          <MenuItem value="REVIEWED">Reviewed</MenuItem>
                          <MenuItem value="ACCEPTED">Accepted</MenuItem>
                          <MenuItem value="REJECTED">Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedJob(null)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Toasts */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast(t => ({ ...t, open: false }))}>
        <Alert onClose={() => setToast(t => ({ ...t, open: false }))} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default HRHome; 