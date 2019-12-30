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
