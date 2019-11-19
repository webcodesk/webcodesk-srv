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

import isNull from 'lodash/isNull';
import isEqual from 'lodash/isEqual';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import PropsTreeItem from './PropsTreeItem';
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
      borderLeft: '1px solid #e2e2e2',
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
    top: '9px',
    left: '-16px',
    color: '#aaaaaa',
    cursor: 'move',
    fontSize: '10px',
    zIndex: 10
  }
});

class PropsTree extends React.Component {
  static propTypes = {
    properties: PropTypes.array,
    onUpdateComponentPropertyModel: PropTypes.func,
    onIncreaseComponentPropertyArray: PropTypes.func,
    onDeleteComponentProperty: PropTypes.func,
    onErrorClick: PropTypes.func,
    onUpdateComponentPropertyArrayOrder: PropTypes.func,
  };

  static defaultProps = {
    properties: [],
    onUpdateComponentPropertyModel: () => {
      console.info('PropsTree.onUpdateComponentPropertyModel is not set');
    },
    onIncreaseComponentPropertyArray: () => {
      console.info('PropsTree.onIncreaseComponentPropertyArray is not set');
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
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      expandedGroupKeys: {},
      showEditJsonDialog: false,
      editComponentPropertyModel: null,
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { properties } = this.props;
    const { expandedGroupKeys, showEditJsonDialog } = this.state;
    return (properties !== nextProps.properties && !isEqual(properties, nextProps.properties))
      || expandedGroupKeys !== nextState.expandedGroupKeys
      || showEditJsonDialog !== nextState.showEditJsonDialog;
  }

  handleUpdateComponentPropertyModel = (newComponentPropertyModel) => {
    this.props.onUpdateComponentPropertyModel(newComponentPropertyModel);
  };

  handleIncreaseComponentPropertyArray = (propertyKey) => {
    this.props.onIncreaseComponentPropertyArray(propertyKey);
    const newExpandedGroupKeys = {...this.state.expandedGroupKeys};
    newExpandedGroupKeys[propertyKey] = true;
    this.setState({
      expandedGroupKeys: newExpandedGroupKeys,
    })
  };

  handleDeleteComponentProperty = (propertyKey) => {
    this.props.onDeleteComponentProperty(propertyKey);
  };

  handleUpdateComponentPropertyArrayOrder = (model) => ({oldIndex, newIndex}) => {
    if (model && model.children) {
      model.children = arrayMove(model.children, oldIndex, newIndex);
    }
    this.props.onUpdateComponentPropertyArrayOrder(model);
  };

  handleErrorClick = (messages) => {
    this.props.onErrorClick(messages);
  };

  handleToggleExpandItem = (groupKey) => {
    const newExpandedGroupKeys = {...this.state.expandedGroupKeys};
    newExpandedGroupKeys[groupKey] = !newExpandedGroupKeys[groupKey];
    this.setState({
      expandedGroupKeys: newExpandedGroupKeys,
    })
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

  handleSubmitEditJsonDialog = ({script}) => {
    const { editComponentPropertyModel } = this.state;
    editComponentPropertyModel.props = editComponentPropertyModel.props || {};
    try {
      editComponentPropertyModel.props.propertyValue = JSON.parse(script);
    } catch(e) {
      // do nothing
    }
    this.props.onUpdateComponentPropertyModel(editComponentPropertyModel);
    this.handleCloseEditJsonDialog();
  };

  createList = (node, level = 0, arrayIndex = null) => {
    const { classes } = this.props;
    let result = [];
    let isArrayItem = false;
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
        if (listItemLabelName) {
          listItemLabelName = propertyName;
        } else {
          listItemLabelName = propertyName;
        }
      }
      if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
        result.push(
          <PropsTreeGroup
            key={key}
            name={listItemLabelName}
            propertyModel={node}
            type={type}
            isExpanded={this.state.expandedGroupKeys[key]}
            onDeleteComponentProperty={this.handleDeleteComponentProperty}
            onErrorClick={this.handleErrorClick}
            onToggleExpandItem={this.handleToggleExpandItem}
          />
        );
        if (this.state.expandedGroupKeys[key] && children && children.length > 0) {
          result.push(
            <div key={`${key}_container`} className={classes.listItemContainer}>
              <div className={classes.listContainer}>
                {children.reduce(
                  (acc, child) => acc.concat(this.createList(child, level + 1, null)),
                  []
                )}
              </div>
            </div>
          );
        }
      } else if (type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
        result.push(
          <PropsTreeGroup
            key={key}
            name={listItemLabelName}
            propertyModel={node}
            type={type}
            isExpanded={this.state.expandedGroupKeys[key]}
            onIncreaseComponentPropertyArray={this.handleIncreaseComponentPropertyArray}
            onDeleteComponentProperty={this.handleDeleteComponentProperty}
            onErrorClick={this.handleErrorClick}
            onToggleExpandItem={this.handleToggleExpandItem}
          />
        );
        if (this.state.expandedGroupKeys[key] && children && children.length > 0) {
          result.push(
            <div key={`${key}_container`} className={classes.listItemContainer}>
              <SortableTreeList
                classes={classes}
                useDragHandle={true}
                items={children.reduce(
                  (acc, child, childIdx) => acc.concat(this.createList(child, level + 1, childIdx)),
                  []
                )}
                onSortEnd={this.handleUpdateComponentPropertyArrayOrder(node)}
              />
            </div>
          );
        }
      } else if (type === constants.COMPONENT_PROPERTY_ELEMENT_TYPE) {
          result.push(
            <PropsTreeItem
              key={key}
              name={listItemLabelName}
              propertyModel={node}
              onDeleteComponentProperty={this.handleDeleteComponentProperty}
              onErrorClick={this.handleErrorClick}
            />
          );
      } else if (type === constants.PAGE_COMPONENT_TYPE) {
          result.push(
            <PropsTreeItem
              key={key}
              name={listItemLabelName}
              propertyModel={node}
              onDeleteComponentProperty={this.handleDeleteComponentProperty}
              onErrorClick={this.handleErrorClick}
            />
          );
      } else if (type !== constants.COMPONENT_PROPERTY_FUNCTION_TYPE) {
        result.push(
          <PropsTreeItem
            key={key}
            name={listItemLabelName}
            propertyModel={node}
            onPropertyUpdate={this.handleUpdateComponentPropertyModel}
            onDeleteComponentProperty={this.handleDeleteComponentProperty}
            onErrorClick={this.handleErrorClick}
            onEditJson={this.handleOpenEditJsonDialog}
          />
        );
      }
    }
    if (isArrayItem) {
      return [
        <div className={classes.dragHandlerContainer}>
          <DragHandler
            element={
              <div className={`${classes.dragHandler} fas fa-grip-horizontal`} />
            }
          />
          {result}
        </div>
      ];
    }
    return result;
  };

  render () {
    const { classes, properties } = this.props;
    if (properties && properties.length > 0) {
      const { showEditJsonDialog, editComponentPropertyModel } = this.state;
      let editJsonScript = '';
      let editJsonDialogTitle = '';
      if (editComponentPropertyModel && editComponentPropertyModel.props) {
        editJsonScript = JSON.stringify(editComponentPropertyModel.props.propertyValue);
        editJsonDialogTitle = `Edit property: ${editComponentPropertyModel.props.propertyName}`;
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
                {properties.reduce(
                  (acc, child) => acc.concat(this.createList(child)),
                  []
                )}
              </div>
            </div>
          </List>
          <div className={classes.footerArea} />
          <EditJsonDialog
            title={editJsonDialogTitle}
            isOpen={showEditJsonDialog}
            script={editJsonScript}
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
