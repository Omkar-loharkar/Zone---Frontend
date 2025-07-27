import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App, { ColorModeContext } from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, CssBaseline } from '@mui/material';
import getTheme from './theme';

function Main() {
  const { mode } = useContext(ColorModeContext);
  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
