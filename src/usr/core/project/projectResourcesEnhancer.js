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
import isUndefined from 'lodash/isUndefined';
import * as projectResourcesManager from './projectResourcesManager';
import constants from '../../../commons/constants';

function getPropertyByName(properties, propertyName) {
  let result = null;
  if (properties && properties.length > 0) {
    result = properties.find(property => {
      return property && property.props && property.props.propertyName === propertyName;
    });
    // properties.forEach(property => {
    //   const { props } = property;
    //   if (props && props.propertyName === propertyName) {
    //     result = property;
    //   }
    // });
  }
  return result;
}

function getPropertiesRef(properties) {
  let result = [];
  if (properties && properties.length > 0) {
    properties.forEach(property => {
      const {
        type,
        props,
        children
      } = property;
      const {propertyName, isRequired, propertyComment, propertyLabel, propertyValueVariants} = props;
      if (type === constants.COMPONENT_PROPERTY_STRING_TYPE
        || type === constants.COMPONENT_PROPERTY_OBJECT_TYPE
        || type === constants.COMPONENT_PROPERTY_ONE_OF_TYPE
        || type === constants.COMPONENT_PROPERTY_SYMBOL_TYPE
        || type === constants.COMPONENT_PROPERTY_BOOL_TYPE
        || type === constants.COMPONENT_PROPERTY_ANY_TYPE
        || type === constants.COMPONENT_PROPERTY_ARRAY_TYPE
        || type === constants.COMPONENT_PROPERTY_ELEMENT_TYPE
        || type === constants.COMPONENT_PROPERTY_NODE_TYPE
        || type === constants.COMPONENT_PROPERTY_NUMBER_TYPE) {
        const newPropertyRef = {
          type,
          props: {
            propertyName,
            propertyComment,
            propertyLabel,
            propertyValue: null,
            isRequired,
          }
        };
        if (propertyValueVariants) {
          newPropertyRef.props.propertyValueVariants = cloneDeep(propertyValueVariants);
        }
        result.push(newPropertyRef);
      } else if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
        const newPropertyRef = {
          type,
          props: {
            propertyName,
            propertyComment,
            propertyLabel,
            isRequired,
          },
        };
        if (children && children.length > 0) {
          newPropertyRef.children = getPropertiesRef(children);
        }
        result.push(newPropertyRef);
      } else if (type === constants.COMPONENT_PROPERTY_FUNCTION_TYPE) {
        const newPropertyRef = {
          type,
          props: {
            propertyName,
            propertyComment,
            propertyLabel,
            isRequired,
          },
        };
        result.push(newPropertyRef);
      } else if (type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
        const newPropertyRef = {
          type,
          props: {
            propertyName,
            propertyComment,
            propertyLabel,
            isRequired,
          },
        };
        // named array field in the defaults
        if (props.defaultChildren && props.defaultChildren[0]) {
          newPropertyRef.children = getPropertiesRef([props.defaultChildren[0]]);
        }
        result.push(newPropertyRef);
      }
    });
  }
  return result;
}

function traversePropertiesWithDefaultValues(properties, defaults) {
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
        if (defaultValue && defaultValue.length > 0 && props.defaultChildren && props.defaultChildren[0]) {
          property.children = property.children || [];
          defaultValue.forEach((defaultValueArrayItem, defaultValueArrayItemIndex) => {
            // todo: should we preserve the default children values array in order to give the ability to create new array item with the default values
            // todo: bu then the user will be able to create item only with the item with values from the first array item...
            // set up the default values into the default children reference
            // traversePropertiesWithDefaultValues(props.defaultChildren, defaultValueArrayItem);
            // add new child property with the default value if there is no child
            if (!property.children[defaultValueArrayItemIndex]) {
              const newChild = cloneDeep(props.defaultChildren[0]);
              traversePropertiesWithDefaultValues([newChild], defaultValueArrayItem);
              property.children.push(newChild);
            }
          });
        }
      }
    });
  }
}


function traversePropTypesProps(property) {
  if (property) {
    const {props} = property;
    if (props) {
      if (props.externalProperties) {
        const externalPropTypesResource = projectResourcesManager.getResourceByKey(props.externalProperties);
        if (externalPropTypesResource) {
          property.children = cloneDeep(externalPropTypesResource.properties);
        }
      }
      if (props.defaultChildren && props.defaultChildren.length > 0) {
        props.defaultChildren.forEach(traversePropTypesProps);
      }
    }
    if (property.children && property.children.length > 0) {
      property.children.forEach(traversePropTypesProps);
    }
  }
}

