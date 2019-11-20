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
import GraphModel from '../graph/GraphModel';
import constants from '../../../commons/constants';
import * as composerFactory from './flowComposerFactory';
import FlowGraphVisitor from './FlowGraphVisitor';

const inBasketTypes = [
  constants.FLOW_PAGE_IN_BASKET_TYPE,
  constants.FLOW_USER_FUNCTION_IN_BASKET_TYPE,
  constants.FLOW_COMPONENT_INSTANCE_IN_BASKET_TYPE,
  constants.FLOW_PAGE_IN_BASKET_TYPE,
  constants.FLOW_USER_FUNCTION_IN_BASKET_TYPE,
  constants.FLOW_COMPONENT_INSTANCE_IN_BASKET_TYPE,
];

const flowModelComparator = (aModel, bModel) => {
  const { type: aType, props: { inputs: aInputs } } = aModel;
  const { type: bType, props: { inputs: bInputs } } = bModel;
  // we have to move models in basket to down because of the flow tree composition
  // otherwise they cause the root tree node collapsed
  if (inBasketTypes.some(i => i === aType)) {
    return 1;
  } else if (inBasketTypes.some(i => i === bType)) {
    return -1;
  }
  const aInput = aInputs ? aInputs.find(i => !!i.connectedTo) : null;
  const bInput = bInputs ? bInputs.find(i => !!i.connectedTo) : null;
  if (!aInput && bInput) {
    return 0;
  } else if (aInput && !bInput) {
    return 0;
  } else if (!aInput && !bInput) {
    return 0;
  } else {
    if (aInput.connectedTo === 'caughtException') {
      return 1;
    } if (bInput.connectedTo === 'caughtException') {
      return -1;
    }
    return aInput.connectedTo.localeCompare(bInput.connectedTo);
  }
};

class FlowComposerManager {

  constructor (flowModel) {
    this.graphModel = new GraphModel({globallyUniqueKeys: false});
    this.flowGraphVisitor = new FlowGraphVisitor();
    if (flowModel) {
      this.graphModel.initModel(cloneDeep(flowModel));
    } else {
      this.graphModel.initModel(composerFactory.createDefaultModel());
    }
    this.enrichModel();
  }

  getFlowModel = (noKeys = false) => {
    return this.graphModel.getModel(noKeys, flowModelComparator);
  };

  getSerializableFlowModel = () => {
    // return this.graphModel.getModel(false, flowModelComparator, ['acceptableTypes']);
    return this.graphModel.getModel(false, flowModelComparator, (model) => {
      if (model && model.props) {
        delete model.props['acceptableTypes'];
      }
      return false;
    });
  };

  appendNew = (destKey, model) => {
    return this.graphModel.addChildNode(destKey, model);
  };

  replace = (destKey, model) => {
    const destModel = this.graphModel.getNode(destKey);
    if (destModel) {
      const { props: destProps } = destModel;
      const { props: newProps } = model;
      let foundDestInputWithConnectTo = null;
      if (destProps) {
        const {inputs: destInputs} = destProps;
        if (destInputs && destInputs.length > 0) {
          foundDestInputWithConnectTo = destInputs.find(i => !!i.connectedTo);
        }
      }
      if (newProps && foundDestInputWithConnectTo) {
        const {inputs: newInputs} = newProps;
        if (newInputs && newInputs.length > 0) {
          const foundIndexNewInputWithConnectTo =
            newInputs.findIndex(i => i.name === foundDestInputWithConnectTo.name);
          if (foundIndexNewInputWithConnectTo >= 0) {
            model.props.inputs[foundIndexNewInputWithConnectTo].connectedTo =
              foundDestInputWithConnectTo.connectedTo;
            model.props.inputs[foundIndexNewInputWithConnectTo].testDataScript =
              foundDestInputWithConnectTo.testDataScript;
            model.props.inputs[foundIndexNewInputWithConnectTo].transformScript =
              foundDestInputWithConnectTo.transformScript;
          }
        }
      }
    }
    const childrenKeys = this.graphModel.getChildrenKeys(destKey);
    if (childrenKeys && childrenKeys.length > 0) {
      childrenKeys.forEach(childKey => {
        this.clearInputs(childKey);
      });
    }
    this.graphModel.assignNode(destKey, model);
  };

