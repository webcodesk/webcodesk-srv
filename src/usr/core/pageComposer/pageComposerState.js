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
import constants from '../../../commons/constants';
import isNil from 'lodash/isNil';

let componentInstancesState;

function createComponentInstancesState(model, rootModelProps) {
  if (model && model.props) {
    const {
      type,
      children,
      props: {componentName, componentInstance, propertyName, propertyValue}
    } = model;
    if (type === constants.PAGE_COMPONENT_TYPE || type === constants.PAGE_NODE_TYPE) {
      if (children && children.length > 0) {
        let instanceState = {};
        children.forEach(child => {
          instanceState = createComponentInstancesState(child, instanceState);
        });
        componentInstancesState[`${componentName}_${componentInstance}`] = instanceState;
      }
    } else if (type === constants.COMPONENT_PROPERTY_ARRAY_TYPE
      || type === constants.COMPONENT_PROPERTY_OBJECT_TYPE) {
      if (rootModelProps) {
        if (propertyName) {
          if (propertyValue) {
            rootModelProps[propertyName] = cloneDeep(propertyValue);
          }
        } else {
          if (propertyValue) {
            rootModelProps.push(cloneDeep(propertyValue));
          }
        }
      }
    } else if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
      let newObjectModel = {};
      if (children && children.length > 0) {
        children.forEach(child => {
          newObjectModel = createComponentInstancesState(child, newObjectModel);
        });
      }
      if (rootModelProps) {
        if (propertyName) {
          rootModelProps[propertyName] = newObjectModel;
        } else {
          rootModelProps.push(newObjectModel);
        }
      }
    } else if (type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
      let newArrayModel = [];
      if (children && children.length > 0) {
        children.forEach(child => {
          newArrayModel = createComponentInstancesState(child, newArrayModel);
        });
      }
      if (rootModelProps) {
        if (propertyName) {
          rootModelProps[propertyName] = newArrayModel;
        } else {
          rootModelProps.push(newArrayModel);
        }
      }
    } else if (type === constants.COMPONENT_PROPERTY_STRING_TYPE
      || type === constants.COMPONENT_PROPERTY_ONE_OF_TYPE
      || type === constants.COMPONENT_PROPERTY_SYMBOL_TYPE
      || type === constants.COMPONENT_PROPERTY_BOOL_TYPE
      || type === constants.COMPONENT_PROPERTY_ANY_TYPE
      || type === constants.COMPONENT_PROPERTY_NUMBER_TYPE) {
      if (rootModelProps) {
        if (propertyName) {
          if (!isNil(propertyValue)) {
            rootModelProps[propertyName] = propertyValue;
          }
        } else {
          if (!isNil(propertyValue)) {
            rootModelProps.push(propertyValue);
          }
        }
      }
    }
  }
  return rootModelProps;
}

export function createState(model) {
  componentInstancesState = {};
  createComponentInstancesState(model);
  return componentInstancesState;
}
