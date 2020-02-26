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

import debounce from 'lodash/debounce';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ToolbarButton from '../commons/ToolbarButton';
import constants from '../../../commons/constants';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import HelpOutline from '@material-ui/icons/HelpOutline';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    minWidth: '250px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  biggerArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
    flexGrow: 2,
  },
  smallArea: {
    flexGrow: 0,
  }
});

class LeftTopPanel extends React.Component {
  static propTypes = {
    projectServerStatus: PropTypes.object,
    onLivePreview: PropTypes.func,
    onGetProjectServerStatus: PropTypes.func,
    onProjectServerDialog: PropTypes.func,
    onInstallPackage: PropTypes.func,
    onShowSyslog: PropTypes.func,
    onShowProjectReadme: PropTypes.func,
    onShowLeftPanel: PropTypes.func,
  };

  static defaultProps = {
    projectServerStatus: {},
    onLivePreview: () => {
      console.info('LeftTopPanel.onLivePreview is not set');
    },
    onGetProjectServerStatus: () => {
      console.info('LeftTopPanel.onGetProjectServerStatus is not set');
    },
    onProjectServerDialog: () => {
      console.info('LeftTopPanel.onProjectServerDialog is not set');
    },
    onInstallPackage: () => {
      console.info('LeftTopPanel.onInstallPackage is not set');
    },
    onShowSyslog: () => {
      console.info('LeftTopPanel.onShowSyslog is not set');
    },
    onShowProjectReadme: () => {
      console.info('LeftTopPanel.onShowProjectReadme is not set');
    },
    onShowLeftPanel: () => {
      console.info('LeftTopPanel.onShowLeftPanel is not set');
    },
  };

  // componentDidMount () {
  // this.runCheckStatus();
  // }

  componentWillUnmount () {
    this.stopCheckStatus();
  }

  runCheckStatus = () => {
    if (!this.checkStatusTimeoutId) {
      this.checkStatusTimeoutId = setTimeout(() => {
        this.props.onGetProjectServerStatus();
        this.checkStatusTimeoutId = undefined;
        this.runCheckStatus();
      }, 5000);
    }
  };

  stopCheckStatus = () => {
    if (this.checkStatusTimeoutId) {
      clearTimeout(this.checkStatusTimeoutId);
    }
    this.checkStatusTimeoutId = undefined;
  };

  handleLivePreview = () => {
    this.props.onLivePreview();
  };

  handleProjectServerDialog = () => {
    this.props.onProjectServerDialog(true);
  };

  handleInstallPackage = () => {
    this.props.onInstallPackage();
  };

  handleShowSyslog = () => {
    this.props.onShowSyslog();
  };

  handleShowProjectReadme = () => {
    this.props.onShowProjectReadme();
  };

  handleOpenIssueTracker = () => {
    window.open(constants.URL_WEBCODESK_ISSUE_TRACKER, '__blank').focus();
  };

  handleOpenUserGuide = () => {
    window.open(constants.URL_WEBCODESK_USER_GUIDE, '__blank').focus();
  };

  handleShowLeftPanel = () => {
    this.props.onShowLeftPanel(false);
  };

  render () {
    const { classes, projectServerStatus } = this.props;
    const { isWorking, isStarting } = projectServerStatus;
    return (
      <div ref={this.root} className={classes.root}>
        <div className={classes.biggerArea}>
          <ToolbarButton
            iconType="MenuIcon"
            tooltip="Click to see additional options"
            menuItems={[
              {
                iconType: 'CloudDownload',
                label: 'Install packages from the market',
                onClick: this.handleInstallPackage,
              },
              {
                label: 'divider'
              },
              {
                iconType: 'Receipt',
                label: 'Webcodesk console output',
                onClick: this.handleShowSyslog,
              },
            ]}
          />
          <ToolbarButton
            iconType="HelpOutline"
            tooltip="Click to see help options"
            menuItems={[
              {
                iconType: 'ChromeReaderMode',
                label: 'Open Project Readme',
                onClick: this.handleShowProjectReadme,
              },
              {
                label: 'divider'
              },
              {
                iconType: 'OpenInNew',
                label: 'Issue Tracker',
                onClick: this.handleOpenIssueTracker,
              },
              {
                iconType: 'OpenInNew',
                label: 'User Guide',
                onClick: this.handleOpenUserGuide,
              },
            ]}
          />
          {isStarting && (
            <ToolbarButton
              iconType="Dvr"
              iconColor="#2e7d32"
              onClick={this.handleProjectServerDialog}
              tooltip="Development server is starting..."
            />
          )
          }
          {!isStarting && (isWorking
            ? (
              <ToolbarButton
                iconType="Dvr"
                iconColor="#2e7d32"
                onClick={this.handleProjectServerDialog}
                tooltip="Show development server log"
              />
            )
            : (
              <ToolbarButton
                iconType="NotificationImportant"
                iconColor="#BF360C"
                onClick={this.handleProjectServerDialog}
                tooltip="Show development server log"
              />
            ))
          }
          <ToolbarButton
            onClick={this.handleLivePreview}
            title="Live Preview"
            iconType="SlowMotionVideo"
            iconColor="#2e7d32"
            tooltip="Open Live Preview of the application"
          />
        </div>
        <div className={classes.smallArea}>
          <ToolbarButton
            iconType="KeyboardArrowLeft"
            tooltip="Hide left panel"
            onClick={this.handleShowLeftPanel}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(LeftTopPanel);
