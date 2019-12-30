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

import constants from '../../commons/constants';
import globalStore from '../core/config/globalStore';
import * as projectObjectFactory from '../core/project/projectObjectFactory';
import * as projectFileFactory from '../core/project/projectFileFactory';
import * as projectManager from '../core/project/projectManager';
import * as projectResourcesManager from '../core/project/projectResourcesManager';
import { testReservedName } from '../core/utils/textUtils';
import * as scaffoldManager from '../core/scaffold/scaffoldManager';

export const restoreStorageRecords = () => async (dispatch) => {
  try {
    await globalStore.restore(constants.STORAGE_RECORD_EXPANDED_COMPONENT_PROPS_KEYS);
    await globalStore.restore(constants.STORAGE_RECORD_COMPONENT_VIEW_FLAGS);
    await globalStore.restore(constants.STORAGE_RECORD_PAGE_COMPOSER_FLAGS);
    await globalStore.restore(constants.STORAGE_RECORD_TEMPLATE_COMPOSER_FLAGS);
    await globalStore.restore(constants.STORAGE_RECORD_FLOW_COMPOSER_FLAGS);
    await globalStore.restore(constants.STORAGE_RECORD_LIVE_PREVIEW_FLAGS);
  } catch (e) {
    console.error('Cannot restore storage records');
  }
};

export const restoreExpandedResourceKeys = () => async (dispatch) => {
  try {
    const expandedResourceKeys = await globalStore.restore(constants.STORAGE_RECORD_EXPANDED_RESOURCE_KEYS);
    if (expandedResourceKeys) {
      dispatch({expandedResourceKeys: expandedResourceKeys});
    }
  } catch (e) {
    // do nothing;
  }
};

export const updateResourcesTreeView = () => (dispatch) => {
  const resourcesTreeViewObject = projectObjectFactory.createResourcesTreeViewObject();
  dispatch({resourcesTreeViewObject: resourcesTreeViewObject});
};

export const selectResourceByKey = ({ resourceKey, virtualPath }) => (dispatch) => {
  const selectedResource = projectResourcesManager.getResourceByKey(resourceKey);
  // if (selectedResource && selectedResource.isDirectory) {
  //   virtualPath = virtualPath && virtualPath.length > 0
  //     ? `${virtualPath}${constants.FILE_SEPARATOR}${selectedResource.displayName}`
  //     : selectedResource.displayName;
  // }
  dispatch({
    selectedResourceKey: resourceKey,
    selectedResource: selectedResource,
    selectedVirtualPath: virtualPath,
    selected: { resource: selectedResource, virtualPath }
  });
  // dispatch('selectedResource', selectedResource);
  // dispatch('selectedVirtualPath', virtualPath);
  // dispatch('selected', { resource: selectedResource, virtualPath });
};

export const removeSelectedResource = () => (dispatch) => {
  dispatch({
    selectedResourceKey: null,
    selectedResource: null,
    selectedVirtualPath: ''
  });
};

export const findResourcesByText = (text) => (dispatch) => {
  const foundKeys = projectResourcesManager.findResourcesKeysByText(text);
  let foundKeysObject = foundKeys.reduce((acc, value) => {
    return { ...acc, ...{ [value]: true } };
  }, {});
  dispatch({foundResourceKeys: foundKeysObject});
  const keysToExpand = {};
  foundKeys.forEach(foundKey => {
    const pageResource = projectResourcesManager.getResourceByKey(foundKey);
    pageResource.allParentKeys.forEach(parentKey => {
      keysToExpand[parentKey] = true;
    });
  });
  const expandedResourceKeys =
    globalStore.merge(
      constants.STORAGE_RECORD_EXPANDED_RESOURCE_KEYS,
      keysToExpand,
      true
    );
  dispatch({expandedResourceKeys: expandedResourceKeys});
};

export const cancelFindResourcesByText = () => (dispatch) => {
  dispatch({foundResourceKeys: {}});
};

export const findResourcesByEditorRequest = (text) => (dispatch) => {
  dispatch({searchText: text});
  findResourcesByText(text)(dispatch);
};

