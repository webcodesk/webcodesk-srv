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
import { repairPath } from './fileUtils';
import constants from '../../../commons/constants';

export function resourceModelComparator (a, b) {
  const { props: aProps } = a;
  const { props: bProps } = b;
  if (aProps.displayName > bProps.displayName) {
    return 1;
  }
  if (aProps.displayName < bProps.displayName) {
    return -1;
  }
  return 0;
}

export function resourceModelComparatorByKeyAsc (a, b) {
  const { key: aKey } = a;
  const { key: bKey } = b;
  if (aKey > bKey) {
    return 1;
  }
  if (aKey < bKey) {
    return -1;
  }
  return 0;
}

export function resourceModelComparatorByKeyDesc (a, b) {
  const { key: aKey } = a;
  const { key: bKey } = b;
  if (aKey < bKey) {
    return 1;
  }
  if (aKey > bKey) {
    return -1;
  }
  return 0;
}

export function makeResourceName (name) {
  if (name && name.length > 0) {
    const nameParts = name.split(constants.MODEL_KEY_SEPARATOR);
    if (nameParts && nameParts.length > 0) {
      return nameParts[0];
    }
  }
  return name;
}

export function makeResourceModelKey (dirPath, fileName) {
  const validPath = repairPath(dirPath);
  // model key is used to get access to the certain resource (function, component, etc.)
  // through the lodash get in the indices tree
  // so, we have to get rig of the invalid characters in the resource name
  if (fileName) {
    return validPath.replace(constants.FILE_SEPARATOR_REGEXP, constants.MODEL_KEY_SEPARATOR)
      + `${constants.MODEL_KEY_SEPARATOR}${makeResourceName(fileName)}`;
  } else {
    const validDirPath = path.dirname(validPath);
    const validFileName = path.basename(validPath);
    return validDirPath.replace(constants.FILE_SEPARATOR_REGEXP, constants.MODEL_KEY_SEPARATOR)
      + `${constants.MODEL_KEY_SEPARATOR}${makeResourceName(validFileName)}`;
  }
}

export function makeResourceModelCanonicalKey(modelKey, resourceName) {
  return `${modelKey}${constants.MODEL_KEY_SEPARATOR}${resourceName}`;
}
