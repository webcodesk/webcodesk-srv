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

import forOwn from 'lodash/forOwn';
import orderBy from 'lodash/orderBy';
import globalStore from '../../core/config/globalStore';
import GraphModel from '../graph/GraphModel';
import * as config from '../config/config';
import constants from '../../../commons/constants';
import * as projectResourcesUtils from './projectResourcesUtils';
import * as projectResourcesCompiler from './projectResourcesCompiler';
import * as projectResourcesEnhancer from './projectResourcesEnhancer';
import ResourceAdapter from './ResourceAdapter';

let pagesGraphModel = globalStore.get('pagesGraphModel');
let flowsGraphModel = globalStore.get('flowsGraphModel');
let userComponentsGraphModel = globalStore.get('userComponentsGraphModel');
let userFunctionsGraphModel = globalStore.get('userFunctionsGraphModel');
let userPropTypesGraphModel = globalStore.get('userPropTypesGraphModel');
let markdownGraphModel = globalStore.get('markdownGraphModel');
let clipboardGraphModel = globalStore.get('clipboardGraphModel');
let templatesGraphModel = globalStore.get('templatesGraphModel');
let settingsConfGraphModel = globalStore.get('settingsConfGraphModel');
let settingsGraphModel = globalStore.get('settingsGraphModel');

const CLIPBOARD_ITEM_LIST_SIZE_LIMIT = 5;

export let projectDisplayName;
let resourcesUpdateHistory;

export function initNewResourcesTrees () {
  // get the directory name as a project name
  const pathParts = config.projectDirPath.split(constants.FILE_SEPARATOR);
  projectDisplayName = pathParts[pathParts.length - 1];
  // initialize new graph objects
  pagesGraphModel = new GraphModel();
  pagesGraphModel.initModel({
    key: constants.GRAPH_MODEL_PAGES_ROOT_KEY,
    type: constants.GRAPH_MODEL_PAGES_ROOT_TYPE,
    props: {
      displayName: 'Pages',
      resourceType: constants.RESOURCE_IN_PAGES_TYPE,
    }
  });
  templatesGraphModel = new GraphModel();
  templatesGraphModel.initModel({
    key: constants.GRAPH_MODEL_TEMPLATES_ROOT_KEY,
    type: constants.GRAPH_MODEL_TEMPLATES_ROOT_TYPE,
    props: {
      displayName: 'Templates',
      resourceType: constants.RESOURCE_IN_TEMPLATES_TYPE,
    }
  });
  flowsGraphModel = new GraphModel();
  flowsGraphModel.initModel({
    key: constants.GRAPH_MODEL_FLOWS_ROOT_KEY,
    type: constants.GRAPH_MODEL_FLOWS_ROOT_TYPE,
    props: {
      displayName: 'Flows',
      resourceType: constants.RESOURCE_IN_FLOWS_TYPE,
    }
  });
  userComponentsGraphModel = new GraphModel();
  userComponentsGraphModel.initModel({
    key: constants.GRAPH_MODEL_COMPONENTS_ROOT_KEY,
    type: constants.GRAPH_MODEL_COMPONENTS_ROOT_TYPE,
    props: {
      displayName: 'Components',
      resourceType: constants.RESOURCE_IN_COMPONENTS_TYPE,
    }
  });
  userFunctionsGraphModel = new GraphModel();
  userFunctionsGraphModel.initModel({
    key: constants.GRAPH_MODEL_USER_FUNCTIONS_ROOT_KEY,
    type: constants.GRAPH_MODEL_USER_FUNCTIONS_ROOT_TYPE,
    props: {
      displayName: 'Functions',
      resourceType: constants.RESOURCE_IN_USER_FUNCTIONS_TYPE,
    }
  });
  userPropTypesGraphModel = new GraphModel();
  userPropTypesGraphModel.initModel({
    key: constants.GRAPH_MODEL_PROP_TYPES_ROOT_KEY,
    type: constants.GRAPH_MODEL_PROP_TYPES_ROOT_TYPE,
    props: {
      displayName: 'PropTypes',
      resourceType: constants.RESOURCE_IN_PROP_TYPES_TYPE,
    }
  });
  markdownGraphModel = new GraphModel();
  markdownGraphModel.initModel({
    key: constants.GRAPH_MODEL_MARKDOWN_ROOT_KEY,
    type: constants.GRAPH_MODEL_MARKDOWN_ROOT_TYPE,
    props: {
      displayName: 'Markdown',
      resourceType: constants.RESOURCE_IN_MARKDOWN_TYPE,
    }
  });
  clipboardGraphModel = new GraphModel();
  clipboardGraphModel.initModel({
    key: constants.GRAPH_MODEL_CLIPBOARD_ROOT_KEY,
    type: constants.GRAPH_MODEL_CLIPBOARD_ROOT_TYPE,
    props: {
      displayName: 'Clipboard',
      resourceType: constants.RESOURCE_IN_CLIPBOARD_TYPE,
    }
  });
  settingsConfGraphModel = new GraphModel();
  settingsConfGraphModel.initModel({
    key: constants.GRAPH_MODEL_SETTINGS_CONF_ROOT_KEY,
    type: constants.GRAPH_MODEL_SETTINGS_CONF_ROOT_TYPE,
    props: {
      displayName: 'Settings Config',
      resourceType: constants.RESOURCE_IN_SETTINGS_CONF_TYPE,
    }
  });
  settingsGraphModel = new GraphModel();
  settingsGraphModel.initModel({
    key: constants.GRAPH_MODEL_SETTINGS_ROOT_KEY,
    type: constants.GRAPH_MODEL_SETTINGS_ROOT_TYPE,
    props: {
      displayName: 'Settings',
      resourceType: constants.RESOURCE_IN_SETTINGS_TYPE,
    }
  });
  //
  globalStore.set('pagesGraphModel', pagesGraphModel);
  globalStore.set('templatesGraphModel', templatesGraphModel);
  globalStore.set('flowsGraphModel', flowsGraphModel);
  globalStore.set('userComponentsGraphModel', userComponentsGraphModel);
  globalStore.set('userFunctionsGraphModel', userFunctionsGraphModel);
  globalStore.set('userPropTypesGraphModel', userPropTypesGraphModel);
  globalStore.set('markdownGraphModel', markdownGraphModel);
  globalStore.set('clipboardGraphModel', clipboardGraphModel);
  globalStore.set('settingsConfGraphModel', settingsConfGraphModel);
  globalStore.set('settingsGraphModel', settingsGraphModel);
  //
}

