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

import {
  createDefaultFlowModel,
  createFlowModelForComponent,
  createFlowModelForFunction
} from './flowModelCreators';

const DEFAULT_MODEL = 'DEFAULT_MODEL';
const COMPONENT_MODEL = 'COMPONENT_MODEL';
const USER_FUNCTION_MODEL = 'USER_FUNCTION_MODEL';

const creators = {
  [DEFAULT_MODEL]: createDefaultFlowModel,
  [COMPONENT_MODEL]: createFlowModelForComponent,
  [USER_FUNCTION_MODEL]: createFlowModelForFunction,
};

export function createDefaultModel() {

  return creators[DEFAULT_MODEL]();
}

export function createFlowModel(resourceObject, inBasket) {
  if (resourceObject.isFlowComponentInstance || resourceObject.isComponentInstance) {
    if (!resourceObject.componentName || !resourceObject.componentInstance) {
      throw Error('FlowComposerFactory.createFlowModel: the dropped component is missing a component name, or a component instance name');
    }
    return creators[COMPONENT_MODEL](resourceObject, inBasket);
  } else if (resourceObject.isUserFunction || resourceObject.isFlowUserFunction) {
    if (!resourceObject.functionName) {
      throw Error('FlowComposerFactory.createFlowModel: the dropped user function misses name');
    }
    return creators[USER_FUNCTION_MODEL](resourceObject, inBasket);
  }
  return null;
}