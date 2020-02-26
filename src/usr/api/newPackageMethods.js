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

import * as constants from '../../commons/constants';
import * as projectInstaller from '../core/project/projectInstaller';

export const startInstallPackage = () => dispatch => {
  dispatch({
    isOpen: true,
    error: '',
    data: {projectModel: null}
  });
  // dispatch('error', '');
  // dispatch('data', {projectModel: null});
};

export const submitInstallPackage = ({directoryName, projectModel}) => async (dispatch) => {
  dispatch({isLoading: true, error: ''});
  // dispatch({error: ''});
  try {
    await projectInstaller.installNewPackage({directoryName, projectModel});
    dispatch({
      isOpen: false,
      success: 'Package has been successfully installed'
    });
    // dispatch('success', 'Package has been successfully installed');
  } catch(e) {
    dispatch({error: e.message});
  } finally {
    dispatch({isLoading: false});
  }
};

export const openMarket = () => async (dispatch) => {
  dispatch({
    projectsType: constants.MARKET_NEW_PACKAGES_TYPE,
    isOpen: true
  });
  // dispatch('isOpen', true);
};

export const submitMarket = ({projectModel}) => (dispatch) => {
  dispatch({
    data: {projectModel: projectModel},
    isOpen: false
  });
  // dispatch('isOpen', false);
};
