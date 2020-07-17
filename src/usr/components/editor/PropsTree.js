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

import isNull from 'lodash/isNull';
import cloneDeep from '../../core/utils/cloneDeep';
import forOwn from 'lodash/forOwn';
import startCase from 'lodash/startCase';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import DragIndicator from '@material-ui/icons/DragIndicator';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import PropsTreeItem from './PropsTreeItem';
import globalStore from '../../core/config/globalStore';
import * as constants from '../../../commons/constants';
import PropsTreeGroup from './PropsTreeGroup';
import EditJsonDialog from '../dialogs/EditJsonDialog';
import { arrayMove } from '../../core/utils/arrayUtils';

const DragHandler = SortableHandle(({element}) => element);

const SortableTreeItem = SortableElement(({element}) => element);

const SortableTreeList = SortableContainer(({items, classes}) => {
  return (
    <div className={classes.listContainer}>
      {items.map((element, index) => {
        return (
          <SortableTreeItem key={`item-${index}`} index={index} element={element} />
        );
      })}
    </div>
  )
});

const TREE_VIEW_INDENT = '21px';
const FIRST_LIST_INDENT = '0px';

const styles = theme => ({
  footerArea: {
    height: '7em',
  },
  firstListContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflow: 'hidden',
    paddingLeft: FIRST_LIST_INDENT,
  },
  listContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflow: 'hidden',
    paddingLeft: TREE_VIEW_INDENT,
    position: 'relative',
    '&::after': {
      content: `''`,
      position: 'absolute',
      top: 0,
      left: '9px',
      bottom: 0,
      width: 0,
      borderLeft: '1px dotted #cdcdcd',
    }
  },
  listItemContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  dragHandlerContainer: {
    position: 'relative',
  },
  dragHandler: {
    position: 'absolute',
    top: '8px',
    left: '-18px',
    color: '#aaaaaa',
    cursor: 'move',
    fontSize: '13px',
    zIndex: 10
  }
});

const propertyComparator = (aModel, bModel) => {
  const { type: aType, props: { propertyName: aPropertyName } } = aModel;
  const { type: bType, props: { propertyName: bPropertyName } } = bModel;
  if (!aPropertyName && bPropertyName) {
    return 1;
  } else if (aPropertyName && !bPropertyName) {
    return -1;
  } else if (!aPropertyName && !bPropertyName) {
    return 0;
  } else {
    if (aType === constants.COMPONENT_PROPERTY_SHAPE_TYPE || aType === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
      return 1;
    }
    if (bType === constants.COMPONENT_PROPERTY_SHAPE_TYPE || bType === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
      return -1;
    }
    return aPropertyName.localeCompare(bPropertyName);
  }
};

function omitParentKey(expandedGroupKeys, parentKey) {
  let result = {};
  const nestedKeys = [];
  forOwn(expandedGroupKeys, (value, key) => {
      if (value.parentItemSignature !== parentKey) {
        result[key] = value;
      } else {
        nestedKeys.push(key);
      }
  });
  if (nestedKeys.length > 0) {
    for(let i = 0; i < nestedKeys.length; i++) {
      result = omitParentKey(result, nestedKeys[i]);
    }
  }
  return result;
}

class PropsTree extends React.Component {
  static propTypes = {
    dataId: PropTypes.string,
    properties: PropTypes.array,
    onUpdateComponentPropertyModel: PropTypes.func,
    onIncreaseComponentPropertyArray: PropTypes.func,
    onDuplicateComponentPropertyArrayItem: PropTypes.func,
    onDeleteComponentProperty: PropTypes.func,
    onErrorClick: PropTypes.func,
    onUpdateComponentPropertyArrayOrder: PropTypes.func,
    onSelectComponent: PropTypes.func,
  };

  static defaultProps = {
    dataId: '',
    properties: [],
    onUpdateComponentPropertyModel: () => {
      console.info('PropsTree.onUpdateComponentPropertyModel is not set');
    },
    onIncreaseComponentPropertyArray: () => {
      console.info('PropsTree.onIncreaseComponentPropertyArray is not set');
    },
    onDuplicateComponentPropertyArrayItem: () => {
      console.info('PropsTree.onDuplicateComponentPropertyArrayItem is not set');
    },
    onDeleteComponentProperty: () => {
      console.info('PropsTree.onDeleteComponentProperty is not set');
    },
    onErrorClick: () => {
      console.info('PropsTree.onErrorClick is not set');
    },
    onUpdateComponentPropertyArrayOrder: () => {
      console.info('PropsTree.onUpdateComponentPropertyArrayOrder is not set');
    },
    onSelectComponent: () => {
      console.info('PropsTree.onSelectComponent is not set');
    },
  };

