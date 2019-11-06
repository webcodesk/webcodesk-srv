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

const styles = theme => ({
  mutedText: {
    color: theme.palette.text.disabled,
  },
  errorText: {
    color: '#D50000',
  }
});

const PageTreeListItem = withStyles(theme => ({
  root: {
    alignItems: 'flex-start',
    position: 'relative',
    cursor: 'default',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    userSelect: 'none',
  },
  dense: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  }
}))(ListItem);

const PageTreeListItemText = withStyles({
  root: {
    padding: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
})(ListItemText);

const PageTreeListItemIcon = withStyles({
  root: {
    marginRight: 0,
    padding: '3px',
  }
})(ListItemIcon);

class PageTreeItem extends React.Component {
  static propTypes = {
    itemKey: PropTypes.string,
    isSelected: PropTypes.bool,
    isPlaceholder: PropTypes.bool,
    componentName: PropTypes.string,
    componentInstance: PropTypes.string,
    name: PropTypes.string,
    errors: PropTypes.object,
    paddingLeft: PropTypes.string,
    draggedItem: PropTypes.object,
    isDraggingItem: PropTypes.bool,
    onClick: PropTypes.func,
    onErrorClick: PropTypes.func,
    onDrop: PropTypes.func,
  };

  static defaultProps = {
    itemKey: null,
    isSelected: false,
    isPlaceholder: false,
    componentName: null,
    componentInstance: null,
    name: null,
    errors: null,
    paddingLeft: '0px',
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
  };

  handleClick = () => {
    const { itemKey } = this.props;
    this.props.onClick(itemKey);
  };

  handleErrorClick = () => {
    const { itemKey, errors, onErrorClick, onClick } = this.props;
    if (errors) {
      onErrorClick(values(errors).map(error => ({message: error})));
    }
    onClick(itemKey);
  };

  handleItemDrop = (droppedItem) => {
    const {itemKey, onDrop} = this.props;
    if (droppedItem && itemKey) {
      onDrop({
        destination: {
          key: itemKey,
        },
        source: droppedItem,
      });
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
      paddingLeft
    } = this.props;
    if (!isPlaceholder) {
      return (
        <PageTreeListItem
          key={itemKey}
          style={{paddingLeft}}
          button={false}
          onClick={!isEmpty(errors) ? this.handleErrorClick : this.handleClick}
          selected={isSelected}
        >
          <PageTreeListItemIcon>
            <ResourceIcon resourceType={constants.PAGE_COMPONENT_TYPE} />
          </PageTreeListItemIcon>
          <PageTreeListItemText
            title={componentName}
            primary={
              !errors || isEmpty(errors)
                ? (
                  <span style={{whiteSpace: 'nowrap'}}>
                    <span className={classes.mutedText}>{name || 'root'}:&nbsp;</span>
                    <span>{componentInstance}</span>
                  </span>
                )
                  : (
                  <span className={classes.errorText} style={{whiteSpace: 'nowrap'}}>
                    <span>{name || 'root'}:&nbsp;</span>
                    <span>{componentInstance}</span>
                  </span>
                )
            }
          />
        </PageTreeListItem>
      );
    }
    return (
      <PageTreeListItem
        key={itemKey}
        style={{paddingLeft}}
        selected={isSelected}
        onClick={this.handleClick}
      >
        <PageTreeListItemIcon>
          <ResourceIcon resourceType={constants.COMPONENT_PROPERTY_ELEMENT_TYPE} />
        </PageTreeListItemIcon>
        <PageTreeListItemText
          title={componentName}
          primary={
            componentInstance
              ? (
                <span style={{ whiteSpace: 'nowrap' }}>
                  <span className={classes.mutedText}>{name || 'root'}:&nbsp;</span>
                  <span>{componentInstance}</span>
                </span>
              )
              : (
                <span style={{ display: 'flex', whiteSpace: 'nowrap' }}>
                  <span className={classes.mutedText}>{name || 'root'}:&nbsp;</span>
                  <PlaceholderSpan
                    isDraggingItem={isDraggingItem}
                    draggedItem={draggedItem}
                    onDrop={this.handleItemDrop}
                  >
                    &nbsp;
                  </PlaceholderSpan>
                </span>
              )

          }
        />
      </PageTreeListItem>
    );
  }
}

export default withStyles(styles)(PageTreeItem);
