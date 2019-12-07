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
import constants from '../../../commons/constants';
import * as textUtils from '../utils/textUtils';

export function createDefaultFlowModel() {
  return {
    type: constants.FLOW_APPLICATION_STARTER_TYPE,
    props: {
      title: 'Application',
      searchName: 'Application',
      outputs: [
        {
          name: 'onApplicationStart',
          properties: {
            type: constants.COMPONENT_PROPERTY_FUNCTION_TYPE,
            children: [],
          }
        }
      ],
    },
  };
}

export function createFlowModelForComponent(resourceObject, inBasket) {
  let title = textUtils.cutText(resourceObject.componentInstance, 25);
  // let subtitle = componentName;
  // if (subtitle) {
  //   const nameParts = componentName.split(constants.MODEL_KEY_SEPARATOR);
  //   subtitle = textUtils.cutText(nameParts[nameParts.length - 1]);
  // }
  const flowModel = {
    type: constants.FLOW_COMPONENT_INSTANCE_TYPE,
    props: {
      componentName: resourceObject.componentName,
      componentInstance: resourceObject.componentInstance,
      title,
      searchName: resourceObject.componentInstance,
      subtitle: '',
    }
  };
  if (inBasket) {
    flowModel.type = constants.FLOW_COMPONENT_INSTANCE_IN_BASKET_TYPE;
    flowModel.props.position = inBasket.position;
  }
  if (resourceObject.isFlowComponentInstance) {
    flowModel.props.inputs = cloneDeep(resourceObject.inputs);
    flowModel.props.outputs = cloneDeep(resourceObject.outputs);
    if (inBasket) {
      // we don't need connection point in the input if we pass the copy of the component instance
      if (flowModel.props.inputs.length > 0) {
        for (let i = 0; i < flowModel.props.inputs.length; i++) {
          delete flowModel.props.inputs[i].connectedTo;
        }
      }
    }
  } else if (resourceObject.isComponentInstance) {
    flowModel.props.inputs = [];
    flowModel.props.outputs = [];
    if (resourceObject.properties && resourceObject.properties.length > 0) {
      resourceObject.properties.forEach(property => {
        const {type, props} = property;
        const propertyRef = resourceObject.propertiesRefMap[props.propertyName];
        if (type === constants.COMPONENT_PROPERTY_FUNCTION_TYPE) {
          flowModel.props.outputs.push({
            name: props.propertyName,
            properties: propertyRef ? cloneDeep(propertyRef) : {}
          });
        } else {
          if (props.propertyName !== constants.COMPONENT_PROPERTY_DO_NOT_USE_IN_FLOWS_NAME) {
            flowModel.props.inputs.push({
              name: props.propertyName,
              properties: propertyRef ? cloneDeep(propertyRef) : {}
            });
          }
        }
      });
    }
  }
  return flowModel;
}

export function createFlowModelForFunction(resourceObject, inBasket) {
  let title;
  let searchName;
  const nameParts = resourceObject.functionName
    ? resourceObject.functionName.split(constants.MODEL_KEY_SEPARATOR)
    : [];
  if (nameParts.length > 1) {
    title = textUtils.cutText(nameParts[nameParts.length - 1], 25);
    searchName = nameParts[nameParts.length - 1];
  } else {
    title = textUtils.cutText(resourceObject.functionName, 25);
    searchName = resourceObject.functionName;
  }
  const flowModel = {
    type: constants.FLOW_USER_FUNCTION_TYPE,
    props: {
      functionName: resourceObject.functionName,
      title,
      subtitle: '',
      searchName,
    }
  };
  if (inBasket) {
    flowModel.type = constants.FLOW_USER_FUNCTION_IN_BASKET_TYPE;
    flowModel.props.position = inBasket.position;
  }
  if (resourceObject.isFlowUserFunction) {
    flowModel.props.inputs = cloneDeep(resourceObject.inputs);
    flowModel.props.outputs = cloneDeep(resourceObject.outputs);
    if (inBasket) {
      // we don't need connection point in the input if we pass the copy of the function instance
      if (flowModel.props.inputs.length > 0) {
        for (let i = 0; i < flowModel.props.inputs.length; i++) {
          delete flowModel.props.inputs[i].connectedTo;
        }
      }
    }
  } else if (resourceObject.isUserFunction) {
    flowModel.props.inputs = [{
        name: 'callFunction',
        properties: {
          type: constants.COMPONENT_PROPERTY_SHAPE_TYPE,
          props: {
            isRequired: true,
          },
          children: resourceObject.propertiesRef ? cloneDeep(resourceObject.propertiesRef) : [],
        }
      }];
    flowModel.props.outputs = [];
    if (resourceObject.dispatches && resourceObject.dispatches.length > 0) {
      resourceObject.dispatches.forEach(dispatch => {
        flowModel.props.outputs.push({
          name: dispatch.name,
          properties: {
            type: constants.COMPONENT_PROPERTY_SHAPE_TYPE,
            children: dispatch.propertiesRef ? cloneDeep(dispatch.propertiesRef) : []
          }
        });
      });
    }
  }
  return flowModel;
}

export function createFlowModelForPage(resourceObject, inBasket) {
  let searchName;
  let title = textUtils.cutPagePath(resourceObject.pagePath, 20, 2);
  const pagePathParts = resourceObject.pagePath
    ? resourceObject.pagePath.split(constants.FILE_SEPARATOR)
    : [];
  if (pagePathParts.length > 1) {
    searchName = pagePathParts[pagePathParts.length - 1];
  } else {
    searchName = resourceObject.pagePath;
  }
  const flowModel = {
    type: constants.FLOW_PAGE_TYPE,
    props: {
      pageName: resourceObject.pageName,
      pagePath: resourceObject.pagePath,
      title,
      subtitle: '',
      searchName,
    }
  };
  if (inBasket) {
    flowModel.type = constants.FLOW_PAGE_IN_BASKET_TYPE;
    flowModel.props.position = inBasket.position;
  }
  if (resourceObject.isFlowPage) {
    flowModel.props.inputs = cloneDeep(resourceObject.inputs);
    flowModel.props.outputs = cloneDeep(resourceObject.outputs);
    if (inBasket) {
      // we don't need connection point in the input if we pass the copy of the page instance
      if (flowModel.props.inputs.length > 0) {
        for (let i = 0; i < flowModel.props.inputs.length; i++) {
          delete flowModel.props.inputs[i].connectedTo;
        }
      }
    }
  } else if (resourceObject.isPage) {
    flowModel.props.inputs = [
      {
        name: 'forward',
        properties: {
          type: constants.COMPONENT_PROPERTY_SHAPE_TYPE,
          props: {
            propertyComment: 'Accepting object'
          },
          children: [],
        },
      }
    ];
    flowModel.props.outputs = [
      {
        name: 'queryParams',
        properties: {
          type: constants.COMPONENT_PROPERTY_SHAPE_TYPE,
          props: {
            propertyComment: 'Object has the same fields in the object passed in to the forward input.'
          },
          children: [],
        },
      }
    ];
  }
  return flowModel;
}
