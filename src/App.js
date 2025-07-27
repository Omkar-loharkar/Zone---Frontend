import React, { useMemo, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import RoleSelection from './RoleSelection';
import CandidateLogin from './pages/CandidateLogin';
import CandidateRegister from './pages/CandidateRegister';
import CandidateHome from './pages/CandidateHome';
import HRLogin from './pages/HRLogin';
import HRRegister from './pages/HRRegister';
import HRHome from './pages/HRHome';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WorkIcon from '@mui/icons-material/Work';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'light' });

const navLinks = [
  { text: 'Role Selection', to: '/', icon: <HomeIcon /> },
  { text: 'Candidate Login', to: '/candidate/login', icon: <LoginIcon /> },
  { text: 'Candidate Register', to: '/candidate/register', icon: <PersonAddIcon /> },
  { text: 'Candidate Home', to: '/candidate/home', icon: <WorkIcon /> },
  { text: 'HR Login', to: '/hr/login', icon: <LoginIcon /> },
  { text: 'HR Register', to: '/hr/register', icon: <PersonAddIcon /> },
  { text: 'HR Home', to: '/hr/home', icon: <WorkIcon /> },
];

function MainLayout({ children, mode, toggleColorMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Zone - Find your next job
          </Typography>
          <IconButton color="inherit" onClick={toggleColorMode}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {navLinks.map((link) => (
            <ListItem
              button
              key={link.to}
              component={Link}
              to={link.to}
              selected={location.pathname === link.to}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}

function App() {
  const [mode, setMode] = useState('dark');
  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    mode,
  }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <Router>
        <MainLayout mode={mode} toggleColorMode={colorMode.toggleColorMode}>
          <Routes>
            <Route path="/" element={<RoleSelection />} />
            <Route path="/candidate/login" element={<CandidateLogin />} />
            <Route path="/candidate/register" element={<CandidateRegister />} />
            <Route path="/candidate/home" element={<CandidateHome />} />
            <Route path="/hr/login" element={<HRLogin />} />
            <Route path="/hr/register" element={<HRRegister />} />
            <Route path="/hr/home" element={<HRHome />} />
          </Routes>
        </MainLayout>
      </Router>
    </ColorModeContext.Provider>
  );
}

export default App;
