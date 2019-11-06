import cloneDeep from 'lodash/cloneDeep';
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

  constructor (model, metaData) {
    this.graphModel = new GraphModel({globallyUniqueKeys: false});
    this.graphModel.initModel(cloneDeep(model));
    this.metaData = metaData;
  }

  instanceVisitor = ({nodeModel, parentModel}) => {
    const result = [];
    if (nodeModel && nodeModel.props && nodeModel.type === constants.PAGE_COMPONENT_TYPE) {
      const { key, props } = nodeModel;
      const extractedModel = this.graphModel.extractModel(key, true);
      result.push({
        componentName: props.componentName,
        componentInstance: props.componentInstance,
        // no need to clone children,
        // this is the responsibility of the executor of the method
        properties: extractedModel.children,
      });
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
     return this.graphModel.traverse(this.instanceVisitor);
  };

  getModel = () => {
    return this.graphModel.getModel(false);
  };

  getSerializableModel = (nodeKey = null) => {
    if (nodeKey) {
      return this.graphModel.extractModel(nodeKey, true);
    }
    return this.graphModel.getModel();
  };

  getMetaData = () => {
    return this.metaData;
  };

  setMetaData = (newMetaData) => {
    this.metaData = newMetaData;
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

  renameComponentInstance = (targetKey, componentInstance) => {
    const componentModel = this.graphModel.getNode(targetKey);
    if (componentModel && componentModel.type === constants.PAGE_COMPONENT_TYPE) {
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
}

export default PageComposerManager;