  enrichModel = () => {
    this.flowGraphVisitor.visitForEnrichment(this.graphModel);
  };

  decreaseModel = () => {
    this.flowGraphVisitor.visitForDecreasing(this.graphModel);
  };

  getFlowParticles = () => {
    return this.flowGraphVisitor.visitForFlowParticles(this.graphModel);
  };

  replaceWithResource = (resourceObject, destination) => {
    if (!resourceObject || !destination) {
      console.error('FlowComposerManager.replaceWithNew: missing source or destination flow parts when replacing.');
    }
    const { key: destKey } = destination;
    const flowModel = this.createFlowModel(resourceObject);
    if (flowModel) {
      this.replace(destKey, flowModel);
      this.setSelectedByKey(destKey);
    } else {
      console.error(`FlowComposerManager.replaceWithNew: new flow model was not created for ${resourceObject.type}`);
    }
  };

  addResourceToBasket = (resourceObject, position) => {
    if (!resourceObject) {
      console.error('FlowComposerManager.replaceWithNew: missing source flow parts when adding to basket.');
    }
    const flowModel = this.createFlowModel(resourceObject, {position});
    if (flowModel) {
      const newModelKey = this.appendNew(this.graphModel.getRootKey(), flowModel);
      this.setSelectedByKey(newModelKey);
    } else {
      console.error(`FlowComposerManager.replaceWithNew: new flow model was not created for ${resourceObject.type}`);
    }
  };

  createFlowModel = (source, inBasket) => {
    return composerFactory.createFlowModel(source, inBasket);
  };

  connectInput = (outputKey, outputName, inputKey, inputName) => {
    if (outputKey !== inputKey) {
      const parentModel = this.graphModel.getNode(outputKey);
      const childModel = this.graphModel.getNode(inputKey);
      if (parentModel && childModel) {
        if (childModel.props && childModel.props.position) {
          delete childModel.props.position;
        }
        const { type: childType, props: { inputs } } = childModel;
        const { type: parentType, props: { outputs } } = parentModel;
        if (
          (childType === constants.FLOW_USER_FUNCTION_TYPE && parentType === constants.FLOW_PAGE_TYPE) ||
          (parentType === constants.FLOW_PAGE_TYPE &&
            (childType === constants.FLOW_PAGE_TYPE || childType === constants.FLOW_PAGE_IN_BASKET_TYPE)
          )
        ) {
          return;
        }
        if (outputs.findIndex(i => i.name === outputName) < 0) {
          console.error('FlowComposerManager.connectInput: wrong output name.');
        }
        if (inputs && inputs.length > 0) {
          for(let i = 0; i < inputs.length; i++) {
            delete inputs[i].connectedTo;
            if (inputs[i].name === inputName) {
              inputs[i].connectedTo = outputName;
            }
          }
        }
        if (childModel.type === constants.FLOW_COMPONENT_INSTANCE_IN_BASKET_TYPE) {
          childModel.type = constants.FLOW_COMPONENT_INSTANCE_TYPE;
        } else if (childModel.type === constants.FLOW_USER_FUNCTION_IN_BASKET_TYPE) {
          childModel.type = constants.FLOW_USER_FUNCTION_TYPE;
        } else if (childModel.type === constants.FLOW_PAGE_IN_BASKET_TYPE) {
          childModel.type = constants.FLOW_PAGE_TYPE;
        }
        try {
          this.graphModel.setParentKey(inputKey, outputKey);
        } catch(e) {
          // it seems that we have a cycle in the graph...
          // let's exchange the nodes' parents
          const inputParentKey = this.graphModel.getParentKey(inputKey);
          this.clearInputs(outputKey, parentModel);
          this.graphModel.setParentKey(outputKey, inputParentKey);
          this.graphModel.setParentKey(inputKey, outputKey);
        }
        return true;
      }
    }
    return false;
  };

