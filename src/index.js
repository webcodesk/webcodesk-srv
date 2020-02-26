/*
 *     Webcodesk
 *     Copyright (C) 2019  Oleksandr (Alex) Pustovalov
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import 'typeface-roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { SnackbarProvider } from 'notistack';
import App from './app';
import { consoleError, clearConsoleErrors } from './usr/core/config/storage';
import './index.css';
import './usr/css/github-markdown.css';

if (process.env.NODE_ENV === 'production') {
  console.warn = consoleError;
  console.log = consoleError;
  console.error = consoleError;
  console.info = consoleError;
}

clearConsoleErrors().then(() => {
  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
      fontFamily: ['"Roboto"', 'sans-serif'],
      fontSize: 13,
      htmlFontSize: 16,
    }
  });

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

