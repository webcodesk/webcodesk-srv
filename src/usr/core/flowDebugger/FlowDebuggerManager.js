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

import uniqueId from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';
import GraphModel from '../graph/GraphModel';
import * as flowDebuggerFactory from './flowDebuggerFactory';
import constants from '../../../commons/constants';

const flowModelComparator = (aModel, bModel) => {
  const { props: { inputs: aInputs } } = aModel;
  const { props: { inputs: bInputs } } = bModel;
  const aInput = aInputs ? aInputs.find(i => !!i.connectedTo) : null;
  const bInput = bInputs ? bInputs.find(i => !!i.connectedTo) : null;
  if (!aInput && bInput) {
    return 1;
  } else if (aInput && !bInput) {
    return -1;
  } else if (!aInput && !bInput) {
    return 0;
  } else {
    if (aInput.connectedTo === constants.FUNCTION_OUTPUT_ERROR_NAME) {
      return 1;
    }
    if (bInput.connectedTo === constants.FUNCTION_OUTPUT_ERROR_NAME) {
      return -1;
    }
    return aInput.connectedTo.localeCompare(bInput.connectedTo);
  }
};

class FlowDebuggerManager {
  constructor (actionSequences) {
    this.graphModel = new GraphModel({globallyUniqueKeys: false});
    if (actionSequences) {
       this.graphModel.initModel(flowDebuggerFactory.createFlowModelByActionSequences(actionSequences));
    }
  }

  getFlowModel = (noKeys = false) => {
    return this.graphModel.getModel(noKeys, flowModelComparator);
  };

  getSerializableFlowModel = () => {
    return this.graphModel.getSerializableModel(flowModelComparator);
  };

  setRecordIdsVisitor = (componentName, componentInstance, recordId) => ({ nodeModel, parentModel }) => {
    if (nodeModel && nodeModel.props) {
      const { props: {componentName: modelComponentName, componentInstance: modelComponentInstance} } = nodeModel;
      if (componentName === modelComponentName && componentInstance === modelComponentInstance) {
        nodeModel.props.recordIds = nodeModel.props.recordIds || [];
        nodeModel.props.recordIds.push(recordId);
      }
    }
  };

  // setPopulatedPropsVisitor = (componentName, componentInstance, propertyName, populatePath, recordId) =>
  //   ({ nodeModel, parentModel }) => {
  //   if (nodeModel && nodeModel.props) {
  //     const {
  //       props: {
  //         componentName: modelComponentName,
  //         componentInstance: modelComponentInstance,
  //         populatePath: modelPopulatePath,
  //         inputs
  //       }
  //     } = nodeModel;
  //     if (componentName === modelComponentName &&
  //       componentInstance === modelComponentInstance &&
  //       populatePath === modelPopulatePath) {
  //
  //       const foundInput = inputs.find(i => i.name === propertyName);
  //       if (foundInput) {
  //         foundInput.recordIds = foundInput.recordIds || [];
  //         foundInput.recordIds.push(recordId);
  //       }
  //     }
  //   }
  // };

