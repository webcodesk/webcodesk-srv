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
