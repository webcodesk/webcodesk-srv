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
import PageTreeGroup from './PageTreeGroup';
import PageTreeItem from './PageTreeItem';
import * as constants from '../../../commons/constants';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: '10px'
  },
  contentPane: {
    position: 'absolute',
    top: '32px',
    bottom: 0,
    right: 0,
    left: 0,
  },
  footerArea: {
    height: '7em',
  },
});

class PageTree extends React.Component {
  static propTypes = {
    componentsTree: PropTypes.object,
    draggedItem: PropTypes.object,
    isDraggingItem: PropTypes.bool,
    onItemClick: PropTypes.func,
    onItemErrorClick: PropTypes.func,
    onItemDrop: PropTypes.func,
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

  createList = (node, draggedItem, isDraggingItem, level = 0, arrayIndex = null) => {
    let result = [];
    if (node) {
      const { key, type, props, children } = node;
      const paddingLeft = `${(level * 16)}px`;
      const { propertyName } = props;
      let listItemLabelName;
      if (!isNull(arrayIndex) && arrayIndex >= 0) {
        listItemLabelName = `[${arrayIndex}]`;
      }
      if (propertyName) {
        if (listItemLabelName) {
          listItemLabelName += `.${propertyName}`;
        } else {
          listItemLabelName = propertyName;
        }
      }
      if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
        let childLevel = level;
        if (propertyName) {
          // indentation if there is grouping property name
          childLevel += 1;
        }
        let childListItems = [];
        if (children && children.length > 0) {
          childListItems = children.reduce(
            (acc, child) => acc.concat(
              this.createList(child, draggedItem, isDraggingItem, childLevel, arrayIndex)
            ),
            childListItems
          );
        }
        if (childListItems.length > 0) {
          if (propertyName) {
            result.push(
              <PageTreeGroup
                key={key}
                paddingLeft={paddingLeft}
                name={listItemLabelName}
              />
            );
          }
          result = result.concat(childListItems);
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
              this.createList(child, draggedItem, isDraggingItem, childLevel, idx)
            ),
            childListItems
          );
        }
        if (childListItems.length > 0) {
          if (propertyName) {
            result.push(
              <PageTreeGroup
                key={key}
                paddingLeft={paddingLeft}
                name={listItemLabelName}
                isArray={true}
              />
            );
          }
          result = result.concat(childListItems);
        }
      } else if (type === constants.COMPONENT_PROPERTY_ELEMENT_TYPE) {
        const { isSelected } = props;
        result.push(
          <PageTreeItem
            key={key}
            itemKey={key}
            isPlaceholder={true}
            name={listItemLabelName}
            isSelected={isSelected}
            paddingLeft={paddingLeft}
            onClick={this.handleItemClick}
            onErrorClick={this.handleItemErrorClick}
            onDrop={this.handleItemDrop}
            draggedItem={draggedItem}
            isDraggingItem={isDraggingItem}
          />
        );
      } else if (type === constants.PAGE_COMPONENT_TYPE) {
        const { errors, componentName, componentInstance, isSelected } = props;
        result.push(
          <PageTreeItem
            key={key}
            itemKey={key}
            isPlaceholder={false}
            name={listItemLabelName}
            errors={errors}
            componentName={componentName}
            componentInstance={componentInstance}
            isSelected={isSelected}
            paddingLeft={paddingLeft}
            onClick={this.handleItemClick}
            onErrorClick={this.handleItemErrorClick}
            onDrop={this.handleItemDrop}
            draggedItem={draggedItem}
            isDraggingItem={isDraggingItem}
          />
        );
        let childListItems = [];
        if (children && children.length > 0) {
          childListItems = children.reduce(
            (acc, child) => acc.concat(
              this.createList(child, draggedItem, isDraggingItem, level + 1)
            ),
            childListItems
          );
        }
        if (childListItems.length > 0) {
          result = result.concat(childListItems);
        }
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
        >
          {this.createList(componentsTree, draggedItem, isDraggingItem)}
        </List>
        <div className={classes.footerArea} />
      </div>
    );
  }
}

export default withStyles(styles)(PageTree);
