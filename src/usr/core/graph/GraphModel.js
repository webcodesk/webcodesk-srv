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
import pickBy from 'lodash/pickBy';
import omit from 'lodash/omit';
import merge from 'lodash/merge';
import assign from 'lodash/assign';
import isUndefined from 'lodash/isUndefined';
import isMatch from 'lodash/isMatch';
import isArray from 'lodash/isArray';
import cloneDeep from 'lodash/cloneDeep';
import graphlib from 'graphlib';

const indexComparator = (a, b) => a.index - b.index;

class GraphModel {
  graphInstance;
  rootNodeKey;
  idCounter;
  globallyUniqueKeys;

  constructor ({globallyUniqueKeys} = {globallyUniqueKeys: true}) {
    this.graphInstance = new graphlib.Graph({compound: true, directed: true});
    this.graphInstance.setDefaultEdgeLabel('link');
    this.idCounter = 0;
    this.globallyUniqueKeys = globallyUniqueKeys;
  }

  mapModel(root, index = 0, refreshKey = false) {
    const { key, type, props, text, children } = root;
    let nodeKey;
    if (refreshKey) {
      nodeKey = this.globallyUniqueKeys ? uniqueId('node') : `node${++this.idCounter}`;
    } else {
      if (!this.globallyUniqueKeys) {
        if (key) {
          if (key.indexOf('node') === 0) {
            const newIdCounterValue = parseInt(key.replace('node', ''));
            if (newIdCounterValue <= this.idCounter) {
              nodeKey = `node${++this.idCounter}`;
            } else if (newIdCounterValue > this.idCounter) {
              this.idCounter = newIdCounterValue;
              nodeKey = key;
            }
          } else {
            nodeKey = key;
          }
        } else {
          nodeKey = `node${++this.idCounter}`;
        }
      } else {
        nodeKey = key || uniqueId('node');
      }
    }
    this.graphInstance.setNode(
      nodeKey,
      pickBy({ key: nodeKey, type, props, text, index }, i => !isUndefined(i))
    );
    if (children && children.length > 0) {
      children.forEach((child, idx) => {
        const childKey = this.mapModel(child, idx, refreshKey);
        this.graphInstance.setParent(childKey, nodeKey);
        this.graphInstance.setEdge(nodeKey, childKey, `${nodeKey}${childKey}`);
      });
    }
    return nodeKey;
  }

  mapNewModel(root, index = 0) {
    if (root) {
      const newModel = cloneDeep(root);
      return this.mapModel(newModel, index, true);
    }
    throw Error('The new model prototype is null.');
  }

  extractModel(rootNodeKey, noKeys = false, comparator = null, excludeTestCallback = null) {
    const nodeObject = this.graphInstance.node(rootNodeKey);
    const model = nodeObject ? cloneDeep(pickBy(nodeObject, i => !isUndefined(i))) : {};
    if (excludeTestCallback && excludeTestCallback(model)) {
      return null;
    }
    if (noKeys) {
      delete model.key;
    }
    const childrenKeys = this.graphInstance.children(rootNodeKey);
    if (childrenKeys && childrenKeys.length > 0) {
      const unOrderedChildren = [];
      let childModel;
      childrenKeys.forEach(childKey => {
        childModel = this.extractModel(childKey, noKeys, comparator, excludeTestCallback);
        if (childModel) {
          unOrderedChildren.push(childModel);
        }
      });
      model.children = unOrderedChildren.sort(comparator || indexComparator);
    }
    return model;
  }

  initModel(jsonModel) {
    if (!jsonModel) {
      throw Error('GraphModel.initModel: missing json model definition');
    }
    this.rootNodeKey = this.mapModel(jsonModel);
  }

  getModel(noKeys = false, comparator = null, excludeTestCallback = null) {
    if (this.rootNodeKey) {
      return this.extractModel(this.rootNodeKey, noKeys, comparator, excludeTestCallback);
    }
    throw Error('GraphModel.initModel: can not find root node key');
  }

  getSerializableModel(comparator = null, excludeTestCallback = null) {
    if (this.rootNodeKey) {
      return this.extractModel(this.rootNodeKey, true, comparator, excludeTestCallback);
    }
    throw Error('GraphModel.initModel: can not find root node key');
  }

  getRootKey() {
    return this.rootNodeKey;
  }

  traverse(visitor, rootNodeKey) {
    let accumulator = [];
    if (!visitor) {
      throw Error('GraphModel.traverse: visitor function is not passed in.');
    }
    rootNodeKey = rootNodeKey || this.rootNodeKey;
    const parentModel = this.getParentNode(rootNodeKey);
    const nodeModel = this.getNode(rootNodeKey);
    const visitorResult = visitor({nodeModel, parentModel});
    if (visitorResult && isArray(visitorResult)) {
      accumulator = accumulator.concat(visitorResult);
    }
    const childrenKeys = this.graphInstance.children(rootNodeKey);
    if (childrenKeys && childrenKeys.length > 0) {
      let traverseAcc;
      childrenKeys.forEach(childKey => {
        traverseAcc = this.traverse(visitor, childKey);
        if (traverseAcc && traverseAcc.length > 0) {
          accumulator = accumulator.concat(traverseAcc);
        }
      });
    }
    return accumulator;
  }

  replaceNode(nodeKey, model) {
    const parentNodeKey = this.graphInstance.parent(nodeKey);
    if (parentNodeKey) {
      const oldNodeModel = this.getNode(nodeKey);
      const newNodeKey = this.mapNewModel(model, oldNodeModel.index);
      if (nodeKey !== newNodeKey) {
        this.graphInstance.removeNode(nodeKey);
        this.graphInstance.setParent(newNodeKey, parentNodeKey);
      }
      return newNodeKey;
    } else {
      const newModel = cloneDeep(model);
      this.initModel(newModel);
      return this.rootNodeKey;
    }
  }

