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

import cloneDeep from 'lodash/cloneDeep';
import * as constants from '../../../commons/constants';

export function createPageComponentModel(resourceObject, targetPropertyName) {
  if (resourceObject.isComponent) {
    return {
      type: constants.PAGE_COMPONENT_TYPE,
      props: {
        componentName: resourceObject.componentName,
        componentInstance: resourceObject.componentInstance,
        propertyName: targetPropertyName,
      },
      children: cloneDeep(resourceObject.properties),
    };
  } else if (resourceObject.isComponentInstance) {
    return {
      type: constants.PAGE_COMPONENT_TYPE,
      props: {
        componentName: resourceObject.componentName,
        componentInstance: resourceObject.componentInstance,
        propertyName: targetPropertyName,
      },
      children: cloneDeep(resourceObject.properties),
    };
  } else if (resourceObject.isTemplate) {
    const newPageComponentModel = cloneDeep(resourceObject.componentsTree);
    newPageComponentModel.props = newPageComponentModel.props || {};
    newPageComponentModel.props.propertyName = targetPropertyName;
    return newPageComponentModel;
  } else if (resourceObject.isClipboardItem) {
    const newPageComponentModel = cloneDeep(resourceObject.itemModel);
    newPageComponentModel.props = newPageComponentModel.props || {};
    newPageComponentModel.props.propertyName = targetPropertyName;
    return newPageComponentModel;
  }
  return undefined;
}

export function createPagePlaceholderModel(targetPropertyName) {
  return {
    type: constants.COMPONENT_PROPERTY_ELEMENT_TYPE,
    props: {
      componentName: '__PlaceHolder',
      propertyName: targetPropertyName,
    },
  };
}

export function createDefaultModel() {
  return {
    type: constants.COMPONENT_PROPERTY_ELEMENT_TYPE,
    props: {
      componentName: '__PlaceHolder'
    },
  };
}
