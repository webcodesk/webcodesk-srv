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
    flexDirection: 'column'
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
