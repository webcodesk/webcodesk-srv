/*
 *    Copyright 2019 Alex (Oleksandr) Pustovalov
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
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

