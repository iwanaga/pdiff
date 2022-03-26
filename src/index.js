import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App';

import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0d1117' },
    primary: { main: "#58a6ff" },
    secondary: { main: "#238636" }
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
