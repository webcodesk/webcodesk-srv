import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
import constants from '../../../../commons/constants';

class PageModelCompiler {

  changesCount = 0;
  errorsCount = 0;

  instanceErrors = 0;

  constructor ({componentsGraphModel}) {
    this.componentsGraphModel = componentsGraphModel;
  }

  testComponentModel(instanceModel) {
    const { props: {componentName, componentInstance}, children } = instanceModel;
    const foundComponentModel = this.componentsGraphModel.getNode(componentName);
    // reset errors count before the each instance traversing
    this.instanceErrors = 0;
    if (foundComponentModel) {
      // there is such a component in the resource tree
      // remove error if the error is here
      if (instanceModel.props.errors
        && instanceModel.props.errors[constants.COMPILER_ERROR_COMPONENT_NOT_FOUND]) {
        delete instanceModel.props.errors[constants.COMPILER_ERROR_COMPONENT_NOT_FOUND];
        this.changesCount++;
      }
      if (children && children.length > 0) {
        const { props: {properties: modelProperties} } = foundComponentModel;
        instanceModel.children = this.testProperties(modelProperties, children);
      }
    } else {
      // we didn't find such a component model
      // add the error to replace the element property
      instanceModel.props.errors =
        instanceModel.props.errors || {};
      instanceModel.props.errors[constants.COMPILER_ERROR_COMPONENT_NOT_FOUND] =
        `The ${componentName} component was not found.`;
      this.changesCount++;
      this.errorsCount++;
      this.instanceErrors++;
        // clear children in the unknown instance
      instanceModel.children = [];
    }
    if (this.instanceErrors > 0) {
      instanceModel.props.errors =
        instanceModel.props.errors || {};
      instanceModel.props.errors[constants.COMPILER_ERROR_INSTANCE_HAS_PROPERTIES_ERRORS] =
        `The ${componentInstance} instance has errors in properties.`;
      this.changesCount++;
    } else {
      if (instanceModel.props.errors
        && instanceModel.props.errors[constants.COMPILER_ERROR_INSTANCE_HAS_PROPERTIES_ERRORS]) {
        delete instanceModel.props.errors[constants.COMPILER_ERROR_INSTANCE_HAS_PROPERTIES_ERRORS];
        this.changesCount++;
      }
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

      if (
        modelPropertyType !== instancePropertyType
        && (
          modelPropertyType !== constants.COMPONENT_PROPERTY_ELEMENT_TYPE
          && instancePropertyType !== constants.PAGE_COMPONENT_TYPE
        )
      ) {
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

        if (instancePropertyType === constants.PAGE_COMPONENT_TYPE) {
          instanceProperty = this.testComponentModel(instanceProperty);
        } else if (instancePropertyType === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
          instanceProperty.children =
            this.testProperties(modelPropsChildren, instanceProperty.children);
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
    if (nodeModel && nodeModel.type === constants.PAGE_COMPONENT_TYPE) {
        nodeModel = this.testComponentModel(nodeModel);
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

export default PageModelCompiler;