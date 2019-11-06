import * as constants from '../../commons/constants';
import * as projectInstaller from '../core/project/projectInstaller';

export const startInstallPackage = () => dispatch => {
  dispatch('isOpen', true);
  dispatch('error', '');
  dispatch('data', {projectModel: null});
};

export const submitInstallPackage = ({directoryName, projectModel}) => async (dispatch) => {
  dispatch('isLoading', true);
  dispatch('error', '');
  try {
    await projectInstaller.installNewPackage({directoryName, projectModel});
    dispatch('isOpen', false);
    dispatch('success', 'Package has been successfully installed');
  } catch(e) {
    dispatch('error', e.message);
  } finally {
    dispatch('isLoading', false);
  }
};

export const openMarket = () => async (dispatch) => {
  dispatch('projectsType', constants.MARKET_NEW_PACKAGES_TYPE);
  dispatch('isOpen', true);
};

export const submitMarket = ({projectModel}) => (dispatch) => {
  dispatch('data', {projectModel: projectModel});
  dispatch('isOpen', false);
};
