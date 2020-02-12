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

import path from 'path-browserify';
import { repairPath, writeFileWhenDifferent } from '../../utils/fileUtils';
import constants from '../../../../commons/constants';
import { getSchemaIndexFileText } from './fileTemplates';

export async function generateSchemaIndex(destDir, appMode) {
  const indexFilePath = repairPath(path.join(destDir, 'index.js'));
  const indexFileText = getSchemaIndexFileText({
    flowsFileName: constants.FILE_NAME_FLOWS,
    pagesFileName: constants.FILE_NAME_PAGES,
    routerFileName: constants.FILE_NAME_ROUTER,
    appMode
  });
  return writeFileWhenDifferent(indexFilePath, indexFileText)
    .catch(error => {
      console.error(`Can not write index file "${indexFilePath}" `, error);
    });
}