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

import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import values from 'lodash/values';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import PanoramaFishEye from '@material-ui/icons/PanoramaFishEye';
import * as constants from '../../../commons/constants';
import ResourceIcon from '../commons/ResourceIcon';
import PlaceholderSpan from '../commons/PlaceholderSpan';
import FileCopy from '@material-ui/icons/FileCopy';
import ExposureNeg1 from '@material-ui/icons/ExposureNeg1';
import IconButton from '@material-ui/core/IconButton';

const PageTreeListItem = withStyles(theme => ({
  root: {
    alignItems: 'flex-start',
    position: 'relative',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#eceff1',
    },
    userSelect: 'none',
    borderRadius: '4px',
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
    padding: 0,
    fontSize: '12px',
    border: '1px solid #dddddd',
    backgroundColor: '#f5f5f5',
    marginRight: '5px'
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
    width: '100%'
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: '2px',
    width: '100%'
  },
  itemName: {
    whiteSpace: 'nowrap',
  },
  buttonIcon: {
    fontSize: '12px'
  },
  extraButtonDelete: {
    borderColor: '#ff8a80',
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
      hasChildren,
      isPlaceholder,
      itemKey,
      errors,
      isSelected,
      arrayIndex
    } = this.props;
    if (!isPlaceholder) {
      return (
        <PageTreeListItem
          key={itemKey}
          button={false}
          onClick={!isEmpty(errors) ? this.handleErrorClick : this.handleClick}
          className={isSelected ? classes.selectedItem : ''}
        >
          <div className={classes.itemContentWrapper}>
            <div className={classes.itemContent}>
              <PageTreeListItemIcon>
                {hasChildren
                  ? (
                    <RemoveCircleOutline className={classes.buttonIcon} color="primary"/>
                  )
                  : (
                    <PanoramaFishEye className={classes.buttonIcon} color="primary"/>
                  )
                }

              </PageTreeListItemIcon>
              <PageTreeListItemText
                title={componentName}
                primary={
                  <div
                    className={!errors || isEmpty(errors) ? classes.mutedText : classes.errorText}
                  >
                    {name || 'root'}
                  </div>
                }
              />
              {!isNull(arrayIndex)
                ? (
                  <PageTreeListItemExtraButton
                    title="Duplicate this item in the array"
                    onClick={this.handleDuplicateComponentProperty}
                  >
                    <FileCopy className={classes.buttonIcon}/>
                  </PageTreeListItemExtraButton>
                )
                : null
              }
              {!isNull(arrayIndex)
                ? (
                  <PageTreeListItemExtraButton
                    title="Remove this item from the array"
                    className={classes.extraButtonDelete}
                    onClick={this.handleDeleteComponentProperty}
                  >
                    <ExposureNeg1 className={classes.buttonIcon} color="disabled"/>
                  </PageTreeListItemExtraButton>
                )
                : null
              }
            </div>
            <div className={classes.itemContent}>
              <PageTreeListItemIcon>
                <div className={classes.buttonIcon}>
                  <ResourceIcon resourceType={constants.PAGE_COMPONENT_TYPE}/>
                </div>
              </PageTreeListItemIcon>
              <PageTreeListItemText
                primary={<span>{componentInstance}</span>}
              />
            </div>
          </div>
        </PageTreeListItem>
      );
    }
    return (
      <PageTreeListItem
        key={itemKey}
        onClick={this.handleClick}
        className={isSelected ? classes.selectedItem : ''}
      >
        <div className={classes.itemContentWrapper}>
          <div className={classes.itemContent}>
            <PageTreeListItemIcon>
              <PanoramaFishEye className={classes.buttonIcon} color="primary"/>
            </PageTreeListItemIcon>
            <PageTreeListItemText
              title={componentName}
              primary={<span className={classes.mutedText}>{name || 'root'}</span>}
            />
            {!isNull(arrayIndex)
              ? (
                <PageTreeListItemExtraButton
                  title="Duplicate this item in the array"
                  onClick={this.handleDuplicateComponentProperty}
                >
                  <FileCopy className={classes.buttonIcon}/>
                </PageTreeListItemExtraButton>
              )
              : null
            }
            {!isNull(arrayIndex)
              ? (
                <PageTreeListItemExtraButton
                  title="Remove this item from the array"
                  className={classes.extraButtonDelete}
                  onClick={this.handleDeleteComponentProperty}
                >
                  <ExposureNeg1 className={classes.buttonIcon} color="disabled"/>
                </PageTreeListItemExtraButton>
              )
              : null
            }
          </div>
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
                      &nbsp;
                    </PlaceholderSpan>
                  )
              }
            />
          </div>
        </div>
      </PageTreeListItem>
    );
  }
}

export default withStyles(styles)(PageTreeItem);
