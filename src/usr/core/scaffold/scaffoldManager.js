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

import { TSX_FILE_EXTENSION, TS_FILE_EXTENSION, JS_FILE_EXTENSION } from '../../../commons/constants';
import * as config from '../config/config';
import components from './components';
import functions from './functions';
import { ensureFilePath, writeFile } from '../utils/fileUtils';

const componentGeneratorsMap = {
  'general': {
    [TSX_FILE_EXTENSION]: components.generalComponentTS,
    [JS_FILE_EXTENSION]: components.generalComponentJS,
  },
};

const functionsGeneratorsMap = {
  [TS_FILE_EXTENSION]: functions.functionsTS,
  [JS_FILE_EXTENSION]: functions.functionsJS,
};

export async function generateComponentScaffold(name, directoryName, fileExtension, componentScaffold) {
  directoryName = directoryName || '';
  const generator = componentGeneratorsMap[componentScaffold][fileExtension];
  let sequence = Promise.resolve();
  if (generator) {
    const fileList = await generator.createFiles(name, directoryName, config.usrSourceDir, fileExtension);
    if (fileList.length > 0) {
      fileList.forEach(fileObject => {
        if (fileObject.filePath && fileObject.fileData) {
          sequence = sequence.then(() => {
            return ensureFilePath(fileObject.filePath)
              .then(() => {
                return writeFile(fileObject.filePath, fileObject.fileData);
              })
              .catch(err => {
                console.error(`Can not write file ${fileObject.filePath}. ${err.message}`);
              });
          });
        }
      });
    }
  }
  return sequence;
}

export async function generateFunctionsScaffold(name, directoryName, fileExtension) {
  directoryName = directoryName || '';
  const generator = functionsGeneratorsMap[fileExtension];
  let sequence = Promise.resolve();
  if (generator) {
    const fileList = await generator.createFiles(
      name, directoryName, config.usrSourceDir, fileExtension
    );
    if (fileList.length > 0) {
      fileList.forEach(fileObject => {
        if (fileObject.filePath && fileObject.fileData) {
          sequence = sequence.then(() => {
            return ensureFilePath(fileObject.filePath)
              .then(() => {
                return writeFile(fileObject.filePath, fileObject.fileData);
              })
              .catch(err => {
                console.error(`Can not write file ${fileObject.filePath}. ${err.message}`);
              });
          });
        }
      });
    }
  }
  return sequence;
}
