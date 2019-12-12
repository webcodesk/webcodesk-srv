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

import globalStore from '../core/config/globalStore';
import * as projectManager from '../core/project/projectManager';

export const testProjectConfiguration = () => async (dispatch) => {
  try {
    const validPaths = await projectManager.testProjectConfiguration();
    let projectName;
    let projectDirPath;
    if (validPaths) {
      projectName = validPaths.projectName;
      projectDirPath = validPaths.testProjectDirPath;
    }
    dispatch('projectConfigStatus', {projectName, projectDirPath, ready: true});
  } catch (e) {
    console.error(e);
    dispatch('projectConfigStatus', {ready: false});
    dispatch('error', {message: e.message});
  }
};

export const testError = (error) => dispatch => {
  if (error && error.message) {
    dispatch('success', error);
  }
};

export const openExistingProject = () => async (dispatch) => {
  globalStore.clear();
  dispatch('isOpening', true);
  try {
    await projectManager.initProjectConfiguration();
  } catch (e) {
    console.error(e);
  }
  // dispatch('infoMessage', 'Reading source files. Please wait...');
  try {
    await projectManager.watchUsrSourceDir();
    dispatch('success');
    // dispatch('successMessage', 'Project initialised successfully');
  } catch (e) {
    console.error(e);
  }
  dispatch('isOpening', false);
};

export const closeExistingProject = () => dispatch => {
  globalStore.clear();
  dispatch('activeEditorTabIndex', -1);
  dispatch('resourceEditorTabs', []);
  dispatch('selectedResourceKey', null);
  dispatch('selectedResource', null);
  dispatch('selectedVirtualPath', '');
  dispatch('success');
};