  clearInputs = (key, model = null, parentModel = null) => {
    if (!model) {
      model = this.graphModel.getNode(key);
    }
    if (!parentModel) {
      parentModel = this.graphModel.getParentNode(key);
    }
    let parentOutputs = [];
    if (parentModel && parentModel.props && parentModel.props.outputs) {
      parentOutputs = parentModel.props.outputs;
    }
    if (model && model.props) {
      const { props: { inputs } } = model;
      if (inputs && inputs.length > 0) {
        let foundParentOutput;
        for (let i = 0; i < inputs.length; i++) {
          if (!!inputs[i].connectedTo) {
            foundParentOutput = parentOutputs.find(parentOutput => parentOutput.name === inputs[i].connectedTo);
            if (!foundParentOutput) {
              delete inputs[i].connectedTo;
            }
          }
        }
      }
    }
  };

  setTransformScript = (key, inputName, transformScript, testDataScript) => {
    const model = this.graphModel.getNode(key);
    if (model) {
      const { props: { inputs } } = model;
      if (inputs && inputs.length > 0) {
        for(let i = 0; i < inputs.length; i++) {
          if (inputs[i].name === inputName) {
            inputs[i].transformScript = transformScript;
            inputs[i].testDataScript = testDataScript;
          }
        }
      }
    }
  };

  setSelected = (source) => {
    if (!source) {
      return null;
    }
    const { key } = source;
    this.setSelectedByKey(key);
  };

  setSelectedByKey = (key) => {
    const model = this.graphModel.getNode(key);
    if (!model) {
      console.error('FlowComposerManager.setSelectedByKey: missing model for passed in key.');
    }
    this.flowGraphVisitor.visitForRemoveSelected(this.graphModel);
    const { props: { inputs } } = model;
    let parentModel;
    if (inputs && inputs.length > 0) {
      inputs.forEach(input => {
        if (input.connectedTo) {
          parentModel = this.graphModel.getParentNode(key);
          if (parentModel) {
            const { props: {outputs: parentOutputs} } = parentModel;
            if (parentOutputs && parentOutputs.length > 0) {
              const foundParentOutput = parentOutputs.find(i => i.name === input.connectedTo);
              if (foundParentOutput) {
                foundParentOutput.isSelected = true;
              }
            }
          }
          input.isSelected = true;
        }
      });
    }
    model.props = model.props || {};
    model.props.isSelected = true;
  };

  setNewBasketPosition = (key, newPosition) => {
    const model = this.graphModel.getNode(key);
    if (!model) {
      console.error('FlowComposerManager.setNewBasketPosition: missing model for passed in key.');
    }
    // this.graphModel.mergeNode(key, { props: { position: newPosition } });
    model.props = model.props || {};
    model.props.position = newPosition;
  };

  getSelected = () => {
    const selectedNodes = this.flowGraphVisitor.visitForSelected(this.graphModel);
    if (selectedNodes && selectedNodes.length > 0) {
      return cloneDeep(selectedNodes[0]);
    }
    return null;
  };

  deleteSelected = () => {
    const selectedNodes = this.flowGraphVisitor.visitForSelected(this.graphModel);
    if (selectedNodes.length > 0) {
      const {
        nodeModel,
      } = selectedNodes[0];
      if (nodeModel) {
        const keyToDelete = nodeModel.key;
        const parentKey = this.graphModel.getParentKey(keyToDelete);
        const childrenKeys = this.graphModel.getChildrenKeys(keyToDelete);
        if (parentKey) {
          // set new parent to each child node
          if (childrenKeys && childrenKeys.length > 0) {
            childrenKeys.forEach(childKey => {
              this.graphModel.setParentKey(childKey, parentKey);
            });
          }
        }
        this.graphModel.deleteChildren(keyToDelete);
        this.graphModel.deleteNode(keyToDelete);
        // reconnect each new child to new parent
        if (childrenKeys && childrenKeys.length > 0) {
          let childModel;
          childrenKeys.forEach(childKey => {
            childModel = this.graphModel.getNode(childKey);
            this.clearInputs(childKey, childModel);
          });
        }
        if (!parentKey) {
          this.graphModel.initModel(composerFactory.createDefaultModel());
        }
      }
    }
    this.flowGraphVisitor.visitForRemoveSelected(this.graphModel);
  };

}

export default FlowComposerManager;