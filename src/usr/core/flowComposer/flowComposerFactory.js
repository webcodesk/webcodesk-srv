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

import {
  createDefaultFlowModel,
  createFlowModelForComponent,
  createFlowModelForFunction,
  createFlowModelForPage
} from './flowModelCreators';

const DEFAULT_MODEL = 'DEFAULT_MODEL';
const COMPONENT_MODEL = 'COMPONENT_MODEL';
const USER_FUNCTION_MODEL = 'USER_FUNCTION_MODEL';
const PAGE_MODEL = 'PAGE_MODEL';

const creators = {
  [DEFAULT_MODEL]: createDefaultFlowModel,
  [COMPONENT_MODEL]: createFlowModelForComponent,
  [USER_FUNCTION_MODEL]: createFlowModelForFunction,
  [PAGE_MODEL]: createFlowModelForPage,
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
  } else if (resourceObject.isPage || resourceObject.isFlowPage) {
    return creators[PAGE_MODEL](resourceObject, inBasket);
  }
  return null;
}