  constructor (props, context) {
    super(props, context);
    const { properties, dataId } = this.props;
    this.state = {
      expandedGroupKeys: this.getStoredExpandedKeys(dataId),
      showEditJsonDialog: false,
      editComponentPropertyModel: null,
      propertiesLocal: properties ? this.sortProperties(cloneDeep(properties)) : [],
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { properties } = this.props;
    const { expandedGroupKeys, showEditJsonDialog, propertiesLocal } = this.state;
    return properties !== nextProps.properties
      || expandedGroupKeys !== nextState.expandedGroupKeys
      || showEditJsonDialog !== nextState.showEditJsonDialog
      || propertiesLocal !== nextState.propertiesLocal;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { properties, dataId } = this.props;
    if (properties && properties !== prevProps.properties) {
      this.setState({
        expandedGroupKeys: this.getStoredExpandedKeys(dataId),
        propertiesLocal: this.sortProperties(cloneDeep(properties)),
      });
    }
  }

  handleUpdateComponentPropertyModel = (newComponentPropertyModel) => {
    this.props.onUpdateComponentPropertyModel(newComponentPropertyModel);
  };

  handleIncreaseComponentPropertyArray = (propertyKey, itemSignature, parentItemSignature) => {
    this.props.onIncreaseComponentPropertyArray(propertyKey);
    if (!this.state.expandedGroupKeys[itemSignature]) {
      const newExpandedGroupKeys = {...this.state.expandedGroupKeys};
      newExpandedGroupKeys[itemSignature] = {
        parentItemSignature
      };
      this.storeExpandedKeys(this.props.dataId, newExpandedGroupKeys);
      this.setState({
        expandedGroupKeys: newExpandedGroupKeys,
      });
    }
  };

  handleDeleteComponentProperty = (propertyKey, itemSignature) => {
    if (itemSignature) {
      const newExpandedGroupKeys = { ...this.state.expandedGroupKeys };
      delete newExpandedGroupKeys[itemSignature];
      this.storeExpandedKeys(this.props.dataId, newExpandedGroupKeys);
    }
    this.props.onDeleteComponentProperty(propertyKey);
  };

  handleUpdateComponentPropertyArrayOrder = (model) => ({oldIndex, newIndex}) => {
    if (model && model.children) {
      model.children = arrayMove(model.children, oldIndex, newIndex);
    }
    this.props.onUpdateComponentPropertyArrayOrder(model);
  };

  handleDuplicateComponentPropertyArrayItem = (propertyKey, groupPropertyKey, itemIndex) => {
    this.props.onDuplicateComponentPropertyArrayItem(propertyKey, groupPropertyKey, itemIndex);
  };

  handleErrorClick = (messages) => {
    this.props.onErrorClick(messages);
  };

  handleSelectComponent = (componentKey) => {
    this.props.onSelectComponent(componentKey);
  };

  handleToggleExpandItem = (itemSignature, parentItemSignature) => {
    let newExpandedGroupKeys = {...this.state.expandedGroupKeys};
    if (newExpandedGroupKeys[itemSignature]) {
      newExpandedGroupKeys = omitParentKey(newExpandedGroupKeys, itemSignature);
      delete newExpandedGroupKeys[itemSignature];
    } else {
      newExpandedGroupKeys[itemSignature] = {
        parentItemSignature,
      };
    }
    this.storeExpandedKeys(this.props.dataId, newExpandedGroupKeys);
    this.setState({
      expandedGroupKeys: newExpandedGroupKeys,
    });
  };

  handleOpenEditJsonDialog = (editComponentPropertyModel) => {
    this.setState({
      showEditJsonDialog: true,
      editComponentPropertyModel,
    });
  };

  handleCloseEditJsonDialog = () => {
    this.setState({
      showEditJsonDialog: false,
      editComponentPropertyModel: null,
    });
  };

  handleSubmitEditJsonDialog = ({objectAfterEdit}) => {
    const { editComponentPropertyModel } = this.state;
    editComponentPropertyModel.props = editComponentPropertyModel.props || {};
    editComponentPropertyModel.props.propertyValue = objectAfterEdit;
    // try {
    //   editComponentPropertyModel.props.propertyValue = script && script.length > 0
    //     ? JSON.parse(script)
    //     : undefined;
    // } catch(e) {
    //   // do nothing
    // }
    this.props.onUpdateComponentPropertyModel(editComponentPropertyModel);
    this.handleCloseEditJsonDialog();
  };

  sortProperties = (properties) => {
    if (properties && properties.length > 0) {
      properties.forEach(propertyItem => {
        if (propertyItem && propertyItem.children && propertyItem.children.length > 0) {
          propertyItem.children = this.sortProperties(propertyItem.children);
        }
      });
      return properties.sort(propertyComparator);
    }
    return properties;
  };

  // expandAllGroupsProperties = (properties) => {
  //   let result = {};
  //   if (properties && properties.length > 0) {
  //     properties.forEach(propertyItem => {
  //       if (propertyItem) {
  //         const { type, key, children } = propertyItem;
  //         if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE || type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
  //           result[key] = true;
  //           if (children && children.length > 0) {
  //             result = {...result, ...this.expandAllGroupsProperties(children)};
  //           }
  //         }
  //       }
  //     });
  //   }
  //   return result;
  // };

  getStoredExpandedKeys = (dataId) => {
    if (dataId) {
      const recordOfExpandedKeys = globalStore.get(constants.STORAGE_RECORD_EXPANDED_COMPONENT_PROPS_KEYS) || {};
      return recordOfExpandedKeys[dataId] || {};
    }
    return {};
  };

  storeExpandedKeys = (dataId, expandedKeys) => {
    if (dataId) {
      const recordOfExpandedKeys = globalStore.get(constants.STORAGE_RECORD_EXPANDED_COMPONENT_PROPS_KEYS) || {};
      recordOfExpandedKeys[dataId] = expandedKeys;
      globalStore.set(constants.STORAGE_RECORD_EXPANDED_COMPONENT_PROPS_KEYS, recordOfExpandedKeys, true);
    }
  };

  createList = (node, itemSignature = '', parentNode = null, level = 0, arrayIndex = null) => {
    const { classes } = this.props;
    let result = [];
    let isArrayItem = false;
    let parentKey;
    if (parentNode) {
      parentKey = parentNode.key;
    }
    if (node) {
      const { key, type, props, children } = node;
      const { propertyName } = props;
      let listItemLabelName;
      if (!isNull(arrayIndex) && arrayIndex >= 0) {
        listItemLabelName = `${arrayIndex} item`;
        isArrayItem = true;
      } else {
        isArrayItem = false;
      }
      if (propertyName) {
        listItemLabelName = startCase(propertyName);
        // if (listItemLabelName) {
        //   listItemLabelName = propertyName;
        // } else {
        // }
      }
      const parentItemSignature = itemSignature;
      itemSignature += `.${listItemLabelName}`;
      if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
        result.push(
          <PropsTreeGroup
            key={key}
            name={listItemLabelName}
            parentKey={parentKey}
            itemSignature={itemSignature}
            parentItemSignature={parentItemSignature}
            arrayIndex={arrayIndex}
            propertyModel={node}
            type={type}
            isExpanded={!!this.state.expandedGroupKeys[itemSignature]}
            onDeleteComponentProperty={this.handleDeleteComponentProperty}
            onErrorClick={this.handleErrorClick}
            onToggleExpandItem={this.handleToggleExpandItem}
            onDuplicateComponentProperty={this.handleDuplicateComponentPropertyArrayItem}
          />
        );
        if (this.state.expandedGroupKeys[itemSignature] && children && children.length > 0) {
          let containerContent = [];
          for (let i = 0; i < children.length; i++) {
            containerContent = containerContent.concat(this.createList(children[i], itemSignature, node, level + 1, null));
          }
          result.push(
            <div key={`${key}_container`} className={classes.listItemContainer}>
              <div className={classes.listContainer}>
                {containerContent}
              </div>
            </div>
          );
        }
      } else if (type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
        result.push(
          <PropsTreeGroup
            key={key}
            name={listItemLabelName}
            parentKey={parentKey}
            itemSignature={itemSignature}
            parentItemSignature={parentItemSignature}
            arrayIndex={arrayIndex}
            propertyModel={node}
            type={type}
            isExpanded={!!this.state.expandedGroupKeys[itemSignature]}
            onIncreaseComponentPropertyArray={this.handleIncreaseComponentPropertyArray}
            onDeleteComponentProperty={this.handleDeleteComponentProperty}
            onErrorClick={this.handleErrorClick}
            onToggleExpandItem={this.handleToggleExpandItem}
            onDuplicateComponentProperty={this.handleDuplicateComponentPropertyArrayItem}
          />
        );
        if (this.state.expandedGroupKeys[itemSignature] && children && children.length > 0) {
          let containerContent = [];
          for (let i = 0; i < children.length; i++) {
            containerContent = containerContent.concat(this.createList(children[i], itemSignature, node, level + 1, i));
          }
          result.push(
            <div key={`${key}_container`} className={classes.listItemContainer}>
              <SortableTreeList
                classes={classes}
                useDragHandle={true}
                items={containerContent}
                onSortEnd={this.handleUpdateComponentPropertyArrayOrder(node)}
              />
            </div>
          );
        }
      } else if (
        type === constants.COMPONENT_PROPERTY_ELEMENT_TYPE
        || type === constants.COMPONENT_PROPERTY_NODE_TYPE
      ) {
          result.push(
            <PropsTreeItem
              key={key}
              name={listItemLabelName}
              parentKey={parentKey}
              arrayIndex={arrayIndex}
              propertyModel={node}
              onDeleteComponentProperty={this.handleDeleteComponentProperty}
              onDuplicateComponentProperty={this.handleDuplicateComponentPropertyArrayItem}
              onErrorClick={this.handleErrorClick}
            />
          );
      } else if (
        type === constants.PAGE_COMPONENT_TYPE
        || type === constants.PAGE_NODE_TYPE
      ) {
          result.push(
            <PropsTreeItem
              key={key}
              name={listItemLabelName}
              parentKey={parentKey}
              arrayIndex={arrayIndex}
              propertyModel={node}
              onDeleteComponentProperty={this.handleDeleteComponentProperty}
              onDuplicateComponentProperty={this.handleDuplicateComponentPropertyArrayItem}
              onErrorClick={this.handleErrorClick}
              onSelectComponent={this.handleSelectComponent}
            />
          );
      } else if (type !== constants.COMPONENT_PROPERTY_FUNCTION_TYPE) {
        result.push(
          <PropsTreeItem
            key={key}
            name={listItemLabelName}
            parentKey={parentKey}
            arrayIndex={arrayIndex}
            propertyModel={node}
            onPropertyUpdate={this.handleUpdateComponentPropertyModel}
            onDeleteComponentProperty={this.handleDeleteComponentProperty}
            onErrorClick={this.handleErrorClick}
            onEditJson={this.handleOpenEditJsonDialog}
            onDuplicateComponentProperty={this.handleDuplicateComponentPropertyArrayItem}
          />
        );
      }
    }
    if (isArrayItem) {
      return [
        <div className={classes.dragHandlerContainer}>
          <DragHandler
            element={
              <DragIndicator className={classes.dragHandler} />
            }
          />
          {result}
        </div>
      ];
    }
    return result;
  };

