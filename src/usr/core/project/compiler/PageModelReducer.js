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

import cloneDeep from '../../utils/cloneDeep';
import constants from '../../../../commons/constants';
import isUndefined from 'lodash/isUndefined';

class PageModelReducer {

  constructor ({componentInstancesState}) {
    this.componentInstancesState = componentInstancesState || {};
  }

  traversePropertiesWithDefaultValues(properties, defaults) {
    if (properties && properties.length > 0) {
      properties.forEach(property => {
        const {
          type,
          props,
          children
        } = property;
        const {propertyName} = props;
        if (type === constants.COMPONENT_PROPERTY_STRING_TYPE
          || type === constants.COMPONENT_PROPERTY_OBJECT_TYPE
          || type === constants.COMPONENT_PROPERTY_ONE_OF_TYPE
          || type === constants.COMPONENT_PROPERTY_SYMBOL_TYPE
          || type === constants.COMPONENT_PROPERTY_BOOL_TYPE
          || type === constants.COMPONENT_PROPERTY_ANY_TYPE
          || type === constants.COMPONENT_PROPERTY_ARRAY_TYPE
          || type === constants.COMPONENT_PROPERTY_NUMBER_TYPE) {
          let defaultValue = undefined;
          if (!isUndefined(defaults)) {
            if (propertyName) {
              defaultValue = defaults[propertyName];
            } else {
              defaultValue = defaults;
            }
          }
          if (!isUndefined(defaultValue)) {
            if (type === constants.COMPONENT_PROPERTY_ANY_TYPE
              || type === constants.COMPONENT_PROPERTY_ARRAY_TYPE
              || type === constants.COMPONENT_PROPERTY_OBJECT_TYPE) {
              property.props.propertyValue = cloneDeep(defaultValue);
            } else {
              property.props.propertyValue = defaultValue;
            }
          } else {
            property.props.propertyValue = defaultValue;
          }
        } else if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
          if (propertyName) {
            // we have the named object property
            const defaultValue = defaults ? defaults[propertyName] : {};
            if (children && children.length > 0) {
              this.traversePropertiesWithDefaultValues(children, defaultValue || {});
            }
          } else {
            // we have the unnamed object that is the item of the array
            this.traversePropertiesWithDefaultValues(children, defaults || {});
          }
        } else if (type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
          let defaultValue;
          if (propertyName) {
            defaultValue = defaults ? defaults[propertyName] : null;
          } else {
            defaultValue = defaults;
          }
          // named array field in the defaults
          if (defaultValue && defaultValue.length > 0) {
            if (props.defaultChildren && props.defaultChildren[0]) {
              const prevChildren = property.children;
              property.children = [];
              let newChild;
              defaultValue.forEach((defaultValueArrayItem, defaultValueArrayItemIndex) => {
                if (!prevChildren[defaultValueArrayItemIndex]) {
                  newChild = cloneDeep(props.defaultChildren[0]);
                } else {
                  newChild = cloneDeep(prevChildren[defaultValueArrayItemIndex]);
                }
                this.traversePropertiesWithDefaultValues([newChild], defaultValueArrayItem);
                property.children.push(newChild);
              });
            }
          } else {
            // empty default value for the array may indicate there is components
            // we have to check each child if it is not a component or node
            if (property.children && property.children.length > 0) {
              const prevChildren = property.children;
              property.children = [];
              for (let i = 0; i < prevChildren.length; i++) {
                const { type } = prevChildren[i];
                if (type === constants.COMPONENT_PROPERTY_ELEMENT_TYPE
                  || type === constants.COMPONENT_PROPERTY_NODE_TYPE) {
                  property.children.push(prevChildren[i]);
                }
                if (type === constants.PAGE_COMPONENT_TYPE || type === constants.PAGE_NODE_TYPE) {
                  property.children.push(prevChildren[i]);
                  this.testComponentModel(prevChildren[i]);
                }
              }
            }
          }
        } else if (type === constants.PAGE_COMPONENT_TYPE || type === constants.PAGE_NODE_TYPE) {
          this.testComponentModel(property)
        }
      });
    }
  }

  testComponentModel(instanceModel) {
    const { props: {componentName, componentInstance}, children } = instanceModel;
    const componentInstanceKey = `${componentName}_${componentInstance}`;
    const currentInstanceState = this.componentInstancesState[componentInstanceKey];
    if (children && children.length > 0) {
      this.traversePropertiesWithDefaultValues(children, currentInstanceState);
    }
    return instanceModel;
  }

  reduce(nodeModel) {
    if (
      nodeModel
      && (nodeModel.type === constants.PAGE_COMPONENT_TYPE || nodeModel.type === constants.PAGE_NODE_TYPE)
    ) {
        nodeModel = this.testComponentModel(nodeModel);
    }
    return nodeModel;
  }

  getComponentInstancesState() {
    return this.componentInstancesState;
  }

}

export default PageModelReducer;