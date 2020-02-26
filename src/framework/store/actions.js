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

import queryString from 'query-string';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import isUndefined from 'lodash/isUndefined';
import { COMPONENT_TYPE, USER_FUNCTION_TYPE, DISPATCH_ERROR_TYPE} from './constants';
import { getUserFunctionByName } from './sequences';

function dispatchToComponent (props, payload, dispatch, helpers) {
  if (props) {
    const {
      componentName, componentInstance, propertyName, forwardPath, componentKey
    } = props;
    try {
      if (forwardPath && helpers) {
        const { history } = helpers;
        if (history) {
          // hmmm... why there can not be the history helper?
          let pathString = `/${forwardPath}`;
          if (!isUndefined(payload)) {
            if (isNumber(payload) || isString(payload)) {
              // if user function dispatches string or number we pass it as the :parameter in the http request
              pathString = `${pathString}/${payload}`;
            } else if (isObject(payload) || isArray(payload)) {
              // if user function dispatches an object or an array we pass it as the request query
              pathString = `${pathString}?${queryString.stringify(payload)}`;
            } else {
              console.error(
                '[Framework] The mapping to parameters in URL is possible only for ' +
                'a string, a number, an object, or an array.'
              );
            }
          }
          history.push(pathString);
        } else if (propertyName) {
          // hmmm... why there can not be the history helper?
          const targetKey = `${componentName}_${componentInstance}`;
          dispatch({ type: targetKey, payload: { [propertyName]: payload } });
        }
      } else {
        const targetKey = `${componentName}_${componentInstance}`;
        dispatch({ type: targetKey, payload: { [propertyName]: payload } });
      }
    } catch (e) {
      console.error(`[Framework] ${e.message}`);
    }
  }
}

function findEventTargets (events, type) {
  let result;
  if (events && events.length > 0) {
    const event = events.find(targetEvent => targetEvent.name === type);
    if (event && event.targets && event.targets.length > 0) {
      result = event.targets;
    }
  }
  return result;
}

function executeUserFunctionDispatch (
  events, innerTasks, functionKey, functionName, dispatchPayloads, dispatch, getState, helpers
) {
  const dispatchTypeKeys = dispatchPayloads ? Object.keys(dispatchPayloads) : null;
  let dispatchType;
  let payload;
  if (dispatchTypeKeys && dispatchTypeKeys.length > 0) {
    for (let i = 0; i < dispatchTypeKeys.length; i++) {
      dispatchType = dispatchTypeKeys[i];
      // check if the user function dispatches any event
      const eventTargets = findEventTargets(events, dispatchType);
      if (eventTargets && eventTargets.length > 0) {
        payload = dispatchPayloads[dispatchType];
        eventTargets.forEach(eventTarget => {
          const { type: eventTargetType, props: eventTargetProps } = eventTarget;
          if (eventTargetType === COMPONENT_TYPE) {
            dispatchToComponent(eventTargetProps, payload, dispatch, helpers);
          }
        });
        if (innerTasks[dispatchType] && innerTasks[dispatchType].length > 0) {
          innerTasks[dispatchType].forEach(task => {
            const { func } = task;
            func.apply(null, [payload])(dispatch, getState, helpers);
          });
        }
      }
    }
  }
}

