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
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import PageTreeGroup from './PageTreeGroup';
import PageTreeItem from './PageTreeItem';
import * as constants from '../../../commons/constants';
import { arrayMove } from '../../core/utils/arrayUtils';
import DragIndicator from '@material-ui/icons/DragIndicator';

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

const TREE_VIEW_INDENT = '16px';
const FIRST_LIST_INDENT = '0px';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: '10px'
  },
  list: {
    width: '800px'
  },
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
  componentListContainer: {
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
      top: '-16px',
      left: '9px',
      bottom: 0,
      width: 0,
      borderLeft: '1px dotted #cdcdcd',
    }
  },
  arrayListContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
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
    top: '5px',
    left: '-13px',
    color: '#aaaaaa',
    cursor: 'move',
    fontSize: '13px',
    zIndex: 10
  }
});

class PageTree extends React.Component {
  static propTypes = {
    componentsTree: PropTypes.object,
    draggedItem: PropTypes.object,
    isDraggingItem: PropTypes.bool,
    onItemClick: PropTypes.func,
    onItemErrorClick: PropTypes.func,
    onItemDrop: PropTypes.func,
    onDeleteComponentProperty: PropTypes.func,
    onIncreaseComponentPropertyArray: PropTypes.func,
    onDuplicateComponentPropertyArrayItem: PropTypes.func,
    onUpdateComponentPropertyArrayOrder: PropTypes.func,
  };

