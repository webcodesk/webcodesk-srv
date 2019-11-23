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

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import PropsTreeElement from './PropsTreeElement';
import PropsTree from './PropsTree';
import SettingsManager from '../../core/settings/SettingsManager';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: '10px'
  },
  mainDivider: {
    height: '5px'
  },
});

class SettingsPropsTree extends React.Component {
  static propTypes = {
    settingsProperties: PropTypes.array,
    onUpdateSettingsProperties: PropTypes.func,
  };

  static defaultProps = {
    settingsProperties: [],
    onUpdateSettingsProperties: () => {
      console.info('SettingsPropsTree.onUpdateSettingsProperties is not set');
    },
  };

  constructor (props, context) {
    super(props, context);
    this.settingsManager = new SettingsManager(this.props.settingsProperties);
    this.state = {
      sendUpdateCounter: 0,
      localSettingsModel: this.settingsManager.getModel(),
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { settingsProperties } = this.props;
    const { sendUpdateCounter, localSettingsModel } = this.state;
    return settingsProperties !== nextProps.settingsProperties
      || localSettingsModel !== nextState.localSettingsModel
      || sendUpdateCounter !== nextState.sendUpdateCounter;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { settingsProperties } = this.props;
    if (settingsProperties !== prevProps.settingsProperties) {
      delete this.settingsManager;
      this.settingsManager = new SettingsManager(settingsProperties);
      this.setState({
        sendUpdateCounter: 0,
        localSettingsModel: this.settingsManager.getModel(),
      });
    }
  }

  handleUpdateComponentPropertyModel = (newComponentPropertyModel) => {
    this.settingsManager.updateProperty(newComponentPropertyModel);
    this.setState({
      sendUpdateCounter: this.state.sendUpdateCounter + 1,
      localSettingsModel: this.settingsManager.getModel(),
    });
  };

  handleIncreaseComponentPropertyArray = (propertyKey) => {
    this.settingsManager.increasePropertyArray(propertyKey);
    this.setState({
      sendUpdateCounter: this.state.sendUpdateCounter + 1,
      localSettingsModel: this.settingsManager.getModel(),
    });
  };

  handleDeleteComponentProperty = (propertyKey) => {
    this.settingsManager.deleteProperty(propertyKey);
    this.setState({
      sendUpdateCounter: this.state.sendUpdateCounter + 1,
      localSettingsModel: this.settingsManager.getModel(),
    });
  };

  handleSaveSettingsProperties = () => {
    // this.setState({});
    this.props.onUpdateSettingsProperties(this.settingsManager.getSettingsProperties());
  };

  render () {
    const { classes } = this.props;
    const { localSettingsModel, sendUpdateCounter } = this.state;
    if (localSettingsModel && localSettingsModel.children) {
      return (
        <div className={classes.root}>
          <List
            key="componentPropsTree"
            dense={true}
            disablePadding={true}
          >
              <PropsTreeElement
                name="Save Changes"
                title="Save recent changes in application settings"
                type="button"
                disabled={sendUpdateCounter === 0}
                color={sendUpdateCounter === 0 ? 'default' : 'primary'}
                onClick={this.handleSaveSettingsProperties}
              />
          </List>
          <div className={classes.mainDivider} />
          <PropsTree
            dataId="applicationSettings"
            properties={localSettingsModel.children}
            onUpdateComponentPropertyModel={this.handleUpdateComponentPropertyModel}
            onIncreaseComponentPropertyArray={this.handleIncreaseComponentPropertyArray}
            onDeleteComponentProperty={this.handleDeleteComponentProperty}
          />
        </div>
      );
    }
    return (
      <div className={classes.root}>
        <Typography variant="subtitle2" gutterBottom={true}>
          Application settings was not found
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(SettingsPropsTree);
