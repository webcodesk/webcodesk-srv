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

import forOwn from 'lodash/forOwn';
import * as constants from '../../../commons/constants';
import * as textUtils from '../utils/textUtils';

function propertiesComparator(a, b) {
  if (a.name === 'caughtException') {
    return 1;
  }
  if (b.name === 'caughtException') {
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
        const {componentName, componentInstance, componentKey, propertyName, forwardPath, populatePath} = props;
        if (forwardPath) {
          let searchName;
          const pagePathParts = forwardPath ? forwardPath.split(constants.FILE_SEPARATOR) : [];
          if (pagePathParts.length > 1) {
            searchName = pagePathParts[pagePathParts.length - 1];
          } else {
            searchName = forwardPath;
          }
          model = {
            key: componentKey,
            type: constants.FLOW_PAGE_TYPE,
            props: {
              title: textUtils.cutPagePath(forwardPath, 20, 2),
              searchName,
              forwardPath,
              subtitle: '',
              inputs: [
                {
                  name: 'forward',
                  connectedTo: eventName,
                }
              ],
              outputs: [
                {
                  name: 'queryParams',
                }
              ],
            },
            children: [],
          };
        } else {
          model = {
            key: componentKey,
            type: constants.FLOW_COMPONENT_INSTANCE_TYPE,
            props: {
              title: textUtils.cutText(componentInstance, 25),
              searchName: componentInstance,
              componentName: componentName,
              componentInstance: componentInstance,
              // forwardPath,
              populatePath,
              subtitle: '',
              outputs: [],
            },
            children: [],
          };
          if (populatePath) {
            model.props.inputs = [
              {
                name: propertyName,
                connectedTo: 'queryParams'
              }
            ];
          } else {
            model.props.inputs = [
              {
                name: propertyName,
                connectedTo: eventName,
              }
            ];
          }
        }
      } else if (type === constants.FRAMEWORK_ACTION_SEQUENCE_USER_FUNCTION_TYPE) {
        const {functionName, functionKey,} = props;
        let title;
        let searchName;
        const nameParts = functionName ? functionName.split(constants.MODEL_KEY_SEPARATOR) : [];
        if (nameParts.length > 1) {
          title = textUtils.cutText(nameParts[nameParts.length - 1], 25);
          searchName = nameParts[nameParts.length - 1];
        } else {
          title = textUtils.cutText(functionName, 25);
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
      model.props.inputs = model.props.inputs.sort((a, b) => a.name.localeCompare(b.name));
      // add extra output for caught error if there were assigned output
      if (model.type === constants.FLOW_USER_FUNCTION_TYPE) {
        if (model.props.outputs.findIndex(i => i.name === 'caughtException') < 0) {
          model.props.outputs.push({
            name: 'caughtException'
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
    const {events, componentName, componentInstance, componentKey, forwardPath} = actionSequence;
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
      if (forwardPath) {
        // this is the top level page
        let searchName;
        const pagePathParts = forwardPath ? forwardPath.split(constants.FILE_SEPARATOR) : [];
        if (pagePathParts.length > 1) {
          searchName = pagePathParts[pagePathParts.length - 1];
        } else {
          searchName = forwardPath;
        }
        model.type = constants.FLOW_PAGE_TYPE;
        model.props.title = textUtils.cutPagePath(forwardPath, 20, 2);
        model.props.searchName = searchName;
        model.props.forwardPath = forwardPath;
        model.props.outputs = [
          {
            name: 'queryParams',
          }
        ];
      } else {
        // this is the top level page component
        model.type = constants.FLOW_COMPONENT_INSTANCE_TYPE;
        model.props.title = textUtils.cutText(componentInstance, 25);
        model.props.searchName = componentInstance;
        model.props.componentName = componentName;
        model.props.componentInstance = componentInstance;
      }
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