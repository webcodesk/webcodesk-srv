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

import cloneDeep from 'lodash/cloneDeep';
import path from 'path-browserify';
import * as fileUtils from '../../utils/fileUtils';
import * as constants from '../../../../commons/constants';
import { getArrayDefaultExportFileText } from './fileTemplates';
import { writeFileWhenDifferent } from '../../utils/fileUtils';

export function createTree(model, rootModelProps) {
  if (model && model.props) {
    const {
      type,
      children,
      props: {propertyName, propertyValue}
    } = model;
    if (type === constants.COMPONENT_PROPERTY_ARRAY_TYPE
      || type === constants.COMPONENT_PROPERTY_OBJECT_TYPE) {
      if (rootModelProps) {
        if (propertyName) {
          if (propertyValue) {
            rootModelProps[propertyName] = cloneDeep(propertyValue);
          } else {
            rootModelProps[propertyName] = null;
          }
        } else {
          // rootModelProps = rootModelProps || [];
          if (propertyValue) {
            rootModelProps = cloneDeep(propertyValue);
          }
        }
      }
    } else if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
      let newObjectModel = {};
      if (children && children.length > 0) {
        children.forEach(child => {
          newObjectModel = createTree(child, newObjectModel);
        });
      }
      if (rootModelProps) {
        if (propertyName) {
          rootModelProps[propertyName] = newObjectModel;
        } else {
          rootModelProps.push(newObjectModel);
        }
      }
    } else if (type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
      let newArrayModel = [];
      if (children && children.length > 0) {
        children.forEach(child => {
          newArrayModel = createTree(child, newArrayModel);
        });
      }
      if (rootModelProps) {
        if (propertyName) {
          rootModelProps[propertyName] = newArrayModel;
        } else {
          rootModelProps.push(newArrayModel);
        }
      }
    } else if (type === constants.COMPONENT_PROPERTY_STRING_TYPE
      || type === constants.COMPONENT_PROPERTY_ONE_OF_TYPE
      || type === constants.COMPONENT_PROPERTY_SYMBOL_TYPE
      || type === constants.COMPONENT_PROPERTY_BOOL_TYPE
      || type === constants.COMPONENT_PROPERTY_ANY_TYPE
      || type === constants.COMPONENT_PROPERTY_NUMBER_TYPE) {
      if (rootModelProps) {
        if (propertyName) {
          rootModelProps[propertyName] = propertyValue;
        } else {
          if (propertyValue) {
            rootModelProps.push(propertyValue);
          }
        }
      }
    }
  }
  return rootModelProps;
}

export function createIndexObject (resourceModel, resultObject) {
  if (resourceModel) {
    const { type, props, children } = resourceModel;
    if (type === constants.GRAPH_MODEL_SETTINGS_TYPE && props && props.settingsProperties) {
      const { settingsProperties } = props;
      if (settingsProperties && settingsProperties.length > 0) {
        settingsProperties.forEach(settingsPropertyItem => {
          createTree(settingsPropertyItem, resultObject);
        });
      }
    } else if (children && children.length > 0) {
      children.forEach(child => {
        createIndexObject(child, resultObject);
      });
    }
  }
}

export async function generateFiles(resourcesTrees, destFilePath) {
  const indexObject = {};
  createIndexObject(resourcesTrees, indexObject);
  const fileBody = getArrayDefaultExportFileText({fileData: indexObject});
  return writeFileWhenDifferent(destFilePath, fileBody);
}

export async function generateInitialSettingsEtc(destFilePath) {
  try {
    await fileUtils.isExisting(destFilePath);
    // cool, we don't have to do anything
  } catch (e) {
    // need to create the file in the ect dir
    return fileUtils.ensureFilePath(destFilePath)
      .then(() => {
        return fileUtils.writeFile(destFilePath, JSON.stringify({model: []}));
      })
      .catch(error => {
        console.error(`Error writing ${destFilePath} file. `, error);
      });
  }
}