export const showContextMenu = ({ resource, virtualPath }) => (dispatch) => {
  // we have to pass only serializable plain object
  // sendAppWidowMessage(
  //   appWindowMessages.CONTEXT_MENU_RESOURCE_TREE_VIEW_ITEM,
  //   { resourceModel: resource.compactModel, virtualPath }
  // );
};

export const createNewPageStart = ({ virtualPath }) => (dispatch) => {
  dispatch({
    dirPath: virtualPath,
    isDialogOpen: true
  });
};

export const createNewPageSubmit = (options) => async (dispatch) => {
  const { pageName, directoryName } = options;
  if (testReservedName(pageName)) {
    throw Error(`${pageName} is a reserved name.`);
  }
  const fileObject =
    projectFileFactory.createNewPageFileObject(pageName, directoryName);
  const isAlreadyExists =
    await projectManager.checkResourceExists(fileObject.filePath);
  if (isAlreadyExists) {
    throw Error('The page with the equal path already exists.');
  }
  const newResources = await projectManager.updateResource(fileObject.filePath, fileObject.fileData);
  if (newResources.updatedResources && newResources.updatedResources.length > 0) {
    const newResource = newResources.updatedResources[0];
    dispatch({resourceUpdatedSuccessfully: true});
    if (newResource && newResource.hasChildren) {
      const pageResource = projectResourcesManager.getResourceByKey(newResource.childrenKeys[0]);
      dispatch({
        selectedResourceKey: pageResource.key,
        selectedResource: pageResource
      });
      const keysToExpand = {};
      pageResource.allParentKeys.forEach(parentKey => {
        keysToExpand[parentKey] = true;
      });
      const expandedResourceKeys =
        globalStore.merge(
          constants.STORAGE_RECORD_EXPANDED_RESOURCE_KEYS,
          keysToExpand,
          true
        );
      dispatch({expandedResourceKeys: expandedResourceKeys});
    }
  }
  dispatch({
    isDialogOpen: false,
    fileObject: fileObject
  });
};

export const createNewTemplateStart = ({ virtualPath, templateModel }) => (dispatch) => {
  dispatch({
    dirPath: virtualPath,
    templateModel: templateModel || null,
    isDialogOpen: true
  });
};

export const createNewTemplateSubmit = (options) => async (dispatch) => {
  const { templateName, templateModel, directoryName } = options;
  if (testReservedName(templateName)) {
    throw Error(`${templateName} is a reserved name.`);
  }
  const fileObject =
    projectFileFactory.createNewTemplateFileObject(templateName, templateModel, directoryName);
  const isAlreadyExists =
    await projectManager.checkResourceExists(fileObject.filePath);
  if (isAlreadyExists) {
    throw Error('The template with the equal file path already exists.');
  }
  const newResources = await projectManager.updateResource(fileObject.filePath, fileObject.fileData);
  if (newResources.updatedResources && newResources.updatedResources.length > 0) {
    const newResource = newResources.updatedResources[0];
    dispatch({resourceUpdatedSuccessfully: true});
    if (newResource && newResource.hasChildren) {
      const pageResource = projectResourcesManager.getResourceByKey(newResource.childrenKeys[0]);
      dispatch({
        selectedResourceKey: pageResource.key,
        selectedResource: pageResource
      });
      const keysToExpand = {};
      pageResource.allParentKeys.forEach(parentKey => {
        keysToExpand[parentKey] = true;
      });
      const expandedResourceKeys =
        globalStore.merge(
          constants.STORAGE_RECORD_EXPANDED_RESOURCE_KEYS,
          keysToExpand,
          true
        );
      dispatch({expandedResourceKeys: expandedResourceKeys});
    }
  }
  dispatch({
    isDialogOpen: false,
    fileObject: fileObject
  });
};

export const copyPageStart = ({ resourceKey, virtualPath }) => (dispatch) => {
  const resource = projectResourcesManager.getResourceByKey(resourceKey);
  dispatch({
    resource: resource,
    dirPath: virtualPath,
    isDialogOpen: true
  });
};

