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
