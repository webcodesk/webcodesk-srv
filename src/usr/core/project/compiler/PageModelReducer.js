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
import orderBy from 'lodash/orderBy';
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
          console.info('In simple prop: ', propertyName);
          console.info('In simple prop ( default value ): ', defaultValue);
          if (!isUndefined(defaultValue)) {
            if (type === constants.COMPONENT_PROPERTY_ANY_TYPE
              || constants.COMPONENT_PROPERTY_ARRAY_TYPE
              || constants.COMPONENT_PROPERTY_OBJECT_TYPE) {
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
            console.info('In shape prop: ', propertyName);
            console.info('In shape prop ( default value ): ', defaultValue);
            if (children && children.length > 0) {
              this.traversePropertiesWithDefaultValues(children, defaultValue || {});
            }
          } else {
            // we have the unnamed object that is the item of the array
            console.info('In shape prop no name: ');
            console.info('In shape prop ( default value ): ', defaults);
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
              console.info('In array prop: ', propertyName);
              console.info('In array prop ( default value ): ', defaultValue);
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
            property.children = [];
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
    console.info('Start testing component instance: ', componentName, componentInstance, currentInstanceState);
    if (children && children.length > 0) {
      this.traversePropertiesWithDefaultValues(children, currentInstanceState);
    }
    return instanceModel;
  }

  // testArray (arrayChildren, modelDefaultChildren, instancePropertyState) {
  //   if (modelDefaultChildren && modelDefaultChildren.length > 0) {
  //     // we take the first default item as the testing reference
  //     const defaultArrayItemModel = modelDefaultChildren[0];
  //     if (instancePropertyState) {
  //       const newArrayChildren = [];
  //       if (instancePropertyState && instancePropertyState.length > 0) {
  //         let newItem;
  //         instancePropertyState.forEach((instancePropertyStateItem, itemIdx) => {
  //           let existingItem;
  //           if (arrayChildren && arrayChildren.length > 0) {
  //             existingItem = arrayChildren[itemIdx];
  //           }
  //           if (!existingItem) {
  //             existingItem = defaultArrayItemModel;
  //           }
  //           newItem = this.testProperty(existingItem, instancePropertyStateItem);
  //           newArrayChildren.push(newItem);
  //         });
  //       }
  //       arrayChildren = newArrayChildren;
  //     }
  //   }
  //   return arrayChildren;
  // }
  //
  // testProperty(instanceProperty, instancePropertyState) {
  //
  //   if (instanceProperty) {
  //
  //     const {
  //       type: instancePropertyType,
  //       props: {
  //         propertyName,
  //         defaultChildren
  //       }
  //     } = instanceProperty;
  //
  //     if (
  //       instancePropertyType === constants.PAGE_COMPONENT_TYPE
  //       || instancePropertyType === constants.PAGE_NODE_TYPE
  //     ) {
  //       instanceProperty = this.testComponentModel(instanceProperty);
  //     } else if (instancePropertyType === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
  //       let propertyState;
  //       if (instancePropertyState) {
  //         if (propertyName) {
  //           propertyState = instancePropertyState[propertyName];
  //         } else {
  //           propertyState = instancePropertyState;
  //         }
  //       }
  //       console.info('testProperty SHAPE (propertyState): ', propertyName, instancePropertyState,  propertyState);
  //       instanceProperty.children =
  //         this.testProperties(instanceProperty.children || [], propertyState);
  //     } else if (instancePropertyType === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
  //       let propertyState;
  //       if (instancePropertyState) {
  //         if (propertyName) {
  //           propertyState = instancePropertyState[propertyName];
  //         } else {
  //           propertyState = instancePropertyState;
  //         }
  //       }
  //       console.info('testProperty ARRAY (propertyState): ', propertyName, instancePropertyState,  propertyState);
  //       instanceProperty.children =
  //         this.testArray(instanceProperty.children, defaultChildren, propertyState);
  //     } else {
  //       if (instancePropertyState && instancePropertyState[propertyName]) {
  //         instanceProperty.props.propertyValue = instancePropertyState[propertyName];
  //       }
  //     }
  //   }
  //   return instanceProperty;
  // }
  //
  // testProperties(instanceProperties, instanceState) {
  //   if (instanceProperties && instanceProperties.length > 0) {
  //     const newInstanceProperties = [];
  //     instanceProperties.forEach(instancePropertyItem => {
  //       if (
  //         instancePropertyItem
  //         && instancePropertyItem.props
  //       ) {
  //         const { type, props: {propertyName} } = instancePropertyItem;
  //         if (propertyName) {
  //           // init instance property state if it is undefined
  //           const propertyState = instanceState && instanceState[propertyName];
  //           console.info('testProperties (propertyState): ', propertyName, instanceState,  propertyState);
  //           let newInstancePropertyItem = this.testProperty(instancePropertyItem, propertyState);
  //           newInstanceProperties.push(newInstancePropertyItem);
  //         }
  //       }
  //     });
  //     instanceProperties = newInstanceProperties;
  //   }
  //   return instanceProperties;
  // }

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