export const copyPageSubmit = ({ resource, name, directoryName }) => async (dispatch) => {
  if (testReservedName(name)) {
    throw Error(`${name} is a reserved name.`);
  }
  const fileObject =
    projectFileFactory.createCopyPageFileObject(resource, name, directoryName);
  const isAlreadyExists =
    await projectManager.checkResourceExists(fileObject.filePath);
  if (isAlreadyExists) {
    throw Error('The page with the equal path already exists.');
  }
  const newResources = await projectManager.updateResource(fileObject.filePath, fileObject.fileData);
  if (newResources.updatedResources && newResources.updatedResources.length > 0) {
    const newResource = newResources.updatedResources[0];
    dispatch({resourceUpdatedSuccessfully: true});
    if (newResource && newResource.hasChildren) {
      const pageResource = projectResourcesManager.getResourceByKey(newResource.childrenKeys[0]);
      dispatch({
        selectedResourceKey: pageResource.key,
        selectedResource: pageResource
      });
      const keysToExpand = {};
      pageResource.allParentKeys.forEach(parentKey => {
        keysToExpand[parentKey] = true;
      });
      const expandedResourceKeys =
        globalStore.merge(
          constants.STORAGE_RECORD_EXPANDED_RESOURCE_KEYS,
          keysToExpand,
          true
        );
      dispatch({expandedResourceKeys: expandedResourceKeys});
    }
  }
  dispatch({
    isDialogOpen: false,
    fileObject: fileObject
  });
};

export const copyTemplateStart = ({ resourceKey, virtualPath }) => (dispatch) => {
  const resource = projectResourcesManager.getResourceByKey(resourceKey);
  dispatch({
    resource: resource,
    dirPath: virtualPath,
    isDialogOpen: true
  });
};

export const copyTemplateSubmit = ({ resource, name, directoryName }) => async (dispatch) => {
  if (testReservedName(name)) {
    throw Error(`${name} is a reserved name.`);
  }
  const fileObject =
    projectFileFactory.createCopyTemplateFileObject(resource, name, directoryName);
  const isAlreadyExists =
    await projectManager.checkResourceExists(fileObject.filePath);
  if (isAlreadyExists) {
    throw Error('The template with the equal path already exists.');
  }
  const newResources = await projectManager.updateResource(fileObject.filePath, fileObject.fileData);
  if (newResources.updatedResources && newResources.updatedResources.length > 0) {
    const newResource = newResources.updatedResources[0];
    dispatch({resourceUpdatedSuccessfully: true});
    if (newResource && newResource.hasChildren) {
      const pageResource = projectResourcesManager.getResourceByKey(newResource.childrenKeys[0]);
      dispatch({
        selectedResourceKey: pageResource.key,
        selectedResource: pageResource
      });
      const keysToExpand = {};
      pageResource.allParentKeys.forEach(parentKey => {
        keysToExpand[parentKey] = true;
      });
      const expandedResourceKeys =
        globalStore.merge(
          constants.STORAGE_RECORD_EXPANDED_RESOURCE_KEYS,
          keysToExpand,
          true
        );
      dispatch({expandedResourceKeys: expandedResourceKeys});
    }
  }
  dispatch({
    isDialogOpen: false,
    fileObject: fileObject
  });
};

export const removePageStart = (resourceKey) => (dispatch) => {
  let foundResource = projectResourcesManager.getResourceByKey(resourceKey);
  if (foundResource && foundResource.isPage) {
    // we can delete only file
    const resourceToDelete = projectResourcesManager.getResourceByKey(foundResource.parentKey);
    dispatch({
      resource: resourceToDelete,
      resourceName: foundResource.displayName,
      isDialogOpen: true
    });
  }
};

export const removePageSubmit = (resource) => async (dispatch) => {
  if (resource && resource.absolutePath) {
    dispatch({deleteFilePath: resource.absolutePath});
  }
  dispatch({isDialogOpen: false});
};