export function resetResourcesTrees() {
  globalStore.clear();
}

function updateResourceTrees (declarationsInFile) {
  let deletedResources = [];
  const { updatedResources, resourcesToDelete } = projectResourcesUtils.updateResourceTree(declarationsInFile);
  // delete at all resources that have empty declarations in the source files
  resourcesToDelete.forEach(resourceToDelete => {
    deletedResources = deletedResources.concat(projectResourcesUtils.eraseResource(resourceToDelete));
  });
  // clean all empty directories
  projectResourcesUtils.cleanAllGraphs();
  return { updatedResources, deletedResources };
}

export function updateResources (declarationsInFiles) {
  let updatedResources = [];
  let deletedResources = [];
  if (declarationsInFiles && declarationsInFiles.length > 0) {
    declarationsInFiles.forEach(declarationsInFile => {
      const {
        updatedResources: newUpdatedResources,
        deletedResources: newDeletedResources,
      } = updateResourceTrees(declarationsInFile);
      updatedResources = [
        ...updatedResources,
        ...newUpdatedResources
      ];
      deletedResources = [
        ...deletedResources,
        ...newDeletedResources
      ];
    });
  }
  // enrich resources with the data that are related to the different graph trees
  projectResourcesEnhancer.enrichResources();
  // test if new resources do have the same structure as the instances in pages and flows
  let doUpdateAll = projectResourcesCompiler.compileResources();
  return { updatedResources, deletedResources, doUpdateAll };
}

export function getResourceByKey(resourceKey, specificResourceType = null) {
  return projectResourcesUtils.getResource(resourceKey, specificResourceType);
}

export function getUserFunctionsTree (startKey = null) {
  return projectResourcesUtils.getResourceTree(constants.RESOURCE_IN_USER_FUNCTIONS_TYPE, startKey);
}

const flowUserFunctionsModelsMap = new Map();

function flowUserFunctionResourceVisitor ({ nodeModel, parentModel }) {
  const result = [];
  if (nodeModel && nodeModel.props && nodeModel.type === constants.GRAPH_MODEL_FLOW_USER_FUNCTION_TYPE) {
    if (!nodeModel.props.isTest) {
      result.push(nodeModel);
    }
  }
  return result;
}

