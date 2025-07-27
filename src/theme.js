import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#757575' }, // gray
          secondary: { main: '#bdbdbd' }, // lighter gray
          background: { default: '#f4f6fa', paper: '#fff' },
        }
      : {
          primary: { main: '#bdbdbd' }, // gray for dark mode
          secondary: { main: '#757575' }, // darker gray
          background: { default: '#121212', paper: '#1e1e1e' },
        }),
  },
  typography: {
    fontFamily: 'Roboto, Arial',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
});

export default function getTheme(mode = 'light') {
  return createTheme(getDesignTokens(mode));
} 