export const removeTemplateStart = (resourceKey) => (dispatch) => {
  let foundResource = projectResourcesManager.getResourceByKey(resourceKey);
  if (foundResource && foundResource.isTemplate) {
    // we can delete only file
    const resourceToDelete = projectResourcesManager.getResourceByKey(foundResource.parentKey);
    dispatch({
      resource: resourceToDelete,
      resourceName: foundResource.displayName,
      isDialogOpen: true
    });
  }
};

export const removeTemplateSubmit = (resource) => async (dispatch) => {
  if (resource && resource.absolutePath) {
    dispatch({deleteFilePath: resource.absolutePath});
  }
  dispatch({isDialogOpen: false});
};

export const createNewFlowStart = ({ virtualPath }) => (dispatch) => {
  dispatch({
    dirPath: virtualPath,
    isDialogOpen: true
  });
};

export const createNewFlowSubmit = ({ name, directoryName }) => async (dispatch) => {
  if (testReservedName(name)) {
    throw Error(`${name} is a reserved name.`);
  }
  const fileObject =
    projectFileFactory.createNewFlowFileObject(name, directoryName);
  const isAlreadyExists =
    await projectManager.checkResourceExists(fileObject.filePath);
  if (isAlreadyExists) {
    throw Error('The page with the equal path already exists.');
  }
  const newResources = await projectManager.updateResource(fileObject.filePath, fileObject.fileData);
  if (newResources.updatedResources && newResources.updatedResources.length > 0) {
    const newResource = newResources.updatedResources[0];
    dispatch({resourceUpdatedSuccessfully: true});
    if (newResource.hasChildren) {
      const flowResource = projectResourcesManager.getResourceByKey(newResource.childrenKeys[0]);
      dispatch({
        selectedResourceKey: flowResource.key,
        selectedResource: flowResource
      });
      const keysToExpand = {};
      flowResource.allParentKeys.forEach(parentKey => {
        keysToExpand[parentKey] = true;
      });
      const expandedResourceKeys =
        globalStore.merge(
          constants.STORAGE_RECORD_EXPANDED_RESOURCE_KEYS,
          keysToExpand,
          true
        );
      dispatch({expandedResourceKeys: expandedResourceKeys});
    }
  }
  dispatch({
    isDialogOpen: false,
    fileObject: fileObject
  });
};

export const copyFlowStart = ({ resourceKey, virtualPath }) => (dispatch) => {
  const resource = projectResourcesManager.getResourceByKey(resourceKey);
  dispatch({
    resource: resource,
    dirPath: virtualPath,
    isDialogOpen: true
  });
};

export const copyFlowSubmit = ({ resource, name, directoryName }) => async (dispatch) => {
  if (testReservedName(name)) {
    throw Error(`${name} is a reserved name.`);
  }
  const fileObject = projectFileFactory.createCopyFlowFileObject(resource, name, directoryName);
  const isAlreadyExists =
    await projectManager.checkResourceExists(fileObject.filePath);
  if (isAlreadyExists) {
    throw Error('The page with the equal path already exists.');
  }
  const newResources = await projectManager.updateResource(fileObject.filePath, fileObject.fileData);
  if (newResources.updatedResources && newResources.updatedResources.length > 0) {
    const newResource = newResources.updatedResources[0];
    dispatch({resourceUpdatedSuccessfully: true});
    if (newResource.hasChildren) {
      const flowResource = projectResourcesManager.getResourceByKey(newResource.childrenKeys[0]);
      dispatch({
        selectedResourceKey: flowResource.key,
        selectedResource: flowResource
      });
      const keysToExpand = {};
      flowResource.allParentKeys.forEach(parentKey => {
        keysToExpand[parentKey] = true;
      });
      const expandedResourceKeys =
        globalStore.merge(
          constants.STORAGE_RECORD_EXPANDED_RESOURCE_KEYS,
          keysToExpand,
          true
        );
      dispatch({expandedResourceKeys: expandedResourceKeys});
    }
  }
  dispatch({
    isDialogOpen: false,
    fileObject: fileObject
  });
};

