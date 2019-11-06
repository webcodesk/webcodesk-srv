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

import * as dirUtils from './dirUtils';
import * as fileUtils from './fileUtils';
import * as installUtils from './installUtils';
import * as config from './config';
import * as socketUtils from './socketUtils';
import projectServer from './projectServer';
import watcher from './watcher';

export async function getProjectDirPath() {
  return config.getProjectDirPath();
}

export async function readDir(dirPath) {
  return dirUtils.readDir(dirPath);
}

export function ensureFilePath (filePath) {
  return fileUtils.ensureFilePath(filePath);
}

export function ensureDirPath (dirPath) {
  return fileUtils.ensureDirPath(dirPath);
}

export function readFile (filePath) {
  return fileUtils.readFile(filePath);
}

export function readFileSync (filePath) {
  return fileUtils.readFileSync(filePath);
}

export function writeFile ({filePath, fileData}) {
  return fileUtils.writeFile(filePath, fileData)
}

export function copyFile ({srcFilePath, destFilePath}) {
  return fileUtils.copyFile(srcFilePath, destFilePath);
}

export function isExisting (filePath) {
  return fileUtils.isExisting(filePath);
}

export function checkDirIsEmpty (dirPath) {
  return fileUtils.checkDirIsEmpty(dirPath);
}

export function readJson (filePath) {
  return fileUtils.readJson(filePath);
}

export function writeJson ({filePath, jsonObj}) {
  return fileUtils.writeJson(filePath, jsonObj)
}

export function writeFileWhenDifferent({filePath, fileBody}) {
  return fileUtils.writeFileWhenDifferent(filePath, fileBody);
}

export function removeFile (filePath) {
  return fileUtils.removeFile(filePath);
}

export function removeFileAndEmptyDir ({filePath, stopDirPath}) {
  return fileUtils.removeFileAndEmptyDir(filePath, stopDirPath);
}

export function isFile (filePath) {
  return fileUtils.isFile(filePath);
}

export function unpackTarGz ({srcFilePath, destDirPath}) {
  return fileUtils.unpackTarGz(srcFilePath, destDirPath)
}

export function download({url, destDirPath}) {
  return fileUtils.download(url, destDirPath);
}

export function checkProjectPaths() {
  try {
    return config.checkProjectPaths();
  } catch (e) {
    return null;
  }
}

export function saveProjectSettings(newSettings) {
  return config.saveProjectSettings(newSettings);
}

export function unpackPackagesInDir(dirPath) {
  return installUtils.unpackPackagesInDir(dirPath);
}

export function install({destDirPath, dependencies, isDevelopment}) {
  return installUtils.install(destDirPath, dependencies, isDevelopment);
}

export function restartProjectServer() {
  projectServer.setSendMessageHook(socketUtils.sendMainWindowMessage);
  projectServer.stopServer(() => {
    config.checkProjectPaths()
      .then(validPaths => {
        if (validPaths) {
          watcher.startWatchingFiles(
            [
              validPaths.testUsrSourceDir,
              validPaths.testEtcTemplatesSourceDir,
            ],
            socketUtils.sendMainWindowMessage
          );
          const { testProjectDirPath, startScriptPath, projectSettings } = validPaths;
          projectServer.startServer({
            projectDirPath: testProjectDirPath,
            startScriptPath,
            port: projectSettings.port
          });
        }
      })
      .catch(error => {
        // do nothing
      });
  });
}

export function stopProjectServer() {
  projectServer.stopServer();
}
