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

import * as schemaIndexGeneratorManager from './generator/schemaIndexGeneratorManager';
import * as config from '../config/config';
import constants from '../../../commons/constants';
import * as projectResourcesManager from './projectResourcesManager';
import * as pagesGeneratorManager from './generator/pagesGeneratorManager';
import * as flowsGeneratorManager from './generator/flowsGeneratorManager';
import * as indicesGeneratorManager from './generator/indicesGeneratorManager';
import * as settingsGeneratorManager from './generator/settingsGeneratorManager';

async function generateSchema () {
  // generate schema index just for the sake it is missing
  await schemaIndexGeneratorManager.generateSchemaIndex(config.appSchemaSourceDir, config.wcdAppMode); // development
  await schemaIndexGeneratorManager.generateSchemaIndex(config.appSchemaProdSourceDir, config.wcdAppMode); // production

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

  /**
   * Settings
   */
    // omit root keys
  const settingsStarterKey =
      config.etcSettingsSourceDir.replace(`${config.projectRootSourceDir}${constants.FILE_SEPARATOR}`, '');
  const settings = projectResourcesManager.getSettingsTree(settingsStarterKey);
  await settingsGeneratorManager.generateFiles(settings, config.appSettingsFile);

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

export async function generateDefaultFiles () {
  await settingsGeneratorManager.generateInitialSettingsEtc(config.etcSettingsFile);
  await settingsGeneratorManager.generateInitialStateEtc(config.etcStateFile);
}
