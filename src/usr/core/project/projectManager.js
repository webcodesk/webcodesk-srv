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

// import debounce from 'lodash/debounce';
import * as fileUtils from '../utils/fileUtils';
import * as parserManager from '../parser/parserManager';
import * as config from '../config/config';
import * as projectResourcesManager from './projectResourcesManager';
import { invokeServer, sendAppWidowMessage } from '../utils/serverUtils';
import * as indicesGeneratorManager from '../generator/indicesGeneratorManager';
import * as schemaIndexGeneratorManager from '../generator/schemaIndexGeneratorManager';
import * as pagesGeneratorManager from '../generator/pagesGeneratorManager';
import * as flowsGeneratorManager from '../generator/flowsGeneratorManager';
import appWindowMessages from '../../../commons/appWindowMessages';
import constants from '../../../commons/constants';
import { getConsoleErrors } from '../../core/config/storage';
import { repairPath } from '../utils/fileUtils';

async function generateSchema () {
  // generate schema index just for the sake it is missing
  await schemaIndexGeneratorManager.generateSchemaIndex(config.appSchemaSourceDir);

  // omit root keys
  const pagesStarterKey =
    config.etcPagesSourceDir.replace(`${config.projectRootSourceDir}${constants.FILE_SEPARATOR}`, '');
  const pages = projectResourcesManager.getPagesTree(pagesStarterKey);
  // if we want to write pages files we have to write them into schema dir
  // but before we need to get rid of the etc dir in the import paths of the page resources
  const replacePagesDirName =
    `${constants.DIR_NAME_ETC}${constants.FILE_SEPARATOR}${constants.DIR_NAME_PAGES}`;
  // write pages files
  await pagesGeneratorManager.generateFiles(pages, config.appSchemaPagesSourceDir, replacePagesDirName);
  // write routes file
  await pagesGeneratorManager.generateRoutesFile(pages, config.appSchemaRouterFile);

  // omit root keys
  const flowsStarterKey =
    config.etcFlowsSourceDir.replace(`${config.projectRootSourceDir}${constants.FILE_SEPARATOR}`, '');
  const flows = projectResourcesManager.getFlowsTree(flowsStarterKey);
  // if we want to write flows files we have to write them into schema dir
  // but before we need to get rid of the etc dir in the import paths of the flow resources
  const replaceFlowsDirName =
    `${constants.DIR_NAME_ETC}${constants.FILE_SEPARATOR}${constants.DIR_NAME_FLOWS}`;
  // write flows files
  await flowsGeneratorManager.generateFiles(flows, config.appSchemaFlowsSourceDir, replaceFlowsDirName);

}

export async function generateIndices () {
  // Obtain model trees from the graphs
  const userFunctions = projectResourcesManager.getUserFunctionsTree();
  const userComponents = projectResourcesManager.getUserComponentsTree();
  // Regenerate index files by the trees
  const resourceTrees = [
    {
      tree: userFunctions,
      indexDirName: constants.INDEX_USER_FUNCTIONS_ROOT_DIR_NAME,
    },
    {
      tree: userComponents,
      indexDirName: constants.INDEX_COMPONENTS_ROOT_DIR_NAME,
    },
  ];
  await indicesGeneratorManager.generateFiles(resourceTrees, config.appIndicesSourceDir);
}

// let generatingFilesRunCount = 0;

// const debounceGeneratingFiles = debounce(async () => {
//   try {
//     await generateFiles();
//   } catch (e) {
//     console.error(e);
//   }
// }, 600);

async function generateFiles () {
  // generatingFilesRunCount += 1;
  await generateIndices();
  await generateSchema();
  // generatingFilesRunCount -= 1;
}

// const waitForFilesGenerating = timeout => new Promise((r, j)=>{
//   const check = () => {
//     if(generatingFilesRunCount <= 0) {
//       generatingFilesRunCount = 0; // for the sake of negative numbers :-)
//       r();
//     } else if((timeout -= 200) < 0) {
//       j('timed out!');
//     } else {
//       setTimeout(check, 200)
//     }
//   };
//   setTimeout(check, 10)
// });

