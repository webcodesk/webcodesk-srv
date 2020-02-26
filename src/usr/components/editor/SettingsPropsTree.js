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

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropsTree from './PropsTree';
import SettingsManager from '../../core/settings/SettingsManager';
import ToolbarButton from '../commons/ToolbarButton';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
  },
  fixedArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '34px',
    right: 0,
    overflow: 'hidden',
    borderBottom: '1px solid #cdcdcd'
  },
  fixedAreaContainer: {
    padding: '5px 10px 5px 4px',
  },
  scrollArea: {
    position: 'absolute',
    top: '35px',
    left: 0,
    bottom: 0,
    right: 0,
    padding: '10px',
    overflow: 'auto'
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
          <div className={classes.fixedArea}>
            <div className={classes.fixedAreaContainer}>
            <ToolbarButton
              iconType="Save"
              onClick={this.handleSaveSettingsProperties}
              iconColor="#2e7d32"
              disabled={sendUpdateCounter === 0}
              title="Save Changes"
              tooltip="Save application settings changes"
            />
            </div>
          </div>
          <div className={classes.scrollArea}>
            <PropsTree
              dataId="applicationSettings"
              properties={localSettingsModel.children}
              onUpdateComponentPropertyModel={this.handleUpdateComponentPropertyModel}
              onIncreaseComponentPropertyArray={this.handleIncreaseComponentPropertyArray}
              onDeleteComponentProperty={this.handleDeleteComponentProperty}
            />
          </div>
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
