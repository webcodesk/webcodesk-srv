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

import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ExpandMore from '@material-ui/icons/ExpandMore';
import green from '@material-ui/core/colors/green';
import ResourceIcon from '../commons/ResourceIcon';
import {
  ResourceList,
  ResourceSubheaderBadge,
  ResourceListItem,
  ResourceListItemText,
  ResourceListItemErrorText,
  ResourceListItemIcon,
  ResourceListItemExpandedIcon,
  ResourceListSubheader,
  ResourceListItemDimmedText,
} from './ResourcesTreeView.parts';
import ToolbarButton from '../commons/ToolbarButton';

import constants from '../../../commons/constants';
import DraggableWrapper from './DraggableWrapper';
import ScrollSlider from '../commons/ScrollSlider';

const TREE_VIEW_INDENT = '18px';
const FIRST_LIST_INDENT = '17px';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    overflow: 'hidden',
  },
  firstListContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflow: 'hidden',
    paddingLeft: FIRST_LIST_INDENT,
    paddingBottom: '5px'
  },
  list: {
    width: '800px'
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
      left: '9px',
      bottom: 0,
      width: 0,
      borderLeft: '1px solid #e2e2e2',
    }
  },
  listItemContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    // paddingRight: '5px',
  },
  listItemTextContainer: {
    // flexGrow: 2,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      border: 0,
      borderRadius: '4px',
      backgroundColor: '#eceff1'
    },
  },
  listItemTextContainerClickable: {
    // flexGrow: 2,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      border: 0,
      borderRadius: '4px',
      backgroundColor: '#eceff1'
    },
  },
  listItemTextContainerDraggable: {
    // flexGrow: 2,
    display: 'flex',
    alignItems: 'center',
    cursor: 'grab',
    '&:hover': {
      border: 0,
      borderRadius: '4px',
      backgroundColor: '#eceff1'
    },
  },
  listItemButtonWrapper: {
    display: 'flex',
    alignItems: 'center',
    '&:hover $listItemButton': {
      opacity: 1,
    },
    '&:hover': {
      border: 0,
      borderRadius: '4px',
      backgroundColor: '#eceff1'
    },
  },
  listItemButton: {
    opacity: 0,
  },
  listItemPrefixButtonSector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    cursor: 'pointer',
    '&:hover': {
      border: 0,
      borderRadius: '4px',
      backgroundColor: '#eceff1'
    }
  },
  listItemPrefixSector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  listItemExpandedIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  listItemResourceIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3px 3px 3px 3px',
  },
  highlightedText: {
    borderRadius: '4px',
    padding: '4px',
    backgroundColor: '#fff176'
  },
  strikeThroughText: {
    textDecoration: 'line-through',
    color: theme.palette.grey['600'],
  },
  testItemText: {
    // fontWeight: 700,
    color: green['700'],
  },
  subheaderContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '24px',
  },
  subheaderText: {
    flexGrow: 0,
  },
  subheaderButtonsWrapper: {
    marginLeft: '36px'
  },
  subheaderItemsCountText: {
    color: '#7d7d7d',
    fontSize: '12px'
  },
  subheaderButton: {
    flexGrow: 0,
  },
  htmlPopper: {
    opacity: 1,
  },
  htmlTooltip: {
    minWidth: '450px',
    backgroundColor: '#fff9c4',
    border: '1px solid #dddddd',
  },
  htmlTooltipCode: {
    backgroundColor: '#fff9c4',
  },
  smallIcon: {
    fontSize: '14px',
    margin: '0 4px',
    cursor: 'pointer',
    border: '1px solid #dcdcdc',
    borderRadius: '50%'
  },
  htmlTooltipDivider: {
    margin: '5px 0',
  },
  subheader1: {
    borderTop: '2px solid #ff9800',
    backgroundColor: '#eceff1',
    fontWeight: 400,
    color: '#455a64',
    '&:hover': {
      backgroundColor: '#cfd8dc',
      color: '#263238',
    },
  },
  subheader2: {
    borderTop: '2px solid #3f51b5',
    backgroundColor: '#eceff1',
    fontWeight: 400,
    color: '#455a64',
    '&:hover': {
      backgroundColor: '#cfd8dc',
      color: '#263238',
    },
  },
  subheader3: {
    borderTop: '2px solid #795548',
    backgroundColor: '#eceff1',
    fontWeight: 400,
    color: '#455a64',
    '&:hover': {
      backgroundColor: '#cfd8dc',
      color: '#263238',
    },
  },
  subheader4: {
    borderTop: '2px solid #009688',
    backgroundColor: '#eceff1',
    fontWeight: 400,
    color: '#455a64',
    '&:hover': {
      backgroundColor: '#cfd8dc',
      color: '#263238',
    },
  },
  subheader5: {
    borderTop: '2px solid #673ab7',
    backgroundColor: '#eceff1',
    fontWeight: 400,
    color: '#455a64',
    '&:hover': {
      backgroundColor: '#cfd8dc',
      color: '#263238',
    },
  },
  subheader6: {
    backgroundColor: '#eceff1',
    fontWeight: 400,
    color: '#455a64',
    '&:hover': {
      backgroundColor: '#cfd8dc',
      color: '#263238',
    },
  }
});

