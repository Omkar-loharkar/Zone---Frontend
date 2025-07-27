import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Grid, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, CircularProgress, Avatar, Chip
} from '@mui/material';
import { getJobs, getProfile, applyToJob, getCandidateApplications, updateProfile } from '../api';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { keyframes } from '@mui/system';
import Skeleton from '@mui/material/Skeleton';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
`;

const widgetFadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: none; }
`;

function CandidateHome() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ title: '', company: '', location: '' });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applications, setApplications] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({ name: '', email: '', phone: '', resume: '' });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [jobsData, profileData, appsData] = await Promise.all([
        getJobs('candidate', filters),
        getProfile('candidate'),
        getCandidateApplications()
      ]);
      setJobs(jobsData);
      setProfile(profileData);
      setApplications(appsData);
      setEditProfile(profileData);
    } catch (e) {
      setToast({ open: true, message: e.message, severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, []);

  const handleFilter = () => fetchAll();

  const handleApply = async (jobId) => {
    setApplying(true);
    try {
      await applyToJob(jobId);
      setToast({ open: true, message: 'Applied successfully!', severity: 'success' });
      fetchAll();
    } catch (e) {
      setToast({ open: true, message: e.message, severity: 'error' });
    }
    setApplying(false);
  };

  const handleProfileSave = async () => {
    try {
      const updated = await updateProfile('candidate', editProfile);
      setProfile(updated);
      setEditProfile(updated);
      setProfileModalOpen(false);
      setToast({ open: true, message: 'Profile updated!', severity: 'success' });
    } catch (e) {
      setToast({ open: true, message: e.message, severity: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('candidateToken');
    localStorage.removeItem('candidate');
    window.location.href = '/candidate/login';
  };

  const getApplicationStatus = (jobId) => {
    const app = applications.find(a => a.jobId === jobId);
    return app ? app.status : null;
  };

  // Profile completeness calculation
  function getProfileCompleteness(profile) {
    if (!profile) return 0;
    const fields = ['name', 'email', 'phone', 'resume'];
    let filled = 0;
    fields.forEach(f => { if (profile[f]) filled++; });
    return Math.round((filled / fields.length) * 100);
  }

  return (
    <Box sx={{
      maxWidth: 1000,
      mx: 'auto',
      mt: 4,
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #f4f6fa 0%, #e3e9f7 100%)',
      borderRadius: 6,
      boxShadow: 3,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle background illustration */}
      <Box sx={{ position: 'absolute', top: -40, right: -40, opacity: 0.08, fontSize: 240, pointerEvents: 'none', zIndex: 0 }}>
        <span role="img" aria-label="search">🔍</span>
      </Box>
      {/* Dashboard Widgets */}
      <Grid container spacing={3} mb={3} sx={{ zIndex: 1, position: 'relative' }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2, animation: `${widgetFadeIn} 0.7s cubic-bezier(.4,2,.6,1) 0s both` }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56, fontSize: 32 }}>
              <WorkIcon fontSize="inherit" />
            </Avatar>
            <Box>
              <Typography variant="h6">Jobs Available</Typography>
              <Typography variant="h4">{jobs.length}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2, animation: `${widgetFadeIn} 0.7s cubic-bezier(.4,2,.6,1) 0.1s both` }}>
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 56, height: 56, fontSize: 32 }}>
              <AssignmentTurnedInIcon fontSize="inherit" />
            </Avatar>
            <Box>
              <Typography variant="h6">Applications Submitted</Typography>
              <Typography variant="h4">{applications.length}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 2, animation: `${widgetFadeIn} 0.7s cubic-bezier(.4,2,.6,1) 0.2s both` }}>
            <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 56, height: 56, fontSize: 32 }}>
              <CheckCircleIcon fontSize="inherit" />
            </Avatar>
            <Box>
              <Typography variant="h6">Profile Complete</Typography>
              <Typography variant="h4">{getProfileCompleteness(profile)}%</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Available Jobs</Typography>
      {profile && (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            {profile.name ? profile.name[0] : '?'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" component="span">Welcome, {profile.name}</Typography>
            <Button onClick={() => setProfileModalOpen(true)} sx={{ ml: 2 }} color="primary" variant="outlined">Edit Profile</Button>
            <Button onClick={handleLogout} sx={{ ml: 2 }} color="secondary" variant="outlined">Logout</Button>
          </Box>
        </Box>
      )}
      </Box>
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField label="Title" fullWidth value={filters.title} onChange={e => setFilters(f => ({ ...f, title: e.target.value }))} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Company" fullWidth value={filters.company} onChange={e => setFilters(f => ({ ...f, company: e.target.value }))} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Location" fullWidth value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))} />
          </Grid>
        </Grid>
        <Button onClick={handleFilter} sx={{ mt: 2 }} variant="contained">Filter</Button>
      </Box>
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ p: 2 }}>
                <Skeleton variant="rectangular" height={80} animation="wave" />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job, idx) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card
                sx={{
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  boxShadow: 2,
                  '&:hover': { boxShadow: 8, transform: 'translateY(-4px) scale(1.03)' },
                  animation: `${fadeIn} 0.5s ease ${(idx * 0.08).toFixed(2)}s both`,
                  cursor: 'pointer',
                }}
              >
                <CardContent onClick={() => setSelectedJob(job)}>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{job.company} - {job.location}</Typography>
                  <Typography variant="body2" mt={1}>{job.description.slice(0, 80)}{job.description.length > 80 ? '...' : ''}</Typography>
                  {(() => {
                    const status = getApplicationStatus(job.id);
                    if (status) {
                      return <Chip
                        label={status}
                        color={
                          status === 'ACCEPTED' ? 'success' :
                          status === 'REJECTED' ? 'error' :
                          status === 'REVIEWED' ? 'info' : 'warning'
                        }
                        size="small"
                        sx={{ fontWeight: 600, mt: 1 }}
                      />;
                    }
                    return null;
                  })()}
                </CardContent>
                <CardActions>
                  {(() => {
                    const status = getApplicationStatus(job.id);
                    if (status) {
                      return <Button disabled variant="outlined">Applied ({status})</Button>;
                    }
                    return <Button onClick={() => handleApply(job.id)} disabled={applying} variant="contained">Apply</Button>;
                  })()}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/* Job Details Modal */}
      <Dialog open={!!selectedJob} onClose={() => setSelectedJob(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <>
              <Typography variant="h6">{selectedJob.title}</Typography>
              <Typography variant="subtitle1">{selectedJob.company} - {selectedJob.location}</Typography>
              <Typography variant="body1" mt={2}>{selectedJob.description}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedJob(null)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Profile Edit Modal */}
      <Dialog open={profileModalOpen} onClose={() => setProfileModalOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={editProfile.name} onChange={e => setEditProfile(p => ({ ...p, name: e.target.value }))} />
          <TextField label="Email" fullWidth margin="normal" value={editProfile.email} onChange={e => setEditProfile(p => ({ ...p, email: e.target.value }))} />
          <TextField label="Phone" fullWidth margin="normal" value={editProfile.phone} onChange={e => setEditProfile(p => ({ ...p, phone: e.target.value }))} />
          <TextField label="Resume" fullWidth margin="normal" value={editProfile.resume} onChange={e => setEditProfile(p => ({ ...p, resume: e.target.value }))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileModalOpen(false)}>Cancel</Button>
          <Button onClick={handleProfileSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      {/* Toasts */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast(t => ({ ...t, open: false }))}>
        <Alert onClose={() => setToast(t => ({ ...t, open: false }))} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
      <style>{`@keyframes ${widgetFadeIn} { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; }}`}</style>
    </Box>
  );
}

export default CandidateHome; 