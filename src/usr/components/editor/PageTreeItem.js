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

import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import values from 'lodash/values';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import * as constants from '../../../commons/constants';
import ResourceIcon from '../commons/ResourceIcon';
import PlaceholderSpan from '../commons/PlaceholderSpan';
import FileCopy from '@material-ui/icons/FileCopy';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const PageTreeListItem = withStyles(theme => ({
  root: {
    alignItems: 'flex-start',
    position: 'relative',
    cursor: 'pointer',
    userSelect: 'none',
  },
  dense: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
}))(ListItem);

const PageTreeListItemText = withStyles({
  root: {
    padding: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  primary: {
    width: '100%'
  }
})(ListItemText);

const PageTreeListItemIcon = withStyles({
  root: {
    marginRight: 0,
    padding: '3px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
})(ListItemIcon);

export const PageTreeListItemExtraButton = withStyles({
  root: {
    padding: '2px',
    fontSize: '12px',
    border: '1px solid #dddddd',
    backgroundColor: '#f5f5f5',
  }
})(IconButton);

const styles = theme => ({
  mutedText: {
    color: theme.palette.text.disabled,
  },
  errorText: {
    color: '#D50000',
  },
  selectedItem: {
    backgroundColor: '#eceff1',
    border: '1px solid #2979FF',
    borderRadius: '4px'
  },
  itemContentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    // width: '100%',
    '&:hover $button': {
      opacity: 1,
    },
    '&:hover': {
      backgroundColor: '#eceff1',
    },
    borderRadius: '4px',
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: '2px',
    // width: '100%'
  },
  itemName: {
    whiteSpace: 'nowrap',
  },
  button: {
    opacity: 0,
    marginLeft: '5px',
  },
  buttonVisible: {
    marginLeft: '5px',
  },
  buttonIcon: {
    fontSize: '10px',
    display: 'flex',
  },
});

class PageTreeItem extends React.Component {
  static propTypes = {
    itemKey: PropTypes.string,
    parentKey: PropTypes.string,
    isSelected: PropTypes.bool,
    isPlaceholder: PropTypes.bool,
    componentName: PropTypes.string,
    componentInstance: PropTypes.string,
    name: PropTypes.string,
    node: PropTypes.object,
    arrayIndex: PropTypes.number,
    hasChildren: PropTypes.bool,
    errors: PropTypes.object,
    draggedItem: PropTypes.object,
    isDraggingItem: PropTypes.bool,
    onClick: PropTypes.func,
    onErrorClick: PropTypes.func,
    onDrop: PropTypes.func,
    onDeleteComponentProperty: PropTypes.func,
    onDuplicateComponentProperty: PropTypes.func,
  };

  static defaultProps = {
    itemKey: null,
    parentKey: null,
    isSelected: false,
    isPlaceholder: false,
    componentName: null,
    componentInstance: null,
    name: null,
    node: null,
    arrayIndex: null,
    errors: null,
    hasChildren: false,
    draggedItem: null,
    isDraggingItem: false,
    onClick: () => {
      console.info('PageTreeItem.onClick is not set');
    },
    onErrorClick: () => {
      console.info('PageTreeItem.onErrorClick is not set');
    },
    onDrop: () => {
      console.info('PageTreeItem.onDrop is not set');
    },
    onDeleteComponentProperty: () => {
      console.info('PageTreeItem.onDeleteComponentProperty is not set');
    },
    onDuplicateComponentProperty: () => {
      console.info('PageTreeItem.onDuplicateComponentProperty is not set');
    },
  };

  handleClick = () => {
    const { itemKey } = this.props;
    this.props.onClick(itemKey);
  };

  handleErrorClick = () => {
    const { itemKey, errors, onErrorClick, onClick } = this.props;
    if (errors) {
      onErrorClick(values(errors).map(error => ({ message: error })));
    }
    onClick(itemKey);
  };

  handleItemDrop = (droppedItem) => {
    const { itemKey, onDrop } = this.props;
    if (droppedItem && itemKey) {
      onDrop({
        destination: {
          key: itemKey,
        },
        source: droppedItem,
      });
    }
  };

  handleDeleteComponentProperty = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { onDeleteComponentProperty, node } = this.props;
    if (node) {
      onDeleteComponentProperty(node.key);
    }
  };

  handleDuplicateComponentProperty = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { parentKey, arrayIndex, node, onDuplicateComponentProperty } = this.props;
    if (!isNull(arrayIndex) && arrayIndex >= 0 && parentKey && node) {
      onDuplicateComponentProperty(node.key, parentKey, arrayIndex);
    }
  };

  render () {
    if (!this.props.itemKey) {
      return null;
    }
    const {
      draggedItem,
      isDraggingItem,
      classes,
      componentName,
      componentInstance,
      name,
      isPlaceholder,
      itemKey,
      errors,
      isSelected,
      arrayIndex
    } = this.props;
    if (!isPlaceholder) {
      return (
        <PageTreeListItem
          id={itemKey}
          key={itemKey}
          button={false}
        >
          <div
            className={`${classes.itemContentWrapper} ${isSelected ? classes.selectedItem : ''}`}
            onClick={!isEmpty(errors) ? this.handleErrorClick : this.handleClick}
          >
            <div className={classes.itemContent}>
              <PageTreeListItemIcon>
                <div className={classes.buttonIcon}>
                  <ResourceIcon resourceType={constants.PAGE_COMPONENT_TYPE}/>
                </div>
              </PageTreeListItemIcon>
              <PageTreeListItemText
                title={componentName}
                primary={
                  <div
                    className={!errors || isEmpty(errors) ? '' : classes.errorText}
                  >
                    {componentInstance || 'root'}
                  </div>
                }
              />
              {!isNull(arrayIndex)
                ? (
                  <PageTreeListItemExtraButton
                    title="Duplicate this item in the array"
                    onClick={this.handleDuplicateComponentProperty}
                    className={isSelected ? classes.buttonVisible : classes.button}
                  >
                    <FileCopy className={classes.buttonIcon} />
                  </PageTreeListItemExtraButton>
                )
                : null
              }
              {!isNull(arrayIndex)
                ? (
                  <PageTreeListItemExtraButton
                    title="Remove this item from the array"
                    onClick={this.handleDeleteComponentProperty}
                    className={isSelected ? classes.buttonVisible : classes.button}
                  >
                    <Close className={classes.buttonIcon} />
                  </PageTreeListItemExtraButton>
                )
                : null
              }
            </div>
          </div>
        </PageTreeListItem>
      );
    }
    return (
      <PageTreeListItem
        id={itemKey}
        key={itemKey}
        onClick={this.handleClick}
      >
        <div className={`${classes.itemContentWrapper} ${isSelected ? classes.selectedItem : ''}`}>
          <div className={classes.itemContent}>
            <PageTreeListItemIcon>
              <div className={classes.buttonIcon}>
                <ResourceIcon resourceType={constants.COMPONENT_PROPERTY_ELEMENT_TYPE}/>
              </div>
            </PageTreeListItemIcon>
            <PageTreeListItemText
              title={componentName}
              primary={
                componentInstance
                  ? (
                    <span>{componentInstance}</span>
                  )
                  : (
                    <PlaceholderSpan
                      isDraggingItem={isDraggingItem}
                      draggedItem={draggedItem}
                      onDrop={this.handleItemDrop}
                    >
                      <span className={classes.mutedText}>&nbsp;&nbsp;&nbsp;&nbsp;{name}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </PlaceholderSpan>
                  )
              }
            />
            {!isNull(arrayIndex)
              ? (
                <PageTreeListItemExtraButton
                  title="Duplicate this item in the array"
                  onClick={this.handleDuplicateComponentProperty}
                  className={isSelected ? classes.buttonVisible : classes.button}
                >
                  <FileCopy className={classes.buttonIcon} />
                </PageTreeListItemExtraButton>
              )
              : null
            }
            {!isNull(arrayIndex)
              ? (
                <PageTreeListItemExtraButton
                  title="Remove this item from the array"
                  onClick={this.handleDeleteComponentProperty}
                  className={isSelected ? classes.buttonVisible : classes.button}
                >
                  <Close className={classes.buttonIcon} />
                </PageTreeListItemExtraButton>
              )
              : null
            }
          </div>
        </div>
      </PageTreeListItem>
    );
  }
}

export default withStyles(styles)(PageTreeItem);
