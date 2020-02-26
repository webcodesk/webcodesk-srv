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

import path from 'path';
import { isExisting, readJson, repairPath, writeJson } from './fileUtils';
import constants from '../commons/constants';

let serverDirPath = undefined;
let projectDirPath = undefined;

export function setServerDirPath(value) {
  serverDirPath = value;
}

export function getServerDirPath() {
  return serverDirPath;
}


export function setProjectDirPath(value) {
  projectDirPath = value;
}

export function getProjectDirPath() {
  return projectDirPath;
}

export async function saveProjectSettings(newSettings) {
  const testProjectDirPath = repairPath(projectDirPath);
  await writeJson(repairPath(path.join(testProjectDirPath, constants.PROJECT_SETTINGS_FILE_NAME)), newSettings);
}

export async function checkProjectPaths() {

  // check if all essential project parts are existing

  const testProjectDirPath = repairPath(projectDirPath);

  let projectSettings;
  try {
    projectSettings = await readJson(repairPath(path.join(testProjectDirPath, constants.PROJECT_SETTINGS_FILE_NAME)));
  } catch (e) {
    projectSettings = constants.PROJECT_SETTINGS_DEFAULTS;
  }

  const testProjectPackageFile =
    repairPath(path.join(testProjectDirPath, constants.FILE_NAME_PACKAGE));
  let packageConfig;
  try {
    await isExisting(testProjectPackageFile);
    packageConfig = await readJson(testProjectPackageFile);
  } catch (e) {
    throw Error(`Project package file is missing. Please check "package.json" file exists in ${testProjectDirPath}.`);
  }
  let testProjectTSConfigFile =
    repairPath(path.join(testProjectDirPath, constants.FILE_NAME_TS_CONFIG));
  try {
    await isExisting(testProjectTSConfigFile);
  } catch (e) {
    // it is optional for project to have tsconfig.json
    testProjectTSConfigFile = null;
  }
  // check root source code dir
  const testProjectRootSourceDir =
    repairPath(path.join(testProjectDirPath, constants.DIR_NAME_SRC));
  try {
    await isExisting(testProjectRootSourceDir);
  } catch (e) {
    throw Error(`Project source code dir is missing. Please check "src" directory exists in ${testProjectDirPath}.`);
  }
  const testProjectPublicDir =
    repairPath(path.join(testProjectDirPath, constants.DIR_NAME_PUBLIC));
  try {
    await isExisting(testProjectPublicDir);
  } catch (e) {
    throw Error(`Project public dir is missing. Please check "public" directory exists in ${testProjectDirPath}.`);
  }
  // check usr dir path in the project
  const testUsrSourceDir =
    repairPath(path.join(testProjectRootSourceDir, constants.DIR_NAME_USR));
  try {
    await isExisting(testUsrSourceDir);
  } catch (e) {
    throw Error(`User source code dir is missing. Please check "src/usr" directory exists in ${testProjectDirPath}.`);
  }
  // check app dir path in the project
  const testAppSourceDir =
    repairPath(path.join(testProjectRootSourceDir, constants.DIR_NAME_APP));
  try {
    await isExisting(testAppSourceDir);
  } catch (e) {
    throw Error(`App source code dir is missing. Please check "src/app" directory exists in ${testProjectDirPath}.`);
  }

  // check etc dir path in the project
  const testEtcSourceDir =
    repairPath(path.join(testProjectRootSourceDir, constants.DIR_NAME_ETC));
  try {
    await isExisting(testEtcSourceDir);
  } catch (e) {
    throw Error(`Etc source code dir is missing. Please check "src/etc" directory exists in ${testProjectDirPath}.`);
  }

  // check pages config dir path in the project
  const testEtcPagesSourceDir =
    repairPath(path.join(testEtcSourceDir, constants.DIR_NAME_PAGES));
  // check flows config dir path in the project
  const testEtcFlowsSourceDir =
    repairPath(path.join(testEtcSourceDir, constants.DIR_NAME_FLOWS));
  // check templates config dir path in the project
  const testEtcTemplatesSourceDir =
    repairPath(path.join(testEtcSourceDir, constants.DIR_NAME_TEMPLATES));
  const testEtcSettingsSourceDir =
    repairPath(path.join(testEtcSourceDir, constants.DIR_NAME_SETTINGS));
  const testEtcStateSourceDir =
    repairPath(path.join(testEtcSourceDir, constants.DIR_NAME_STATE));

  // check yarn lock file existing
  let testProjectYarnLockFile =
    repairPath(path.join(testProjectDirPath, constants.FILE_NAME_YARN_LOCK));
  try {
    await isExisting(testProjectYarnLockFile);
  } catch (e) {
    testProjectYarnLockFile = null;
  }

  const startScriptPath = repairPath(path.join(
    testProjectDirPath,
    constants.NODE_MODULES_DIR_NAME,
    constants.REACT_SCRIPTS_NAME,
    'scripts',
    `start.js`,
  ));

  try {
    await isExisting(startScriptPath);
  } catch (e) {
    throw Error(`Start script is missing in ${testProjectDirPath}.`);
  }

  const projectName = path.basename(testProjectDirPath);

  return {
    projectName,
    projectSettings,
    packageConfig,
    testProjectDirPath,
    testProjectPublicDir,
    testProjectRootSourceDir,
    testUsrSourceDir,
    testAppSourceDir,
    testEtcSourceDir,
    testEtcPagesSourceDir,
    testEtcFlowsSourceDir,
    testEtcTemplatesSourceDir,
    testEtcSettingsSourceDir,
    testEtcStateSourceDir,
    testProjectTSConfigFile,
    testProjectYarnLockFile,
    startScriptPath,
  }
}
