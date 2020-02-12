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

import * as fileUtils from '../utils/fileUtils';
import * as parserManager from '../parser/parserManager';
import * as config from '../config/config';
import * as projectResourcesManager from './projectResourcesManager';
import * as projectGenerator from './projectGenerator';
import { invokeServer, sendAppWidowMessage } from '../utils/serverUtils';
import constants  from '../../../commons/constants';
import appWindowMessages from '../../../commons/appWindowMessages';
import { getConsoleErrors } from '../../core/config/storage';
import { repairPath } from '../utils/fileUtils';

export async function testProjectConfiguration () {
   return config.checkProjectPaths();
}

export async function initProjectConfiguration () {
  return config.initProjectPaths();
}

export function getProjectSettings () {
  return config.projectSettings;
}

export async function mergeProjectSettings (newSettings) {
  await config.mergeProjectSettings(newSettings);
  return config.projectSettings;
}

export function restartProjectServer () {
  invokeServer('restartProjectServer')
    .catch(err => {
      console.error(`Error restarting the project server. `, err);
    });
}

export function stopProjectServer() {
  invokeServer('stopProjectServer')
    .catch(err => {
      console.error(`Error stopping the project server. `, err);
    });
}

export function getProjectServerStatus () {
  sendAppWidowMessage(appWindowMessages.PROJECT_SERVER_STATUS_REQUEST);
}

export function getProjectServerLog () {
  sendAppWidowMessage(appWindowMessages.PROJECT_SERVER_LOG_REQUEST);
}

export function openUrlInExternalBrowser (url) {
  window.open(url, '__blank').focus();
}

export async function getSyslog () {
  return getConsoleErrors();
}

export async function watchUsrSourceDir () {
  // Make resources trees by declarations in files
  // Init new resources graphs
  projectResourcesManager.initNewResourcesTrees();
  // generate all default files if they are missing
  await projectGenerator.generateDefaultFiles();
  // read the entire usr directory after a while
  await readResource(config.usrSourceDir);
  // read the entire etc directory after a while
  await readResource(config.etcSourceDir);
  //
  if (config.wcdAppMode === constants.APP_MODE_DEMO) {
    await parserManager.parseResourceAndWrite(config.usrSourceDir);
    await parserManager.readDirAndWrite(config.etcSourceDir);
  }
}

export async function readResource (resourcePath) {
  const validResourcePath = repairPath(resourcePath);
  const declarationsInFiles = await parserManager.parseResource(validResourcePath);
  if (declarationsInFiles && declarationsInFiles.length > 0) {
    // Update resources in the graphs for updated files
    const { updatedResources, deletedResources, doUpdateAll } =
      projectResourcesManager.updateResources(declarationsInFiles);
    // try to generate all needed files
    await projectGenerator.generateFiles();
    // tell there are updated resources
    return { updatedResources, deletedResources, doUpdateAll };
  }
  // tell there are no updated resources
  return {};
}

export async function removeResource (resourcePath) {
  const validResourcePath = repairPath(resourcePath);
  // to remove all resources just create empty declarations and pass them to update the resource trees
  const emptyDeclarationsInFiles = parserManager.createEmptyResource(validResourcePath);
  // Update resource in the graphs
  const { updatedResources, deletedResources, doUpdateAll } =
    projectResourcesManager.updateResources(emptyDeclarationsInFiles, () => {
      return false;
    });
  // try to generate all needed files
  await projectGenerator.generateFiles();
  return { updatedResources, deletedResources, doUpdateAll };

}

export async function updateResource (resourcePath, resourceFileData) {
  // optimistic update of the declarations in files
  const validResourcePath = repairPath(resourcePath);
  const declarationsInFiles = await parserManager.parseResource(validResourcePath, resourceFileData);
  if (declarationsInFiles && declarationsInFiles.length > 0) {
    // Update resource in the graphs
    const { updatedResources, deletedResources, doUpdateAll } =
      projectResourcesManager.updateResources(declarationsInFiles);
    // try to generate all needed files
    await projectGenerator.generateFiles();
    return { updatedResources, deletedResources, doUpdateAll };
  }
  return {};
}

export async function updateMultipleResources (fileObjects) {
  if (fileObjects && fileObjects.length > 0) {
    // optimistic update of the declarations in files
    const declarationsInFiles = await parserManager.parseMultipleResources(fileObjects);
    if (declarationsInFiles && declarationsInFiles.length > 0) {
      // Update resource in the graphs
      const { updatedResources, deletedResources, doUpdateAll } =
        projectResourcesManager.updateResources(declarationsInFiles);
      // try to generate all needed files
      await projectGenerator.generateFiles();
      return { updatedResources, deletedResources, doUpdateAll };
    }
  }
  return {};
}

export async function checkResourceExists (resourcePath) {
  const validResourcePath = repairPath(resourcePath);
  try {
    await fileUtils.isExisting(validResourcePath);
    return true;
  } catch (e) {
    return false;
  }
}

export async function writeEtcFile (filePath, fileData) {
  const validResourcePath = repairPath(filePath);
  if (validResourcePath.indexOf(config.etcPagesSourceDir) === 0
    || validResourcePath.indexOf(config.etcFlowsSourceDir) === 0
    || validResourcePath.indexOf(config.etcTemplatesSourceDir) === 0
    || validResourcePath.indexOf(config.etcSettingsSourceDir) === 0
    || validResourcePath.indexOf(config.etcStateSourceDir) === 0) {
    await fileUtils.ensureFilePath(validResourcePath);
    await fileUtils.writeFile(validResourcePath, fileData);
  } else {
    throw Error(`It is not allowed to write files out of ${config.etcSourceDir} directory.`);
  }
}

export async function deleteEtcFile (filePath) {
  const validResourcePath = repairPath(filePath);
  if (validResourcePath.indexOf(config.etcPagesSourceDir) === 0) {
    await fileUtils.removeFileAndEmptyDir(validResourcePath, config.etcPagesSourceDir);
  } else if (validResourcePath.indexOf(config.etcFlowsSourceDir) === 0) {
    await fileUtils.removeFileAndEmptyDir(validResourcePath, config.etcFlowsSourceDir);
  } else if (validResourcePath.indexOf(config.etcTemplatesSourceDir) === 0) {
    await fileUtils.removeFileAndEmptyDir(validResourcePath, config.etcTemplatesSourceDir);
  } else if (validResourcePath.indexOf(config.etcSettingsSourceDir) === 0) {
    await fileUtils.removeFileAndEmptyDir(validResourcePath, config.etcSettingsSourceDir);
  } else {
    throw Error(`It is not allowed to delete files out of ${config.etcSourceDir} directory.`);
  }
}

export async function writeSourceFile(filePath, fileData) {
  const validResourcePath = repairPath(filePath);
  if (validResourcePath.indexOf(config.usrSourceDir) === 0) {
    await fileUtils.ensureFilePath(validResourcePath);
    await fileUtils.writeFile(validResourcePath, fileData);
  } else {
    throw Error(`It is not allowed to write files out of ${config.usrSourceDir} directory.`);
  }
}