export const removeFlowStart = (resourceKey) => (dispatch) => {
  let foundResource = projectResourcesManager.getResourceByKey(resourceKey);
  if (foundResource && foundResource.isFlow) {
    // we can delete only file
    const resourceToDelete = projectResourcesManager.getResourceByKey(foundResource.parentKey);
    dispatch({
      resource: resourceToDelete,
      resourceName: foundResource.displayName,
      isDialogOpen: true
    });
  }
};

export const removeFlowSubmit = (resource) => async (dispatch) => {
  if (resource && resource.absolutePath) {
    dispatch({deleteFilePath: resource.absolutePath});
  }
  dispatch({isDialogOpen: false});
};

export const createNewComponentStart = ({ virtualPath }) => (dispatch) => {
  dispatch({
    dirPath: virtualPath,
    isDialogOpen: true
  });
};

export const createNewComponentSubmit = (options) => async (dispatch) => {
  const { name, directoryName, fileExtension, componentScaffold } = options;
  if (testReservedName(name)) {
    throw Error(`${name} is a reserved name.`);
  }
  await scaffoldManager.generateComponentScaffold(name, directoryName, fileExtension, componentScaffold);
  dispatch({isDialogOpen: false});
};

export const createNewFunctionsStart = ({ virtualPath }) => (dispatch) => {
  dispatch({
    dirPath: virtualPath,
    isDialogOpen: true
  });
};

export const createNewFunctionsSubmit = (options) => async (dispatch) => {
  const {
    name,
    directoryName,
    fileExtension,
  } = options;
  if (testReservedName(name)) {
    throw Error(`${name} is a reserved name.`);
  }
  await scaffoldManager.generateFunctionsScaffold(name, directoryName, fileExtension);
  dispatch({isDialogOpen: false});
};

export const toggleFlow = ({ resourceKey, isDisabled }) => async (dispatch) => {
  let foundResource = projectResourcesManager.getResourceByKey(resourceKey);
  const fileObject = projectFileFactory.createFileObject(foundResource, { isDisabled });
  const newResources = await projectManager.updateResource(fileObject.filePath, fileObject.fileData);
  if (newResources.updatedResources && newResources.updatedResources.length > 0) {
    dispatch({resourceUpdatedSuccessfully: true});
  }
  dispatch({fileObject: fileObject});
};

export const toggleIsTest = ({ resourceKey, isTest }) => async (dispatch) => {
  let foundResource = projectResourcesManager.getResourceByKey(resourceKey);
  const fileObject = projectFileFactory.createFileObject(foundResource, { isTest });
  const newResources = await projectManager.updateResource(fileObject.filePath, fileObject.fileData);
  if (newResources.updatedResources && newResources.updatedResources.length > 0) {
    dispatch({resourceUpdatedSuccessfully: true});
  }
  dispatch({fileObject: fileObject});
};

export const toggleExpandedResourceKey = (key) => (dispatch) => {
  let expandedResourceKeys =
    globalStore.get(constants.STORAGE_RECORD_EXPANDED_RESOURCE_KEYS) || {};
  expandedResourceKeys =
    globalStore.merge(
      constants.STORAGE_RECORD_EXPANDED_RESOURCE_KEYS,
      { [key]: !expandedResourceKeys[key] },
      true
    );
  dispatch({expandedResourceKeys: expandedResourceKeys});
};

export const getProjectServerStatus = () => (dispatch) => {
  projectManager.getProjectServerStatus();
};

export const getProjectServerLog = () => (dispatch) => {
  projectManager.getProjectServerLog();
};

export const getProjectSettings = () => (dispatch) => {
  dispatch({projectSettings: projectManager.getProjectSettings()});
};

export const restartProjectServer = () => dispatch => {
  projectManager.restartProjectServer();
};

export const stopProjectServer = () => dispatch => {
  projectManager.stopProjectServer();
};

export const setProjectServerPort = (newPort) => async (dispatch) => {
  const newProjectSettings = await projectManager.mergeProjectSettings({ port: newPort });
  projectManager.restartProjectServer();
  dispatch({projectSettings: newProjectSettings});
  setTimeout(() => {
    dispatch({doUpdateAll: true});
  }, 10000);
};
