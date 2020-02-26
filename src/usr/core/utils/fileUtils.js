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

import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
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
  // the caller should catch the error to be sure that file exists
  return invokeServer('isExisting', filePath);
}

export function checkDirIsEmpty (dirPath) {
  // the caller should catch the error to be sure that dir is empty
  return invokeServer('checkDirIsEmpty', dirPath);
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

export function excludeFields(obj2, fields) {
  let obj1 = null;
  if (isArray(obj2)) {
    obj1 = [];
    for (let i = 0; i < obj2.length; i++) {
      obj1.push(excludeFields(obj2[i], fields));
    }
  } else if (isObject(obj2)) {
    obj1 = {};
    for (let item in obj2) {
      if (obj2.hasOwnProperty(item) && !fields[item]) {
        obj1[item] = excludeFields(obj2[item], fields);
      }
    }
  } else {
    obj1 = obj2;
  }
  return obj1;
}