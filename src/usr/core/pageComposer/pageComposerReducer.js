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
import isUndefined from 'lodash/isUndefined';
import isNil from 'lodash/isNil';

export function createSingleInstanceState (properties, rootModelProps = {}) {
  if (properties && properties.length > 0) {
    let model;
    for (let p = 0; p < properties.length; p++) {
      model = properties[p];
      if (model && model.props) {
        const {
          type,
          children,
          props: { propertyName, propertyValue }
        } = model;
        if (type === constants.COMPONENT_PROPERTY_ARRAY_TYPE
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
            newObjectModel = createSingleInstanceState(children, newObjectModel);
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
            newArrayModel = createSingleInstanceState(children, newArrayModel);
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
    }
  }
  return rootModelProps;
}

function traversePropertiesWithDefaultValues (properties, defaults) {
  if (properties && properties.length > 0) {
    properties.forEach(property => {
      const {
        type,
        props,
        children
      } = property;
      const { propertyName } = props;
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
            traversePropertiesWithDefaultValues(children, defaultValue || {});
          }
        } else {
          // we have the unnamed object that is the item of the array
          traversePropertiesWithDefaultValues(children, defaults || {});
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
              traversePropertiesWithDefaultValues([newChild], defaultValueArrayItem);
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
                testComponentModel(prevChildren[i]);
              }
            }
          }
        }
      } else if (type === constants.PAGE_COMPONENT_TYPE || type === constants.PAGE_NODE_TYPE) {
        testComponentModel(property);
      }
    });
  }
}

function traverseProperties (properties) {
  if (properties && properties.length > 0) {
    properties.forEach(property => {
      const {
        type,
        children
      } = property;
      if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
        traverseProperties(children);
      } else if (type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
        if (children && children.length > 0) {
          children.forEach(arrayItem => {
            traverseProperties([arrayItem]);
          });
        }
      } else if (type === constants.PAGE_COMPONENT_TYPE || type === constants.PAGE_NODE_TYPE) {
        testComponentModel(property);
      }
    });
  }
}

function testComponentModel (componentsTree) {
  const { props: { componentName, componentInstance }, children } = componentsTree;
  if (children && children.length > 0) {
    if (currentComponentName === componentName && currentComponentInstance === componentInstance) {
      traversePropertiesWithDefaultValues(children, currentInstanceState);
    } else {
      traverseProperties(children);
    }
  }
  return componentsTree;
}

let currentInstanceState = {};
let currentComponentName;
let currentComponentInstance;

export function reduceComponentTree (refModel, componentsTree) {
  if (refModel && refModel.props) {
    const { componentName, componentInstance } = refModel.props;
    currentComponentName = componentName;
    currentComponentInstance = componentInstance;
    currentInstanceState = createSingleInstanceState(refModel.children);
    if (
      componentsTree
      && (componentsTree.type === constants.PAGE_COMPONENT_TYPE || componentsTree.type === constants.PAGE_NODE_TYPE)
    ) {
      componentsTree = testComponentModel(componentsTree);
    }
  }
  return componentsTree;
}
