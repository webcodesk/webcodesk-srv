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
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import PanoramaFishEye from '@material-ui/icons/PanoramaFishEye';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ExposurePlus1 from '@material-ui/icons/ExposurePlus1';
import Close from '@material-ui/icons/Close';
import FileCopy from '@material-ui/icons/FileCopy';
import Delete from '@material-ui/icons/Delete';
import * as constants from '../../../commons/constants';

const styles = theme => ({
  listItemPrefixSector: {
    display: 'flex',
    alignItems: 'center',
    width: '18px',
  },
  buttonIcon: {
    fontSize: '10px'
  },
  mutedText: {
    color: theme.palette.text.disabled,
  },
  title: {
    flexGrow: 0,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  },
  titleText: {
    fontWeight: 400,
    // fontSize: '14px',
    whiteSpace: 'nowrap',
    color: '#455a64',
  },
  errorText: {
    color: '#D50000',
  },
  extraButtonIncrease: {
    borderColor: '#81c784',
  },
  extraButtonDelete: {
    borderColor: '#dddddd',
  },
  htmlPopper: {
    opacity: 1,
  },
  htmlTooltip: {
    backgroundColor: '#fff9c4',
    border: '1px solid #dddddd',
  },
});

const PropsTreeGroupListItem = withStyles(theme => ({
  root: {
    alignItems: 'center',
    position: 'relative',
    cursor: 'pointer',
    borderRadius: '4px',
    backgroundColor: '#eceff1',
    '&:hover': {
      backgroundColor: '#cfd8dc',
    },
    userSelect: 'none',
  },
  dense: {
    margin: '5px 0',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    position: 'sticky',
    top: 0,
  }
}))(ListItem);

const PropsTreeGroupText = withStyles(theme => ({
  root: {
    padding: '0 2px 0 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
  }
}))(ListItemText);

export const PropsListItemButton = withStyles({
  root: {
    padding: '3px',
    fontSize: '12px',
    color: '#aaaaaa',
  }
})(IconButton);

export const PropsListItemExtraButton = withStyles({
  root: {
    padding: '2px',
    fontSize: '12px',
    border: '1px solid #dddddd',
    backgroundColor: '#f5f5f5',
    marginLeft: '5px'
  }
})(IconButton);