  static defaultProps = {
    componentsTree: null,
    draggedItem: null,
    isDraggingItem: false,
    onItemClick: () => {
      console.info('PageTree.onItemClick is not set');
    },
    onItemErrorClick: () => {
      console.info('PageTree.onItemErrorClick is not set');
    },
    onItemDrop: () => {
      console.info('PageTree.onItemDrop is not set');
    },
    onDeleteComponentProperty: () => {
      console.info('PageTree.onDeleteComponentProperty is not set');
    },
    onIncreaseComponentPropertyArray: () => {
      console.info('PageTree.onIncreaseComponentPropertyArray is not set');
    },
    onDuplicateComponentPropertyArrayItem: () => {
      console.info('PageTree.onDuplicateComponentPropertyArrayItem is not set');
    },
    onUpdateComponentPropertyArrayOrder: () => {
      console.info('PageTree.onUpdateComponentPropertyArrayOrder is not set');
    },
  };

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { componentsTree, draggedItem, isDraggingItem } = this.props;
    return componentsTree !== nextProps.componentsTree
      || draggedItem !== nextProps.draggedItem
      || isDraggingItem !== nextProps.isDraggingItem;
  }

  handleItemClick = (key) => {
    this.props.onItemClick(key);
  };

  handleItemErrorClick = (messages) => {
    this.props.onItemErrorClick(messages);
  };

  handleItemDrop = (data) => {
    this.props.onItemDrop(data);
  };

  handleDeleteComponentProperty = (propertyKey) => {
    this.props.onDeleteComponentProperty(propertyKey);
  };

  handleIncreaseComponentPropertyArray = (propertyKey) => {
    this.props.onIncreaseComponentPropertyArray(propertyKey);
  };

  handleDuplicateComponentPropertyArrayItem = (propertyKey, groupPropertyKey, itemIndex) => {
    this.props.onDuplicateComponentPropertyArrayItem(propertyKey, groupPropertyKey, itemIndex);
  };

  handleUpdateComponentPropertyArrayOrder = (model) => ({oldIndex, newIndex}) => {
    if (model && model.children) {
      model.children = arrayMove(model.children, oldIndex, newIndex);
    }
    this.props.onUpdateComponentPropertyArrayOrder(model);
  };

  createList = (node, draggedItem, isDraggingItem, parent = null, level = 0, arrayIndex = null) => {
    const { classes } = this.props;
    let result = [];
    if (node) {
      let isArrayItem = false;
      const { key, type, props, children } = node;
      const { propertyName } = props;
      let listItemLabelName;
      if (!isNull(arrayIndex) && arrayIndex >= 0) {
        listItemLabelName = `${arrayIndex} item`;
        isArrayItem = true;
      }
      if (propertyName) {
        if (listItemLabelName) {
          listItemLabelName += `.${propertyName}`;
        } else {
          listItemLabelName = propertyName;
        }
      }
      if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
        let childListItems = [];
        if (children && children.length > 0) {
          childListItems = children.reduce(
            (acc, child) => acc.concat(
              this.createList(child, draggedItem, isDraggingItem, node, level + 1)
            ),
            childListItems
          );
        }
        if (childListItems.length > 0) {
          result.push(
            <PageTreeGroup
              key={key}
              name={listItemLabelName}
              node={node}
              parentKey={parent ? parent.key : null}
              arrayIndex={arrayIndex}
              onDeleteComponentProperty={this.handleDeleteComponentProperty}
              onDuplicateComponentProperty={this.handleDuplicateComponentPropertyArrayItem}
            />
          );
          result.push(
            <div key={`${key}_container`} className={classes.listItemContainer}>
              <div className={classes.listContainer}>
                {childListItems}
              </div>
            </div>
          );
        }
      } else if (type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
        let childLevel = level;
        if (propertyName) {
          // indentation if there is grouping property name
          childLevel += 1;
        }
        let childListItems = [];
        if (children && children.length > 0) {
          childListItems = children.reduce(
            (acc, child, idx) => acc.concat(
              this.createList(child, draggedItem, isDraggingItem, node, childLevel, idx)
            ),
            childListItems
          );
        }
        if (childListItems.length > 0) {
          if (propertyName) {
            result.push(
              <PageTreeGroup
                key={key}
                name={listItemLabelName}
                node={node}
                parentKey={parent ? parent.key : null}
                arrayIndex={arrayIndex}
                isArray={true}
                onIncreaseComponentPropertyArray={this.handleIncreaseComponentPropertyArray}
                onDeleteComponentProperty={this.handleDeleteComponentProperty}
                onDuplicateComponentProperty={this.handleDuplicateComponentPropertyArrayItem}
              />
            );
          }
          result.push(
            <div key={`${key}_container`} className={classes.listItemContainer}>
              <SortableTreeList
                classes={classes}
                useDragHandle={true}
                items={childListItems}
                onSortEnd={this.handleUpdateComponentPropertyArrayOrder(node)}
              />
            </div>
          );
        }
      } else if (
        type === constants.COMPONENT_PROPERTY_ELEMENT_TYPE
        || type === constants.COMPONENT_PROPERTY_NODE_TYPE
      ) {
        const { isSelected } = props;
        result.push(
          <PageTreeItem
            key={key}
            itemKey={key}
            parentKey={parent ? parent.key : null}
            isPlaceholder={true}
            name={listItemLabelName}
            node={node}
            arrayIndex={arrayIndex}
            isSelected={isSelected}
            draggedItem={draggedItem}
            isDraggingItem={isDraggingItem}
            onClick={this.handleItemClick}
            onErrorClick={this.handleItemErrorClick}
            onDrop={this.handleItemDrop}
            onDeleteComponentProperty={this.handleDeleteComponentProperty}
            onDuplicateComponentProperty={this.handleDuplicateComponentPropertyArrayItem}
          />
        );
      } else if (
        type === constants.PAGE_COMPONENT_TYPE
        || type === constants.PAGE_NODE_TYPE
      ) {
        const { errors, componentName, componentInstance, isSelected } = props;
        let childListItems = [];
        if (children && children.length > 0) {
          childListItems = children.reduce(
            (acc, child) => acc.concat(
              this.createList(child, draggedItem, isDraggingItem, node, level + 1)
            ),
            childListItems
          );
        }
        result.push(
          <PageTreeItem
            key={key}
            itemKey={key}
            parentKey={parent ? parent.key : null}
            isPlaceholder={false}
            name={listItemLabelName}
            node={node}
            arrayIndex={arrayIndex}
            errors={errors}
            componentName={componentName}
            componentInstance={componentInstance}
            isSelected={isSelected}
            hasChildren={childListItems.length > 0}
            draggedItem={draggedItem}
            isDraggingItem={isDraggingItem}
            onClick={this.handleItemClick}
            onErrorClick={this.handleItemErrorClick}
            onDrop={this.handleItemDrop}
            onDeleteComponentProperty={this.handleDeleteComponentProperty}
            onDuplicateComponentProperty={this.handleDuplicateComponentPropertyArrayItem}
          />
        );
        if (childListItems.length > 0) {
          result.push(
            <div key={`${key}_container`} className={classes.listItemContainer}>
              <div className={classes.componentListContainer}>
                {childListItems}
              </div>
            </div>
          );
        }
      }
      if (isArrayItem && result.length > 0) {
        result = [
          <div key="dragHandler" className={classes.dragHandlerContainer}>
            <DragHandler
              element={
                <DragIndicator className={classes.dragHandler} />
              }
            />
            {result}
          </div>
        ];
      }
    }
    return result;
  };

  render () {
    const {classes, draggedItem, isDraggingItem, componentsTree} = this.props;
    return (
      <div className={classes.root}>
        <List
          key="pageTree"
          dense={true}
          disablePadding={true}
          className={classes.list}
        >
          <div className={classes.listItemContainer}>
            <div className={classes.firstListContainer}>
              {this.createList(componentsTree, draggedItem, isDraggingItem)}
            </div>
          </div>
        </List>
        <div className={classes.footerArea} />
      </div>
    );
  }
}

export default withStyles(styles)(PageTree);
