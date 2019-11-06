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
