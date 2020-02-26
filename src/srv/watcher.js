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

const path = require('path');
const chokidar = require('chokidar');
const appWindowMessages = require('../commons/appWindowMessages');

let watcher;
let watcherIsReady;

const validFileExtensions = {
  '.js': true, '.jsx': true, '.ts': true, '.tsx': true, '.json': true, '.md': true
};


function stopWatchingFiles() {
  if (watcher) {
    watcher.close();
    watcher = undefined;
  }
  watcherIsReady = false;
}

function startWatchingFiles(filePaths, sendMainWindowMessage) {
  stopWatchingFiles();
  watcher = chokidar.watch(filePaths, {
    persistent: true,
    followSymlinks: false,
    awaitWriteFinish: true,
    interval: 500,
    depth: 20,
  });
  watcher
    .on('ready', () => {
      watcherIsReady = true;
      // console.info(watcher.getWatched());
    })
    .on('add', filePath => {
      if (watcherIsReady) {
        const extName = path.extname(filePath);
        if (validFileExtensions[extName]) {
          // console.info(`File ${filePath} was added.`);
          sendMainWindowMessage(appWindowMessages.WATCHER_FILE_WAS_ADDED, { path: filePath });
        }
      }
    })
    .on('change', filePath => {
      if (watcherIsReady) {
        const extName = path.extname(filePath);
        if (validFileExtensions[extName]) {
          // console.info(`File ${filePath} was changed`);
          sendMainWindowMessage(appWindowMessages.WATCHER_FILE_WAS_CHANGED, { path: filePath });
        }
      }
    })
    .on('unlink', filePath => {
      if (watcherIsReady) {
        const extName = path.extname(filePath);
        if (validFileExtensions[extName]) {
          // console.info(`File ${filePath} was removed`);
          sendMainWindowMessage(appWindowMessages.WATCHER_FILE_WAS_REMOVED, { path: filePath });
        }
      }
    });
}

module.exports = {
  startWatchingFiles,
  stopWatchingFiles
};