  render () {
    const { classes } = this.props;
    const { propertiesLocal } = this.state;
    if (propertiesLocal && propertiesLocal.length > 0) {
      const { showEditJsonDialog, editComponentPropertyModel } = this.state;
      let editJsonObject;
      let editJsonDialogTitle = '';
      if (editComponentPropertyModel && editComponentPropertyModel.props) {
        editJsonObject = editComponentPropertyModel.props.propertyValue;
        editJsonDialogTitle = `Edit property: ${editComponentPropertyModel.props.propertyName}`;
      }
      let containerContent = [];
      for (let i = 0; i < propertiesLocal.length; i++) {
        containerContent = containerContent.concat(this.createList(propertiesLocal[i]));
      }
      return (
        <div>
          <List
            key="componentPropsTree"
            dense={true}
            disablePadding={true}
          >
            <div className={classes.listItemContainer}>
              <div className={classes.firstListContainer}>
                {containerContent}
              </div>
            </div>
          </List>
          <div className={classes.footerArea} />
          <EditJsonDialog
            title={editJsonDialogTitle}
            isOpen={showEditJsonDialog}
            objectToEdit={editJsonObject}
            onClose={this.handleCloseEditJsonDialog}
            onSubmit={this.handleSubmitEditJsonDialog}
          />
        </div>
      );
    }
    return (
      <div className={classes.root}>
        <Typography variant="subtitle2" gutterBottom={true}>
          No properties found.
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(PropsTree);
