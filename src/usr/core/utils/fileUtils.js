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

const wrongWin32AbsolutePathPrefix = new RegExp(/^\/[A-Za-z]:(.*?)/);

export function ensureFilePath (filePath) {
  return invokeServer('ensureFilePath', filePath)
    .catch(err => {
      console.error(`Error ensuring path ${filePath}. `, err);
    });
}

export function ensureDirPath (dirPath) {
  return invokeServer('ensureDirPath', dirPath)
    .catch(err => {
      console.error(`Error ensuring directory ${dirPath}. `, err);
    });
}

export function readFile (filePath) {
  return invokeServer('readFile', filePath)
    .catch(err => {
      console.error(`Error reading file ${filePath}. `, err);
    });
}

export function writeFile (filePath, fileData) {
  return invokeServer('writeFile', {filePath, fileData})
    .catch(err => {
      console.error(`Error writing file ${filePath}. `, err);
    });
}

export function copyFile (srcFilePath, destFilePath) {
  return invokeServer('copyFile', {srcFilePath, destFilePath})
    .catch(err => {
      console.error(`Error copying file ${srcFilePath} to ${destFilePath}. `, err);
    });
}

export function isExisting (filePath) {
  return invokeServer('isExisting', filePath)
    .catch(err => {
      console.error(`Error checking existence of file ${filePath}. `, err);
    });
}

export function checkDirIsEmpty (dirPath) {
  return invokeServer('checkDirIsEmpty', dirPath)
    .catch(err => {
      console.error(`Error checking directory is empty ${dirPath}. `, err);
    });
}

export function readJson (filePath) {
  return invokeServer('readJson', filePath)
    .catch(err => {
      console.error(`Error reading JSON file ${filePath}. `, err);
    });
}

export function writeJson (filePath, jsonObj) {
  return invokeServer('writeJson', {filePath, jsonObj})
    .catch(err => {
      console.error(`Error writing JSON file ${filePath}. `, err);
    });
}

export function removeFile (filePath) {
  return invokeServer('removeFile', filePath)
    .catch(err => {
      console.error(`Error deleting file ${filePath}. `, err);
    });
}

export function isFile (filePath) {
  return invokeServer('isFile', filePath)
    .catch(() => {
      // silently accept that this is not a file
      return false;
    });
}

export function removeFileAndEmptyDir (filePath, stopDirPath) {
  return invokeServer('removeFileAndEmptyDir', {filePath, stopDirPath})
    .catch(err => {
      console.error(`Error deleting files and empty directories ${filePath}. `, err);
    });
}

export function writeFileWhenDifferent (filePath, fileBody) {
  return invokeServer('writeFileWhenDifferent', {filePath, fileBody})
    .catch(err => {
      console.error(`Error writing files if the content is different ${filePath}. `, err);
    });
}

export function unpackTarGz (srcFilePath, destDirPath) {
  return invokeServer('unpackTarGz', {srcFilePath, destDirPath})
    .catch(err => {
      console.error(`Error unpacking tar.gz file ${srcFilePath} to ${destDirPath}. `, err);
    });
}

export function repairPath (filePath) {
  if (filePath) {
    const newFilePath = filePath.replace(/\\/g, constants.FILE_SEPARATOR);
    const nameMatches = wrongWin32AbsolutePathPrefix.exec(newFilePath);
    if (!nameMatches) {
      return newFilePath;
    }
    // here we have a bug in the path-browserify
    // after the path resolving we get the leading slash --> /D://dir/dir
    // however there should not be any on the win32 platform --> D://dir/dir
    return newFilePath.substr(1);
  }
  return filePath;
}
