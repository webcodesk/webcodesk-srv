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

import isEmpty from 'lodash/isEmpty';
import path from 'path-browserify';
import { getIndexObjectFileText } from './fileTemplates';
import constants from '../../../../commons/constants';
import {
  repairPath,
  writeFileWhenDifferent
} from '../../utils/fileUtils';

function createIndexObject (resourceModel) {
  const { children } = resourceModel;
  let resultObject = {};
  let childrenArray = children;
  if (childrenArray && childrenArray.length > 0) {
    let dirObject;
    childrenArray.forEach(child => {
      const { type: childType, props: childProps, children: childChildren } = child;
      if (childType === constants.GRAPH_MODEL_DIR_TYPE) {
        dirObject = createIndexObject(child);
        if (!isEmpty(dirObject)) {
          resultObject[childProps.name] = dirObject;
        }
      } else if (childType === constants.GRAPH_MODEL_FILE_TYPE) {
        if (childProps.resourceType === constants.RESOURCE_IN_USER_FUNCTIONS_TYPE) {
          if (childChildren && childChildren.length > 0) {
            resultObject[childProps.name] = `require('${childProps.importPath}')`;
          }
        } else if (childProps.resourceType === constants.RESOURCE_IN_COMPONENTS_TYPE) {
          if (childChildren && childChildren.length > 0) {
            resultObject[childProps.name] = `require('${childProps.importPath}').default`;
          }
        }
      }
    });
  }
  return resultObject;
}

export function generateFiles (resourceTrees, appIndicesDirPath) {
  let sequence = Promise.resolve();
  if (resourceTrees && resourceTrees.length > 0) {
    resourceTrees.forEach(resourceTree => {
      sequence = sequence.then(() => {
        const indexObject = createIndexObject(resourceTree.tree);
        const fileBody = getIndexObjectFileText({indexObject});
        const filePath = repairPath(path.join(appIndicesDirPath, `${resourceTree.indexDirName}.js`));
        return writeFileWhenDifferent(filePath, fileBody);
      });
    });
  }
  return sequence;
}
