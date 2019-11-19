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
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import PanoramaFishEye from '@material-ui/icons/PanoramaFishEye';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ExposurePlus1 from '@material-ui/icons/ExposurePlus1';
import ExposureNeg1 from '@material-ui/icons/ExposureNeg1';
import Delete from '@material-ui/icons/Delete';

import * as constants from '../../../commons/constants';
import { ResourceListItem } from '../panels/ResourcesTreeView.parts';

const styles = theme => ({
  listItemPrefixSector: {
    display: 'flex',
    alignItems: 'center',
    width: '18px',
  },
  buttonIcon: {
    fontSize: '12px'
  },
  mutedText: {
    color: theme.palette.text.disabled,
  },
  title: {
    flexGrow: 2,
  },
  titleText: {
    fontWeight: 700,
  },
  errorText: {
    color: '#D50000',
  },
  extraButtonIncrease: {
    borderColor: '#81c784',
  },
  extraButtonDelete: {
    borderColor: '#ff8a80',
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
    cursor: 'default',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    userSelect: 'none',
  },
  dense: {
    margin: '5px 0',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  }
}))(ListItem);

const PropsTreeGroupText = withStyles(theme => ({
  root: {
    padding: 0,
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
  }
})(IconButton);

export const PropsListItemExtraButton = withStyles({
  root: {
    padding: 0,
    fontSize: '12px',
    border: '1px solid #dddddd',
    backgroundColor: '#f5f5f5',
    marginLeft: '5px'
  }
})(IconButton);

class PropsTreeGroup extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    propertyModel: PropTypes.object,
    paddingLeft: PropTypes.string,
    isExpanded: PropTypes.bool,
    onIncreaseComponentPropertyArray: PropTypes.func,
    onDeleteComponentProperty: PropTypes.func,
    onToggleExpandItem: PropTypes.func,
    onErrorClick: PropTypes.func,
  };

  static defaultProps = {
    name: null,
    propertyModel: {},
    paddingLeft: '0px',
    isExpanded: false,
    onIncreaseComponentPropertyArray: () => {
      console.info('ComponentPropsTreeGroup.onIncreaseComponentPropertyArray is not set');
    },
    onDeleteComponentProperty: () => {
      console.info('ComponentPropsTreeGroup.onDeleteComponentProperty is not set');
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
    const { onIncreaseComponentPropertyArray, propertyModel } = this.props;
    if (propertyModel) {
      onIncreaseComponentPropertyArray(propertyModel.key);
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

  handleToggleExpandItem = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { onToggleExpandItem, propertyModel } = this.props;
    if (propertyModel) {
      onToggleExpandItem(propertyModel.key);
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
      expandIcon = (<PanoramaFishEye className={classes.buttonIcon} color="disabled"/>);
    } else {
      if (isExpanded) {
        expandIcon = (<RemoveCircleOutline className={classes.buttonIcon} color="disabled"/>);
      } else {
        expandIcon = (<AddCircleOutline className={classes.buttonIcon} color="disabled"/>);
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
                <span className={isError ? classes.errorText : classes.titleText}>
                  {name}
                </span>
                </div>
              </Tooltip>
              {type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE && (
                <PropsListItemExtraButton
                  title="Add new item to the array"
                  className={classes.extraButtonIncrease}
                  onClick={this.handleIncreaseComponentPropertyArray}
                >
                  <ExposurePlus1 className={classes.buttonIcon} color="disabled"/>
                </PropsListItemExtraButton>
              )}
              {!propertyName && (
                <PropsListItemExtraButton
                  title="Remove this item from the array"
                  className={classes.extraButtonDelete}
                  onClick={this.handleDeleteComponentProperty}
                >
                  <ExposureNeg1 className={classes.buttonIcon} color="disabled"/>
                </PropsListItemExtraButton>
              )}
              {isError && (
                <PropsListItemExtraButton
                  title="Remove the property"
                  className={classes.errorText}
                  onClick={this.handleDeleteComponentProperty}
                >
                  <Delete className={classes.buttonIcon} color="disabled"/>
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
