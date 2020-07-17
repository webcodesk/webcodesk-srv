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

import cloneDeep from '../utils/cloneDeep';
import GraphModel from '../graph/GraphModel';
import * as constants from '../../../commons/constants';
import * as pageComposerFactory from './pageComposerFactory';

// const pageComposerComparator = (a, b) => {
//   const { props: aProps } = a;
//   const { props: bProps } = b;
//   if (!aProps.elementProperty && bProps.elementProperty) {
//     return -1;
//   } else if (aProps.elementProperty && !bProps.elementProperty) {
//     return 1;
//   } else if (!aProps.elementProperty && !bProps.elementProperty) {
//     return 0;
//   } else {
//     return aProps.elementProperty.localeCompare(bProps.elementProperty);
//   }
// };

class PageComposerManager {

  constructor (model) {
    this.graphModel = new GraphModel({globallyUniqueKeys: false});
    this.graphModel.initModel(cloneDeep(model));
  }

  instanceVisitor = ({nodeModel}) => {
    const result = [];
    if (
      nodeModel
      && nodeModel.props
      && (nodeModel.type === constants.PAGE_COMPONENT_TYPE || nodeModel.type === constants.PAGE_NODE_TYPE)
    ) {
      const { key, props } = nodeModel;
      const extractedModel = this.graphModel.extractModel(key, true);
      if (props) {
        result.push({
          componentName: props.componentName,
          componentInstance: props.componentInstance,
          componentsTreeBranch: extractedModel,
        });
      }
    }
    return result;
  };

  instanceVisitor2 = (nodeModelTransformFunc) => (accumulator, {nodeModel, parentModel}) => {
    if (
      nodeModel
      && nodeModel.props
      && (nodeModel.type === constants.PAGE_COMPONENT_TYPE || nodeModel.type === constants.PAGE_NODE_TYPE)
    ) {
      const { key, props } = nodeModel;
      const extractedModel = this.graphModel.extractModel(key, true);
      if (props) {
        const instanceModel = nodeModelTransformFunc(props, extractedModel);
        if (parentModel) {
          accumulator = accumulator || {};
          accumulator.children = accumulator.children || [];
          accumulator.children.push(instanceModel);
        }
        accumulator = instanceModel;
      }
    }
    return accumulator;
  };

  componentVisitor = ({ nodeModel }) => {
    const result = [];
    if (
      nodeModel
      && nodeModel.props
      && (nodeModel.type === constants.PAGE_COMPONENT_TYPE || nodeModel.type === constants.PAGE_NODE_TYPE)
    ) {
      const { props } = nodeModel;
      if (props) {
        result.push({
          componentName: props.componentName,
          componentInstance: props.componentInstance,
        });
      }
    }
    return result;
  };

  selectedVisitor = ({nodeModel, parentModel}) => {
    const result = [];
    if (nodeModel && nodeModel.props && result.length === 0) {
      const { key, props } = nodeModel;
      if (props && props.isSelected) {
        const extractedModel = this.graphModel.extractModel(key);
        if (extractedModel) {
          result.push(extractedModel);
        }
      }
    }
    return result;
  };

  removeSelectedVisitor = ({nodeModel, parentModel}) => {
    if (nodeModel && nodeModel.props) {
      const { props } = nodeModel;
      if (props && props.isSelected) {
        delete nodeModel.props.isSelected;
      }
    }
  };

  getInstancesListUniq = () => {
    // get all instance references with the component tree chunks that belong to each instance
    return this.graphModel.traverse(this.instanceVisitor);
  };

  getInstancesTree = (nodeModelTransformFunc) => {
    // get all instance references with the component tree chunks that belong to each instance
    return this.graphModel.traverseWithAccumulator({}, this.instanceVisitor2(nodeModelTransformFunc));
  };

  getComponentsList = () => {
    return this.graphModel.traverse(this.componentVisitor);
  };

  getModel = (fast) => {
    if (fast) {
      return this.graphModel.getModel(false);
    } else {
      return this.graphModel.getModel(false);
    }
  };

  getModelWithoutKeys = (nodeKey) => {
    return this.graphModel.extractModel(nodeKey, true);
  };

  getSerializableModel = () => {
    return this.graphModel.getModel(false, null);
  };

