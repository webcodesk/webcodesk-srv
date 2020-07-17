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
import startCase from 'lodash/startCase';
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
import globalStore from '../../core/config/globalStore';
import AutoScrollPanel from '../commons/AutoScrollPanel';

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
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  rootWrapper: {
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
      left: '8px',
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
      left: '8px',
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
    left: '-14px',
    color: '#aaaaaa',
    cursor: 'move',
    fontSize: '13px',
    zIndex: 10
  },
  autoScrollButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
  },
});

class PageTree extends React.Component {
  static propTypes = {
    dataId: PropTypes.string,
    componentsTree: PropTypes.object,
    selectedKey: PropTypes.string,
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
    dataId: '',
    componentsTree: null,
    selectedKey: null,
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

  constructor (props, context) {
    super(props, context);
    const { dataId } = this.props;
    this.autoScrollRef = React.createRef();
    this.state = {
      collapsedGroupKeys: this.getStoredCollapsedKeys(dataId),
      scrollCounter: 0,
    };
  }

  componentDidMount () {
    if (this.autoScrollRef.current) {
      this.autoScrollRef.current.scrollToElement(this.props.selectedKey);
    }
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { componentsTree, draggedItem, isDraggingItem } = this.props;
    const { collapsedGroupKeys } = this.state;
    return componentsTree !== nextProps.componentsTree
      || draggedItem !== nextProps.draggedItem
      || isDraggingItem !== nextProps.isDraggingItem
      || collapsedGroupKeys !== nextState.collapsedGroupKeys;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const {componentsTree, selectedKey} = this.props;
    if (componentsTree !== prevProps.componentsTree) {
      this.setState({scrollCounter: this.state.scrollCounter + 1});
      if (this.autoScrollRef.current) {
        this.autoScrollRef.current.scrollToElement(selectedKey);
      }
    }

  }

  getStoredCollapsedKeys = (dataId) => {
    if (dataId) {
      const recordOfCollapsedKeys = globalStore.get(constants.STORAGE_RECORD_COLLAPSED_PAGE_TREE_GROUPS_KEYS) || {};
      return recordOfCollapsedKeys[dataId] || {};
    }
    return {};
  };

  storeCollapsedKeys = (dataId, collapsedKeys) => {
    if (dataId) {
      const recordOfCollapsedKeys = globalStore.get(constants.STORAGE_RECORD_COLLAPSED_PAGE_TREE_GROUPS_KEYS) || {};
      recordOfCollapsedKeys[dataId] = collapsedKeys;
      globalStore.set(constants.STORAGE_RECORD_COLLAPSED_PAGE_TREE_GROUPS_KEYS, recordOfCollapsedKeys, true);
    }
  };

  handleToggleCollapseItem = (groupKey) => {
    const collapsedGroupKeys = {...this.state.collapsedGroupKeys};
    if (collapsedGroupKeys[groupKey]) {
      delete collapsedGroupKeys[groupKey];
    } else {
      collapsedGroupKeys[groupKey] = true;
    }
    this.storeCollapsedKeys(this.props.dataId, collapsedGroupKeys);
    this.setState({
      collapsedGroupKeys,
    });
  };

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
      let listItemLabelName = '';
      if (!isNull(arrayIndex) && arrayIndex >= 0) {
        listItemLabelName = `${arrayIndex} item`;
        isArrayItem = true;
      }
      if (propertyName) {
        if (listItemLabelName) {
          listItemLabelName += `.${startCase(propertyName)}`;
        } else {
          listItemLabelName = startCase(propertyName);
        }
      } else {
        if (!listItemLabelName) {
          listItemLabelName = 'root';
        }
      }
      if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
        let childListItems = [];
        if (children && children.length > 0) {
          for (let i = 0; i < childListItems.length; i++) {
            childListItems = childListItems.concat(
              this.createList(children[i], draggedItem, isDraggingItem, node, level + 1)
            );
          }
          // childListItems = children.reduce(
          //   (acc, child) => acc.concat(
          //     this.createList(child, draggedItem, isDraggingItem, node, level + 1)
          //   ),
          //   childListItems
          // );
        }
        if (childListItems.length > 0) {
          result.push(
            <PageTreeGroup
              key={key}
              name={listItemLabelName}
              node={node}
              parentKey={parent ? parent.key : null}
              arrayIndex={arrayIndex}
              isCollapsed={this.state.collapsedGroupKeys[key]}
              onDeleteComponentProperty={this.handleDeleteComponentProperty}
              onDuplicateComponentProperty={this.handleDuplicateComponentPropertyArrayItem}
              onToggleCollapseItem={this.handleToggleCollapseItem}
            />
          );
          if (!this.state.collapsedGroupKeys[key]) {
            result.push(
              <div key={`${key}_container`} className={classes.listItemContainer}>
                <div className={classes.listContainer}>
                  {childListItems}
                </div>
              </div>
            );
          }
        }
      } else if (type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
        let childLevel = level;
        if (propertyName) {
          // indentation if there is grouping property name
          childLevel += 1;
        }
        let childListItems = [];
        if (children && children.length > 0) {
          for (let i = 0; i < children.length; i++) {
            childListItems = childListItems.concat(
              this.createList(children[i], draggedItem, isDraggingItem, node, childLevel, i)
            );
          }
          // childListItems = children.reduce(
          //   (acc, child, idx) => acc.concat(
          //     this.createList(child, draggedItem, isDraggingItem, node, childLevel, idx)
          //   ),
          //   childListItems
          // );
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
                isCollapsed={this.state.collapsedGroupKeys[key]}
                onIncreaseComponentPropertyArray={this.handleIncreaseComponentPropertyArray}
                onDeleteComponentProperty={this.handleDeleteComponentProperty}
                onDuplicateComponentProperty={this.handleDuplicateComponentPropertyArrayItem}
                onToggleCollapseItem={this.handleToggleCollapseItem}
              />
            );
          }
          if (!this.state.collapsedGroupKeys[key]) {
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
        }
      } else if (
        type === constants.COMPONENT_PROPERTY_ELEMENT_TYPE
        || type === constants.COMPONENT_PROPERTY_NODE_TYPE
      ) {
        const { isSelected } = props;
        // if (isSelected) {
        //   this.selectedKey = key;
        // }
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
          for (let i = 0; i < children.length; i++) {
            childListItems = childListItems.concat(this.createList(children[i], draggedItem, isDraggingItem, node, level + 1));
          }
          // childListItems = children.reduce(
          //   (acc, child) => acc.concat(
          //     this.createList(child, draggedItem, isDraggingItem, node, level + 1)
          //   ),
          //   childListItems
          // );
        }
        // if (isSelected) {
        //   this.selectedKey = key;
        // }
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
        <AutoScrollPanel ref={this.autoScrollRef}>
          <div className={classes.rootWrapper}>
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
        </AutoScrollPanel>
      </div>
    );
  }
}

export default withStyles(styles)(PageTree);