function createTasks (targets) {
  const tasks = [];
  if (targets && targets.length > 0) {
    targets.forEach(target => {
      const { type, props, events } = target;
      if (type === USER_FUNCTION_TYPE && props) {
        const func = getUserFunctionByName(props.functionName);
        if (func) {
          // we need to check if there is a user function sequence
          let innerTasks = {};
          if (events && events.length > 0) {
            events.forEach(innerEvent => {
              if (innerEvent && innerEvent.targets) {
                // select only user function targets
                const userFunctionTargets =
                  innerEvent.targets.filter(innerEventTarget => innerEventTarget.type === USER_FUNCTION_TYPE);
                if (userFunctionTargets && userFunctionTargets.length > 0) {
                  innerTasks[innerEvent.name] = innerTasks[innerEvent.name] || [];
                  innerTasks[innerEvent.name] = [
                    ...innerTasks[innerEvent.name],
                    ...createTasks(userFunctionTargets)
                  ];
                }
              }
            });
          }
          // create dispatchFunction in order to reuse its instance in the action function body
          const dispatchFunction = (functionKey, functionName, dispatchPayloads, dispatch, getState, helpers) => {
            executeUserFunctionDispatch(
              events, innerTasks, functionKey, functionName, dispatchPayloads, dispatch, getState, helpers
            );
          };
          // this function is used to pass the error object caught by the exception caching
          // the function is called with null error object before each user function invocation
          // this will let user to do not worry about the clearing of the error object
          const caughtExceptionFunction = (functionKey, functionName, error, dispatch, getState, helpers) => {
            executeUserFunctionDispatch(
              events,
              innerTasks,
              functionKey,
              functionName,
              {[DISPATCH_ERROR_TYPE]: error},
              dispatch,
              getState,
              helpers
            );
            if (error) {
              console.error(`[Framework] In "${props.functionName}" function ${error.message}.`);
            }
          };
          // push function reference for user function dispatch
          tasks.push({
            functionKey: props.functionKey,
            funcName: props.functionName,
            func: function () {
              const args = arguments;
              return (dispatch, getState, helpers) => {
                // before execute the function we have to transform the input argument if needed
                try {
                  const firstArgument = args[0];
                  const userFunctionInstance = func.apply(null, [firstArgument]);
                  try {
                    // dispatch caughtException as null to the assigned targets
                    caughtExceptionFunction(
                      props.functionKey,
                      props.functionName,
                      null,
                      dispatch,
                      getState,
                      helpers
                    );
                    // now execute dispatching of the events objects to the targets
                    const userFunctionResult = userFunctionInstance((dispatchPayloads) => {
                      // user function is invoked now
                      dispatchFunction(
                        props.functionKey,
                        props.functionName,
                        dispatchPayloads,
                        dispatch,
                        getState,
                        helpers
                      );
                    });
                    // here user returns a Promise and there may be the error
                    if (userFunctionResult && userFunctionResult.then) {
                      userFunctionResult.catch(error => {
                        caughtExceptionFunction(
                          props.functionKey,
                          props.functionName,
                          error,
                          dispatch,
                          getState,
                          helpers
                        );
                      });
                    }
                  } catch (error) {
                    caughtExceptionFunction(
                      props.functionKey,
                      props.functionName,
                      error,
                      dispatch,
                      getState,
                      helpers
                    );
                  }
                } catch (e) {
                  console.error(`[Framework] ${e.message}`);
                }
              };
            }
          });
        } else {
          console.error(`[Framework] Missing function: ${props.functionName}`);
        }
      } else if (type === COMPONENT_TYPE && props) {
        tasks.push({
          func: function () {
            const args = arguments;
            // arguments here is the passed parameters from the component event handler
            // we have to take only the first argument as a payload
            let payload = null;
            if (args.length > 0) {
              payload = args[0];
            }
            return (dispatch, getState, helpers) => {
              dispatchToComponent(props, payload, dispatch, helpers);
            };
          }
        });
      }
    });
  }
  return tasks;
}

function createActions (eventHandlers) {
  const actions = {};
  if (eventHandlers && eventHandlers.length > 0) {
    eventHandlers.forEach(eventHandler => {
      const { name, targets } = eventHandler;
      const tasks = createTasks(targets);
      actions[name] = function () {
        const args = arguments;
        return (dispatch, getState, helpers) => {
          if (tasks.length > 0) {
            tasks.forEach(task => {
              if (task.func) {
                task.func.apply(null, args)(dispatch, getState, helpers);
              }
            });
          }
        };
      };
    });
  }
  return actions;
}

const actionsCache = new Map();
const transformFunctionsCache = new Map();

export function clearActionsCache () {
  actionsCache.clear();
  transformFunctionsCache.clear();
}

export default function (eventHandlersKey, eventHandlers) {
  let actions = actionsCache.get(eventHandlersKey);
  if (!actions) {
    actions = createActions(eventHandlers);
    actionsCache.set(eventHandlersKey, actions);
  }
  return actions;
};
