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
import * as pageComposerFactory from '../pageComposer/pageComposerFactory';
import * as flowComposerFactory from '../flowComposer/flowComposerFactory';
import * as projectResourcesManager from './projectResourcesManager';
import * as config from '../config/config';
import constants from '../../../commons/constants';
import { repairPath } from '../utils/fileUtils';

export function createNewPageFileObject (name, directoryName) {
  directoryName = directoryName || '';
  const filePath = repairPath(path.join(config.etcPagesSourceDir, directoryName, `${name}.json`));
  const pageFileDataObject = {
    pageName: name,
    pagePath: repairPath(path.join(directoryName, name)),
    componentsTree: pageComposerFactory.createDefaultModel(),
  };
  return { filePath, fileData: JSON.stringify(pageFileDataObject) };
}

export function createNewTemplateFileObject (name, templateModel, directoryName) {
  directoryName = directoryName || '';
  const filePath = repairPath(path.join(config.etcTemplatesSourceDir, directoryName, `${name}.json`));
  const templateFileDataObject = {
    templateName: name,
    componentsTree: templateModel || pageComposerFactory.createDefaultModel(),
  };
  return { filePath, fileData: JSON.stringify(templateFileDataObject) };
}

export function createNewFlowFileObject (name, directoryName) {
  directoryName = directoryName || '';
  const filePath = repairPath(path.join(config.etcFlowsSourceDir, directoryName, `${name}.json`));
  const flowFileDataObject = {
    flowName: name,
    model: flowComposerFactory.createDefaultModel(),
  };
  return { filePath, fileData: JSON.stringify(flowFileDataObject) };
}

export function createCopyPageFileObject (source, name, directoryName) {
  directoryName = directoryName || '';
  const filePath = repairPath(path.join(config.etcPagesSourceDir, directoryName, `${name}.json`));
  const pageFileDataObject = {
    pageName: name,
    pagePath: repairPath(path.join(directoryName, name)),
    componentsTree: source.componentsTree,
  };
  return { filePath, fileData: JSON.stringify(pageFileDataObject) };
}

export function createCopyTemplateFileObject (source, name, directoryName) {
  directoryName = directoryName || '';
  const filePath = repairPath(path.join(config.etcTemplatesSourceDir, directoryName, `${name}.json`));
  const templateFileDataObject = {
    templateName: name,
    componentsTree: source.componentsTree,
  };
  return { filePath, fileData: JSON.stringify(templateFileDataObject) };
}

export function createCopyFlowFileObject (source, name, directoryName) {
  directoryName = directoryName || '';
  const filePath = repairPath(path.join(config.etcFlowsSourceDir, directoryName, `${name}.json`));
  const flowFileDataObject = {
    flowName: name,
    model: source.flowTree,
  };
  return { filePath, fileData: JSON.stringify(flowFileDataObject) };
}

/**
 * To be updated the data should have the same fields that has given resource
 *
 * @param resource
 * @param data
 */
export function createFileObjectsWithNewData (resource, data) {
  let fileObjects = [];
  if (resource.isPage) {
    const { componentsTree: dataComponentsTree, componentInstancesState } = data;
    const parentKeys = resource.allParentKeys;
    if (parentKeys && parentKeys.length > 1) {
      const pageFileResource = projectResourcesManager.getResourceByKey(parentKeys[0]);
      fileObjects.push({
        filePath: pageFileResource.absolutePath,
        fileData: JSON.stringify({
          pageName: resource.pageName,
          pagePath: resource.pagePath,
          isTest: resource.isTest,
          componentsTree: dataComponentsTree
        })
      });
    }

    if (componentInstancesState) {
      const stateIndexResource = projectResourcesManager.getResourceByKey(constants.GRAPH_MODEL_STATE_KEY);
      if (stateIndexResource) {
        const stateIndexParentKeys = stateIndexResource.allParentKeys;
        if (stateIndexParentKeys && stateIndexParentKeys.length > 1) {
          const stateIndexFileResource = projectResourcesManager.getResourceByKey(stateIndexParentKeys[0]);
          fileObjects.push({
            filePath: stateIndexFileResource.absolutePath,
            fileData: JSON.stringify(
              stateIndexResource.componentInstancesState
                ? { ...stateIndexResource.componentInstancesState, ...componentInstancesState }
                : componentInstancesState
            )
          });
        }
      }
    }

  } else if (resource.isTemplate) {
    const { componentsTree: dataComponentsTree, componentInstancesState } = data;
    const parentKeys = resource.allParentKeys;
    if (parentKeys && parentKeys.length > 1) {
      const pageFileResource = projectResourcesManager.getResourceByKey(parentKeys[0]);
      fileObjects.push({
        filePath: pageFileResource.absolutePath,
        fileData: JSON.stringify({
          templateName: resource.templateName,
          componentsTree: dataComponentsTree
        })
      });
    }

    if (componentInstancesState) {
      const stateIndexResource = projectResourcesManager.getResourceByKey(constants.GRAPH_MODEL_STATE_KEY);
      if (stateIndexResource) {
        const stateIndexParentKeys = stateIndexResource.allParentKeys;
        if (stateIndexParentKeys && stateIndexParentKeys.length > 1) {
          const stateIndexFileResource = projectResourcesManager.getResourceByKey(stateIndexParentKeys[0]);
          fileObjects.push({
            filePath: stateIndexFileResource.absolutePath,
            fileData: JSON.stringify(
              stateIndexResource.componentInstancesState
                ? { ...stateIndexResource.componentInstancesState, ...componentInstancesState }
                : componentInstancesState
            )
          });
        }
      }
    }

  } else if (resource.isFlow) {
    const { flowTree } = data;
    const parentResource = projectResourcesManager.getResourceByKey(resource.parentKey);
    fileObjects.push({
      filePath: parentResource.absolutePath,
      fileData: JSON.stringify({
        isDisabled: resource.isDisabled,
        isTest: resource.isTest,
        flowName: resource.displayName,
        model: flowTree,
      })
    });
  }
  return fileObjects;
}

