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

import orderBy from 'lodash/orderBy';
import cloneDeep from 'lodash/cloneDeep';
import isUndefined from 'lodash/isUndefined';
import constants from '../../../commons/constants';

export function traverseProperties(properties, defaults) {
  let result = [];
  if (properties && properties.length > 0) {
    properties.forEach(property => {
      const {
        name,
        type,
        isRequired,
        variants,
        wcdAnnotations,
        externalProperties,
        properties: childProperties
      } = property;
      const newChildItem = {
        type,
        props: {
          propertyName: name,
          isRequired,
        },
      };
      if (wcdAnnotations) {
        if (wcdAnnotations[constants.ANNOTATION_COMMENT]) {
          newChildItem.props.propertyComment = wcdAnnotations[constants.ANNOTATION_COMMENT];
        }
        if (wcdAnnotations[constants.ANNOTATION_LABEL]) {
          newChildItem.props.propertyLabel = wcdAnnotations[constants.ANNOTATION_LABEL];
        }
      }
      if (externalProperties) {
        newChildItem.props.externalProperties = externalProperties;
        result.push(newChildItem);
      } else if (type === constants.COMPONENT_PROPERTY_STRING_TYPE
        || type === constants.COMPONENT_PROPERTY_OBJECT_TYPE
        || type === constants.COMPONENT_PROPERTY_ONE_OF_TYPE
        || type === constants.COMPONENT_PROPERTY_SYMBOL_TYPE
        || type === constants.COMPONENT_PROPERTY_BOOL_TYPE
        || type === constants.COMPONENT_PROPERTY_ANY_TYPE
        || type === constants.COMPONENT_PROPERTY_ARRAY_TYPE
        || type === constants.COMPONENT_PROPERTY_NUMBER_TYPE) {
        let defaultValue = null;
        if (!isUndefined(defaults)) {
          if (name) {
            defaultValue = defaults[name];
          } else {
            defaultValue = defaults;
          }
        }
        if (!isUndefined(defaultValue)) {
          if (type === constants.COMPONENT_PROPERTY_ANY_TYPE
            || constants.COMPONENT_PROPERTY_ARRAY_TYPE
            || constants.COMPONENT_PROPERTY_OBJECT_TYPE) {
            newChildItem.props.propertyValue = cloneDeep(defaultValue);
          } else {
            newChildItem.props.propertyValue = defaultValue;
          }
        }
        if (variants && variants.length > 0) {
          newChildItem.props.propertyValueVariants = cloneDeep(variants);
        }
        result.push(newChildItem);
      } else if (
        type === constants.COMPONENT_PROPERTY_ELEMENT_TYPE
        || type === constants.COMPONENT_PROPERTY_NODE_TYPE
      ) {
        // todo: it seems we don't need to specify the special component name for the placeholder on the page composer
        newChildItem.props.componentName = '__PlaceHolder';
        result.push(newChildItem);
      } else if (type === constants.COMPONENT_PROPERTY_FUNCTION_TYPE) {
        result.push(newChildItem);
      } else if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
        if (name) {
          // we have the named object property
          const defaultValue = defaults ? defaults[name] : {};
          if (childProperties && childProperties.length > 0) {
            newChildItem.children = traverseProperties(childProperties, defaultValue || {});
          }
        } else {
          // we have the unnamed object that is the item of the array
          newChildItem.children = traverseProperties(childProperties, defaults || {});
        }
        result.push(newChildItem);
      } else if (type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
        if (childProperties && childProperties.length > 0) {
          // we have to keep children properties as a sample for the new array item
          newChildItem.props.defaultChildren = [];
          newChildItem.props.defaultChildren = traverseProperties(childProperties, null);
          newChildItem.children = [];
          let defaultValue;
          if (name) {
            defaultValue = defaults ? defaults[name] : null;
          } else {
            defaultValue = defaults;
          }
          // named array field in the defaults
          if (defaultValue && defaultValue.length > 0) {
            defaultValue.forEach(defaultValueArrayItem => {
              newChildItem.children = newChildItem.children.concat(
                traverseProperties(childProperties, defaultValueArrayItem)
              );
            });
          }
        }
        result.push(newChildItem);
      }
    });
  }
  if (result.length > 0) {
    result = orderBy(result, propItem => {
      if (propItem && propItem.props) {
        return propItem.props.propertyName;
      }
      return undefined;
    });
  }
  return result;
}
