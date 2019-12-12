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
import ToolbarButton from '../commons/ToolbarButton';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #dddddd'
  },
  cell: {
    display: 'flex',
    height: '32px',
    alignItems: 'center',
    marginLeft: '-3px'
  }
});

class LeftMicroPanel extends React.Component {
  static propTypes = {
    onLivePreview: PropTypes.func,
    onShowLeftPanel: PropTypes.func,
  };

  static defaultProps = {
    onLivePreview: () => {
      console.info('LeftMicroPanel.onLivePreview is not set');
    },
    onShowLeftPanel: () => {
      console.info('LeftMicroPanel.onShowLeftPanel is not set');
    },
  };

  handleShowLeftPanel = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onShowLeftPanel(true);
  };

  handleLivePreview = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onLivePreview();
  };

  render () {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.cell}>
          <ToolbarButton
            iconType="KeyboardArrowRight"
            tooltip="Show left panel"
            onClick={this.handleShowLeftPanel}
          />
        </div>
        <div className={classes.cell}>
          <ToolbarButton
            iconType="SlowMotionVideo"
            iconColor="#2e7d32"
            tooltip="Open Live Preview of the application"
            onClick={this.handleLivePreview}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(LeftMicroPanel);
