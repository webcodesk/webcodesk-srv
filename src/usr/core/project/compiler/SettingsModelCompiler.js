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

import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
import constants from '../../../../commons/constants';

class SettingsModelCompiler {

  changesCount = 0;
  errorsCount = 0;

  instanceErrors = 0;

  constructor ({settingsConfGraphModel}) {
    this.settingsConfGraphModel = settingsConfGraphModel;
  }

  testSettingsModel(instanceModel) {
    const { props: {settingsProperties} } = instanceModel;
    const foundSettingsConfModel = this.settingsConfGraphModel.getNode(constants.GRAPH_MODEL_SETTINGS_CONF_KEY);
    // reset errors count before the each instance traversing
    this.instanceErrors = 0;
    if (foundSettingsConfModel) {
      const { props: {settingsConfProperties} } = foundSettingsConfModel;
      if (settingsProperties && settingsProperties.length > 0) {
        instanceModel.props.settingsProperties = this.testProperties(settingsConfProperties, settingsProperties);
      } else {
        instanceModel.props.settingsProperties = cloneDeep(settingsConfProperties);
      }
    } else {
      // settings configuration was not found
      instanceModel.props.settingsProperties = [];
    }
    this.instanceErrors = 0;
    return instanceModel;
  }

  testArray(arrayChildren, modelDefaultChildren) {
    const newArrayChildren = [];
    if (modelDefaultChildren && modelDefaultChildren.length > 0) {
      // we take the first default item as the testing reference
      const defaultArrayItemModel = modelDefaultChildren[0];
      if (arrayChildren && arrayChildren.length > 0) {
        let newItem;
        arrayChildren.forEach((arrayItem, itemIdx) => {
          if (arrayItem) {
            newItem = this.testProperty(defaultArrayItemModel, arrayItem);
            newArrayChildren.push(newItem);
          }
        });
      }
      return newArrayChildren;
    }
    // this is not usual if the array of types does not have any default item type
    // still return empty array for the children array
    this.changesCount++;
    return newArrayChildren;
  }

  testProperty(modelProperty, instanceProperty) {
    if (instanceProperty && modelProperty) {
      const {
        type: modelPropertyType,
        props: modelPropertyProps,
        children: modelPropsChildren
      } = modelProperty;

      const {
        type: instancePropertyType,
        props: {propertyName}
      } = instanceProperty;

      if (modelPropertyType !== instancePropertyType) {
        // when there are different types change the entire property
        instanceProperty = {
          type: modelPropertyType,
          props: cloneDeep(modelPropertyProps),
          children: cloneDeep(modelPropsChildren)
        };
        // we completely update the property with the model's one
        instanceProperty.props.errors =
          instanceProperty.props.errors || {};
        instanceProperty.props.errors[constants.COMPILER_ERROR_PROPERTY_REPLACED] =
          `The ${propertyName} property was replaced with the new one but with different type.`;
        this.changesCount++;
        this.errorsCount++;
        this.instanceErrors++;
      } else {
        // the instance property has the same type as found model's property
        instanceProperty.props.propertyComment = modelPropertyProps.propertyComment;
        instanceProperty.props.propertyLabel = modelPropertyProps.propertyLabel;
        if (modelPropertyProps.propertyValueVariants) {
          instanceProperty.props.propertyValueVariants =
            cloneDeep(modelPropertyProps.propertyValueVariants);
        }
        // remove error if the error is here
        if (instanceProperty.props.errors
          && instanceProperty.props.errors[constants.COMPILER_ERROR_PROPERTY_REPLACED]) {
          delete instanceProperty.props.errors[constants.COMPILER_ERROR_PROPERTY_REPLACED];
          this.changesCount++;
        }

        if (instancePropertyType === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
          instanceProperty.children =
            this.testProperties(modelPropsChildren, instanceProperty.children || []);
        } else if (instancePropertyType === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
          // array should have default children to test the items
          // clone them into the instance property
          instanceProperty.props.defaultChildren = modelPropertyProps.defaultChildren
            ? cloneDeep(modelPropertyProps.defaultChildren)
            : [];
          // check the array items consistency against new default children
          instanceProperty.children =
            this.testArray(instanceProperty.children, instanceProperty.props.defaultChildren);
        }

      }
    }
    return instanceProperty;
  }

  testProperties(modelProperties, instanceProperties) {
    const modelPropertiesMap = {};
    if (modelProperties && modelProperties.length > 0) {
      modelProperties.forEach(modelPropertyItem => {
        if (modelPropertyItem) {
          const { props: {propertyName} } = modelPropertyItem;
          if (propertyName) {
            modelPropertiesMap[propertyName] = modelPropertyItem;
          }
        }
      });
    }
    const instancePropertiesMap = {};
    if (instanceProperties && instanceProperties.length > 0) {
      const newInstanceProperties = [];
      instanceProperties.forEach(instancePropertyItem => {
        if (
          instancePropertyItem
          && instancePropertyItem.props
        ) {
          const { type, props: {propertyName} } = instancePropertyItem;
          if (propertyName) {
            // the named property
            if (modelPropertiesMap[propertyName]) {
              // we found property with the same name
              // remove error if the error is here
              if (type !== constants.COMPONENT_PROPERTY_FUNCTION_TYPE) {
                if (instancePropertyItem.props.errors
                  && instancePropertyItem.props.errors[constants.COMPILER_ERROR_PROPERTY_NOT_FOUND]) {
                  delete instancePropertyItem.props.errors[constants.COMPILER_ERROR_PROPERTY_NOT_FOUND];
                  this.changesCount++;
                }
              }
              let newInstancePropertyItem = this.testProperty(modelPropertiesMap[propertyName], instancePropertyItem);
              newInstanceProperties.push(newInstancePropertyItem);
            } else {
              // there is no such a property in the model
              if (type !== constants.COMPONENT_PROPERTY_FUNCTION_TYPE) {
                instancePropertyItem.props.errors = instancePropertyItem.props.errors || {};
                instancePropertyItem.props.errors[constants.COMPILER_ERROR_PROPERTY_NOT_FOUND] =
                  `The ${propertyName} property was not found.`;
                this.changesCount++;
                this.errorsCount++;
                this.instanceErrors++;
              }
              newInstanceProperties.push(instancePropertyItem);
            }
            // add the reference in the instance props map
            instancePropertiesMap[propertyName] = instancePropertyItem;
          }
        }
      });
      instanceProperties = newInstanceProperties;
    }

    if (modelProperties && modelProperties.length > 0) {
      modelProperties.forEach(modelPropertyItem => {
        if (modelPropertyItem) {
          const { props: {propertyName} } = modelPropertyItem;
          if (propertyName) {
            if (!instancePropertiesMap[propertyName]) {
              // there is no such a property in the instance properties
              instanceProperties.push(cloneDeep(modelPropertyItem));
              this.changesCount++;
            }
          }
        }
      });
    }

    return orderBy(instanceProperties, o => o.props.propertyName);

  }

  compile(nodeModel) {
    if (nodeModel && nodeModel.type === constants.GRAPH_MODEL_SETTINGS_TYPE) {
        nodeModel = this.testSettingsModel(nodeModel);
    }
    return nodeModel;
  }

  resetCounters() {
    this.errorsCount = 0;
    this.changesCount = 0;
  }

  getErrorsCount() {
    return this.errorsCount;
  }

  getChangesCount() {
    return this.changesCount;
  }

}

export default SettingsModelCompiler;