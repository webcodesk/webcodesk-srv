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

import get from 'lodash/get';
import path from 'path-browserify';
import { repairPath } from '../utils/fileUtils';
import constants from '../../../commons/constants';
import { invokeServer } from '../utils/serverUtils';

export let projectDirPath;
/**
 * Project src directory
 */
export let packageConfig;
export let wcdAppMode;

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
export let etcSettingsFile;
export let etcStateSourceDir;
export let etcStateFile;

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
  etcStateSourceDir = validPaths.testEtcStateSourceDir;

  etcSettingsFile = repairPath(path.join(etcSettingsSourceDir, `${constants.FILE_NAME_SETTINGS_ETC}.json`));
  etcStateFile = repairPath(path.join(etcStateSourceDir, `${constants.FILE_NAME_STATE_ETC}.json`));

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
  wcdAppMode = get(packageConfig, 'wcd.appMode', constants.APP_MODE_RELEASE);

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
