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

import * as projectInstaller from '../core/project/projectInstaller';
import * as projectManager from '../core/project/projectManager';
import * as constants from '../../commons/constants';

export const createNewProjectSubmit = ({newProjectModel}) => async (dispatch) => {
  try {
    dispatch({creatingError: null});
    await projectInstaller.createNewProject(
      {newProjectModel},
      (feedback) => {
        if (feedback) {
          const { code } = feedback;
          if (code === 'log') {
            dispatch({installerFeedback: feedback});
          } else if (code === '0') {
            projectManager.restartProjectServer();
            dispatch({projectCreated: true});
          } else {
            dispatch({
              installerFeedback: feedback,
              creatingError: 'Error creating new project'
            });
          }
        }
      }
    )
  } catch(err) {
    dispatch({creatingError: err.message});
  }
};

export const openMarket = () => async (dispatch) => {
  dispatch({projectsType: constants.MARKET_NEW_PROJECTS_TYPE, isOpen: true});
};

export const submitMarket = ({projectModel}) => (dispatch) => {
  dispatch({data: {newProjectModel: projectModel}, isOpen: false});
};
