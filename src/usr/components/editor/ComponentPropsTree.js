import isNull from 'lodash/isNull';
import isEqual from 'lodash/isEqual';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ComponentPropsTreeItem from './ComponentPropsTreeItem';
import * as constants from '../../../commons/constants';
import ComponentPropsTreeGroup from './ComponentPropsTreeGroup';
import ComponentPropsTreeElement from './ComponentPropsTreeElement';
import { getComponentName } from '../commons/utils';
import EditJsonDialog from '../dialogs/EditJsonDialog';
import PanelWithShortcutsHelp from '../commons/PanelWithShortcutsHelp';

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
  mainDivider: {
    margin: '8px 0',
  },
  footerArea: {
    height: '7em',
  }
});

class ComponentPropsTree extends React.Component {
  static propTypes = {
    componentModel: PropTypes.object,
    isSampleComponent: PropTypes.bool,
    onUpdateComponentPropertyModel: PropTypes.func,
    onIncreaseComponentPropertyArray: PropTypes.func,
    onDeleteComponentProperty: PropTypes.func,
    onRenameComponentInstance: PropTypes.func,
    onErrorClick: PropTypes.func,
    onOpenComponent: PropTypes.func,
  };

  static defaultProps = {
    componentModel: {},
    isSampleComponent: false,
    onUpdateComponentPropertyModel: () => {
      console.info('ComponentPropsTree.onUpdateComponentPropertyModel is not set');
    },
    onIncreaseComponentPropertyArray: () => {
      console.info('ComponentPropsTree.onIncreaseComponentPropertyArray is not set');
    },
    onDeleteComponentProperty: () => {
      console.info('ComponentPropsTree.onDeleteComponentProperty is not set');
    },
    onRenameComponentInstance: () => {
      console.info('ComponentPropsTree.onRenameComponentInstance is not set');
    },
    onErrorClick: () => {
      console.info('ComponentPropsTree.onErrorClick is not set');
    },
    onOpenComponent: () => {
      console.info('ComponentPropsTree.onOpenComponent is not set');
    },
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      expandedGroupKeys: {},
      showEditJsonDialog: false,
      editComponentPropertyModel: null,
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { componentModel, isSampleComponent } = this.props;
    const { expandedGroupKeys, showEditJsonDialog } = this.state;
    return (componentModel !== nextProps.componentModel && !isEqual(componentModel, nextProps.componentModel))
      || isSampleComponent !== nextProps.isSampleComponent
      || expandedGroupKeys !== nextState.expandedGroupKeys
      || showEditJsonDialog !== nextState.showEditJsonDialog;
  }

  handleUpdateComponentPropertyModel = (newComponentPropertyModel) => {
    this.props.onUpdateComponentPropertyModel(newComponentPropertyModel);
  };

  handleIncreaseComponentPropertyArray = (propertyKey) => {
    this.props.onIncreaseComponentPropertyArray(propertyKey);
    const newExpandedGroupKeys = {...this.state.expandedGroupKeys};
    newExpandedGroupKeys[propertyKey] = true;
    this.setState({
      expandedGroupKeys: newExpandedGroupKeys,
    })
  };

  handleDeleteComponentProperty = (propertyKey) => {
    this.props.onDeleteComponentProperty(propertyKey);
  };

  handleRenameComponentInstance = (componentInstance) => {
    this.props.onRenameComponentInstance(componentInstance);
  };

  handleErrorClick = (messages) => {
    this.props.onErrorClick(messages);
  };

  handleOpenComponent = () => {
    this.props.onOpenComponent();
  };

  handleToggleExpandItem = (groupKey) => {
    const newExpandedGroupKeys = {...this.state.expandedGroupKeys};
    newExpandedGroupKeys[groupKey] = !newExpandedGroupKeys[groupKey];
    this.setState({
      expandedGroupKeys: newExpandedGroupKeys,
    })
  };

  handleOpenEditJsonDialog = (editComponentPropertyModel) => {
    this.setState({
      showEditJsonDialog: true,
      editComponentPropertyModel,
    });
  };

  handleCloseEditJsonDialog = () => {
    this.setState({
      showEditJsonDialog: false,
      editComponentPropertyModel: null,
    });
  };

  handleSubmitEditJsonDialog = ({script}) => {
    const { editComponentPropertyModel } = this.state;
    editComponentPropertyModel.props = editComponentPropertyModel.props || {};
    try {
      editComponentPropertyModel.props.propertyValue = JSON.parse(script);
    } catch(e) {
      // do nothing
    }
    this.props.onUpdateComponentPropertyModel(editComponentPropertyModel);
    this.handleCloseEditJsonDialog();
  };