class PropsTreeGroup extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    parentKey: PropTypes.string,
    arrayIndex: PropTypes.number,
    propertyModel: PropTypes.object,
    paddingLeft: PropTypes.string,
    isExpanded: PropTypes.bool,
    onIncreaseComponentPropertyArray: PropTypes.func,
    onDeleteComponentProperty: PropTypes.func,
    onDuplicateComponentProperty: PropTypes.func,
    onToggleExpandItem: PropTypes.func,
    onErrorClick: PropTypes.func,
  };

  static defaultProps = {
    name: null,
    parentKey: null,
    arrayIndex: null,
    propertyModel: {},
    paddingLeft: '0px',
    isExpanded: false,
    onIncreaseComponentPropertyArray: () => {
      console.info('ComponentPropsTreeGroup.onIncreaseComponentPropertyArray is not set');
    },
    onDeleteComponentProperty: () => {
      console.info('ComponentPropsTreeGroup.onDeleteComponentProperty is not set');
    },
    onDuplicateComponentProperty: () => {
      console.info('ComponentPropsTreeGroup.onDuplicateComponentProperty is not set');
    },
    onToggleExpandItem: () => {
      console.info('ComponentPropsTreeGroup.onToggleExpandItem is not set');
    },
    onErrorClick: () => {
      console.info('ComponentPropsTreeGroup.onErrorClick is not set');
    },
  };

  handleErrorClick = () => {
    const { propertyModel, onErrorClick } = this.props;
    if (propertyModel && propertyModel.props && propertyModel.props.errors) {
      onErrorClick(values(propertyModel.props.errors).map(error => ({ message: error })));
    }
  };

  handleClick = () => {

  };

  handleIncreaseComponentPropertyArray = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { onIncreaseComponentPropertyArray, propertyModel, parentKey } = this.props;
    if (propertyModel) {
      onIncreaseComponentPropertyArray(propertyModel.key, parentKey);
    }
  };

  handleDeleteComponentProperty = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { onDeleteComponentProperty, propertyModel } = this.props;
    if (propertyModel) {
      onDeleteComponentProperty(propertyModel.key);
    }
  };

  handleDuplicateComponentProperty = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { parentKey, arrayIndex, propertyModel, onDuplicateComponentProperty } = this.props;
    if (!isNull(arrayIndex) && arrayIndex >= 0 && parentKey && propertyModel) {
      onDuplicateComponentProperty(propertyModel.key, parentKey, arrayIndex);
    }
  };

  handleToggleExpandItem = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { onToggleExpandItem, propertyModel, parentKey } = this.props;
    if (propertyModel) {
      onToggleExpandItem(propertyModel.key, parentKey);
    }
  };

  render () {
    const {
      classes,
      paddingLeft,
      name,
      propertyModel,
      isExpanded
    } = this.props;
    const { type, props, children } = propertyModel;
    if (!props) {
      return (
        <PropsTreeGroupText
          primary={
            <span className={classes.errorText}>unknown property</span>
          }
        />
      );
    }
    const { propertyName, propertyComment, errors } = props;
    const isError = errors && !isEmpty(errors);
    const hasChildren = children && children.length > 0;
    let expandIcon;
    if (!hasChildren) {
      expandIcon = (<PanoramaFishEye className={classes.buttonIcon} color="primary"/>);
    } else {
      if (isExpanded) {
        expandIcon = (<RemoveCircleOutline className={classes.buttonIcon} color="primary"/>);
      } else {
        expandIcon = (<AddCircleOutline className={classes.buttonIcon} color="primary"/>);
      }
    }
    return (
      <PropsTreeGroupListItem
        component="div"
        disableGutters={true}
        style={{ paddingLeft }}
        button={false}
        onClick={isError ? this.handleErrorClick : this.handleToggleExpandItem}
      >
        <div className={classes.listItemPrefixSector}>
          <PropsListItemButton onClick={this.handleToggleExpandItem}>
            {expandIcon}
          </PropsListItemButton>
        </div>
        <PropsTreeGroupText
          title={name}
          disableTypography={true}
          primary={
            <React.Fragment>
              <Tooltip
                enterDelay={500}
                classes={{
                  popper: classes.htmlPopper,
                  tooltip: classes.htmlTooltip,
                }}
                title=
                  {propertyComment
                    ? (
                      <Typography>{propertyComment}</Typography>
                    )
                    : (
                      <React.Fragment>
                        <Typography variant="caption">There is no comment for this property.</Typography>
                      </React.Fragment>
                    )
                  }
              >
                <div className={classes.title}>
                  <div>
                    <span className={isError ? classes.errorText : classes.titleText}>
                      {name}
                    </span>
                  </div>
                </div>
              </Tooltip>
              {!propertyName && (
                <PropsListItemExtraButton
                  title="Duplicate this item in the array"
                  onClick={this.handleDuplicateComponentProperty}
                >
                  <FileCopy className={classes.buttonIcon} />
                </PropsListItemExtraButton>
              )}
              {type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE && (
                <PropsListItemExtraButton
                  title="Add new item to the array"
                  onClick={this.handleIncreaseComponentPropertyArray}
                >
                  <ExposurePlus1 className={classes.buttonIcon} />
                </PropsListItemExtraButton>
              )}
              {!propertyName && (
                <PropsListItemExtraButton
                  title="Remove this item from the array"
                  onClick={this.handleDeleteComponentProperty}
                >
                  <Close className={classes.buttonIcon} />
                </PropsListItemExtraButton>
              )}
              {isError && (
                <PropsListItemExtraButton
                  title="Remove the property"
                  className={classes.errorText}
                  onClick={this.handleDeleteComponentProperty}
                >
                  <Delete className={classes.buttonIcon} />
                </PropsListItemExtraButton>
              )}
            </React.Fragment>
          }
        />
      </PropsTreeGroupListItem>
    );
  }
}

export default withStyles(styles)(PropsTreeGroup);
