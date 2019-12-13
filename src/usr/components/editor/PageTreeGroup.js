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
  },
  primary: {
    color: '#90a4ae',
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
    onClick: PropTypes.func,
    onErrorClick: PropTypes.func,
    onIncreaseComponentPropertyArray: PropTypes.func,
    onDeleteComponentProperty: PropTypes.func,
    onDuplicateComponentProperty: PropTypes.func,
  };

  static defaultProps = {
    name: '',
    node: null,
    isArray: false,
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
  };

  handleClick = () => {
    const { node: { key } } = this.props;
    this.props.onClick(key);
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
    const { name, classes, isArray, arrayIndex } = this.props;
    return (
      <PageTreeListGroup>
        <PageTreeListGroupIcon>
          <RemoveCircleOutline className={classes.buttonIcon} color="disabled"/>
        </PageTreeListGroupIcon>
        <div className={classes.itemContentWrapper}>
          <div className={classes.itemContent}>
            <PageTreeListGroupText
              title={name}
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