class ResourcesTreeView extends React.Component {
  static propTypes = {
    resourcesTreeViewObject: PropTypes.object,
    selectedResourceKey: PropTypes.string,
    selectedResource: PropTypes.object,
    selectedVirtualPath: PropTypes.string,
    expandedResourceKeys: PropTypes.object,
    highlightedResourceKeys: PropTypes.object,
    onSelectResourceTreeViewItem: PropTypes.func,
    onDoubleClickResourceTreeViewItem: PropTypes.func,
    onToggleResourceTreeViewItem: PropTypes.func,
    onItemDragStart: PropTypes.func,
    onItemDragEnd: PropTypes.func,
    onCreatePage: PropTypes.func,
    onCopyPage: PropTypes.func,
    onRenamePage: PropTypes.func,
    onEditPage: PropTypes.func,
    onCreateTemplate: PropTypes.func,
    onCopyTemplate: PropTypes.func,
    onRenameTemplate: PropTypes.func,
    onEditTemplate: PropTypes.func,
    onCreateFlow: PropTypes.func,
    onCopyFlow: PropTypes.func,
    onRenameFlow: PropTypes.func,
    onEditFlow: PropTypes.func,
    onToggleFlow: PropTypes.func,
    onToggleIsTest: PropTypes.func,
    onDeletePage: PropTypes.func,
    onDeleteFlow: PropTypes.func,
    onDeleteTemplate: PropTypes.func,
    onCreateComponent: PropTypes.func,
    onCreateFunctions: PropTypes.func,
    onOpenMarket: PropTypes.func,
  };