  addChildNodeToRoot(model) {
    if (this.rootNodeKey) {
      const newNodeKey = this.mapModel(model);
      this.graphInstance.setParent(newNodeKey, this.rootNodeKey);
      this.graphInstance.setEdge(this.rootNodeKey, newNodeKey, `${this.rootNodeKey}${newNodeKey}`)
    }
  }

  addChildNode(parentNodeKey, model) {
    const childrenKeys = this.graphInstance.children(parentNodeKey);
    if (childrenKeys && childrenKeys.length > 0) {
      childrenKeys.forEach((childKey, idx) => {
        this.graphInstance.setNode(childKey, {...this.getNode(childKey), index: idx});
      });
    }
    const newNodeKey = this.mapNewModel(model, childrenKeys.length);
    this.graphInstance.setParent(newNodeKey, parentNodeKey);
    return newNodeKey;
  }

  insertSiblingNode(nodeKey, model) {
    const parentNodeKey = this.graphInstance.parent(nodeKey);
    const newNodeKey = this.mapNewModel(model);
    this.graphInstance.setParent(newNodeKey, parentNodeKey);
  }

  deleteNode(nodeKey) {
    this.graphInstance.removeNode(nodeKey);
  }

  mergeNode(nodeKey, model) {
    const nodeModel = this.graphInstance.node(nodeKey);
    const newModel = merge({}, nodeModel, model);
    this.graphInstance.setNode(nodeKey, newModel);
    return newModel;
  }

  assignNode(nodeKey, model) {
    const nodeModel = this.graphInstance.node(nodeKey);
    const newModel = assign({}, nodeModel, model);
    this.graphInstance.setNode(nodeKey, newModel);
  }

  updateNode(nodeKey, model) {
    this.graphInstance.setNode(nodeKey, model);
  }

  getChildrenCount(nodeKey) {
    const childrenKeys = this.graphInstance.children(nodeKey);
    return childrenKeys ? childrenKeys.length : 0;
  }

  getChildrenKeys(nodeKey) {
    return this.graphInstance.children(nodeKey);
  }

  replaceChildren(nodeKey, model) {
    const childrenKeys = this.graphInstance.children(nodeKey);
    if (childrenKeys && childrenKeys.length > 0) {
      childrenKeys.forEach(childKey => {
        this.deleteChildren(childKey);
        this.graphInstance.removeNode(childKey);
      });
    }
    const newNodeKey = this.mapNewModel(model);
    this.graphInstance.setParent(newNodeKey, nodeKey);
  }

  deleteChildren(nodeKey) {
    const childrenKeys = this.graphInstance.children(nodeKey);
    if (childrenKeys && childrenKeys.length > 0) {
      childrenKeys.forEach(childKey => {
        this.deleteChildren(childKey);
        this.graphInstance.removeNode(childKey);
      });
    }
  }

  getNode(nodeKey) {
    return this.graphInstance.node(nodeKey);
  }

  nodeExists(nodeKey) {
    const node = this.graphInstance.node(nodeKey);
    return !!node;
  }

  getOrderedNodesByKeys(nodeKeys, comparator) {
    let nodes = [];
    if (nodeKeys && nodeKeys.length > 0 && comparator) {
      nodeKeys.forEach(nodeKey => {
        nodes.push(this.graphInstance.node(nodeKey));
      });
      nodes = nodes.sort(comparator);
    }
    return nodes;
  }

  getParentNode(nodeKey) {
    const parentNodeKey = this.graphInstance.parent(nodeKey);
    if (parentNodeKey) {
      return {...this.graphInstance.node(parentNodeKey), key: parentNodeKey};
    }
    return null;
  }

  getParentKey(nodeKey) {
    return this.graphInstance.parent(nodeKey);
  }

  setParentKey(nodeKey, newParentKey) {
    this.graphInstance.setParent(nodeKey, newParentKey);
    this.graphInstance.setEdge(newParentKey, nodeKey, `${newParentKey}${nodeKey}`);
  }

  getAllSiblingNodes(nodeKey) {
    const result = [];
    const parentNodeKey = this.graphInstance.parent(nodeKey);
    const childrenKeys = this.graphInstance.children(parentNodeKey);
    if (childrenKeys && childrenKeys.length > 0) {
      childrenKeys.forEach(childKey => {
         result.push(this.graphInstance.node(childKey));
      });
    }
    return result;
  }

  getAllParentNodes(nodeKey) {
    let result = [];
    const parentNode = this.getParentNode(nodeKey);
    if (parentNode) {
      result.push(parentNode);
      result = result.concat(this.getAllParentNodes(parentNode.key));
    }
    return result;
  }

  getAllParentKeys(nodeKey) {
    let result = [];
    const parentKey = this.getParentKey(nodeKey);
    if (parentKey) {
      result.push(parentKey);
      result = result.concat(this.getAllParentKeys(parentKey));
    }
    return result;
  }

  findAllNodesMatch(testNode, startNodeKey = null) {
    let result = [];
    startNodeKey = startNodeKey || this.rootNodeKey;
    const {key, type, instance, text, props} = this.graphInstance.node(startNodeKey);
    const graphNode = {key, type, instance, text, props};
    if (isMatch(graphNode, testNode)) {
      result.push(graphNode);
    }
    const childrenKeys = this.graphInstance.children(startNodeKey);
    if (childrenKeys && childrenKeys.length > 0) {
      childrenKeys.forEach(childKey => {
        result = result.concat(this.findAllNodesMatch(testNode, childKey));
      });
    }
    return result;
  }

  getPostorderKeys() {
    return graphlib.alg.postorder(this.graphInstance, this.rootNodeKey);
  }

}

export default GraphModel;