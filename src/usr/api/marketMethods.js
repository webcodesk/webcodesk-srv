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

import * as marketBoardManager from '../core/market/boardManager';

export const findProjects = ({projectsType, searchValues, searchLang}) => async (dispatch) => {
  dispatch({isLoading: true, selectedProject: null, error: ''});
  // dispatch({selectedProject: null});
  // dispatch({error: ''});
  try {
    let projectsList = [];
    if (searchValues && searchValues.length > 0) {
      projectsList = await marketBoardManager.findProject(searchValues, searchLang);
    } else {
      projectsList = await marketBoardManager.getAllProjects(projectsType, searchLang);
    }
    dispatch({projectsList: projectsList});
    const searchTagsList = await marketBoardManager.getSearchTagsList();
    dispatch({searchTagsList: searchTagsList});
  } catch(e) {
    dispatch({error: e.message});
  }
  dispatch({isLoading: false});
};

export const openMarketBoard = () => dispatch => {
  dispatch({selectedProject: null});
};

export const selectProject = ({projectModel}) => async dispatch => {
  dispatch({isLoading: true, error: ''});
  // dispatch({error: ''});
  try {
    const projectData = await marketBoardManager.getProjectDetails(projectModel);
    dispatch({selectedProject: projectData});
  } catch(e) {
    dispatch({error: e.message});
  }
  dispatch({isLoading: false});
};
