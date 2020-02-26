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

import values from 'lodash/values';
import isNull from 'lodash/isNull';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import ExposurePlus1 from '@material-ui/icons/ExposurePlus1';
import FileCopy from '@material-ui/icons/FileCopy';
import Close from '@material-ui/icons/Close';
import PanoramaFishEye from '@material-ui/icons/PanoramaFishEye';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';

const styles = theme => ({
  itemContentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    // width: '100%',
    '&:hover $button': {
      opacity: 1,
    },
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#eceff1',
    },
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: '2px',
    flexWrap: 'nowrap',
  },
  button: {
    opacity: 0,
    marginLeft: '5px',
  },
  buttonIcon: {
    fontSize: '10px',
    display: 'flex'
  },
});

const PageTreeListGroup = withStyles(theme => ({
  root: {
    alignItems: 'flex-start',
    position: 'relative',
    cursor: 'default',
    userSelect: 'none',
  },
  dense: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
}))(ListItem);

const PageTreeListGroupText = withStyles({
  root: {
    padding: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
  },
  primary: {
    color: '#607d8b',
  }
})(ListItemText);

const PageTreeListGroupIcon = withStyles({
  root: {
    marginRight: 0,
    padding: '3px',
  }
})(ListItemIcon);

export const PageTreeListGroupExtraButton = withStyles({
  root: {
    padding: '2px',
    fontSize: '12px',
    border: '1px solid #dddddd',
    backgroundColor: '#f5f5f5',
  }
})(IconButton);

class PageTreeGroup extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    parentKey: PropTypes.string,
    node: PropTypes.object,
    arrayIndex: PropTypes.number,
    isArray: PropTypes.bool,
    isCollapsed: PropTypes.bool,
    onClick: PropTypes.func,
    onErrorClick: PropTypes.func,
    onIncreaseComponentPropertyArray: PropTypes.func,
    onDeleteComponentProperty: PropTypes.func,
    onDuplicateComponentProperty: PropTypes.func,
    onToggleCollapseItem: PropTypes.func,
  };

  static defaultProps = {
    name: '',
    node: null,
    isArray: false,
    isCollapsed: false,
    onClick: () => {
      console.info('PageTreeGroup.onClick is not set');
    },
    onErrorClick: () => {
      console.info('PageTreeGroup.onErrorClick is not set');
    },
    onIncreaseComponentPropertyArray: () => {
      console.info('PageTreeGroup.onIncreaseComponentPropertyArray is not set');
    },
    onDeleteComponentProperty: () => {
      console.info('PageTreeGroup.onDeleteComponentProperty is not set');
    },
    onDuplicateComponentProperty: () => {
      console.info('PageTreeGroup.onDuplicateComponentProperty is not set');
    },
    onToggleCollapseItem: () => {
      console.info('PageTreeGroup.onToggleCollapseItem is not set');
    },
  };

  handleClick = () => {
    const { node: { key } } = this.props;
    this.props.onToggleCollapseItem(key);
  };

  handleErrorClick = () => {
    const { node: { key, props }, onErrorClick, onClick } = this.props;
    if (props && props.errors) {
      onErrorClick(values(props.errors).map(error => ({ message: error })));
    }
    onClick(key);
  };

  handleIncreaseComponentPropertyArray = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { onIncreaseComponentPropertyArray, node } = this.props;
    if (node) {
      onIncreaseComponentPropertyArray(node.key);
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
    if (!this.props.name || !this.props.node) {
      return null;
    }
    const { name, classes, isArray, arrayIndex, isCollapsed } = this.props;
    let expandIcon;
    if (isCollapsed) {
      expandIcon = (<AddCircleOutline className={classes.buttonIcon} color="disabled" />);
    } else {
      expandIcon = (<RemoveCircleOutline className={classes.buttonIcon} color="disabled" />);
    }
    return (
      <PageTreeListGroup>
        <PageTreeListGroupIcon>
          {expandIcon}
        </PageTreeListGroupIcon>
        <div className={classes.itemContentWrapper}>
          <div className={classes.itemContent}>
            <PageTreeListGroupText
              title={name}
              onClick={this.handleClick}
              primary={
                <span style={{ whiteSpace: 'nowrap' }}>
                  <span>{name}:</span>
                </span>
              }
            />
            {isArray && (
              <PageTreeListGroupExtraButton
                title="Add new item to the array"
                onClick={this.handleIncreaseComponentPropertyArray}
                className={classes.button}
              >
                <ExposurePlus1 className={classes.buttonIcon}/>
              </PageTreeListGroupExtraButton>
            )}
            {!isNull(arrayIndex)
              ? (
                <PageTreeListGroupExtraButton
                  title="Duplicate this item in the array"
                  onClick={this.handleDuplicateComponentProperty}
                  className={classes.button}
                >
                  <FileCopy className={classes.buttonIcon}/>
                </PageTreeListGroupExtraButton>
              )
              : null
            }
            {!isNull(arrayIndex)
              ? (
                <PageTreeListGroupExtraButton
                  title="Remove this item from the array"
                  onClick={this.handleDeleteComponentProperty}
                  className={classes.button}
                >
                  <Close className={classes.buttonIcon}/>
                </PageTreeListGroupExtraButton>
              )
              : null
            }
          </div>
        </div>
      </PageTreeListGroup>
    );
  }
}

export default withStyles(styles)(PageTreeGroup);