  static defaultProps = {
    resourcesTreeViewObject: {},
    selectedResourceKey: null,
    selectedResource: null,
    selectedVirtualPath: null,
    expandedResourceKeys: {},
    highlightedResourceKeys: {},
    onSelectResourceTreeViewItem: () => {
      console.info('ResourcesTreeView.onSelectResourceTreeViewItem is not set');
    },
    onDoubleClickResourceTreeViewItem: () => {
      console.info('ResourcesTreeView.onDoubleClickResourceTreeViewItem is not set');
    },
    onToggleResourceTreeViewItem: () => {
      console.info('ResourcesTreeView.onToggleResourceTreeViewItem is not set');
    },
    onItemDragStart: () => {
      console.info('ResourcesTreeView.onItemDragStart is not set');
    },
    onItemDragEnd: () => {
      console.info('ResourcesTreeView.onItemDragEnd is not set');
    },
    onCreatePage: () => {
      console.info('ResourcesTreeView.onCreatePage is not set');
    },
    onCopyPage: () => {
      console.info('ResourcesTreeView.onCopyPage is not set');
    },
    onRenamePage: () => {
      console.info('ResourcesTreeView.onRenamePage is not set');
    },
    onEditPage: () => {
      console.info('ResourcesTreeView.onEditPage is not set');
    },
    onCreateTemplate: () => {
      console.info('ResourcesTreeView.onCreateTemplate is not set');
    },
    onCopyTemplate: () => {
      console.info('ResourcesTreeView.onCopyTemplate is not set');
    },
    onRenameTemplate: () => {
      console.info('ResourcesTreeView.onRenameTemplate is not set');
    },
    onEditTemplate: () => {
      console.info('ResourcesTreeView.onEditTemplate is not set');
    },
    onCreateFlow: () => {
      console.info('ResourcesTreeView.onCreateFlow is not set');
    },
    onCopyFlow: () => {
      console.info('ResourcesTreeView.onCopyFlow is not set');
    },
    onRenameFlow: () => {
      console.info('ResourcesTreeView.onRenameFlow is not set');
    },
    onEditFlow: () => {
      console.info('ResourcesTreeView.onEditFlow is not set');
    },
    onToggleFlow: () => {
      console.info('ResourcesTreeView.onToggleFlow is not set');
    },
    onToggleIsTest: () => {
      console.info('ResourcesTreeView.onToggleIsTest is not set');
    },
    onDeletePage: () => {
      console.info('ResourcesTreeView.onDeletePage is not set');
    },
    onDeleteFlow: () => {
      console.info('ResourcesTreeView.onDeleteFlow is not set');
    },
    onDeleteTemplate: () => {
      console.info('ResourcesTreeView.onDeleteTemplate is not set');
    },
    onCreateComponent: () => {
      console.info('ResourcesTreeView.onCreateComponent is not set');
    },
    onCreateFunctions: () => {
      console.info('ResourcesTreeView.onCreateFunctions is not set');
    },
    onOpenMarket: () => {
      console.info('ResourcesTreeView.onOpenMarket is not set');
    },
  };

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const {
      resourcesTreeViewObject,
      selectedResourceKey,
      highlightedResourceKeys,
      expandedResourceKeys
    } = this.props;
    return (
        resourcesTreeViewObject !== nextProps.resourcesTreeViewObject
        && !isEqual(resourcesTreeViewObject, nextProps.resourcesTreeViewObject)
      )
      || (
        selectedResourceKey !== nextProps.selectedResourceKey
      )
      || (
        expandedResourceKeys !== nextProps.expandedResourceKeys
        && !isEqual(expandedResourceKeys, nextProps.expandedResourceKeys)
      )
      || (
        highlightedResourceKeys !== nextProps.highlightedResourceKeys
        && !isEqual(highlightedResourceKeys, nextProps.highlightedResourceKeys)
      );
  }

  handleToggleExpandItem = (key) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onToggleResourceTreeViewItem(key);
  };

  // handleSelectItem = (key, virtualPath) => (e) => {
  //   this.props.onSelectResourceTreeViewItem({ resourceKey: key, virtualPath });
  // };

  handleDoubleClickItem = (key) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onDoubleClickResourceTreeViewItem(key);
  };

  handleItemDragStart = (key) => {
    this.props.onItemDragStart(key);
  };

  handleItemDragEnd = (key) => {
    this.props.onItemDragEnd(key);
  };

  // handleNoop = (e) => {
  //   if (e) {
  //     e.stopPropagation();
  //     e.preventDefault();
  //   }
  // };

  handleCreateNewResourceByType = (resourceType, virtualPath) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const {
      onCreatePage,
      onCreateFlow,
      onCreateComponent,
      onCreateFunctions,
      onCreateTemplate
    } = this.props;
    if (resourceType === constants.RESOURCE_IN_PAGES_TYPE) {
      onCreatePage({ virtualPath });
    } else if (resourceType === constants.RESOURCE_IN_FLOWS_TYPE) {
      onCreateFlow({ virtualPath });
    } else if (resourceType === constants.RESOURCE_IN_COMPONENTS_TYPE) {
      onCreateComponent({ virtualPath });
    } else if (resourceType === constants.RESOURCE_IN_USER_FUNCTIONS_TYPE) {
      onCreateFunctions({ virtualPath });
    } else if (resourceType === constants.RESOURCE_IN_TEMPLATES_TYPE) {
      onCreateTemplate({ virtualPath });
    }
  };

  handleCopyResource = (resourceKey, resourceType, virtualPath) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { onCopyFlow, onCopyPage, onCopyTemplate } = this.props;
    if (resourceType === constants.RESOURCE_IN_PAGES_TYPE) {
      onCopyPage({ resourceKey, virtualPath });
    } else if (resourceType === constants.RESOURCE_IN_FLOWS_TYPE) {
      onCopyFlow({ resourceKey, virtualPath });
    } else if (resourceType === constants.RESOURCE_IN_TEMPLATES_TYPE) {
      onCopyTemplate({ resourceKey, virtualPath });
    }
  };

  handleRenameResource = (resourceKey, resourceType, virtualPath) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { onRenameFlow, onRenamePage, onRenameTemplate } = this.props;
    if (resourceType === constants.RESOURCE_IN_PAGES_TYPE) {
      onRenamePage({ resourceKey, virtualPath });
    } else if (resourceType === constants.RESOURCE_IN_FLOWS_TYPE) {
      onRenameFlow({ resourceKey, virtualPath });
    } else if (resourceType === constants.RESOURCE_IN_TEMPLATES_TYPE) {
      onRenameTemplate({ resourceKey, virtualPath });
    }
  };

  handleDeleteSelected = (resourceKey, resourceType) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { onDeleteFlow, onDeletePage, onDeleteTemplate } = this.props;
    if (resourceType === constants.RESOURCE_IN_PAGES_TYPE) {
      onDeletePage(resourceKey);
    } else if (resourceType === constants.RESOURCE_IN_FLOWS_TYPE) {
      onDeleteFlow(resourceKey);
    } else if (resourceType === constants.RESOURCE_IN_TEMPLATES_TYPE) {
      onDeleteTemplate(resourceKey);
    }
  };

  handleToggleFlow = (resourceKey, isDisabled) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onToggleFlow({ resourceKey, isDisabled: !isDisabled });
  };

  handleToggleIsTest = (resourceKey, isTest) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onToggleIsTest({ resourceKey, isTest: !isTest });
  };

  handleClearClipboard = () => {

  };

  handleOpenMarket = () => {
    this.props.onOpenMarket();
  };

  createLists = (resourcesList, virtualPath = '', level = 0) => {
    const { expandedResourceKeys, highlightedResourceKeys, classes } = this.props;
    let list = [];
    let totalLevels = level;
    if (resourcesList && resourcesList.length > 0) {
      resourcesList.forEach(resourceItem => {
        const { type, props, key, children } = resourceItem;
        const { resourceType } = props;
        let listItems = [];
        let elementKey = `${key}_${type}`;
        let parentVirtualPath = virtualPath;
        if (type === constants.GRAPH_MODEL_DIR_TYPE) {
          parentVirtualPath = virtualPath && virtualPath.length > 0
            ? `${virtualPath}${constants.FILE_SEPARATOR}${props.displayName}`
            : props.displayName;
        }
        let hasChildren = children && children.length > 0;
        if (hasChildren && expandedResourceKeys[key]) {
          const { list: childList, totalLevels: childTotalLevels } =
            this.createLists(children, parentVirtualPath, level + 1);
          listItems = listItems.concat(childList);
          totalLevels = childTotalLevels;
        }
        if (type === constants.GRAPH_MODEL_DIR_TYPE) {
          list.push(
            <ResourceListItem
              key={elementKey}
              component="div"
              dense={true}
              disableGutters={true}
            >
              <div className={classes.listItemContainer}>
                <div
                  className={classes.listItemPrefixButtonSector}
                  onClick={this.handleToggleExpandItem(key)}
                  title="Click to expand the group"
                >
                  <ResourceListItemExpandedIcon>
                    {hasChildren
                      ? (
                        expandedResourceKeys[key]
                          ? (
                            <ExpandMore fontSize="small" color="disabled"/>
                          )
                          : (
                            <ChevronRight fontSize="small" color="disabled"/>
                          )
                      )
                      : (
                        <span>&nbsp;</span>
                      )
                    }
                  </ResourceListItemExpandedIcon>
                  <ResourceListItemIcon>
                    <ResourceIcon
                      resourceType={type}
                    />
                  </ResourceListItemIcon>
                </div>
                <div className={classes.listItemButtonWrapper}>
                  <div
                    className={classes.listItemTextContainerClickable}
                    onClick={this.handleToggleExpandItem(key)}
                  >
                    {props.hasErrors
                      ? (
                        <ResourceListItemErrorText
                          primary={props.displayName}
                        />
                      )
                      : (
                        <ResourceListItemDimmedText
                          primary={props.displayName}
                        />
                      )
                    }
                  </div>
                  <ToolbarButton
                    iconType="MoreVert"
                    primary={true}
                    tooltip="More actions"
                    className={classes.listItemButton}
                    menuItems={[
                      {
                        label: 'Create new',
                        onClick: this.handleCreateNewResourceByType(resourceType, parentVirtualPath),
                      }
                    ]}
                  />
                </div>
              </div>
            </ResourceListItem>
          );
          if (expandedResourceKeys[key]) {
            list.push(
              <div key={`children_${elementKey}`} className={classes.listItemContainer}>
                <div className={classes.listContainer}>
                  {listItems}
                </div>
              </div>
            );
          }
        } else if (type === constants.GRAPH_MODEL_FILE_TYPE) {
          if (
            children && children.length === 1
            && (
              children[0].type === constants.GRAPH_MODEL_COMPONENT_TYPE
              || children[0].type === constants.GRAPH_MODEL_FUNCTIONS_TYPE
              || children[0].type === constants.GRAPH_MODEL_PAGE_TYPE
              || children[0].type === constants.GRAPH_MODEL_FLOW_TYPE
              || children[0].type === constants.GRAPH_MODEL_TEMPLATE_TYPE
            )
          ) {
            const { list: childList } = this.createLists(children, virtualPath, level);
            list = list.concat(childList);
          } else {
            list.push(
              <ResourceListItem
                key={elementKey}
                dense={true}
                component="div"
                disableGutters={true}
              >
                <div className={classes.listItemContainer}>
                  <div
                    className={classes.listItemPrefixButtonSector}
                    onClick={this.handleToggleExpandItem(key)}
                    title="Click to expand the group"
                  >
                    <ResourceListItemExpandedIcon>
                      {hasChildren
                        ? (
                          expandedResourceKeys[key]
                            ? (
                              <ExpandMore fontSize="small" color="disabled"/>
                            )
                            : (
                              <ChevronRight fontSize="small" color="disabled"/>
                            )
                        )
                        : (
                          <span>&nbsp;</span>
                        )
                      }
                    </ResourceListItemExpandedIcon>
                    <ResourceListItemIcon>
                      <ResourceIcon
                        isMuted={true}
                        resourceType={type}
                      />
                    </ResourceListItemIcon>
                  </div>
                  <div
                    className={classes.listItemTextContainer}
                    onClick={this.handleToggleExpandItem(key)}
                  >
                    <ResourceListItemText primary={props.displayName}/>
                  </div>
                </div>
              </ResourceListItem>
            );
            if (expandedResourceKeys[key]) {
              list.push(
                <div key={`children_${elementKey}`} className={classes.listItemContainer}>
                  <div className={classes.listContainer}>
                    {listItems}
                  </div>
                </div>
              );
            }
          }
        } else if (type === constants.GRAPH_MODEL_FUNCTIONS_TYPE) {
          list.push(
            <ResourceListItem
              key={elementKey}
              dense={true}
              component="div"
              disableGutters={true}
            >
              <div className={classes.listItemContainer}>
                <div
                  className={classes.listItemPrefixButtonSector}
                  onClick={this.handleToggleExpandItem(key)}
                  title="Click to expand the group"
                >
                  <ResourceListItemExpandedIcon>
                    {hasChildren
                      ? (
                        expandedResourceKeys[key]
                          ? (
                            <ExpandMore fontSize="small" color="disabled"/>
                          )
                          : (
                            <ChevronRight fontSize="small" color="disabled"/>
                          )
                      )
                      : (
                        <span>&nbsp;</span>
                      )
                    }
                  </ResourceListItemExpandedIcon>
                  <ResourceListItemIcon>
                    <ResourceIcon
                      resourceType={type}
                    />
                  </ResourceListItemIcon>
                </div>
                <div
                  className={classes.listItemTextContainerClickable}
                  onClick={this.handleDoubleClickItem(key)}
                >
                  <ResourceListItemText
                    title="Click to open in the tab."
                    primary={
                      highlightedResourceKeys[key]
                        ? <span className={classes.highlightedText}>{props.displayName}</span>
                        : props.displayName
                    }
                  />
                </div>
              </div>
            </ResourceListItem>
          );
          if (expandedResourceKeys[key]) {
            list.push(
              <div key={`children_${elementKey}`} className={classes.listItemContainer}>
                <div className={classes.listContainer}>
                  {listItems}
                </div>
              </div>
            );
          }
        } else if (type === constants.GRAPH_MODEL_USER_FUNCTION_TYPE) {
          list.push(
            <ResourceListItem
              key={elementKey}
              dense={true}
              component="div"
              disableGutters={true}
            >
              <div className={classes.listItemContainer}>
                <div className={classes.listItemPrefixSector}>
                  <ResourceListItemExpandedIcon>
                    <span>&nbsp;</span>
                  </ResourceListItemExpandedIcon>
                  <ResourceListItemIcon>
                    <ResourceIcon
                      resourceType={type}
                    />
                  </ResourceListItemIcon>
                </div>
                <div className={classes.listItemTextContainerDraggable}>
                  <DraggableWrapper
                    onDragStart={this.handleItemDragStart}
                    onDragEnd={this.handleItemDragEnd}
                    key={elementKey}
                    resourceKey={key}
                  >
                    <ResourceListItemText
                      title="Click to open in the tab, or drag & drop into the flow."
                      primary={
                        highlightedResourceKeys[key]
                          ? <span className={classes.highlightedText}>{props.displayName}</span>
                          : props.displayName
                      }
                    />
                  </DraggableWrapper>
                </div>
              </div>
            </ResourceListItem>
          );
        } else if (type === constants.GRAPH_MODEL_COMPONENT_TYPE) {
          list.push(
            <ResourceListItem
              key={elementKey}
              dense={true}
              component="div"
              disableGutters={true}
            >
              <div className={classes.listItemContainer}>
                <div className={classes.listItemPrefixSector}>
                  <ResourceListItemExpandedIcon>
                    <span>&nbsp;</span>
                  </ResourceListItemExpandedIcon>
                  <ResourceListItemIcon>
                    <ResourceIcon
                      resourceType={type}
                    />
                  </ResourceListItemIcon>
                </div>
                <div
                  className={classes.listItemTextContainerDraggable}
                  onClick={this.handleDoubleClickItem(key)}
                >
                  <DraggableWrapper
                    onDragStart={this.handleItemDragStart}
                    onDragEnd={this.handleItemDragEnd}
                    key={elementKey}
                    resourceKey={key}
                  >
                    <ResourceListItemText
                      title="Click to open in the tab, or drag & drop into the page."
                      primary={
                        highlightedResourceKeys[key]
                          ? <span className={classes.highlightedText}>{props.displayName}</span>
                          : props.displayName
                      }
                    />
                  </DraggableWrapper>
                </div>
              </div>
            </ResourceListItem>
          );
        } else if (type === constants.GRAPH_MODEL_PAGE_TYPE) {
          let itemTextClassNames = '';
          if (props.isTest) {
            itemTextClassNames = classes.testItemText;
          }
          if (highlightedResourceKeys[key]) {
            itemTextClassNames += ' ' + classes.highlightedText;
          }
          list.push(
            <ResourceListItem
              key={elementKey}
              dense={true}
              component="div"
              disableGutters={true}
            >
              <div className={classes.listItemContainer}>
                <div
                  className={classes.listItemPrefixButtonSector}
                  onClick={this.handleToggleExpandItem(key)}
                  title="Click to expand the group"
                >
                  <ResourceListItemExpandedIcon>
                    {hasChildren
                      ? (
                        expandedResourceKeys[key]
                          ? (
                            <ExpandMore fontSize="small" color="disabled"/>
                          )
                          : (
                            <ChevronRight fontSize="small" color="disabled"/>
                          )
                      )
                      : (
                        <span>&nbsp;</span>
                      )
                    }
                  </ResourceListItemExpandedIcon>
                  <ResourceListItemIcon>
                    <ResourceIcon
                      resourceType={type}
                    />
                  </ResourceListItemIcon>
                </div>
                <div className={classes.listItemButtonWrapper}>
                  <div
                    className={classes.listItemTextContainerClickable}
                    onClick={this.handleDoubleClickItem(key)}
                  >
                    <DraggableWrapper
                      onDragStart={this.handleItemDragStart}
                      onDragEnd={this.handleItemDragEnd}
                      key={elementKey}
                      resourceKey={key}
                    >
                      {props.hasErrors
                        ? (
                          <ResourceListItemErrorText
                            title="Click to open in the tab, or drag & drop into the flow."
                            primary={props.displayName}
                          />
                        )
                        : (
                          <ResourceListItemText
                            title="Click to open in the tab, or drag & drop into the flow."
                            primary={<span className={itemTextClassNames}>{props.displayName}</span>}
                          />
                        )
                      }
                    </DraggableWrapper>
                  </div>
                  <ToolbarButton
                    iconType="MoreVert"
                    className={classes.listItemButton}
                    primary={true}
                    onClick={this.handleCreateNewResourceByType(resourceType, '')}
                    tooltip="More actions"
                    menuItems={[
                      {
                        label: 'Copy page',
                        onClick: this.handleCopyResource(key, resourceType, virtualPath),
                      },
                      {
                        label: 'Rename page',
                        onClick: this.handleRenameResource(key, resourceType, virtualPath),
                      },
                      {
                        label: 'divider'
                      },
                      {
                        label: props.isTest
                          ? 'Mark as regular page'
                          : 'Mark as test page',
                        onClick: this.handleToggleIsTest(key, props.isTest),
                      },
                      {
                        label: 'divider'
                      },
                      {
                        label: 'Delete page',
                        onClick: this.handleDeleteSelected(key, resourceType),
                      }
                    ]}
                  />
                </div>
              </div>
            </ResourceListItem>
          );
          if (expandedResourceKeys[key]) {
            list.push(
              <div key={`children_${elementKey}`} className={classes.listItemContainer}>
                <div className={classes.listContainer}>
                  {listItems}
                </div>
              </div>
            );
          }
        } else if (type === constants.GRAPH_MODEL_TEMPLATE_TYPE) {
          list.push(
            <ResourceListItem
              key={elementKey}
              dense={true}
              component="div"
              disableGutters={true}
            >
              <div className={classes.listItemContainer}>
                <div className={classes.listItemPrefixSector}>
                  <ResourceListItemExpandedIcon>
                    <span>&nbsp;</span>
                  </ResourceListItemExpandedIcon>
                  <ResourceListItemIcon>
                    <ResourceIcon
                      resourceType={type}
                    />
                  </ResourceListItemIcon>
                </div>
                <div className={classes.listItemButtonWrapper}>
                  <div
                    className={classes.listItemTextContainerDraggable}
                    onClick={this.handleDoubleClickItem(key)}
                  >
                    <DraggableWrapper
                      onDragStart={this.handleItemDragStart}
                      onDragEnd={this.handleItemDragEnd}
                      key={elementKey}
                      resourceKey={key}
                    >
                      {props.hasErrors
                        ? (
                          <ResourceListItemErrorText
                            title="Click to open in the tab, or drag & drop into the page."
                            primary={props.displayName}
                          />
                        )
                        : (
                          <ResourceListItemText
                            title="Click to open in the tab, or drag & drop into the page."
                            primary={
                              highlightedResourceKeys[key]
                                ? <span className={classes.highlightedText}>{props.displayName}</span>
                                : props.displayName
                            }
                          />
                        )
                      }
                    </DraggableWrapper>
                  </div>
                  <ToolbarButton
                    iconType="MoreVert"
                    primary={true}
                    className={classes.listItemButton}
                    onClick={this.handleCreateNewResourceByType(resourceType, '')}
                    tooltip="More actions"
                    menuItems={[
                      {
                        label: 'Copy template',
                        onClick: this.handleCopyResource(key, resourceType, virtualPath),
                      },
                      {
                        label: 'Rename template',
                        onClick: this.handleRenameResource(key, resourceType, virtualPath),
                      },
                      {
                        label: 'divider'
                      },
                      {
                        label: 'Delete template',
                        onClick: this.handleDeleteSelected(key, resourceType),
                      }
                    ]}
                  />
                </div>
              </div>
            </ResourceListItem>
          );
        } else if (type === constants.GRAPH_MODEL_COMPONENT_INSTANCE_TYPE) {
          list.push(
            <ResourceListItem
              key={elementKey}
              dense={true}
              component="div"
              disableGutters={true}
            >
              <div className={classes.listItemContainer}>
                <div
                  className={classes.listItemPrefixButtonSector}
                  onClick={this.handleToggleExpandItem(key)}
                  title="Click to expand the group"
                >
                  <ResourceListItemExpandedIcon>
                    {hasChildren
                      ? (
                        expandedResourceKeys[key]
                          ? (
                            <ExpandMore fontSize="small" color="disabled"/>
                          )
                          : (
                            <ChevronRight fontSize="small" color="disabled"/>
                          )
                      )
                      : (
                        <span>&nbsp;</span>
                      )
                    }
                  </ResourceListItemExpandedIcon>
                  <ResourceListItemIcon>
                    <ResourceIcon
                      resourceType={type}
                    />
                  </ResourceListItemIcon>
                </div>
                <div className={classes.listItemTextContainerDraggable}>
                  <DraggableWrapper
                    onDragStart={this.handleItemDragStart}
                    onDragEnd={this.handleItemDragEnd}
                    key={elementKey}
                    resourceKey={key}
                  >
                    <ResourceListItemText
                      title="Drag & drop into the page or into the flow."
                      primary={
                        highlightedResourceKeys[key]
                          ? <span className={classes.highlightedText}>{props.displayName}</span>
                          : props.displayName
                      }
                    />
                  </DraggableWrapper>
                </div>
              </div>
            </ResourceListItem>
          );
          if (expandedResourceKeys[key]) {
            list.push(
              <div key={`children_${elementKey}`} className={classes.listItemContainer}>
                <div className={classes.listContainer}>
                  {listItems}
                </div>
              </div>
            );
          }
        } else if (type === constants.GRAPH_MODEL_FLOW_TYPE) {
          let itemTextClassNames = '';
          if (props.isDisabled) {
            itemTextClassNames = classes.strikeThroughText;
          } else if (props.isTest) {
            itemTextClassNames = classes.testItemText;
          }
          if (highlightedResourceKeys[key]) {
            itemTextClassNames += ' ' + classes.highlightedText;
          }
          list.push(
            <ResourceListItem
              key={elementKey}
              dense={true}
              component="div"
              disableGutters={true}
            >
              <div className={classes.listItemContainer}>
                <div
                  className={classes.listItemPrefixButtonSector}
                  onClick={this.handleToggleExpandItem(key)}
                  title="Click to expand the group"
                >
                  <ResourceListItemExpandedIcon>
                    {hasChildren
                      ? (
                        expandedResourceKeys[key]
                          ? (
                            <ExpandMore fontSize="small" color="disabled"/>
                          )
                          : (
                            <ChevronRight fontSize="small" color="disabled"/>
                          )
                      )
                      : (
                        <span>&nbsp;</span>
                      )
                    }
                  </ResourceListItemExpandedIcon>
                  <ResourceListItemIcon>
                    <ResourceIcon
                      isMuted={true}
                      resourceType={type}
                    />
                  </ResourceListItemIcon>
                </div>
                <div className={classes.listItemButtonWrapper}>
                  <div
                    className={classes.listItemTextContainerClickable}
                    onClick={this.handleDoubleClickItem(key)}
                  >
                    {props.hasErrors
                      ? (
                        <ResourceListItemErrorText
                          title="Click to open in the tab"
                          primary={<span className={itemTextClassNames}>{props.displayName}</span>}
                        />
                      )
                      : (
                        <ResourceListItemText
                          title="Click to open in the tab"
                          primary={<span className={itemTextClassNames}>{props.displayName}</span>}
                        />
                      )
                    }
                  </div>
                  <ToolbarButton
                    iconType="MoreVert"
                    className={classes.listItemButton}
                    primary={true}
                    tooltip="More actions"
                    menuItems={[
                      {
                        label: 'Copy flow',
                        onClick: this.handleCopyResource(key, resourceType, virtualPath),
                      },
                      {
                        label: 'Rename flow',
                        onClick: this.handleRenameResource(key, resourceType, virtualPath),
                      },
                      {
                        label: 'divider'
                      },
                      {
                        label: props.isDisabled
                          ? 'Enable flow'
                          : 'Disable flow',
                        onClick: this.handleToggleFlow(key, props.isDisabled),
                      },
                      {
                        label: props.isTest
                          ? 'Mark as regular flow'
                          : 'Mark as test flow',
                        onClick: this.handleToggleIsTest(key, props.isTest),
                      },
                      {
                        label: 'divider'
                      },
                      {
                        label: 'Delete flow',
                        onClick: this.handleDeleteSelected(key, resourceType),
                      }
                    ]}
                  />
                </div>
              </div>
            </ResourceListItem>
          );
          if (expandedResourceKeys[key]) {
            list.push(
              <div key={`children_${elementKey}`} className={classes.listItemContainer}>
                <div className={classes.listContainer}>
                  {listItems}
                </div>
              </div>
            );
          }
        } else if (type === constants.GRAPH_MODEL_FLOW_COMPONENT_INSTANCE_TYPE) {
          list.push(
            <ResourceListItem
              key={elementKey}
              dense={true}
              component="div"
              disableGutters={true}
            >
              <div className={classes.listItemContainer}>
                <div className={classes.listItemPrefixSector}>
                  <ResourceListItemExpandedIcon>
                    <span>&nbsp;</span>
                  </ResourceListItemExpandedIcon>
                  <ResourceListItemIcon>
                    <ResourceIcon
                      resourceType={type}
                    />
                  </ResourceListItemIcon>
                </div>
                <div className={classes.listItemButtonWrapper}>
                  <div className={classes.listItemTextContainerDraggable}>
                    <DraggableWrapper
                      onDragStart={this.handleItemDragStart}
                      onDragEnd={this.handleItemDragEnd}
                      key={elementKey}
                      resourceKey={key}
                    >
                      <ResourceListItemText
                        title="Drag & drop into the page or into the flow."
                        primary={
                          highlightedResourceKeys[key]
                            ? <span className={classes.highlightedText}>{props.displayName}</span>
                            : props.displayName
                        }
                      />
                    </DraggableWrapper>
                  </div>
                </div>
              </div>
            </ResourceListItem>
          );
        } else if (type === constants.GRAPH_MODEL_FLOW_USER_FUNCTION_TYPE) {
          list.push(
            <ResourceListItem
              key={elementKey}
              dense={true}
              component="div"
              disableGutters={true}
            >
              <div className={classes.listItemContainer}>
                <div className={classes.listItemPrefixSector}>
                  <ResourceListItemExpandedIcon>
                    <span>&nbsp;</span>
                  </ResourceListItemExpandedIcon>
                  <ResourceListItemIcon>
                    <ResourceIcon
                        resourceType={type}
                    />
                  </ResourceListItemIcon>
                </div>
                <div className={classes.listItemButtonWrapper}>
                  <div className={classes.listItemTextContainerDraggable}>
                    <DraggableWrapper
                      onDragStart={this.handleItemDragStart}
                      onDragEnd={this.handleItemDragEnd}
                      key={elementKey}
                      resourceKey={key}
                    >
                      <ResourceListItemText
                        title="Drag & drop into the flow."
                        primary={
                          highlightedResourceKeys[key]
                            ? <span className={classes.highlightedText}>{props.displayName}</span>
                            : props.displayName
                        }
                      />
                    </DraggableWrapper>
                  </div>
                </div>
              </div>
            </ResourceListItem>
          );
        } else if (type === constants.GRAPH_MODEL_CLIPBOARD_ITEM_TYPE) {
          const { itemModel } = props;
          if (itemModel) {
            list.push(
              <ResourceListItem
                key={elementKey}
                dense={true}
                component="div"
                disableGutters={true}
              >
                <div className={classes.listItemContainer}>
                  <div className={classes.listItemPrefixSector}>
                    <ResourceListItemExpandedIcon>
                      <span>&nbsp;</span>
                    </ResourceListItemExpandedIcon>
                    <ResourceListItemIcon>
                      <ResourceIcon resourceType={itemModel.type}/>
                    </ResourceListItemIcon>
                  </div>
                  <div className={classes.listItemTextContainerDraggable}>
                    <DraggableWrapper
                      onDragStart={this.handleItemDragStart}
                      onDragEnd={this.handleItemDragEnd}
                      key={elementKey}
                      resourceKey={key}
                    >
                      <ResourceListItemText
                        title="Drag & drop into the page or into the template."
                        primary={
                          highlightedResourceKeys[key]
                            ? <span className={classes.highlightedText}>{props.displayName}</span>
                            : props.displayName
                        }
                      />
                    </DraggableWrapper>
                  </div>
                </div>
              </ResourceListItem>
            );
          }
        }
      });
    }
    return { list, totalLevels };
  };

  createRootList = (resourceObject) => {
    const { expandedResourceKeys } = this.props;
    const { key, children } = resourceObject;
    if (expandedResourceKeys[key]) {
      const { list, totalLevels } = this.createLists(children);
      return {
        totalLevels,
        rootResourceItem: resourceObject,
        list,
      };
    }
    return {
      totalLevels: 0,
      rootResourceItem: resourceObject,
      list: [],
    };
  };

  render () {
    const { resourcesTreeViewObject, classes } = this.props;
    if (!resourcesTreeViewObject || isEmpty(resourcesTreeViewObject)) {
      return (<span/>);
    }
    const rootLists = [];
    let maxWidth = 0;
    const {
      clipboardItems,
      clipboardItemsCount,
      templates,
      templatesCount,
      flows,
      flowsCount,
      pages,
      pagesCount,
      userComponents,
      userComponentsCount,
      userFunctions,
      userFunctionsCount
    } = resourcesTreeViewObject;
    // sort roots in the custom order
    [
      { object: clipboardItems, count: clipboardItemsCount },
      { object: userComponents, count: userComponentsCount },
      { object: templates, count: templatesCount },
      { object: pages, count: pagesCount },
      { object: flows, count: flowsCount },
      { object: userFunctions, count: userFunctionsCount }
    ].forEach(resourceObject => {
      if (resourceObject.object) {
        const { totalLevels, rootResourceItem, list } = this.createRootList(resourceObject.object);
        maxWidth = maxWidth < totalLevels ? totalLevels : maxWidth;
        rootLists.push({
          rootResourceItem,
          list,
          itemsCount: resourceObject.count,
        });
      }
    });

    let lists = [];

    if (rootLists && rootLists.length > 0) {
      let subheaderButtons;
      let subheaderClass;
      rootLists.forEach(rootListItem => {
        const { type, props, key } = rootListItem.rootResourceItem;
        const { resourceType } = props;
        subheaderButtons = [];
        subheaderClass = '';
        if (type === constants.GRAPH_MODEL_FLOWS_ROOT_TYPE) {
          subheaderButtons = [
            (<div key={`flowsMoreActions_${key}`} className={classes.subheaderButton}>
              <ToolbarButton
                iconType="Add"
                primary={true}
                tooltip="Create a new flow"
                onClick={this.handleCreateNewResourceByType(resourceType, '')}
              />
            </div>),
          ];
          subheaderClass = classes.subheader1;
        } else if (type === constants.GRAPH_MODEL_PAGES_ROOT_TYPE) {
          subheaderButtons = [
            (<div key={`pagesMoreActions_${key}`} className={classes.subheaderButton}>
              <ToolbarButton
                iconType="Add"
                primary={true}
                tooltip="Create a new page"
                onClick={this.handleCreateNewResourceByType(resourceType, '')}
              />
            </div>),
          ];
          subheaderClass = classes.subheader2;
        } else if (type === constants.GRAPH_MODEL_TEMPLATES_ROOT_TYPE) {
          subheaderButtons = [
            (<div key={`templatesMoreActions_${key}`} className={classes.subheaderButton}>
              <ToolbarButton
                iconType="Add"
                primary={true}
                tooltip="Create a new template"
                onClick={this.handleCreateNewResourceByType(resourceType, '')}
              />
            </div>),
          ];
          subheaderClass = classes.subheader5;
        } else if (type === constants.GRAPH_MODEL_COMPONENTS_ROOT_TYPE) {
          subheaderButtons = [
            (<div key={`componentsMoreActions_${key}`} className={classes.subheaderButton}>
              <ToolbarButton
                iconType="Add"
                primary={true}
                tooltip="Generate the source code for a new component"
                onClick={this.handleCreateNewResourceByType(resourceType, '')}
              />
            </div>),
          ];
          subheaderClass = classes.subheader3;
        } else if (type === constants.GRAPH_MODEL_USER_FUNCTIONS_ROOT_TYPE) {
          subheaderButtons = [
            (<div key={`functionsMoreActions_${key}`} className={classes.subheaderButton}>
              <ToolbarButton
                iconType="Add"
                primary={true}
                tooltip="Generate the source code for a new functions list"
                onClick={this.handleCreateNewResourceByType(resourceType, '')}
              />
            </div>),
          ];
          subheaderClass = classes.subheader4;
        } else if (type === constants.GRAPH_MODEL_CLIPBOARD_ROOT_TYPE) {
          // subheaderButtons = [
          //   // (<div key={`clipboardMoreActions_${key}`} className={classes.subheaderButton}>
          //   //   <ToolbarButton
          //   //     iconType="MoreVert"
          //   //     primary={true}
          //   //     tooltip="More actions"
          //   //     menuItems={[{
          //   //       label: 'Clear clipboard',
          //   //       onClick: this.handleClearClipboard,
          //   //     }]}
          //   //   />
          //   // </div>),
          // ];
          // subheaderStyle.borderTop = '2px solid transparent';
          subheaderClass = classes.subheader6;
        }
        lists.push(
          <ResourceList
            key={`${key}_${type}`}
            component="div"
            dense={true}
            disablePadding={true}
            subheader={
              <ResourceListSubheader
                component="div"
                disableSticky={true}
                className={subheaderClass}
                color="primary"
                disableGutters={true}
              >
                <div
                  className={classes.subheaderContainer}
                  onClick={this.handleToggleExpandItem(key)}
                >
                  {rootListItem.itemsCount > 0
                    ? (
                      <ResourceListItemExpandedIcon>
                        {rootListItem.list.length > 0
                          ? (
                            <ExpandMore fontSize="small" color="disabled"/>
                          )
                          : (
                            <ChevronRight fontSize="small" color="disabled"/>
                          )
                        }
                      </ResourceListItemExpandedIcon>
                    )
                    : (
                      <ResourceListItemExpandedIcon>
                        <span/>
                      </ResourceListItemExpandedIcon>
                    )
                  }
                  <div className={classes.subheaderText} >
                    <ResourceSubheaderBadge
                      max={10000}
                      badgeContent={rootListItem.itemsCount}
                      color={props.hasErrors ? "error" : "default"}
                    >
                      <span>{props.displayName}</span>
                    </ResourceSubheaderBadge>
                  </div>
                  <div className={classes.subheaderButtonsWrapper}>
                    {subheaderButtons}
                  </div>

                </div>
              </ResourceListSubheader>
            }
          >
            {rootListItem.list && rootListItem.list.length > 0 && (
              <div className={classes.listItemContainer}>
                <div className={classes.firstListContainer}>
                  {rootListItem.list}
                </div>
              </div>
            )}
          </ResourceList>
        );
      });
    }
    return (
      <div className={classes.root}>
        <ScrollSlider>
          <div className={classes.list}>
            {lists}
          </div>
          <div style={{ height: '7em', width: '100%' }}/>
        </ScrollSlider>
      </div>
    );
  }
}

export default withStyles(styles)(ResourcesTreeView);
