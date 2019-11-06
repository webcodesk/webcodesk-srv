import * as config from '../config/config';
import path from 'path-browserify';
import * as pageComposerFactory from '../pageComposer/pageComposerFactory';
import * as flowComposerFactory from '../flowComposer/flowComposerFactory';
import * as projectResourcesManager from './projectResourcesManager';
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
export function createFileObjectWithNewData (resource, data) {
  let fileObject = {};
  if (resource.isPage) {
    const { componentsTree: dataComponentsTree, metaData } = data;
    const parentKeys = resource.allParentKeys;
    if (parentKeys && parentKeys.length > 1) {
      const pageFileResource = projectResourcesManager.getResourceByKey(parentKeys[0]);
      fileObject.filePath = pageFileResource.absolutePath;
      fileObject.fileData = JSON.stringify({
        pageName: resource.pageName,
        pagePath: resource.pagePath,
        metaData,
        componentsTree: dataComponentsTree
      });
    }
  } else if (resource.isTemplate) {
    const { componentsTree: dataComponentsTree } = data;
    const parentKeys = resource.allParentKeys;
    if (parentKeys && parentKeys.length > 1) {
      const pageFileResource = projectResourcesManager.getResourceByKey(parentKeys[0]);
      fileObject.filePath = pageFileResource.absolutePath;
      fileObject.fileData = JSON.stringify({
        templateName: resource.templateName,
        componentsTree: dataComponentsTree
      });
    }
  } else if (resource.isFlow) {
    const { flowTree } = data;
    const parentResource = projectResourcesManager.getResourceByKey(resource.parentKey);
    fileObject.filePath = parentResource.absolutePath;
    fileObject.fileData = JSON.stringify({
      flowName: resource.displayName,
      model: flowTree,
    });
  }
  return fileObject;
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