// async function waitFor (delay = 5000) {
//   return new Promise(resolve => {
//     setTimeout(async () => {
//       resolve();
//     }, delay);
//   });
// }

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
  invokeServer('restartProjectServer');
}

export function stopProjectServer() {
  invokeServer('stopProjectServer');
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
  // read the entire usr directory after a while
  await readResource(config.usrSourceDir);
  // read the entire etc directory after a while
  await readResource(config.etcPagesSourceDir);
  await readResource(config.etcFlowsSourceDir);
  await readResource(config.etcTemplatesSourceDir);
}

export async function readResource (resourcePath) {
  const validResourcePath = repairPath(resourcePath);
  const declarationsInFiles = await parserManager.parseResource(validResourcePath);
  // const updatedDeclarationsInFiles = projectFilesManager.updateDeclarationsInFiles(declarationsInFiles);
  if (declarationsInFiles && declarationsInFiles.length > 0) {
    // Update resources in the graphs for updated files
    const { updatedResources, deletedResources, doUpdateAll } =
      projectResourcesManager.updateResources(declarationsInFiles);
    // try to generate all needed files
    // debounceGeneratingFiles();
    // try {
    //   await waitForFilesGenerating(6000);
    // } catch (e) {
    //   console.error('Timeout occurs in files generating process.');
    // }
    await generateFiles();
    // tell there are updated resources
    return { updatedResources, deletedResources, doUpdateAll };
  }
  // tell there are no updated resources
  return {};
}

export async function removeResource (resourcePath) {
  const validResourcePath = repairPath(resourcePath);
  // const declarationsInFilesToRemove = projectFilesManager.getAllDeclarationsInFile(validResourcePath);
  // to remove all resources just create empty declarations and pass them to update the resource trees
  const emptyDeclarationsInFiles = parserManager.createEmptyResource(validResourcePath);
  // declarationsInFilesToRemove.forEach(declarationsInFile => {
  //   emptyDeclarationsInFiles.push(declarationsInFile.cloneWithEmptyDeclarations());
  // });
  // Update resource in the graphs
  const { updatedResources, deletedResources, doUpdateAll } =
    projectResourcesManager.updateResources(emptyDeclarationsInFiles, () => {
      return false;
    });
  //
  // projectFilesManager.removeDeclarationsInFile(validResourcePath);
  // try to generate all needed files
  // debounceGeneratingFiles();
  // try {
  //   await waitForFilesGenerating(6000);
  // } catch (e) {
  //   console.error('Timeout occurs in files generating process.');
  // }
  await generateFiles();
  return { updatedResources, deletedResources, doUpdateAll };

}

export async function updateResource (resourcePath, resourceFileData) {
  // optimistic update of the declarations in files
  const validResourcePath = repairPath(resourcePath);
  const declarationsInFiles = await parserManager.parseResource(validResourcePath, resourceFileData);
  // provide the declaration update in declaration cache will cause not to update
  // the resource when its file will be changed
  // so, the optimistic update will eliminate cycling updates
  // const updatedDeclarationsInFiles = projectFilesManager.updateDeclarationsInFiles(declarationsInFiles);
  if (declarationsInFiles && declarationsInFiles.length > 0) {
    // Update resource in the graphs
    const { updatedResources, deletedResources, doUpdateAll } =
      projectResourcesManager.updateResources(declarationsInFiles);
    // try to generate all needed files
    // debounceGeneratingFiles();
    // try {
    //   await waitForFilesGenerating(6000);
    // } catch (e) {
    //   console.error('Timeout occurs in files generating process.');
    // }
    await generateFiles();
    return { updatedResources, deletedResources, doUpdateAll };
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
    || validResourcePath.indexOf(config.etcTemplatesSourceDir) === 0) {
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
