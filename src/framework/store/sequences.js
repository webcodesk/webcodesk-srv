import uniqueId from 'lodash/uniqueId';
import forOwn from 'lodash/forOwn';
import get from 'lodash/get';
import merge from 'lodash/merge';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';
import unionWith from 'lodash/unionWith';
import { COMPONENT_TYPE, USER_FUNCTION_TYPE } from './constants';

let userFunctions = {};

function getTargetPropertiesFromEvents (events, targetProperties) {
  if (events && events.length > 0) {
    events.forEach(event => {
      const { targets } = event;
      if (targets && targets.length > 0) {
        let key;
        let propertiesObject;
        targets.forEach(target => {
          const { type, props, events } = target;
          if (type === COMPONENT_TYPE && props) {
            const { componentName, componentInstance, propertyName, populatePath } = props;
            if (propertyName) {
              key = `${componentName}_${componentInstance}`;
              propertiesObject = targetProperties[key] || {};
              // tell the that this property should be bind to the http request query
              propertiesObject[propertyName] = merge({}, propertiesObject[propertyName], {
                populatePath
              });
              targetProperties[key] = propertiesObject;
            }
          }
          getTargetPropertiesFromEvents(events, targetProperties);
        });
      }
    });
  }
}

function deriveTargetProperties (actionSequences, targetProperties = {}) {
  forOwn(actionSequences, (value, prop) => {
    getTargetPropertiesFromEvents(value.events, targetProperties);
  });
  return targetProperties;
}

function getEventSequence (event) {
  const eventSequence = {};
  const { name, targets } = event;
  if (targets && targets.length > 0) {
    eventSequence.name = name;
    eventSequence.targets = [];
    targets.forEach(target => {
      const { type, props, events } = target;
      if (props && !isEmpty(props)) {
        const newTarget = {
          type,
        };
        if (type === USER_FUNCTION_TYPE) {
          newTarget.props = {
            ...props,
            functionKey: uniqueId('seqNode')
          };
        } else if (type === COMPONENT_TYPE) {
          newTarget.props = {
            ...props,
            componentKey: uniqueId('seqNode')
          };
        }
        if (events && events.length > 0 && type === USER_FUNCTION_TYPE) {
          const newTargetEvents = [];
          events.forEach(targetEvent => {
            newTargetEvents.push(getEventSequence(targetEvent));
          });
          newTarget.events = newTargetEvents;
        }
        eventSequence.targets.push(newTarget);
      }
    });
  }
  return eventSequence;
}

function eventTargetComparator (destTarget, sourceTarget) {
  const { type: sourceType, props: sourceProps } = sourceTarget;
  const { type: destType, props: destProps } = destTarget;
  let result = false;
  if (sourceType === destType) {
    if (sourceProps && destProps) {
      if (sourceProps.functionName && destProps.functionName) {
          result = sourceProps.functionName === destProps.functionName
      } else if (sourceProps.componentName && destProps.componentName) {
        if (sourceProps.forwardPath && destProps.forwardPath) {
          // if there is forwarding test all attributes
          result = sourceProps.componentName === destProps.componentName
            && sourceProps.componentInstance === destProps.componentInstance
            && sourceProps.propertyName === destProps.propertyName
            && sourceProps.forwardPath === destProps.forwardPath
        } else {
          // if there is no forwarding test only component attributes
          result = sourceProps.componentName === destProps.componentName
            && sourceProps.componentInstance === destProps.componentInstance
            && sourceProps.propertyName === destProps.propertyName
        }
      } else if (sourceProps.forwardPath && destProps.forwardPath) {
        // it is possible to set only forward path without component property target
        result = sourceProps.forwardPath === destProps.forwardPath;
      }
    }
  }
  return result;
}

function targetEventComparator (destEvent, sourceEvent) {
  return destEvent === sourceEvent || destEvent.name === sourceEvent.name;
}

