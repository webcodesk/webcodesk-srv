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

import * as marketBoardManager from '../core/market/boardManager';

export const findProjects = ({projectsType, searchValues, searchLang}) => async (dispatch) => {
  dispatch('isLoading', true);
  dispatch('selectedProject', null);
  dispatch('error', '');
  try {
    let projectsList = [];
    if (searchValues && searchValues.length > 0) {
      projectsList = await marketBoardManager.findProject(searchValues, searchLang);
    } else {
      projectsList = await marketBoardManager.getAllProjects(projectsType, searchLang);
    }
    dispatch('projectsList', projectsList);
    const searchTagsList = await marketBoardManager.getSearchTagsList();
    dispatch('searchTagsList', searchTagsList);
  } catch(e) {
    dispatch('error', e.message);
  }
  dispatch('isLoading', false);
};

export const openMarketBoard = () => dispatch => {
  dispatch('selectedProject', null);
};

export const selectProject = ({projectModel}) => async dispatch => {
  dispatch('isLoading', true);
  dispatch('error', '');
  try {
    const projectData = await marketBoardManager.getProjectDetails(projectModel);
    dispatch('selectedProject', projectData);
  } catch(e) {
    dispatch('error', e.message);
  }
  dispatch('isLoading', false);
};
