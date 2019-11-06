const path = require('path');
const chokidar = require('chokidar');
const appWindowMessages = require('../commons/appWindowMessages');

let watcher;

const validFileExtensions = {
  '.js': true, '.jsx': true, '.ts': true, '.tsx': true, '.json': true, '.md': true
};


function stopWatchingFiles() {
  if (watcher) {
    watcher.close();
    watcher = undefined;
  }
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
    // .on('ready', () => {
    //   console.info(watcher.getWatched());
    // })
    .on('add', filePath => {
      const extName = path.extname(filePath);
      if (validFileExtensions[extName]) {
        // console.info(`File ${filePath} was added.`);
        sendMainWindowMessage(appWindowMessages.WATCHER_FILE_WAS_ADDED, {path: filePath});
      }
    })
    .on('change', filePath => {
      const extName = path.extname(filePath);
      if (validFileExtensions[extName]) {
        // console.info(`File ${filePath} was changed`);
        sendMainWindowMessage(appWindowMessages.WATCHER_FILE_WAS_CHANGED, {path: filePath});
      }
    })
    .on('unlink', filePath => {
      const extName = path.extname(filePath);
      if (validFileExtensions[extName]) {
        // console.info(`File ${filePath} was removed`);
        sendMainWindowMessage(appWindowMessages.WATCHER_FILE_WAS_REMOVED, {path: filePath});
      }
    });
}

module.exports = {
  startWatchingFiles,
  stopWatchingFiles
};
