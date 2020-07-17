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
import isEqual from 'lodash/isEqual';
import isNull from 'lodash/isNull';
import values from 'lodash/values';
import cloneDeep from '../../core/utils/cloneDeep';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import TextFields from '@material-ui/icons/TextFields';
import Image from '@material-ui/icons/Image';
import Wallpaper from '@material-ui/icons/Wallpaper';
import Delete from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';
import FileCopy from '@material-ui/icons/FileCopy';

import * as constants from '../../../commons/constants';

import PropertyNumericField from '../commons/PropertyNumericField';
import PropertyTextField from '../commons/PropertyTextField';
import PropertySelect from '../commons/PropertySelect';
import PropertyCheckbox from '../commons/PropertyCheckbox';
import MarkdownView from "../commons/MarkdownView";

const styles = theme => ({
  listItemPrefixSector: {
    display: 'flex',
    alignItems: 'center',
    width: '2px',
  },
  listItemContent: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    paddingRight: '2px'
  },
  buttonIcon: {
    fontSize: '10px'
  },
  listItemEditorIcon: {
    fontSize: '12px'
  },
  title: {
    flexGrow: 0,
  },
  titleContainer: {
    width: '100%',
  },
  titleText: {
    fontWeight: 400,
    color: '#607d8b',
    '&:hover': {
      color: theme.palette.primary.main,
      cursor: 'help'
    }
  },
  mutedText: {
    color: theme.palette.text.disabled,
  },
  errorText: {
    color: '#D50000',
    whiteSpace: 'nowrap'
  },
  editorWrapper: {
    width: '100%',
    border: '1px solid #dcdcdc',
    borderRadius: '4px',
    marginTop: '5px'
  },
  selectWrapper: {
    width: '100%',
    marginTop: '5px'
  },
  propertyEditorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%'
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
    maxWidth: '100%',
    width: '500px'
  },
});

const PropsTreeListItem = withStyles(theme => ({
  root: {
    alignItems: 'flex-start',
    position: 'relative',
    cursor: 'default',
    // '&:hover': {
    //   backgroundColor: theme.palette.action.hover,
    // },
    userSelect: 'none',
  },
  dense: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    margin: '5px 0',
  }
}))(ListItem);

const PropsTreeListItemText = withStyles({
  root: {
    padding: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
  }
})(ListItemText);

export const PropsTreeItemExtraButton = withStyles({
  root: {
    padding: '2px',
    fontSize: '12px',
    border: '1px solid #dddddd',
    backgroundColor: '#f5f5f5',
    marginLeft: '5px'
  }
})(IconButton);

const PropsTreeListItemIcon = withStyles({
  root: {
    marginRight: 0,
    padding: '2px 3px 2px 0',
  }
})(ListItemIcon);

export const PropsTreeItemButton = withStyles(theme => ({
  sizeSmall: {
    padding: '2px 8px',
    borderRadius: '16px',
    textTransform: 'none',
    fontWeight: 'normal',
    minHeight: '24px',
    whiteSpace: 'nowrap',
    backgroundColor: '#f5f5f5'
  }
}))(Button);