  setDataFromLog = (actionsLog) => {
    if (actionsLog && actionsLog.length > 0) {
      let orderedLog = cloneDeep(actionsLog.sort((a, b) => {
        let result = a.timestamp - b.timestamp;
        if (result === 0 && a.key && b.key) {
          result = a.key.localeCompare(b.key);
          if (result === 0 && a.functionName && b.functionName && a.functionName === b.functionName) {
            if (a.eventType === constants.DEBUG_MSG_FUNCTION_CALL_EVENT) {
              result = -1;
            } else if (b.eventType === constants.DEBUG_MSG_FUNCTION_CALL_EVENT) {
              result = 1;
            }
          }
        }
        return result;
      }));
      let flowNode;
      let logRecordId;
      orderedLog.forEach(logRecord => {
        const { eventType, key, eventName, componentName, componentInstance, populatePath } = logRecord;
        flowNode = key ? this.graphModel.getNode(key) : flowNode;
        if (flowNode) {
          logRecordId = uniqueId('logRecord');
          if (eventType === constants.DEBUG_MSG_COMPONENT_FIRE_EVENT) {
            const foundOutput = flowNode.props.outputs.find(i => i.name === eventName);
            if (foundOutput) {
              foundOutput.recordIds = foundOutput.recordIds || [];
              logRecord.recordId = logRecordId;
              foundOutput.recordIds.push(logRecordId);
            } else {
              // we should show that an unassigned component event has been fired
              flowNode.props.outputs.push({
                name: eventName,
                recordIds: [logRecordId],
              });
              logRecord.recordId = logRecordId;
            }
          } else if (eventType === constants.DEBUG_MSG_FUNCTION_CALL_EVENT) {
            const foundInput = flowNode.props.inputs.find(i => i.name === 'callFunction');
            if (foundInput) {
              foundInput.recordIds = foundInput.recordIds || [];
              logRecord.recordId = logRecordId;
              foundInput.recordIds.push(logRecordId);
            }
          } else if (eventType === constants.DEBUG_MSG_FUNCTION_FIRE_EVENT) {
            const foundOutput = flowNode.props.outputs.find(i => i.name === eventName);
            if (foundOutput) {
              foundOutput.recordIds = foundOutput.recordIds || [];
              logRecord.recordId = logRecordId;
              foundOutput.recordIds.push(logRecordId);
            } else {
              // we should show that an unassigned function dispatch has been fired
              flowNode.props.outputs.push({
                name: eventName,
                recordIds: [logRecordId],
              });
              logRecord.recordId = logRecordId;
            }
          } else if (eventType === constants.DEBUG_MSG_REDUCE_DATA_EVENT) {
            const foundInput = flowNode.props.inputs.find(i => i.name === 'props');
            if (foundInput) {
              foundInput.recordIds = foundInput.recordIds || [];
              logRecord.recordId = logRecordId;
              foundInput.recordIds.push(logRecordId);
            }
          } else if (eventType === constants.DEBUG_MSG_NEW_PROPS_EVENT) {
            // set record id to any component that may receive properties from the dispatcher
            this.graphModel.traverse(this.setRecordIdsVisitor(componentName, componentInstance, logRecordId));
            logRecord.recordId = logRecordId;
          } else if (eventType === constants.DEBUG_MSG_CREATE_CONTAINER_EVENT) {
            // this.graphModel.traverse(
            //   this.setPopulatedPropsVisitor(
            //     componentName, componentInstance, propertyName, populatePath, logRecordId
            //   )
            // );
            logRecord.recordId = logRecordId;
          }
          this.graphModel.mergeNode(flowNode.key, {...flowNode});
        }
      });
      return orderedLog;
    }
    return undefined;
  };

  removeSelectedVisitor = ({ nodeModel, parentModel }) => {
    if (nodeModel && nodeModel.props) {
      delete nodeModel.props.isSelected;
      const { inputs, outputs } = nodeModel.props;
      if (inputs && inputs.length > 0) {
        inputs.forEach(input => {
          if (input && input.isSelected === true) {
            delete input.isSelected;
          }
        });
      }
      if (outputs && outputs.length > 0) {
        outputs.forEach(output => {
          if (output && output.isSelected === true) {
            delete output.isSelected;
          }
        });
      }
    }
  };

  setPropertySelected = (key, inputName, outputName) => {
    this.graphModel.traverse(this.removeSelectedVisitor);
    const node = this.graphModel.getNode(key);
    let recordsIds = [];
    if (node) {
      const { props: {inputs, outputs} } = node;
      if (inputName) {
        const foundInput = inputs.find(i => i.name === inputName);
        if (foundInput) {
          foundInput.isSelected = true;
          recordsIds = foundInput.recordIds;
        }
      }
      if (outputName) {
        const foundOutput = outputs.find(i => i.name === outputName);
        if (foundOutput) {
          foundOutput.isSelected = true;
          recordsIds = foundOutput.recordIds;
        }
      }
    }
    return recordsIds;
  };

  setSelected = (key) => {
    if (!key) {
      return null;
    }
    const node = this.graphModel.getNode(key);
    if (!node) {
      throw Error('FlowDebuggerManager.setSelected: missing model for passed in key.');
    }
    this.graphModel.traverse(this.removeSelectedVisitor);
    this.graphModel.mergeNode(key, { props: { isSelected: true } });
    let recordsIds = [];
    if (node) {
      const { props: {inputs, outputs, recordIds} } = node;
      if (recordIds && recordIds.length > 0) {
        recordsIds = recordsIds.concat(recordIds);
      }
      if (inputs && inputs.length > 0) {
        inputs.forEach(input => {
          if (input.recordIds && input.recordIds.length > 0) {
            recordsIds = recordsIds.concat(input.recordIds);
          }
        });
      }
      if (outputs && outputs.length > 0) {
        outputs.forEach(output => {
          if (output.recordIds && output.recordIds.length > 0) {
            recordsIds = recordsIds.concat(output.recordIds);
          }
        });
      }
    }
    return recordsIds;
  };

  getNode = (key) => {
    return this.graphModel.getNode(key);
  };

}

export default FlowDebuggerManager;