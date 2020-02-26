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
        }
      ],
    },
  };
}

export function createFlowModelForComponent(resourceObject, inBasket) {
  let title = textUtils.cutText(resourceObject.componentInstance, 35);
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
    flowModel.props.inputs = [{
      name: 'props',
    }];
    flowModel.props.outputs = [];
    if (resourceObject.instanceProperties && resourceObject.instanceProperties.length > 0) {
      resourceObject.instanceProperties.forEach(property => {
        const {type, props} = property;
        // const propertyRef = resourceObject.propertiesRefMap[props.propertyName];
        if (type === constants.COMPONENT_PROPERTY_FUNCTION_TYPE) {
          flowModel.props.outputs.push({
            name: props.propertyName,
          });
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
    title = textUtils.cutText(nameParts[nameParts.length - 1], 35);
    searchName = nameParts[nameParts.length - 1];
  } else {
    title = textUtils.cutText(resourceObject.functionName, 35);
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
      }];
    flowModel.props.outputs = [];
    if (resourceObject.dispatches && resourceObject.dispatches.length > 0) {
      resourceObject.dispatches.forEach(dispatch => {
        flowModel.props.outputs.push({
          name: dispatch.name,
        });
      });
    }
  }
  return flowModel;
}
