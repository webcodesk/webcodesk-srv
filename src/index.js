import 'typeface-roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { SnackbarProvider } from 'notistack';
import App, { initApp } from './app';
import { consoleError, clearConsoleErrors } from './usr/core/config/storage';
import './index.css';
import './usr/css/fa/css/all.min.css';
import './usr/css/github-markdown.css';

console.warn = consoleError;
console.log = consoleError;
console.error = consoleError;
console.info = consoleError;

clearConsoleErrors().then(() => {
  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
      fontFamily: ['"Roboto"', 'sans-serif'],
      // htmlFontSize: 8,
    }
  });

  initApp();

  window.addEventListener('contextmenu', (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);

  ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        action={[
          <IconButton key="actionButton">
            <Close fontSize="small" color="disabled" />
          </IconButton>
        ]}
      >
        <App />
      </SnackbarProvider>
    </MuiThemeProvider>,
    document.getElementById('root')
  );
});