  createList = (node, level = 0, arrayIndex = null) => {
    let result = [];
    if (node) {
      const { key, type, props, children } = node;
      const paddingLeft = `${(level * 16)}px`;
      const { propertyName } = props;
      let listItemLabelName;
      if (!isNull(arrayIndex) && arrayIndex >= 0) {
        listItemLabelName = `${arrayIndex} item`;
      }
      if (propertyName) {
        if (listItemLabelName) {
          // listItemLabelName = `[${arrayIndex}].${propertyName}`;
          listItemLabelName = propertyName;
        } else {
          listItemLabelName = propertyName;
        }
      }
      if (type === constants.COMPONENT_PROPERTY_SHAPE_TYPE) {
        result.push(
          <ComponentPropsTreeGroup
            key={key}
            paddingLeft={paddingLeft}
            name={listItemLabelName}
            propertyModel={node}
            type={type}
            isExpanded={this.state.expandedGroupKeys[key]}
            onDeleteComponentProperty={this.handleDeleteComponentProperty}
            onErrorClick={this.handleErrorClick}
            onToggleExpandItem={this.handleToggleExpandItem}
          />
        );
        if (this.state.expandedGroupKeys[key] && children && children.length > 0) {
          result = children.reduce(
            (acc, child) => acc.concat(this.createList(child, level + 1, arrayIndex)),
            result
          );
        }
      } else if (type === constants.COMPONENT_PROPERTY_ARRAY_OF_TYPE) {
        result.push(
          <ComponentPropsTreeGroup
            key={key}
            paddingLeft={paddingLeft}
            name={listItemLabelName}
            propertyModel={node}
            type={type}
            isExpanded={this.state.expandedGroupKeys[key]}
            onIncreaseComponentPropertyArray={this.handleIncreaseComponentPropertyArray}
            onDeleteComponentProperty={this.handleDeleteComponentProperty}
            onErrorClick={this.handleErrorClick}
            onToggleExpandItem={this.handleToggleExpandItem}
          />
        );
        if (this.state.expandedGroupKeys[key] && children && children.length > 0) {
          result = children.reduce(
            (acc, child, childIdx) => acc.concat(this.createList(child, level + 1, childIdx)),
            result
          );
        }
      } else if (type === constants.COMPONENT_PROPERTY_ELEMENT_TYPE) {
          result.push(
            <ComponentPropsTreeItem
              key={key}
              paddingLeft={paddingLeft}
              name={listItemLabelName}
              propertyModel={node}
              onDeleteComponentProperty={this.handleDeleteComponentProperty}
              onErrorClick={this.handleErrorClick}
            />
          );
      } else if (type === constants.PAGE_COMPONENT_TYPE) {
          result.push(
            <ComponentPropsTreeItem
              key={key}
              paddingLeft={paddingLeft}
              name={listItemLabelName}
              propertyModel={node}
              onDeleteComponentProperty={this.handleDeleteComponentProperty}
              onErrorClick={this.handleErrorClick}
            />
          );
      } else if (type !== constants.COMPONENT_PROPERTY_FUNCTION_TYPE) {
        result.push(
          <ComponentPropsTreeItem
            key={key}
            paddingLeft={paddingLeft}
            name={listItemLabelName}
            propertyModel={node}
            onPropertyUpdate={this.handleUpdateComponentPropertyModel}
            onDeleteComponentProperty={this.handleDeleteComponentProperty}
            onErrorClick={this.handleErrorClick}
            onEditJson={this.handleOpenEditJsonDialog}
          />
        );
      }
    }
    return result;
  };

  render () {
    const { classes, componentModel, isSampleComponent } = this.props;
    if (componentModel && componentModel.props) {
      const { type, props: {componentInstance, componentName}, children } = componentModel;
      const { showEditJsonDialog, editComponentPropertyModel } = this.state;
      let editJsonScript = '';
      let editJsonDialogTitle = '';
      if (editComponentPropertyModel && editComponentPropertyModel.props) {
        editJsonScript = JSON.stringify(editComponentPropertyModel.props.propertyValue);
        editJsonDialogTitle = `Edit property: ${editComponentPropertyModel.props.propertyName}`;
      }
      if (type === constants.COMPONENT_PROPERTY_ELEMENT_TYPE) {
        return (
          <div className={classes.root}>
            <Typography variant="subtitle2" gutterBottom={true}>
              This is a placeholder for other components.
            </Typography>
            <Typography variant="subtitle2" gutterBottom={true}>
              Drag & drop components or paste items from the clipboard.
            </Typography>
            <PanelWithShortcutsHelp />
          </div>

        );
      }
      return (
        <div className={classes.root}>
          <List
            key="componentPropsTree"
            dense={true}
            disablePadding={true}
          >
            {!isSampleComponent && (
              <ComponentPropsTreeElement
                name={getComponentName(componentName)}
                title={`Open the ${componentName} component's view`}
                type="button"
                onClick={this.handleOpenComponent}
              />
            )}
            {!isSampleComponent && (
              <ComponentPropsTreeElement
                paddingLeft="0px"
                name="Instance name"
                subname={componentName}
                value={componentInstance}
                onChange={this.handleRenameComponentInstance}
              />
            )}
            {children && children.reduce(
              (acc, child) => acc.concat(this.createList(child)),
              []
            )}
          </List>
          <div className={classes.footerArea} />
          <EditJsonDialog
            title={editJsonDialogTitle}
            isOpen={showEditJsonDialog}
            script={editJsonScript}
            onClose={this.handleCloseEditJsonDialog}
            onSubmit={this.handleSubmitEditJsonDialog}
          />
        </div>
      );
    }
    return (
      <div className={classes.root}>
        <Typography variant="subtitle2" gutterBottom={true}>
          Nothing is selected. Click on any highlighted element on the page to see its properties.
        </Typography>
        <Typography variant="subtitle2" gutterBottom={true}>
          Or drag and drop a component into the placeholder
        </Typography>
        <PanelWithShortcutsHelp />
      </div>
    );
  }
}

export default withStyles(styles)(ComponentPropsTree);
