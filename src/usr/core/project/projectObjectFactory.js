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

import * as projectResourcesManager from './projectResourcesManager';
import constants from '../../../commons/constants';

export function createResourcesTreeViewObject() {
  // Obtain model trees from the graphs
  // UserFunctions tree starts from "usr" directory we may omit that key on the tree view
  const userFunctionsRoot = projectResourcesManager.getResourceByKey(constants.GRAPH_MODEL_USER_FUNCTIONS_ROOT_KEY);

  const userFunctions = {...userFunctionsRoot.model};
  const userFunctionsBranch = projectResourcesManager.getUserFunctionsNavigationTree(constants.GRAPH_MODEL_DIR_USR_KEY);
  if (userFunctionsBranch && userFunctionsBranch.children) {
    userFunctions.children = userFunctionsBranch.children;
  }
  // UserComponents tree starts from "usr" directory we may omit that key on the tree view
  const userComponentsRoot = projectResourcesManager.getResourceByKey(constants.GRAPH_MODEL_COMPONENTS_ROOT_KEY);
  const userComponents = {...userComponentsRoot.model};
  const userComponentsBranch = projectResourcesManager.getUserComponentsNavigationTree(constants.GRAPH_MODEL_DIR_USR_KEY);
  if (userComponentsBranch && userComponentsBranch.children) {
    userComponents.children = userComponentsBranch.children;
  }
  // Pages tree starts from "etc/pages" directory we may omit that key on the tree view
  const pagesRoot = projectResourcesManager.getResourceByKey(constants.GRAPH_MODEL_PAGES_ROOT_KEY);
  const pages = {...pagesRoot.model};
  const pagesBranch = projectResourcesManager.getPagesNavigationTree(constants.GRAPH_MODEL_DIR_ETC_PAGES_KEY);
  if (pagesBranch && pagesBranch.children) {
    pages.children = pagesBranch.children;
  }
  // Templates tree starts from "etc/templates" directory we may omit that key on the tree view
  const templatesRoot = projectResourcesManager.getResourceByKey(constants.GRAPH_MODEL_TEMPLATES_ROOT_KEY);
  const templates = {...templatesRoot.model};
  const templatesBranch = projectResourcesManager.getTemplatesNavigationTree(constants.GRAPH_MODEL_DIR_ETC_TEMPLATES_KEY);
  if (templatesBranch && templatesBranch.children) {
    templates.children = templatesBranch.children;
  }
  // Flows tree starts from "etc/flows" directory
  const flowsRoot = projectResourcesManager.getResourceByKey(constants.GRAPH_MODEL_FLOWS_ROOT_KEY);
  const flows = {...flowsRoot.model};
  const flowsBranch = projectResourcesManager.getFlowsNavigationTree(constants.GRAPH_MODEL_DIR_ETC_FLOWS_KEY);
  if (flowsBranch && flowsBranch.children) {
    flows.children = flowsBranch.children;
  }

  // Clipboard tree
  const clipboardItems = projectResourcesManager.getClipboardTree();

  return {
    flows,
    flowsCount: projectResourcesManager.getFlowsCount(),
    pages,
    pagesCount: projectResourcesManager.getPagesCount(),
    userComponents,
    userComponentsCount: projectResourcesManager.getUserComponentsCount(),
    userFunctions,
    userFunctionsCount: projectResourcesManager.getUserFunctionsCount(),
    clipboardItems,
    clipboardItemsCount: projectResourcesManager.getClipboardItemsCount(),
    templates,
    templatesCount: projectResourcesManager.getTemplatesCount(),
  }
}

export function createResourceEditorTabObject(resourceKey) {
  const resource = projectResourcesManager.getResourceByKey(resourceKey);
  if (resource && !resource.isEmpty) {
    if (resource.isComponent || resource.isPage || resource.isFlow || resource.isFunctions || resource.isTemplate) {
      return resource;
    } else if (resource.isComponentInstance || resource.isFlowComponentInstance) {
      const componentResource = projectResourcesManager.getResourceByKey(resource.componentName);
      if (componentResource && componentResource.isComponent) {
        return componentResource;
      }
    } else if (resource.isUserFunction) {
      const functionsResource = projectResourcesManager.getResourceByKey(resource.parentKey);
      if (functionsResource && functionsResource.isFunctions) {
        return functionsResource;
      }
    } else if (resource.isFlowUserFunction) {
      const userFunctionResource = projectResourcesManager.getResourceByKey(resource.functionName);
      if (userFunctionResource && userFunctionResource.isUserFunction) {
        const functionsResource = projectResourcesManager.getResourceByKey(userFunctionResource.parentKey);
        if (functionsResource && functionsResource.isFunctions) {
          return functionsResource;
        }
      }
    }
  }
  return null;
}

export function createResourceEditorLivePreviewTabObject() {
  return {
    key: constants.RESOURCE_LIVE_PREVIEW_KEY,
    type: constants.RESOURCE_EDITOR_TAB_LIVE_PREVIEW_TYPE,
    title: 'Live Preview',
    pages: projectResourcesManager.getAllPagesList(),
    settings: projectResourcesManager.getApplicationSettings(),
  };
}

export function createProjectReadmePreviewTabObject() {
  return {
    key: constants.RESOURCE_README_PREVIEW_KEY,
    type: constants.RESOURCE_EDITOR_TAB_README_PREVIEW_TYPE,
    title: 'Project Readme',
    markdownContent: projectResourcesManager.getProjectReadmeContent(),
  }
}

export function createResourceEditorDraggedObject(resourceKey) {
  return projectResourcesManager.getResourceByKey(resourceKey);
}
