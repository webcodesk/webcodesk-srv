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
  // check app indices dir path in the project
  const testAppIndicesSourceDir =
    repairPath(path.join(testProjectRootSourceDir, constants.DIR_NAME_APP, constants.DIR_NAME_INDICES));
  // try {
  //   await isExisting(testAppIndicesSourceDir);
  // } catch (e) {
  //   throw Error(`App indices source code dir is missing. Please check "src/app/indices" directory exists in ${testProjectDirPath}.`);
  // }
  // check pages config dir path in the project
  const testEtcPagesSourceDir =
    repairPath(path.join(testProjectRootSourceDir, constants.DIR_NAME_ETC, constants.DIR_NAME_PAGES));
  // try {
  //   await isExisting(testEtcPagesSourceDir);
  // } catch (e) {
  //   throw Error(`Pages configurations dir is missing. Please check "src/etc/pages" directory exists in ${testProjectDirPath}.`);
  // }
  // check flows config dir path in the project
  const testEtcFlowsSourceDir =
    repairPath(path.join(testProjectRootSourceDir, constants.DIR_NAME_ETC, constants.DIR_NAME_FLOWS));
  // try {
  //   await isExisting(testEtcFlowsSourceDir);
  // } catch (e) {
  //   throw Error(`Data flows configurations dir is missing. Please check "src/etc/flows" directory exists in ${testProjectDirPath}.`);
  // }
  // check templates config dir path in the project
  const testEtcTemplatesSourceDir =
    repairPath(path.join(testProjectRootSourceDir, constants.DIR_NAME_ETC, constants.DIR_NAME_TEMPLATES));
  // try {
  //   await isExisting(testEtcTemplatesSourceDir);
  // } catch (e) {
  //   throw Error(`Templates configurations dir is missing. Please check "src/etc/templates" directory exists in ${testProjectDirPath}.`);
  // }

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
    testAppIndicesSourceDir,
    testEtcPagesSourceDir,
    testEtcFlowsSourceDir,
    testEtcTemplatesSourceDir,
    testProjectTSConfigFile,
    testProjectYarnLockFile,
    startScriptPath,
  }
}