class PropsTreeItem extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    parentKey: PropTypes.string,
    arrayIndex: PropTypes.number,
    propertyModel: PropTypes.object,
    paddingLeft: PropTypes.string,
    onPropertyUpdate: PropTypes.func,
    onDeleteComponentProperty: PropTypes.func,
    onDuplicateComponentProperty: PropTypes.func,
    onErrorClick: PropTypes.func,
    onEditJson: PropTypes.func,
    onSelectComponent: PropTypes.func,
  };

  static defaultProps = {
    name: null,
    parentKey: null,
    arrayIndex: null,
    propertyModel: {},
    paddingLeft: '0px',
    onPropertyUpdate: () => {
      console.info('ComponentPropsTreeItem.onPropertyUpdate is not set');
    },
    onDeleteComponentProperty: () => {
      console.info('ComponentPropsTreeItem.onDeleteComponentProperty is not set');
    },
    onDuplicateComponentProperty: () => {
      console.info('ComponentPropsTreeItem.onDuplicateComponentProperty is not set');
    },
    onErrorClick: () => {
      console.info('ComponentPropsTreeItem.onErrorClick is not set');
    },
    onEditJson: () => {
      console.info('ComponentPropsTreeItem.onEditJson is not set');
    },
    onSelectComponent: () => {
      console.info('ComponentPropsTreeItem.onSelectComponent is not set');
    },
  };

  constructor (props, context) {
    super(props, context);
    const { propertyModel } = this.props;
    this.state = {
      localPropertyModel: propertyModel ? cloneDeep(propertyModel) : {},
    };
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { name, propertyModel, paddingLeft, parentKey, arrayIndex } = this.props;
    const { localPropertyModel } = this.state;
    return name !== nextProps.name
      || (
        nextProps.propertyModel
        && propertyModel !== nextProps.propertyModel
        && !isEqual(nextProps.propertyModel, localPropertyModel)
      )
      || paddingLeft !== nextProps.paddingLeft
      || parentKey !== nextProps.parentKey
      || arrayIndex !== nextProps.arrayIndex
      || localPropertyModel !== nextState.localPropertyModel;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { propertyModel } = this.props;
    if (propertyModel && propertyModel !== prevProps.propertyModel) {
      this.setState({
        localPropertyModel: cloneDeep(propertyModel),
      });
    }
  }

  handlePropertyValueChange = (value) => {
    const newPropertyModel = { ...this.state.localPropertyModel };
    newPropertyModel.props = newPropertyModel.props || {};
    newPropertyModel.props.propertyValue = value;
    this.setState({ localPropertyModel: newPropertyModel });
    const { onPropertyUpdate } = this.props;
    onPropertyUpdate(newPropertyModel);
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

  handleEditJson = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { onEditJson } = this.props;
    const { localPropertyModel } = this.state;
    if (localPropertyModel) {
      onEditJson(localPropertyModel);
    }
  };

  handleErrorClick = () => {
    const { propertyModel, onErrorClick } = this.props;
    if (propertyModel && propertyModel.props && propertyModel.props.errors) {
      onErrorClick(values(propertyModel.props.errors).map(error => ({ message: error })));
    }
  };

  handleClick = () => {

  };

  handleSelectComponent = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { localPropertyModel } = this.state;
    if (localPropertyModel) {
      this.props.onSelectComponent(localPropertyModel.key);
    }
  };

  render () {
    const {
      classes,
      paddingLeft,
      name,
    } = this.props;
    const { localPropertyModel } = this.state;
    let editorElement;
    let editorElementIcon;
    const { type, props } = localPropertyModel;
    if (!props) {
      return (
        <PropsTreeListItemText
          primary={
            <span className={classes.errorText}>unknown property</span>
          }
        />
      );
    }
    const {
      propertyName,
      propertyComment,
      propertyValue,
      componentName,
      componentInstance,
      errors,
      propertyValueVariants,
    } = props;
    switch (type) {
      case constants.COMPONENT_PROPERTY_ELEMENT_TYPE:
      case constants.COMPONENT_PROPERTY_NODE_TYPE:
        editorElementIcon = (
          <Wallpaper
            color="disabled"
            className={classes.listItemEditorIcon}
          />
        );
        editorElement = (
          <PropsTreeItemButton
            color="default"
            size="small"
            disabled={true}
            fullWidth={true}
          >
            Empty element
          </PropsTreeItemButton>
        );
        break;
      case constants.PAGE_COMPONENT_TYPE:
      case constants.PAGE_NODE_TYPE:
        editorElementIcon = (
          <Image
            className={classes.listItemEditorIcon}
            color="disabled"
          />
        );
        editorElement = (
          <PropsTreeItemButton
            color="default"
            size="small"
            fullWidth={true}
            title={`Select the ${componentName} component's instance on the page`}
            onClick={this.handleSelectComponent}
          >
            {componentInstance}
          </PropsTreeItemButton>
        );
        break;
      case constants.COMPONENT_PROPERTY_OBJECT_TYPE:
      case constants.COMPONENT_PROPERTY_ARRAY_TYPE:
        editorElementIcon = (
          <TextFields
            color="disabled"
            className={classes.listItemEditorIcon}
          />
        );
        editorElement = (
          <PropsTreeItemButton
            color="default"
            size="small"
            title="Click to edit value"
            fullWidth={true}
            onClick={this.handleEditJson}
          >
            {type === constants.COMPONENT_PROPERTY_OBJECT_TYPE && (
              <span>{'{ object }'}</span>
            )}
            {type === constants.COMPONENT_PROPERTY_ARRAY_TYPE && (
              <span>{'[ a,r,r,a,y ]'}</span>
            )}
          </PropsTreeItemButton>
        );
        break;
      case constants.COMPONENT_PROPERTY_ONE_OF_TYPE:
        editorElementIcon = (
          <TextFields
            color="disabled"
            className={classes.listItemEditorIcon}
          />
        );
        editorElement = (
          <div className={classes.editorWrapper}>
            <div style={{ marginLeft: '5px' }}>
              <PropertySelect
                value={propertyValue}
                values={propertyValueVariants ? propertyValueVariants.map(variant => variant.value) : []}
                onChange={this.handlePropertyValueChange}
              />
            </div>
          </div>
        );
        break;
      case constants.COMPONENT_PROPERTY_NUMBER_TYPE:
        editorElementIcon = (
          <TextFields
            color="disabled"
            className={classes.listItemEditorIcon}
          />
        );
        editorElement = (
          <div className={classes.editorWrapper}>
            <div style={{ marginLeft: '5px' }}>
              <PropertyNumericField
                value={propertyValue}
                onChange={this.handlePropertyValueChange}
              />
            </div>
          </div>
        );
        break;
      case constants.COMPONENT_PROPERTY_BOOL_TYPE:
        editorElementIcon = (
          <TextFields
            color="disabled"
            className={classes.listItemEditorIcon}
          />
        );
        editorElement = (
          <PropertyCheckbox
            value={propertyValue}
            onChange={this.handlePropertyValueChange}
          />
        );
        break;
      default:
        editorElementIcon = (
          <TextFields
            color="disabled"
            className={classes.listItemEditorIcon}
          />
        );
        editorElement = (
          <div className={classes.editorWrapper}>
            <div style={{ marginLeft: '5px' }}>
              <PropertyTextField
                text={propertyValue}
                onChange={this.handlePropertyValueChange}
              />
            </div>
          </div>
        );
        break;
    }
    const isError = errors && !isEmpty(errors);
    return (
      <PropsTreeListItem
        component="div"
        disableGutters={true}
        style={{ paddingLeft }}
        button={false}
        onClick={!isEmpty(errors) ? this.handleErrorClick : this.handleClick}
      >
        <div className={classes.listItemPrefixSector}/>
        <div className={classes.listItemContent}>
          <PropsTreeListItemIcon>
            {editorElementIcon}
          </PropsTreeListItemIcon>
          <div className={classes.propertyEditorContainer}>
            {name && (
              <div className={classes.titleContainer}>
                <PropsTreeListItemText
                  disableTypography={true}
                  title={propertyComment}
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
                              <MarkdownView tiny={true} markdownContent={propertyComment} />
                            )
                            : (
                              <React.Fragment>
                                <Typography variant="caption">There is no comment for this property.</Typography>
                              </React.Fragment>
                            )
                          }
                      >
                        <div className={classes.title}>
                          <span
                            className={isError ? classes.errorText : classes.titleText}
                          >
                            {name}
                          </span>
                        </div>
                      </Tooltip>
                      {!propertyName && (
                        <PropsTreeItemExtraButton
                          title="Duplicate this item in the array"
                          onClick={this.handleDuplicateComponentProperty}
                        >
                          <FileCopy className={classes.buttonIcon} />
                        </PropsTreeItemExtraButton>
                      )}
                      {!propertyName && (
                        <PropsTreeItemExtraButton
                          title="Remove this item from the array"
                          onClick={this.handleDeleteComponentProperty}
                        >
                          <Close className={classes.buttonIcon} />
                        </PropsTreeItemExtraButton>
                      )}
                      {isError && (
                        <PropsTreeItemExtraButton
                          title="Remove the property"
                          className={classes.errorText}
                          onClick={this.handleDeleteComponentProperty}
                        >
                          <Delete className={classes.buttonIcon} />
                        </PropsTreeItemExtraButton>
                      )}
                    </React.Fragment>
                  }
                />
              </div>
            )}
            {editorElement}
          </div>
        </div>
      </PropsTreeListItem>
    );
  }
}

export default withStyles(styles)(PropsTreeItem);
