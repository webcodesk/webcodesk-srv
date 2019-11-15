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
export let etcSettingsSourceDir;

export let appSchemaSourceDir;
export let appSchemaPagesFile;
export let appSchemaFlowsFile;
export let appSchemaRouterFile;

export let appIndicesProdSourceDir;
export let appSchemaProdSourceDir;
export let appSchemaProdPagesFile;
export let appSchemaProdFlowsFile;
export let appSchemaProdRouterFile;

export let appSettingsFile;

export let reactScriptsStartPath;

export let packageDownloadDirPath;

export let projectSettings;

export const getCurrentDirPath = () => {
  return invokeServer('getProjectDirPath')
    .catch(err => {
      console.error(`Error getting current dir path. `, err);
    });
};

export const checkProjectPaths = async () => {
  let validPaths = null;
  try {
    validPaths = await invokeServer('checkProjectPaths');
  } catch (e) {
    console.error(`Error check project paths. `, e);
  }
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

  etcSourceDir = validPaths.testEtcSourceDir;

  etcPagesSourceDir = validPaths.testEtcPagesSourceDir;
  etcFlowsSourceDir = validPaths.testEtcFlowsSourceDir;
  etcTemplatesSourceDir = validPaths.testEtcTemplatesSourceDir;
  etcSettingsSourceDir = validPaths.testEtcSettingsSourceDir;

  projectTSConfigFile = validPaths.testProjectTSConfigFile;
  projectYarnLockFile = validPaths.testProjectYarnLockFile;

  appSchemaSourceDir = repairPath(path.join(validPaths.testAppSourceDir, constants.DIR_NAME_SCHEMA));
  appSchemaFlowsFile = repairPath(path.join(appSchemaSourceDir, `${constants.FILE_NAME_FLOWS}.js`));
  appSchemaPagesFile = repairPath(path.join(appSchemaSourceDir, `${constants.FILE_NAME_PAGES}.js`));
  appSchemaRouterFile = repairPath(path.join(appSchemaSourceDir, `${constants.FILE_NAME_ROUTER}.js`));

  appSchemaProdSourceDir = repairPath(path.join(validPaths.testAppSourceDir, constants.DIR_NAME_SCHEMA_PROD));
  appSchemaProdFlowsFile = repairPath(path.join(appSchemaProdSourceDir, `${constants.FILE_NAME_FLOWS}.js`));
  appSchemaProdPagesFile = repairPath(path.join(appSchemaProdSourceDir, `${constants.FILE_NAME_PAGES}.js`));
  appSchemaProdRouterFile = repairPath(path.join(appSchemaProdSourceDir, `${constants.FILE_NAME_ROUTER}.js`));

  appIndicesSourceDir = repairPath(path.join(validPaths.testAppSourceDir, constants.DIR_NAME_INDICES));
  appIndicesProdSourceDir = repairPath(path.join(validPaths.testAppSourceDir, constants.DIR_NAME_INDICES_PROD));

  appSettingsFile = repairPath(path.join(appSourceDir, `${constants.FILE_NAME_SETTINGS}.js`));

  packageDownloadDirPath = repairPath(path.join(projectDirPath, constants.DIR_NAME_DOWNLOAD));

  reactScriptsStartPath = validPaths.startScriptPath;

  projectSettings = validPaths.projectSettings;

  packageConfig = validPaths.packageConfig;

  projectName = validPaths.projectName;

};

export const mergeProjectSettings = async (newSettings) => {
  const newProjectSettings = {...projectSettings, ...newSettings};
  try {
    await invokeServer('saveProjectSettings', newProjectSettings);
  } catch (e) {
    console.error(`Error saving project settings. `, e);
  }
  projectSettings = newProjectSettings;
};
