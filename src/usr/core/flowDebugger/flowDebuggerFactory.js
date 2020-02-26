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

import forOwn from 'lodash/forOwn';
import * as constants from '../../../commons/constants';
import * as textUtils from '../utils/textUtils';

function propertiesComparator(a, b) {
  if (a.name === constants.FUNCTION_OUTPUT_ERROR_NAME) {
    return 1;
  }
  if (b.name === constants.FUNCTION_OUTPUT_ERROR_NAME) {
    return -1;
  }
  return a.name.localeCompare(b.name);
}

function createFlowByEventTargets(event) {
  const models = [];
  const {name: eventName, targets} = event;
  if (targets && targets.length > 0) {
    let model;
    targets.forEach(target => {
      const {type, props, events} = target;
      if (type === constants.FRAMEWORK_ACTION_SEQUENCE_COMPONENT_TYPE) {
        const { componentName, componentInstance, componentKey } = props;
        model = {
          key: componentKey,
          type: constants.FLOW_COMPONENT_INSTANCE_TYPE,
          props: {
            title: textUtils.cutText(componentInstance, 25),
            searchName: componentInstance,
            componentName: componentName,
            componentInstance: componentInstance,
            subtitle: '',
            outputs: [],
            inputs: [
              {
                name: 'props',
                connectedTo: eventName,
              }
            ]
          },
          children: [],
        };
      } else if (type === constants.FRAMEWORK_ACTION_SEQUENCE_USER_FUNCTION_TYPE) {
        const {functionName, functionKey} = props;
        let title;
        let searchName;
        const nameParts = functionName ? functionName.split(constants.MODEL_KEY_SEPARATOR) : [];
        if (nameParts.length > 1) {
          title = textUtils.cutText(nameParts[nameParts.length - 1], 35);
          searchName = nameParts[nameParts.length - 1];
        } else {
          title = textUtils.cutText(functionName, 35);
          searchName = functionName;
        }
        model = {
          key: functionKey,
          type: constants.FLOW_USER_FUNCTION_TYPE,
          props: {
            title,
            searchName,
            functionName,
            inputs: [
              {
                name: 'callFunction',
                connectedTo: eventName,
              }
            ],
            outputs: [],
          },
          children: [],
        };
      }
      if (events && events.length > 0) {
        events.forEach(event => {
          model.props.outputs.push({
            name: event.name,
          });
          model.children = model.children.concat(createFlowByEventTargets(event));
        });
      }
      // model.props.inputs = model.props.inputs.sort((a, b) => a.name.localeCompare(b.name));
      // add extra output for caught error if there were assigned output
      if (model.type === constants.FLOW_USER_FUNCTION_TYPE) {
        if (model.props.outputs.findIndex(i => i.name === constants.FUNCTION_OUTPUT_ERROR_NAME) < 0) {
          model.props.outputs.push({
            name: constants.FUNCTION_OUTPUT_ERROR_NAME
          });
        }
      }
      model.props.outputs = model.props.outputs.sort(propertiesComparator);
      models.push(model);
    });
  }
  return models;
}

function createFlowBySequence(actionSequence) {
  if (actionSequence) {
    const {events, componentName, componentInstance, componentKey} = actionSequence;
    const model = {
      key: componentKey,
      props: {
        outputs: events && events.length > 0
          ? events.map(event => ({name: event.name}))
          : []
      },
      children: [],
    };
    if (events && events.length > 0) {
      events.forEach(event => {
        model.children = model.children.concat(createFlowByEventTargets(event));
      });
    }
    if (componentName === 'applicationStartWrapper' && componentInstance === 'wrapperInstance') {
      model.type = constants.FLOW_APPLICATION_STARTER_TYPE;
      model.props.title = 'Application';
    } else {
      // this is the top level page component
      model.type = constants.FLOW_COMPONENT_INSTANCE_TYPE;
      model.props.title = textUtils.cutText(componentInstance, 35);
      model.props.searchName = componentInstance;
      model.props.componentName = componentName;
      model.props.componentInstance = componentInstance;
    }
    model.props.outputs = model.props.outputs.sort(propertiesComparator);
    return model;
  }
}

export function createFlowModelByActionSequences(actionSequences) {
  const starterPointChildren = [];
  let model;
  forOwn(actionSequences, (value, props) => {
    model = createFlowBySequence(value);
    if (model) {
      model.props = model.props || {};
      model.props.inputs = model.props.inputs || [];
      model.props.inputs.push({
        name: 'entry',
        connectedTo: 'entries',
      });
      starterPointChildren.push(model);
    }
  });

  return {
    key: 'debuggerFlowStarterPointKey',
    type: constants.FLOW_APPLICATION_STARTER_TYPE,
    props: {
      title: 'Start Point',
      inputs: [],
      outputs: [
        {
          name: 'entries'
        }
      ],
    },
    children: starterPointChildren,
  }
}