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

import isEqual from 'lodash/isEqual';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import * as constants from '../../../commons/constants';
import PropsTreeElement from './PropsTreeElement';
import { getComponentName } from '../commons/utils';
import PanelWithShortcutsHelp from '../commons/PanelWithShortcutsHelp';
import PropsTree from './PropsTree';

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
    onDuplicateComponentPropertyArrayItem: PropTypes.func,
    onDeleteComponentProperty: PropTypes.func,
    onRenameComponentInstance: PropTypes.func,
    onErrorClick: PropTypes.func,
    onOpenComponent: PropTypes.func,
    onUpdateComponentPropertyArrayOrder: PropTypes.func,
    onSelectComponent: PropTypes.func,
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
    onDuplicateComponentPropertyArrayItem: () => {
      console.info('ComponentPropsTree.onDuplicateComponentPropertyArrayItem is not set');
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
    onUpdateComponentPropertyArrayOrder: () => {
      console.info('ComponentPropsTree.onUpdateComponentPropertyArrayOrder is not set');
    },
    onSelectComponent: () => {
      console.info('ComponentPropsTree.onSelectComponent is not set');
    },
  };

  constructor (props, context) {
    super(props, context);
    this.state = {};
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { componentModel, isSampleComponent } = this.props;
    return (componentModel !== nextProps.componentModel && !isEqual(componentModel, nextProps.componentModel))
      || isSampleComponent !== nextProps.isSampleComponent;
  }

  handleUpdateComponentPropertyModel = (newComponentPropertyModel) => {
    this.props.onUpdateComponentPropertyModel(newComponentPropertyModel);
  };

  handleUpdateComponentPropertyArrayOrder = (newComponentPropertyModel) => {
    this.props.onUpdateComponentPropertyArrayOrder(newComponentPropertyModel);
  };

  handleIncreaseComponentPropertyArray = (propertyKey) => {
    this.props.onIncreaseComponentPropertyArray(propertyKey);
  };

  handleDuplicateComponentPropertyArrayItem = (propertyKey, groupPropertyKey, itemIndex) => {
    this.props.onDuplicateComponentPropertyArrayItem(propertyKey, groupPropertyKey, itemIndex);
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

  handleSelectComponent = (componentKey) => {
    this.props.onSelectComponent(componentKey);
  };

  render () {
    const { classes, componentModel, isSampleComponent } = this.props;
    if (componentModel && componentModel.props) {
      const { type, props: {componentInstance, componentName}, children } = componentModel;
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
              <PropsTreeElement
                name={getComponentName(componentName)}
                title={`Open the ${componentName} component's view`}
                type="button"
                onClick={this.handleOpenComponent}
              />
            )}
            {!isSampleComponent && (
              <PropsTreeElement
                paddingLeft="0px"
                name="Instance name"
                subname={componentName}
                value={componentInstance}
                onChange={this.handleRenameComponentInstance}
              />
            )}
          </List>
          <PropsTree
            dataId={isSampleComponent ? componentName : `${componentName}_${componentInstance}`}
            properties={children}
            onUpdateComponentPropertyModel={this.handleUpdateComponentPropertyModel}
            onIncreaseComponentPropertyArray={this.handleIncreaseComponentPropertyArray}
            onDeleteComponentProperty={this.handleDeleteComponentProperty}
            onErrorClick={this.handleErrorClick}
            onUpdateComponentPropertyArrayOrder={this.handleUpdateComponentPropertyArrayOrder}
            onDuplicateComponentPropertyArrayItem={this.handleDuplicateComponentPropertyArrayItem}
            onSelectComponent={this.handleSelectComponent}
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
