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
