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