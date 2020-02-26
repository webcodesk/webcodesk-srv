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
    dispatch({projectConfigStatus: {projectName, projectDirPath, ready: true}});
  } catch (e) {
    console.error(e);
    dispatch({
      projectConfigStatus: {ready: false},
      error: {message: e.message}
    });
  }
};

export const testError = (error) => dispatch => {
  if (error && error.message) {
    dispatch({success: error});
  }
};

export const openExistingProject = () => async (dispatch) => {
  globalStore.clear();
  dispatch({isOpening: true});
  try {
    await projectManager.initProjectConfiguration();
  } catch (e) {
    console.error(e);
  }
  // dispatch('infoMessage', 'Reading source files. Please wait...');
  try {
    await projectManager.watchUsrSourceDir();
    dispatch({success: true});
    // dispatch('successMessage', 'Project initialised successfully');
  } catch (e) {
    console.error(e);
  }
  dispatch({isOpening: false});
};

export const closeExistingProject = () => dispatch => {
  globalStore.clear();
  dispatch({
    activeEditorTabIndex: -1,
    resourceEditorTabs: [],
    selectedResourceKey: null,
    selectedResource: null,
    selectedVirtualPath: '',
    success: true,
  });
};
