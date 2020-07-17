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

import cloneDeep from '../utils/cloneDeep';
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
      children: cloneDeep(resourceObject.instanceProperties),
    };
  } else if (resourceObject.isTemplate) {
    const newPageComponentModel = cloneDeep(resourceObject.componentsTree);
    newPageComponentModel.type = constants.PAGE_COMPONENT_TYPE;
    newPageComponentModel.props = newPageComponentModel.props || {};
    newPageComponentModel.props.propertyName = targetPropertyName;
    return newPageComponentModel;
  } else if (resourceObject.isClipboardItem) {
    const newPageComponentModel = cloneDeep(resourceObject.itemModel);
    newPageComponentModel.type = constants.PAGE_COMPONENT_TYPE;
    newPageComponentModel.props = newPageComponentModel.props || {};
    newPageComponentModel.props.propertyName = targetPropertyName;
    return newPageComponentModel;
  }
  return undefined;
}

export function createPageNodeModel(resourceObject, targetPropertyName) {
  if (resourceObject.isComponent) {
    return {
      type: constants.PAGE_NODE_TYPE,
      props: {
        componentName: resourceObject.componentName,
        componentInstance: resourceObject.componentInstance,
        propertyName: targetPropertyName,
      },
      children: cloneDeep(resourceObject.properties),
    };
  } else if (resourceObject.isComponentInstance) {
    return {
      type: constants.PAGE_NODE_TYPE,
      props: {
        componentName: resourceObject.componentName,
        componentInstance: resourceObject.componentInstance,
        propertyName: targetPropertyName,
      },
      children: cloneDeep(resourceObject.properties),
    };
  } else if (resourceObject.isTemplate) {
    const newPageComponentModel = cloneDeep(resourceObject.componentsTree);
    newPageComponentModel.type = constants.PAGE_NODE_TYPE;
    newPageComponentModel.props = newPageComponentModel.props || {};
    newPageComponentModel.props.propertyName = targetPropertyName;
    return newPageComponentModel;
  } else if (resourceObject.isClipboardItem) {
    const newPageComponentModel = cloneDeep(resourceObject.itemModel);
    newPageComponentModel.type = constants.PAGE_NODE_TYPE;
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

export function createNodePlaceholderModel(targetPropertyName) {
  return {
    type: constants.COMPONENT_PROPERTY_NODE_TYPE,
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
