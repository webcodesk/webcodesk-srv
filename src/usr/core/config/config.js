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
import { repairPath } from '../utils/fileUtils';
import constants from '../../../commons/constants';
import { invokeServer } from '../utils/serverUtils';

export let projectDirPath;
/**
 * Project src directory
 */
export let packageConfig;

export let projectName;
export let projectRootSourceDir;
export let projectTSConfigFile;
export let projectYarnLockFile;
export let projectPublicDir;
export let usrSourceDir;
export let appSourceDir;
export let appIndicesSourceDir;
export let etcSourceDir;
export let etcPagesSourceDir;
export let etcFlowsSourceDir;
export let etcTemplatesSourceDir;

export let appSchemaSourceDir;
export let appSchemaPagesSourceDir;
export let appSchemaFlowsSourceDir;
export let appSchemaRouterFile;
export let appSchemaInitialStateFile;

export let reactScriptsStartPath;

export let packageDownloadDirPath;

export let projectSettings;

export const getCurrentDirPath = () => {
  return invokeServer('getProjectDirPath');
};

export const checkProjectPaths = async () => {
  const validPaths = await invokeServer('checkProjectPaths');
  if (!validPaths) {
    throw Error('Wrong project file structure');
  }
  return validPaths;
};

export const initProjectPaths = async () => {

  const validPaths = await checkProjectPaths();

  projectDirPath = validPaths.testProjectDirPath;
  projectPublicDir = validPaths.testProjectPublicDir;
  projectRootSourceDir = validPaths.testProjectRootSourceDir;
  usrSourceDir = validPaths.testUsrSourceDir;
  appSourceDir = validPaths.testAppSourceDir;
  appIndicesSourceDir = validPaths.testAppIndicesSourceDir;
  etcPagesSourceDir = validPaths.testEtcPagesSourceDir;
  etcFlowsSourceDir = validPaths.testEtcFlowsSourceDir;
  etcTemplatesSourceDir = validPaths.testEtcTemplatesSourceDir;

  projectTSConfigFile = validPaths.testProjectTSConfigFile;
  projectYarnLockFile = validPaths.testProjectYarnLockFile;

  etcSourceDir = repairPath(path.join(projectRootSourceDir, constants.DIR_NAME_ETC));

  appSchemaSourceDir = repairPath(path.join(validPaths.testAppSourceDir, constants.DIR_NAME_SCHEMA));
  appSchemaFlowsSourceDir = repairPath(path.join(appSchemaSourceDir, constants.DIR_NAME_FLOWS));
  appSchemaPagesSourceDir = repairPath(path.join(appSchemaSourceDir, constants.DIR_NAME_PAGES));
  appSchemaRouterFile = repairPath(path.join(appSchemaSourceDir, `${constants.FILE_NAME_ROUTER}.js`));
  appSchemaInitialStateFile = repairPath(path.join(appSchemaSourceDir, `${constants.FILE_NAME_INITIAL_STATE}.js`));

  packageDownloadDirPath = repairPath(path.join(projectDirPath, constants.DIR_NAME_DOWNLOAD));

  reactScriptsStartPath = validPaths.startScriptPath;

  projectSettings = validPaths.projectSettings;

  packageConfig = validPaths.packageConfig;

  projectName = validPaths.projectName;

};

export const mergeProjectSettings = async (newSettings) => {
  const newProjectSettings = {...projectSettings, ...newSettings};
  await invokeServer('saveProjectSettings', newProjectSettings);
  projectSettings = newProjectSettings;
};
