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

import * as schemaIndexGeneratorManager from './generator/schemaIndexGeneratorManager';
import * as config from '../config/config';
import constants from '../../../commons/constants';
import * as projectResourcesManager from './projectResourcesManager';
import * as pagesGeneratorManager from './generator/pagesGeneratorManager';
import * as flowsGeneratorManager from './generator/flowsGeneratorManager';
import * as indicesGeneratorManager from './generator/indicesGeneratorManager';

async function generateSchema () {
  // generate schema index just for the sake it is missing
  await schemaIndexGeneratorManager.generateSchemaIndex(config.appSchemaSourceDir); // development
  await schemaIndexGeneratorManager.generateSchemaIndex(config.appSchemaProdSourceDir); // production

  // omit root keys
  const pagesStarterKey =
    config.etcPagesSourceDir.replace(`${config.projectRootSourceDir}${constants.FILE_SEPARATOR}`, '');
  // if we want to write pages files we have to write them into schema dir
  // but before we need to get rid of the etc dir in the import paths of the page resources
  const replacePagesDirName =
    `${constants.DIR_NAME_ETC}${constants.FILE_SEPARATOR}${constants.DIR_NAME_PAGES}`;

  /**
   * Development pages
   */
    // retrieve the pages models tree
  const pagesDev = projectResourcesManager.getPagesTree(pagesStarterKey);
  // write pages files
  await pagesGeneratorManager.generateFiles(pagesDev, config.appSchemaPagesFile, replacePagesDirName);
  // write routes file
  await pagesGeneratorManager.generateRoutesFile(pagesDev, config.appSchemaRouterFile);
  /**
   * Production pages
   */
    // retrieve the pages models tree
  const pagesProd = projectResourcesManager.getPagesTreeProd(pagesStarterKey);
  // write pages files
  await pagesGeneratorManager.generateFiles(pagesProd, config.appSchemaProdPagesFile, replacePagesDirName);
  // write routes file
  await pagesGeneratorManager.generateRoutesFile(pagesProd, config.appSchemaProdRouterFile);

  // omit root keys
  const flowsStarterKey =
    config.etcFlowsSourceDir.replace(`${config.projectRootSourceDir}${constants.FILE_SEPARATOR}`, '');
  // if we want to write flows files we have to write them into schema dir
  // but before we need to get rid of the etc dir in the import paths of the flow resources
  const replaceFlowsDirName =
    `${constants.DIR_NAME_ETC}${constants.FILE_SEPARATOR}${constants.DIR_NAME_FLOWS}`;

  /**
   * Development flows
   */
  const flowsDev = projectResourcesManager.getFlowsTree(flowsStarterKey);
  // write flows files
  await flowsGeneratorManager.generateFiles(flowsDev, config.appSchemaFlowsFile, replaceFlowsDirName);
  /**
   * Production flows
   */
  const flowsProd = projectResourcesManager.getFlowsTreeProd(flowsStarterKey);
  // write flows files
  await flowsGeneratorManager.generateFiles(flowsProd, config.appSchemaProdFlowsFile, replaceFlowsDirName);

}

export async function generateIndices () {
  /**
   * Development
   */
  // Obtain model trees from the graphs
  const userFunctions = projectResourcesManager.getUserFunctionsTree();
  const userComponents = projectResourcesManager.getUserComponentsTree();
  // Regenerate index files by the trees
  const resourceTrees = [
    {
      tree: userFunctions,
      indexDirName: constants.INDEX_USER_FUNCTIONS_ROOT_FILE_NAME,
    },
    {
      tree: userComponents,
      indexDirName: constants.INDEX_COMPONENTS_ROOT_FILE_NAME,
    },
  ];
  await indicesGeneratorManager.generateFiles(resourceTrees, config.appIndicesSourceDir);

  /**
   * Production
   */
  // Obtain model trees from the graphs
  const userFunctionsProd = projectResourcesManager.getUserFunctionsTreeProd();
  const userComponentsProd = projectResourcesManager.getUserComponentsTreeProd();
  // Regenerate index files by the trees
  const resourceTreesProd = [
    {
      tree: userFunctionsProd,
      indexDirName: constants.INDEX_USER_FUNCTIONS_ROOT_FILE_NAME,
    },
    {
      tree: userComponentsProd,
      indexDirName: constants.INDEX_COMPONENTS_ROOT_FILE_NAME,
    },
  ];
  await indicesGeneratorManager.generateFiles(resourceTreesProd, config.appIndicesProdSourceDir);
}

export async function generateFiles () {
  // generatingFilesRunCount += 1;
  await generateIndices();
  await generateSchema();
  // generatingFilesRunCount -= 1;
}
