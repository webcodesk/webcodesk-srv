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

import * as projectInstaller from '../core/project/projectInstaller';
import * as projectManager from '../core/project/projectManager';
import * as constants from '../../commons/constants';

export const createNewProjectSubmit = ({newProjectModel}) => async (dispatch) => {
  try {
    dispatch('creatingError', null);
    await projectInstaller.createNewProject(
      {newProjectModel},
      (feedback) => {
        if (feedback) {
          const { code } = feedback;
          if (code === 'log') {
            dispatch('installerFeedback', feedback);
          } else if (code === '0') {
            projectManager.restartProjectServer();
            dispatch('projectCreated', true);
          } else {
            dispatch('installerFeedback', feedback);
            dispatch('creatingError', 'Error creating new project');
          }
        }
      }
    )
  } catch(err) {
    dispatch('creatingError', err.message);
  }
};

export const openMarket = () => async (dispatch) => {
  dispatch('projectsType', constants.MARKET_NEW_PROJECTS_TYPE);
  dispatch('isOpen', true);
};

export const submitMarket = ({projectModel}) => (dispatch) => {
  dispatch('data', {newProjectModel: projectModel});
  dispatch('isOpen', false);
};
