import { createTheme } from '@mui/material/styles';

export const colors = {
  outerBg: '#ECEAE6',
  contentBg: '#FFF8E1',
  brownDark: '#5D4037',
  brown: '#795548',
  tan: '#8D6E63',
  tableHeader: '#F5E6B8',
  error: '#C62828',
  link: '#1565C0',
};

const theme = createTheme({
  palette: {
    primary: { main: colors.brown, contrastText: '#FFFFFF' },
    secondary: { main: colors.tan },
    error: { main: colors.error },
    background: { default: colors.outerBg, paper: '#FFFFFF' },
    text: { primary: '#3E2723' },
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
});

export default theme;