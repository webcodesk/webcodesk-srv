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
import keyBy from 'lodash/keyBy';
import remove from 'lodash/remove';
import constants from '../../../../commons/constants';

function propertiesComparator(a, b) {
  if (a.name === 'caughtException') {
    return 1;
  } if (b.name === 'caughtException') {
    return -1;
  }
  return a.name.localeCompare(b.name);
}

class FlowModelCompiler {

  changesCount = 0;
  errorsCount = 0;

  constructor ({componentsGraphModel, userFunctionsGraphModel, pagesGraphModel, componentInstanceModelsMap}) {
    this.componentInstanceModelsMap = componentInstanceModelsMap;
    this.componentsGraphModel = componentsGraphModel;
    this.userFunctionsGraphModel = userFunctionsGraphModel;
    this.pagesGraphModel = pagesGraphModel;
  }

  compile(nodeModel, parentModel = null) {
    if (nodeModel) {
      if (
        nodeModel.type === constants.FLOW_COMPONENT_INSTANCE_TYPE
        || nodeModel.type === constants.FLOW_COMPONENT_INSTANCE_IN_BASKET_TYPE
        || nodeModel.type === constants.GRAPH_MODEL_FLOW_COMPONENT_INSTANCE_TYPE
      ) {
        const { props: { componentName, componentInstance } } = nodeModel;
        const componentModel = this.componentsGraphModel.getNode(componentName);
        if (componentModel) {
          const { props: { inputs, outputs } } = nodeModel;
          const { props: { propertiesRef } } = componentModel;

          const componentPropertiesMap = keyBy(propertiesRef, p => p.props.propertyName);

          const flowItemInputs = keyBy(inputs, 'name');
          const flowItemOutputs = keyBy(outputs, 'name');
          if (propertiesRef && propertiesRef.length > 0) {
            let foundItemInput;
            let foundItemOutput;
            propertiesRef.forEach(propertyRef => {
              const { type: componentPropertyType, props: { propertyName } } = propertyRef;
              if (componentPropertyType === constants.COMPONENT_PROPERTY_FUNCTION_TYPE) {
                foundItemOutput = flowItemOutputs[propertyName];
                if (!foundItemOutput) {
                  // output is missing
                  nodeModel.props.outputs.push({
                    name: propertyName,
                    properties: propertyRef ? cloneDeep(propertyRef) : {},
                  });
                  this.changesCount++;
                } else {
                  // update input props
                  foundItemOutput.properties = propertyRef ? cloneDeep(propertyRef) : {};
                }
              } else {
                foundItemInput = flowItemInputs[propertyName];
                if (!foundItemInput) {
                  // input is missing
                  if (propertyName !== constants.COMPONENT_PROPERTY_DO_NOT_USE_IN_FLOWS_NAME) {
                    nodeModel.props.inputs.push({
                      name: propertyName,
                      properties: propertyRef ? cloneDeep(propertyRef) : {},
                    });
                    this.changesCount++;
                  }
                } else {
                  // update input props
                  foundItemInput.properties = propertyRef ? cloneDeep(propertyRef) : {};
                }
              }
            });
            nodeModel.props.inputs = nodeModel.props.inputs.sort(propertiesComparator);
            nodeModel.props.outputs = nodeModel.props.outputs.sort(propertiesComparator);

            let foundProperty;
            inputs.forEach((flowItemInput, index) => {
              foundProperty = componentPropertiesMap[flowItemInput.name];
              if (!foundProperty) {
                if (!nodeModel.props.inputs[index].connectedTo) {
                  // this input does not have connections, should be removed
                  nodeModel.props.inputs[index].toRemove = true;
                } else {
                  if (!nodeModel.props.inputs[index].error) {
                    nodeModel.props.inputs[index].error =
                      `The "${flowItemInput.name}" property was not found.`;
                    this.changesCount++;
                  }
                  this.errorsCount++;
                }
              } else {
                if (nodeModel.props.inputs[index].error) {
                  delete nodeModel.props.inputs[index].error;
                  this.changesCount++;
                }
              }
            });
            // remove all that was specified as to remove
            remove(nodeModel.props.inputs, i => !!i.toRemove);

            outputs.forEach((flowItemOutput, index) => {
              foundProperty = componentPropertiesMap[flowItemOutput.name];
              if (!foundProperty) {
                // we have to find if there is any child which is connected to the output
                // if there is no any - just remove this output
                let toRemove = true;
                const nodeModelChildren = nodeModel.children;
                if (nodeModelChildren && nodeModelChildren.length > 0) {
                  nodeModelChildren.forEach(nodeModelChild => {
                    const {props: {inputs: nodeModelChildInputs}} = nodeModelChild;
                    if (nodeModelChildInputs && nodeModelChildInputs.length > 0) {
                      const foundIndexNodeModelChildInput =
                        nodeModelChildInputs.findIndex(i => i.connectedTo === flowItemOutput.name);
                      if (foundIndexNodeModelChildInput >= 0) {
                        toRemove = false;
                      }
                    }
                  });
                }
                if (toRemove) {
                  nodeModel.props.outputs[index].toRemove = true;
                } else {
                  // this output has some connections, just set the error
                  if (!nodeModel.props.outputs[index].error) {
                    nodeModel.props.outputs[index].error =
                      `The "${flowItemOutput.name}" property was not found.`;
                    this.changesCount++;
                  }
                  this.errorsCount++;
                }
              } else {
                if (nodeModel.props.outputs[index].error) {
                  delete nodeModel.props.outputs[index].error;
                  this.changesCount++;
                }
              }
            });
            // remove all that was specified as to remove
            remove(nodeModel.props.outputs, i => !!i.toRemove);


            // remove error if it is here
            if (
              nodeModel.props.errors &&
              nodeModel.props.errors[constants.COMPILER_ERROR_FLOW_ELEMENT_EMPTY_PROPERTIES]
            ) {
              delete nodeModel.props.errors[constants.COMPILER_ERROR_FLOW_ELEMENT_EMPTY_PROPERTIES];
              this.changesCount++;
            }

            const foundComponentInstance =
              this.componentInstanceModelsMap.get(`${componentName}_${componentInstance}`);
            if (!foundComponentInstance) {
              // add error if it is not here
              if (
                !nodeModel.props.errors ||
                !nodeModel.props.errors[constants.COMPILER_ERROR_INSTANCE_NOT_FOUND]
              ) {
                nodeModel.props.errors = nodeModel.props.errors || {};
                nodeModel.props.errors[constants.COMPILER_ERROR_INSTANCE_NOT_FOUND] =
                  `The "${componentInstance}" instance of the "${componentName}" component was not found`;
                this.changesCount++;
              }
              this.errorsCount++;
            } else {
              // remove error if it is here
              if (
                nodeModel.props.errors &&
                nodeModel.props.errors[constants.COMPILER_ERROR_INSTANCE_NOT_FOUND]
              ) {
                delete nodeModel.props.errors[constants.COMPILER_ERROR_INSTANCE_NOT_FOUND];
                this.changesCount++;
              }
            }

          } else {
            // add error if it is not here
            if (
              !nodeModel.props.errors ||
              !nodeModel.props.errors[constants.COMPILER_ERROR_FLOW_ELEMENT_EMPTY_PROPERTIES]
            ) {
              nodeModel.props.errors = nodeModel.props.errors || {};
              nodeModel.props.errors[constants.COMPILER_ERROR_FLOW_ELEMENT_EMPTY_PROPERTIES] =
                `The "${componentName}" instance does not have properties.`;
              this.changesCount++;
            }
            this.errorsCount++;
            if (inputs && inputs.length > 0) {
              inputs.forEach((flowItemInput, index) => {
                if (!nodeModel.props.inputs[index].error) {
                  nodeModel.props.inputs[index].error =
                    `The "${flowItemInput.name}" property was not found`;
                  this.changesCount++;
                }
                this.errorsCount++;
              });
            }
            if (outputs && outputs.length > 0) {
              outputs.forEach((flowItemOutput, index) => {
                if (!nodeModel.props.outputs[index].error) {
                  nodeModel.props.outputs[index].error =
                    `The "${flowItemOutput.name}" property was not found`;
                  this.changesCount++;
                }
                this.errorsCount++;
              });
            }
          }
          if (
            parentModel
            && nodeModel.type !== constants.FLOW_COMPONENT_INSTANCE_IN_BASKET_TYPE
            && nodeModel.type !== constants.GRAPH_MODEL_FLOW_COMPONENT_INSTANCE_TYPE
          ) {
            // check if there is a parent, if so, then there should be inputs connected to the parent
            const findConnectedInputs = inputs && inputs.length > 0 ? inputs.find(i => !!i.connectedTo) : null;
            if (!findConnectedInputs) {
              if (
                !nodeModel.props.errors ||
                !nodeModel.props.errors[constants.COMPILER_ERROR_NO_INPUT_CONNECTIONS]
              ) {
                nodeModel.props.errors = nodeModel.props.errors || {};
                nodeModel.props.errors[constants.COMPILER_ERROR_NO_INPUT_CONNECTIONS] =
                  `The "${componentInstance}" instance is not connected`;
                this.changesCount++;
              }
              this.errorsCount++;
            } else {
              if (
                nodeModel.props.errors &&
                nodeModel.props.errors[constants.COMPILER_ERROR_NO_INPUT_CONNECTIONS]
              ) {
                delete nodeModel.props.errors[constants.COMPILER_ERROR_NO_INPUT_CONNECTIONS];
                this.changesCount++;
              }
            }
          }
          if (
            nodeModel.props.errors &&
            nodeModel.props.errors[constants.COMPILER_ERROR_COMPONENT_NOT_FOUND]
          ) {
            delete nodeModel.props.errors[constants.COMPILER_ERROR_COMPONENT_NOT_FOUND];
            this.changesCount++;
          }
        } else {
          // component was not found....
          if (
            !nodeModel.props.errors ||
            !nodeModel.props.errors[constants.COMPILER_ERROR_COMPONENT_NOT_FOUND]
          ) {
            nodeModel.props.errors = nodeModel.props.errors || {};
            nodeModel.props.errors[constants.COMPILER_ERROR_COMPONENT_NOT_FOUND] =
              `The "${componentName}" was not found`;
            this.changesCount++;
          }
          this.errorsCount++;
        }

        // todo: how to find that the components instance is on the forwarded page?
        // need to know if the passed parameters to the correct page's component instance
        // if (parentModel && parentModel.type === constants.FLOW_PAGE_TYPE) {
        //   if (foundComponentInstance.props.pagePath === parentModel.props.pagePath) {
        //     // remove error if it is here
        //     if (newFlowItemModel.props.errors && newFlowItemModel.props.errors['doesNotBelongToPage']) {
        //       delete newFlowItemModel.props.errors['doesNotBelongToPage'];
        //       changesCount++;
        //     }
        //   } else {
        //     // add error if it is not here
        //     if (!newFlowItemModel.props.errors || !newFlowItemModel.props.errors['doesNotBelongToPage']) {
        //       newFlowItemModel.props.errors = newFlowItemModel.props.errors || {};
        //       newFlowItemModel.props.errors['doesNotBelongToPage'] =
        //         `The ${componentInstance} component instance does not belong to the page.`;
        //       changesCount++;
        //     }
        //   }
        // }

      } else if (
        nodeModel.type === constants.FLOW_USER_FUNCTION_TYPE
        || nodeModel.type === constants.FLOW_USER_FUNCTION_IN_BASKET_TYPE
        || nodeModel.type === constants.GRAPH_MODEL_FLOW_USER_FUNCTION_TYPE
      ) {
        const { props: { functionName } } = nodeModel;
        const functionModel = this.userFunctionsGraphModel.getNode(functionName);
        if (functionModel) {
          const { props: { inputs, outputs } } = nodeModel;
          const { props: { propertiesRef, dispatches } } = functionModel;

          if (inputs && inputs.length > 0) {
            nodeModel.props.inputs[0].properties = {
              type: constants.COMPONENT_PROPERTY_SHAPE_TYPE,
              props: {
                isRequired: true,
              },
              children: propertiesRef ? cloneDeep(propertiesRef) : [],
            };
          }

          const functionDispatchesMap = keyBy(dispatches, 'name');

          const flowItemOutputs = keyBy(outputs, 'name');
          if (dispatches && dispatches.length > 0) {
            let foundItemOutput;
            dispatches.forEach(functionDispatch => {
              foundItemOutput = flowItemOutputs[functionDispatch.name];
              if (!foundItemOutput) {
                // output is missing
                nodeModel.props.outputs.push({
                  name: functionDispatch.name,
                  properties: {
                    type: constants.COMPONENT_PROPERTY_SHAPE_TYPE,
                    children: functionDispatch.propertiesRef ? cloneDeep(functionDispatch.propertiesRef) : []
                  }
                });
                this.changesCount++;
              } else {
                // update found output
                foundItemOutput.properties.children =
                  functionDispatch.propertiesRef ? cloneDeep(functionDispatch.propertiesRef) : [];
              }
            });
          }
          nodeModel.props.outputs = nodeModel.props.outputs.sort(propertiesComparator);

          let foundDispatch;
          outputs.forEach((flowItemOutput, index) => {
            foundDispatch = functionDispatchesMap[flowItemOutput.name];
            if (!foundDispatch) {
              // we have to find if there is any child which is connected to the output
              // if there is no any - just remove this output
              let toRemove = true;
              const nodeModelChildren = nodeModel.children;
              if (nodeModelChildren && nodeModelChildren.length > 0) {
                nodeModelChildren.forEach(nodeModelChild => {
                  const {props: {inputs: nodeModelChildInputs}} = nodeModelChild;
                  if (nodeModelChildInputs && nodeModelChildInputs.length > 0) {
                    const foundIndexNodeModelChildInput =
                      nodeModelChildInputs.findIndex(i => i.connectedTo === flowItemOutput.name);
                    if (foundIndexNodeModelChildInput >= 0) {
                      toRemove = false;
                    }
                  }
                });
              }
              if (toRemove) {
                nodeModel.props.outputs[index].toRemove = true;
              } else {
                // this output has some connections, just set the error
                if (!nodeModel.props.outputs[index].error) {
                  nodeModel.props.outputs[index].error =
                    `The "${flowItemOutput.name}" dispatch was not found`;
                  this.changesCount++;
                }
                this.errorsCount++;
              }
            } else {
              if (nodeModel.props.outputs[index].error) {
                delete nodeModel.props.outputs[index].error;
                this.changesCount++;
              }
            }
          });
          // remove all that was specified as to remove
          remove(nodeModel.props.outputs, i => !!i.toRemove);

          if (
            nodeModel.type !== constants.FLOW_USER_FUNCTION_IN_BASKET_TYPE
            && nodeModel.type !== constants.GRAPH_MODEL_FLOW_USER_FUNCTION_TYPE
          ) {
            const findConnectedInputs = inputs && inputs.length > 0 ? inputs.find(i => !!i.connectedTo) : null;
            if (!findConnectedInputs) {
              if (
                !nodeModel.props.errors ||
                !nodeModel.props.errors[constants.COMPILER_ERROR_NO_INPUT_CONNECTIONS]
              ) {
                nodeModel.props.errors = nodeModel.props.errors || {};
                nodeModel.props.errors[constants.COMPILER_ERROR_NO_INPUT_CONNECTIONS] =
                  `The "${functionName}" function is not connected`;
                this.changesCount++;
              }
              this.errorsCount++;
            } else {
              if (
                nodeModel.props.errors &&
                nodeModel.props.errors[constants.COMPILER_ERROR_NO_INPUT_CONNECTIONS]
              ) {
                delete nodeModel.props.errors[constants.COMPILER_ERROR_NO_INPUT_CONNECTIONS];
                this.changesCount++;
              }
            }
          }

          if (
            nodeModel.props.errors &&
            nodeModel.props.errors[constants.COMPILER_ERROR_USER_FUNCTION_NOT_FOUND]
          ) {
            delete nodeModel.props.errors[constants.COMPILER_ERROR_USER_FUNCTION_NOT_FOUND];
            this.changesCount++;
          }

        } else {
          if (
            !nodeModel.props.errors ||
            !nodeModel.props.errors[constants.COMPILER_ERROR_USER_FUNCTION_NOT_FOUND]
          ) {
            nodeModel.props.errors = nodeModel.props.errors || {};
            nodeModel.props.errors[constants.COMPILER_ERROR_USER_FUNCTION_NOT_FOUND] =
              `The function is not found by path "${functionName}"`;
            this.changesCount++;
          }
          this.errorsCount++;
        }
      } else if (nodeModel.type === constants.FLOW_PAGE_TYPE) {
        const { props: { title, pagePath, inputs } } = nodeModel;
        const foundPageModel = this.pagesGraphModel.getNode(pagePath);
        if (!foundPageModel) {
          // add error if it is not here
          if (
            !nodeModel.props.errors ||
            !nodeModel.props.errors[constants.COMPILER_ERROR_PAGE_NOT_FOUND]
          ) {
            nodeModel.props.errors = nodeModel.props.errors || {};
            nodeModel.props.errors[constants.COMPILER_ERROR_PAGE_NOT_FOUND] =
              `The "${title}" page was not found`;
            this.changesCount++;
          }
          this.errorsCount++;
        } else {
          if (parentModel) {
            const findConnectedInputs = inputs && inputs.length > 0 ? inputs.find(i => !!i.connectedTo) : null;
            if (!findConnectedInputs) {
              if (
                !nodeModel.props.errors ||
                !nodeModel.props.errors[constants.COMPILER_ERROR_NO_INPUT_CONNECTIONS]
              ) {
                nodeModel.props.errors = nodeModel.props.errors || {};
                nodeModel.props.errors[constants.COMPILER_ERROR_NO_INPUT_CONNECTIONS] =
                  `The "${title}" page is not connected`;
                this.changesCount++;
              }
              this.errorsCount++;
            } else {
              if (
                nodeModel.props.errors &&
                nodeModel.props.errors[constants.COMPILER_ERROR_NO_INPUT_CONNECTIONS]
              ) {
                delete nodeModel.props.errors[constants.COMPILER_ERROR_NO_INPUT_CONNECTIONS];
                this.changesCount++;
              }
            }
          }
          // remove error if it is here
          if (nodeModel.props.errors && nodeModel.props.errors[constants.COMPILER_ERROR_PAGE_NOT_FOUND]) {
            delete nodeModel.props.errors[constants.COMPILER_ERROR_PAGE_NOT_FOUND];
            this.changesCount++;
          }
        }
      }
      if (nodeModel.children && nodeModel.children.length > 0) {
        nodeModel.children.forEach(child => {
          this.compile(child, nodeModel);
        });
      }
    }
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

export default FlowModelCompiler;
