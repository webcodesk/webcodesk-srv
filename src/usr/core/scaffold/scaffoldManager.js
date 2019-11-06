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