function propTypesEnrichVisitor ({ nodeModel, parentModel }) {
  if (nodeModel && nodeModel.type === constants.GRAPH_MODEL_PROP_TYPES_TYPE) {
    const { props } = nodeModel;
    if (props) {
      if (props.externalProperties) {
        const externalPropTypesResource = projectResourcesManager.getResourceByKey(props.externalProperties);
        if (externalPropTypesResource) {
          props.properties = cloneDeep(externalPropTypesResource.properties);
        }
      }
      if (props.properties && props.properties.length > 0) {
        props.properties.forEach(traversePropTypesProps);
      }
      props.properties = orderBy(props.properties, propItem => {
        if (propItem && propItem.props) {
          return propItem.props.propertyName;
        }
        return undefined;
      });
    }
  }
}

function componentEnrichVisitor ({ nodeModel, parentModel }) {
  if (nodeModel && nodeModel.type === constants.GRAPH_MODEL_COMPONENT_TYPE) {
    const { props } = nodeModel;
    if (props) {
      if (props.externalProperties) {
        const externalPropTypesResource = projectResourcesManager.getResourceByKey(props.externalProperties);
        if (externalPropTypesResource) {
          props.properties = cloneDeep(externalPropTypesResource.properties);
        }
      }
      if (props.properties && props.properties.length > 0) {
        props.properties.forEach(traversePropTypesProps);
        // now when all properties are fulfilled but still are without default values
        // we have to save them for the referencing
        props.propertiesRef = getPropertiesRef(props.properties);
        props.propertiesRef = orderBy(props.propertiesRef, propItem => {
          if (propItem && propItem.props) {
            return propItem.props.propertyName;
          }
          return undefined;
        });
        // and here we set the default values to the properties
        if (props.defaultProps) {
          traversePropertiesWithDefaultValues(props.properties, props.defaultProps);
        }
      }
      props.properties = orderBy(props.properties, propItem => {
        if (propItem && propItem.props) {
          return propItem.props.propertyName;
        }
        return undefined;
      });
    }
  }
}

function settingsConfEnrichVisitor ({ nodeModel, parentModel }) {
  if (nodeModel && nodeModel.type === constants.GRAPH_MODEL_SETTINGS_CONF_TYPE) {
    const { props } = nodeModel;
    if (props) {
      if (props.externalProperties) {
        const externalPropTypesResource = projectResourcesManager.getResourceByKey(props.externalProperties);
        if (externalPropTypesResource) {
          props.settingsConfProperties = cloneDeep(externalPropTypesResource.properties);
        }
      }
      if (props.settingsConfProperties && props.settingsConfProperties.length > 0) {
        props.settingsConfProperties.forEach(traversePropTypesProps);
        // now when all properties are fulfilled but still are without default values
        // we have to save them for the referencing
        // props.propertiesRef = getPropertiesRef(props.properties);
        // props.propertiesRef = orderBy(props.propertiesRef, propItem => {
        //   if (propItem && propItem.props) {
        //     return propItem.props.propertyName;
        //   }
        //   return undefined;
        // });
        // and here we set the default values to the properties
        if (props.defaultProps) {
          traversePropertiesWithDefaultValues(props.settingsConfProperties, props.defaultProps);
        }
      }
      props.settingsConfProperties = orderBy(props.settingsConfProperties, propItem => {
        if (propItem && propItem.props) {
          return propItem.props.propertyName;
        }
        return undefined;
      });
    }
  }
}

export function enrichResources () {

  // first we have to enhance our models with the resources from different graph models.
  // the order of the enhancers are important

  // enhance PropTypes: replace external prop types (imports) with their real props
  const propTypesGraphModel = projectResourcesManager.getPropTypesGraphModel();
  if (propTypesGraphModel) {
    propTypesGraphModel.traverse(propTypesEnrichVisitor);
  }

  // enhance Component: replace external prop types with their real props
  const componentsGraphModel = projectResourcesManager.getComponentsGraphModel();
  if (componentsGraphModel) {
    componentsGraphModel.traverse(componentEnrichVisitor);
  }

  // todo: removing externalProperties from functions
  // // enhance Function: replace external prop types with their real props
  // const functionsGraphModel = projectResourcesManager.getFunctionsGraphModel();
  // if (functionsGraphModel) {
  //   functionsGraphModel.traverse(functionEnrichVisitor);
  // }

  // enhance Settings: replace external prop types with their real props
  const settingsConfGraphModel = projectResourcesManager.getSettingsConfGraphModel();
  if (settingsConfGraphModel) {
    settingsConfGraphModel.traverse(settingsConfEnrichVisitor);
  }

}