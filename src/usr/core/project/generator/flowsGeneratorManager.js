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
import set from 'lodash/set';
import constants from '../../../../commons/constants';
import { getArrayDefaultExportFileText } from './fileTemplates';
import { writeFileWhenDifferent } from '../../utils/fileUtils';

function createFlow (model, level = 0) {
  const targetsPerEvents = [];
  if (model) {
    const localRoot = {};
    let { type, props: { outputs, inputs }, children } = model;
    if (type === constants.FLOW_APPLICATION_STARTER_TYPE) {
      localRoot.type = 'component';
      localRoot.props = {
        componentName: 'applicationStartWrapper',
        componentInstance: 'wrapperInstance',
      };
    } else if (type === constants.FLOW_COMPONENT_INSTANCE_TYPE) {
      localRoot.type = 'component';
      localRoot.props = {
        componentName: model.props.componentName,
        componentInstance: model.props.componentInstance,
      };
      if (model.props.populatePath) {
        // was set in the previous iteration when the page node was visited
        localRoot.props.populatePath = model.props.populatePath;
      }
    } else if (type === constants.FLOW_USER_FUNCTION_TYPE) {
      localRoot.type = 'userFunction';
      localRoot.props = {
        functionName: model.props.functionName,
      };
    } else if (type === constants.FLOW_PAGE_TYPE) {
      localRoot.type = 'component';
      localRoot.props = {
        forwardPath: model.props.pagePath
      };
      if (children && children.length > 0) {
        children.forEach(childOfPage => {
          if (childOfPage) {
            // have to implicit set populated props for it was found in the next iteration for each child
            childOfPage.props = childOfPage.props || {};
            childOfPage.props.populatePath = model.props.pagePath;
          }
        });
      }
    } else {
      localRoot.type = 'unknown';
    }

    let linkedOutputs = [];
    if (children && children.length > 0) {
      children.forEach(childModel => {
        linkedOutputs = linkedOutputs.concat(createFlow(childModel, level + 1));
      });
    }
    if (outputs && outputs.length > 0) {
      const events = [];
      let event;
      let foundTargets;
      outputs.forEach(output => {
        foundTargets = linkedOutputs.filter(i => i.eventName === output.name);
        if (foundTargets && foundTargets.length > 0) {
          event = {
            name: output.name,
            targets: foundTargets.map(i => i.target),
          };
          events.push(event);
        }
      });
      if (events.length > 0) {
        localRoot.events = events;
      }
    }
    if (level === 0) {
      targetsPerEvents.push({
        target: localRoot,
      });
    } else if (inputs && inputs.length > 0) {
      inputs.forEach(input => {
        if (input.connectedTo && input.connectedTo.length > 0) {
          if (type === constants.FLOW_COMPONENT_INSTANCE_TYPE) {
            localRoot.props.propertyName = input.name;
          }
          if (input.transformScript) {
            localRoot.props.transformScript = input.transformScript;
          }
          targetsPerEvents.push({
            eventName: input.connectedTo,
            target: localRoot,
          });
        }
      });
    }
  }
  return targetsPerEvents;
}

export function createIndexObject (resourceModel, resultObject = {}, replaceImportDir) {
  if (resourceModel) {
    const { type, props, children } = resourceModel;
    if (type === constants.GRAPH_MODEL_FILE_TYPE) {
      const schemaImportPath = props && props.indexImportPath
        ? props.indexImportPath.replace(replaceImportDir, '')
        : null;
      if (schemaImportPath && schemaImportPath.length > 0 && children && children.length > 0) {
        const indexObjectKey =
          schemaImportPath.replace(constants.FILE_SEPARATOR_REGEXP, constants.MODEL_KEY_SEPARATOR);
        children.forEach(fileChild => {
          if (fileChild.type === constants.GRAPH_MODEL_FLOW_TYPE && fileChild.props && !fileChild.props.isDisabled) {
            const flowTree = cloneDeep(fileChild.props.flowTree);
            const flow = createFlow(flowTree);
            const flowItems = [];
            if (flow && flow.length > 0) {
              flow.forEach(flowItem => {
                if (flowItem.target) {
                  // todo: do we need disabled flows in the schema?
                  // if (fileChild.props.isDisabled) {
                  //   flowItem.target.props = flowItem.target.props || {};
                  //   flowItem.target.props.isDisabled = fileChild.props.isDisabled;
                  // }
                  flowItems.push(flowItem.target);
                }
              });
            }
            set(resultObject, indexObjectKey, flowItems);
          }
        });
      }
    } else if (children && children.length > 0) {
      children.forEach(child => {
        createIndexObject(child, resultObject, replaceImportDir);
      });
    }
  }
}

export function generateFiles (resourcesTrees, destFilePath, replaceImportDir) {
  const indexObject = {};
  createIndexObject(resourcesTrees, indexObject, `${replaceImportDir}/`);
  const fileBody = getArrayDefaultExportFileText({fileData: indexObject});
  return writeFileWhenDifferent(destFilePath, fileBody);
}
