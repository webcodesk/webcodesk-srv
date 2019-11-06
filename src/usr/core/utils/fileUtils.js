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

import { invokeServer } from './serverUtils';
import constants from '../../../commons/constants';

export function ensureFilePath (filePath) {
  return invokeServer('ensureFilePath', filePath);
}

export function ensureDirPath (dirPath) {
  return invokeServer('ensureDirPath', dirPath);
}

export function readFile (filePath) {
  return invokeServer('readFile', filePath);
}

export function writeFile (filePath, fileData) {
  return invokeServer('writeFile', {filePath, fileData});
}

export function copyFile (srcFilePath, destFilePath) {
  return invokeServer('copyFile', {srcFilePath, destFilePath});
}

export function isExisting (filePath) {
  return invokeServer('isExisting', filePath);
}

export function checkDirIsEmpty (dirPath) {
  return invokeServer('checkDirIsEmpty', dirPath);
}

export function readJson (filePath) {
  return invokeServer('readJson', filePath);
}

export function writeJson (filePath, jsonObj) {
  return invokeServer('writeJson', {filePath, jsonObj});
}

export function removeFile (filePath) {
  return invokeServer('removeFile', filePath);
}

export function isFile (filePath) {
  return invokeServer('isFile', filePath);
}

export function removeFileAndEmptyDir (filePath, stopDirPath) {
  return invokeServer('removeFileAndEmptyDir', {filePath, stopDirPath});
}

export function writeFileWhenDifferent (filePath, fileBody) {
  return invokeServer('writeFileWhenDifferent', {filePath, fileBody});
}

export function unpackTarGz (srcFilePath, destDirPath) {
  return invokeServer('unpackTarGz', {srcFilePath, destDirPath});
}

export function repairPath (filePath) {
  if (filePath) {
    return filePath.replace(/\\/g, constants.FILE_SEPARATOR);
  }
  return filePath;
}