export function createFileObjectWithNewSourceCode (resource, script) {
  let fileObject = {};
  if (resource.isComponent || resource.isFunctions) {
    const pageFileResource = projectResourcesManager.getResourceByKey(resource.parentKey);
    fileObject.filePath = pageFileResource.absolutePath;
    fileObject.fileData = script;
  }
  return fileObject;
}

export function createFileObject (resource, fileDataOptions = {}) {
  let fileObject = {};
  if (resource.isPage) {
    const parentKeys = resource.allParentKeys;
    if (parentKeys && parentKeys.length > 1) {
      const pageFileResource = projectResourcesManager.getResourceByKey(parentKeys[0]);
      fileObject.filePath = pageFileResource.absolutePath;
      fileObject.fileData = JSON.stringify({
        ...fileDataOptions,
        pageName: resource.pageName,
        pagePath: resource.pagePath,
        componentsTree: resource.componentsTree
      });
    }
  } else if (resource.isFlow) {
    const parentResource = projectResourcesManager.getResourceByKey(resource.parentKey);
    fileObject.filePath = parentResource.absolutePath;
    fileObject.fileData = JSON.stringify({
      ...fileDataOptions,
      flowName: resource.displayName,
      model: resource.flowTree,
    });
  }
  return fileObject;
}

export function createBackupFileObjects (resource) {
  let fileObjects = [];
  if (resource.isPage) {
    const parentKeys = resource.allParentKeys;
    if (parentKeys && parentKeys.length > 1) {
      const pageFileResource = projectResourcesManager.getResourceByKey(parentKeys[0]);
      fileObjects.push({
        filePath: pageFileResource.absolutePath,
        fileData: JSON.stringify({
          isTest: resource.isTest,
          pageName: resource.pageName,
          pagePath: resource.pagePath,
          componentsTree: resource.componentsTree
        })
      });
    }
    const stateIndexResource = projectResourcesManager.getResourceByKey(constants.GRAPH_MODEL_STATE_KEY);
    if (stateIndexResource) {
      const stateIndexParentKeys = stateIndexResource.allParentKeys;
      if (stateIndexParentKeys && stateIndexParentKeys.length > 1) {
        const stateIndexFileResource = projectResourcesManager.getResourceByKey(stateIndexParentKeys[0]);
        fileObjects.push({
          filePath: stateIndexFileResource.absolutePath,
          fileData: JSON.stringify(stateIndexResource.componentInstancesState || {})
        });
      }
    }
  } else if (resource.isFlow) {
    const parentResource = projectResourcesManager.getResourceByKey(resource.parentKey);
    fileObjects.push({
      filePath: parentResource.absolutePath,
      fileData: JSON.stringify({
        isTest: resource.isTest,
        flowName: resource.displayName,
        model: resource.flowTree,
      })
    });
  }
  return fileObjects;
}

export function createSettingsFileObject (settings) {
  return {
    filePath: config.etcSettingsFile,
    fileData: JSON.stringify({model: settings}),
  };
}