export function getUserFunctionsTreeProd (startKey = null) {
  // We have to gather all functions in flow into a single map that let us check if there is such a function
  flowUserFunctionsModelsMap.clear();
  if (flowsGraphModel) {
    const flowFunctionsModels = flowsGraphModel.traverse(flowUserFunctionResourceVisitor);
    if (flowFunctionsModels && flowFunctionsModels.length > 0) {
      flowFunctionsModels.forEach(flowFunctionsModel => {
        if (flowFunctionsModel.props) {
          const { props: { parentFunctionsKey } } = flowFunctionsModel;
          flowUserFunctionsModelsMap.set(parentFunctionsKey, true);
        }
      });
    }
  }
  return projectResourcesUtils.getResourceTree(constants.RESOURCE_IN_USER_FUNCTIONS_TYPE, startKey, (model) => {
    if (model && model.props) {
      if (model.type === constants.GRAPH_MODEL_FUNCTIONS_TYPE) {
        const { props: { functionsName } } = model;
        if (!flowUserFunctionsModelsMap.get(functionsName)) {
          // this is function in test flow, exclude it
          return true;
        }
      }
    }
    // this is an unknown resource model or does not fit
    return false;
  });
}

export function getUserFunctionsCount() {
  return projectResourcesUtils.getResourceTreeItemCount(constants.RESOURCE_IN_USER_FUNCTIONS_TYPE);
}

export function getUserComponentsTree (startKey = null) {
  return projectResourcesUtils.getResourceTree(constants.RESOURCE_IN_COMPONENTS_TYPE, startKey);
}

const componentInstanceModelsMap = new Map();

function componentInstancesResourceVisitor ({ nodeModel, parentModel }) {
  const result = [];
  if (nodeModel && nodeModel.props && nodeModel.type === constants.GRAPH_MODEL_COMPONENT_INSTANCE_TYPE) {
    if (!nodeModel.props.isTest) {
      result.push(nodeModel);
    }
  }
  return result;
}

export function getUserComponentsTreeProd (startKey = null) {
  // We have to gather all instances into a single map that let us check if there is such an instance
  componentInstanceModelsMap.clear();
  if (pagesGraphModel) {
    const componentInstanceModels = pagesGraphModel.traverse(componentInstancesResourceVisitor);
    if (componentInstanceModels && componentInstanceModels.length > 0) {
      componentInstanceModels.forEach(componentInstanceModel => {
        if (componentInstanceModel.props) {
          const { props: { componentName } } = componentInstanceModel;
          componentInstanceModelsMap.set(componentName, true);
        }
      });
    }
  }
  return projectResourcesUtils.getResourceTree(constants.RESOURCE_IN_COMPONENTS_TYPE, startKey, (model) => {
    if (model && model.props) {
      if (model.type === constants.GRAPH_MODEL_COMPONENT_TYPE) {
        const { props: { componentName } } = model;
        if (!componentInstanceModelsMap.get(componentName)) {
          // this component is in test page, exclude it
          return true;
        }
      }
    }
    // this is an unknown resource model or does not fit
    return false;
  });
}

export function getUserComponentsCount() {
  return projectResourcesUtils.getResourceTreeItemCount(constants.RESOURCE_IN_COMPONENTS_TYPE);
}

export function getPagesTree (startKey = null) {
  return projectResourcesUtils.getResourceTree(constants.RESOURCE_IN_PAGES_TYPE, startKey);
}

export function getPagesTreeProd (startKey = null) {
  return projectResourcesUtils.getResourceTree(constants.RESOURCE_IN_PAGES_TYPE, startKey, (model) => {
    if (model && model.props && model.props.isTest) {
      // exclude the resource with isTest in the properties
      return true;
    }
    return false;
  });
}

export function getPagesCount() {
  return projectResourcesUtils.getResourceTreeItemCount(constants.RESOURCE_IN_PAGES_TYPE);
}

export function getTemplatesTree (startKey = null) {
  return projectResourcesUtils.getResourceTree(constants.RESOURCE_IN_TEMPLATES_TYPE, startKey);
}

export function getTemplatesCount() {
  return projectResourcesUtils.getResourceTreeItemCount(constants.RESOURCE_IN_TEMPLATES_TYPE);
}

export function getFlowsTree (startKey = null) {
  return projectResourcesUtils.getResourceTree(constants.RESOURCE_IN_FLOWS_TYPE, startKey);
}

export function getFlowsTreeProd (startKey = null) {
  return projectResourcesUtils.getResourceTree(constants.RESOURCE_IN_FLOWS_TYPE, startKey, (model) => {
    if (model && model.props && model.props.isTest) {
      // exclude the resource with isTest in the properties
      return true;
    }
    return false;
  });
}

export function getFlowsCount() {
  return projectResourcesUtils.getResourceTreeItemCount(constants.RESOURCE_IN_FLOWS_TYPE);
}