  getParentKey = (nodeKey) => {
    return this.graphModel.getParentKey(nodeKey);
  };

  placeNewComponent = (targetKey, resourceObject) => {
    const placeHolderModel = this.graphModel.getNode(targetKey);
    if (placeHolderModel) {
      const { type, props } = placeHolderModel;
      if (type === constants.COMPONENT_PROPERTY_ELEMENT_TYPE && props) {
        const {propertyName} = props;
        const newComponentInstanceModel =
          pageComposerFactory.createPageComponentModel(resourceObject, propertyName);
        return this.graphModel.replaceNode(targetKey, newComponentInstanceModel);
      } else if (type === constants.COMPONENT_PROPERTY_NODE_TYPE && props) {
        const {propertyName} = props;
        const newComponentInstanceModel =
          pageComposerFactory.createPageNodeModel(resourceObject, propertyName);
        return this.graphModel.replaceNode(targetKey, newComponentInstanceModel);
      }
    }
  };

  updateComponentProperty = (newComponentPropertyModel) => {
    if (newComponentPropertyModel) {
      const { key } = newComponentPropertyModel;
      const prevModel = this.graphModel.getNode(key);
      if (prevModel) {
        return this.graphModel.updateNode(key, newComponentPropertyModel);
      }
    }
  };

  deleteComponentProperty = (targetKey) => {
    this.graphModel.deleteNode(targetKey);
  };

  updateComponentPropertyArrayOrder = (newComponentPropertyModel) => {
    if (newComponentPropertyModel) {
      this.graphModel.updateChildrenOrder(newComponentPropertyModel);
    }
  };

  increaseComponentPropertyArray = (targetKey) => {
    const nodeModel = this.graphModel.getNode(targetKey);
    if (nodeModel) {
      const { props } = nodeModel;
      if (props) {
        const {defaultChildren} = props;
        if (defaultChildren && defaultChildren.length > 0) {
          defaultChildren.forEach(childModel => {
            this.graphModel.addChildNode(targetKey, childModel);
          });
        }
      }
    }
  };

  duplicateComponentPropertyArrayItem = (targetKey, parentKey, itemIndex) => {
    const extractedNodeModel = this.graphModel.extractModel(targetKey, true);
    // append child after the original item
    this.graphModel.addChildNode(parentKey, extractedNodeModel, itemIndex + 1);
  };

  renameComponentInstance = (targetKey, componentInstance) => {
    const componentModel = this.graphModel.getNode(targetKey);
    if (
      componentModel
      && (componentModel.type === constants.PAGE_COMPONENT_TYPE || componentModel.type === constants.PAGE_NODE_TYPE)
    ) {
      componentModel.props = componentModel.props || {};
      componentModel.props.componentInstance = componentInstance;
    }
  };

  deleteComponentInstance = (targetKey) => {
    const componentModel = this.graphModel.getNode(targetKey);
    if (componentModel) {
      const { type, props } = componentModel;
      if (type === constants.PAGE_COMPONENT_TYPE && props) {
        this.graphModel.replaceNode(targetKey, pageComposerFactory.createPagePlaceholderModel(props.propertyName));
        this.removeAllSelectedCells();
      } else if (type === constants.PAGE_NODE_TYPE && props) {
        this.graphModel.replaceNode(targetKey, pageComposerFactory.createNodePlaceholderModel(props.propertyName));
        this.removeAllSelectedCells();
      }
    }
  };

  getSelectedKey = () => {
    const selectedModels = this.graphModel.traverse(this.selectedVisitor);
    if (selectedModels.length > 0) {
      return selectedModels[0].key;
    }
    return null;
  };

  removeAllSelectedCells = () => {
    this.graphModel.traverse(this.removeSelectedVisitor);
  };

  selectCell = (targetKey) => {
    if (targetKey) {
      this.removeAllSelectedCells();
      const modelNode = this.graphModel.getNode(targetKey);
      if (modelNode) {
        modelNode.props = modelNode.props || {};
        modelNode.props.isSelected = true;
      }
    }
  };

  getSelectedNode = () => {
    const selectedModels = this.graphModel.traverse(this.selectedVisitor);
    if (selectedModels.length > 0) {
      return selectedModels[0];
    }
    return null;
  };

  generateInstanceState = (componentInstanceModel) => {

  };

}

export default PageComposerManager;