function mergeTargetEvents (destEvents, sourceEvents) {
  let resultEvents = unionWith(destEvents, sourceEvents, targetEventComparator);
  if (sourceEvents && sourceEvents.length > 0) {
    let foundDestEvent;
    sourceEvents.forEach(sourceEvent => {
      foundDestEvent = resultEvents.find(i => targetEventComparator(i, sourceEvent));
      if (foundDestEvent) {
        foundDestEvent.targets = foundDestEvent.targets || [];
        sourceEvent.targets = sourceEvent.targets || [];
        foundDestEvent.targets = mergeEventTargets(foundDestEvent.targets, sourceEvent.targets);
      } else {
        resultEvents.push(sourceEvent);
      }
    });
  }
  return resultEvents;
}

function mergeEventTargets (destTargets, sourceTargets) {
  let resultTargets = unionWith(destTargets, sourceTargets, eventTargetComparator);
  if (sourceTargets && sourceTargets.length > 0) {
    let foundDestTarget;
    sourceTargets.forEach(sourceTarget => {
      foundDestTarget = resultTargets.find(i => eventTargetComparator(i, sourceTarget));
      if (foundDestTarget) {
        foundDestTarget.events = foundDestTarget.events || [];
        sourceTarget.events = sourceTarget.events || [];
        foundDestTarget.events = mergeTargetEvents(foundDestTarget.events, sourceTarget.events);
      } else {
        resultTargets.push(sourceTarget);
      }
    });
  }
  return resultTargets;
}

function getActionSequences (handlers, actionSequences = {}) {
  if (handlers && handlers.length > 0) {
    handlers.forEach(handler => {
      const { type, props, events } = handler;
      if (props && !props.isDisabled && events && events.length > 0) {
        events.forEach(event => {
          let key;
          let handlerObject;
          if (event && event.name && event.targets && event.targets.length > 0) {
            if (type === COMPONENT_TYPE) {
              if (props.forwardPath) {
                key = `applicationPage_${props.forwardPath}`;
              } else {
                key = `${props.componentName}_${props.componentInstance}`;
              }
              handlerObject = actionSequences[key]
                || { ...props, componentKey: uniqueId('seqNode'), events: [] };
              const eventSequence = getEventSequence(event);
              // find the same event handler name for the container
              const existingHandlerEventIndex =
                handlerObject.events.findIndex(evn => evn.name === eventSequence.name);
              if (existingHandlerEventIndex >= 0) {
                // here we should merge targets of the same container events handler
                const existingHandlerEvent = handlerObject.events[existingHandlerEventIndex];
                if (existingHandlerEvent) {
                  handlerObject.events[existingHandlerEventIndex].targets =
                    mergeEventTargets(existingHandlerEvent.targets, eventSequence.targets);
                }
              } else {
                eventSequence.targets = mergeEventTargets(eventSequence.targets, eventSequence.targets);
                handlerObject.events.push(eventSequence);
              }
              actionSequences[key] = handlerObject;
            }
            actionSequences = getActionSequences(event.targets, actionSequences);
          }
        });
      }
    });
  }
  return actionSequences;
}

function createActionSequencesRecursively (handlers, actionSequences = {}) {
  forOwn(handlers, value => {
    if (isArray(value)) {
      // only arrays should be exported as flow sequences otherwise the object is assumed as a nested sequences
      actionSequences = getActionSequences(value, actionSequences);
    } else if (isObject(value)) {
      // if the handlers is object - it means we have a nested handlers description
      actionSequences = createActionSequencesRecursively(value, actionSequences);
    }
  });
  return actionSequences;
}

export function createActionSequences (handlers, functions) {
  userFunctions = { ...functions };
  const actionSequences = createActionSequencesRecursively(handlers);
  const targetProperties = deriveTargetProperties(actionSequences);
  return { actionSequences, targetProperties };
}

export function getUserFunctionByName (functionName) {
  return get(userFunctions, functionName);
}