export function getPropTypesTree (startKey = null) {
  return projectResourcesUtils.getResourceTree(constants.RESOURCE_IN_PROP_TYPES_TYPE, startKey);
}

export function getSettingsTree (startKey = null) {
  return projectResourcesUtils.getResourceTree(constants.RESOURCE_IN_SETTINGS_TYPE, startKey);
}

export function getClipboardTree (startKey = null) {
  return projectResourcesUtils.getResourceTreeOrderedByKey(constants.RESOURCE_IN_CLIPBOARD_TYPE, startKey, 'desc');
}

export function getClipboardItemsCount() {
  return projectResourcesUtils.getResourceTreeItemCount(constants.RESOURCE_IN_CLIPBOARD_TYPE);
}

export function getAllPagesList() {
  return projectResourcesUtils.getAllPagesList();
}

export function getApplicationSettings() {
  return projectResourcesUtils.getApplicationSettings();
}

export function findResourcesKeysByText(text) {
  return projectResourcesUtils.findResourcesKeysByText(text);
}

export function getProjectReadmeContent() {
  const projectReadmeResource = projectResourcesUtils.getResource('usr.README.readme');
  return projectReadmeResource.markdownContent;
}

export function pushUpdateToResourceHistory(resource, fileObject) {
  if (!resourcesUpdateHistory) {
    resourcesUpdateHistory = {};
  }
  resourcesUpdateHistory[resource.key] = resourcesUpdateHistory[resource.key] || [];
  resourcesUpdateHistory[resource.key].push(fileObject);
  return getResourcesUpdateHistory();
}

export function getResourcesUpdateHistory() {
  const portableResourcesUpdateHistory = {};
  forOwn(resourcesUpdateHistory, (value, key) => {
    portableResourcesUpdateHistory[key] = value ? value.map(i => i.filePath) : [];
  });
  return portableResourcesUpdateHistory;
}

export function popUpdateFromResourceHistory(resource) {
  let fileObject = null;
  if (resourcesUpdateHistory) {
    const resourceHistory = resourcesUpdateHistory[resource.key];
    if (resourceHistory && resourceHistory.length > 0) {
      fileObject = resourceHistory.pop();
    }
  }
  return fileObject;
}

export function getComponentsGraphModel() {
  return userComponentsGraphModel;
}

export function getFlowsGraphModel() {
  return flowsGraphModel;
}

export function getPagesGraphModel () {
  return pagesGraphModel;
}

export function getFunctionsGraphModel() {
  return userFunctionsGraphModel;
}

export function getPropTypesGraphModel () {
  return userPropTypesGraphModel;
}

export function getMarkdownGraphModel () {
  return markdownGraphModel;
}

export function getClipboardGraphModel () {
  return clipboardGraphModel;
}

export function getSettingsConfGraphModel () {
  return settingsConfGraphModel;
}

export function getClipboardItemList () {
  const resultList = [];
  const rootKey = clipboardGraphModel.getRootKey();
  let childrenKeyList = clipboardGraphModel.getChildrenKeys(rootKey);
  if (childrenKeyList && childrenKeyList.length > 0) {
    childrenKeyList = orderBy(childrenKeyList, String, ['desc']);
    childrenKeyList.forEach(childKey => {
      resultList.push(new ResourceAdapter.Builder()
        .byKeyInGraphs(
          childKey,
          projectResourcesUtils.getGraphByResourceType,
          constants.RESOURCE_IN_CLIPBOARD_TYPE
        )
        .build()
      );
    });
  }
  return resultList;
}

export function addItemToClipboard (newItem) {
  clipboardGraphModel.addChildNodeToRoot(projectResourcesUtils.createClipboardModel(newItem));
  const rootKey = clipboardGraphModel.getRootKey();
  let childrenKeyList = clipboardGraphModel.getChildrenKeys(rootKey);
  if (childrenKeyList && childrenKeyList.length > CLIPBOARD_ITEM_LIST_SIZE_LIMIT) {
    childrenKeyList = orderBy(childrenKeyList, String, ['desc']);
    for (let i = 5; i < childrenKeyList.length; i++) {
      clipboardGraphModel.deleteNode(childrenKeyList[i]);
    }
  }
}

export function clearClipboard () {
  const rootKey = clipboardGraphModel.getRootKey();
  let childrenKeyList = clipboardGraphModel.getChildrenKeys(rootKey);
  if (childrenKeyList && childrenKeyList.length > 0) {
    for (let i = 5; i < childrenKeyList.length; i++) {
      clipboardGraphModel.deleteNode(childrenKeyList[i]);
    }
  }
}
