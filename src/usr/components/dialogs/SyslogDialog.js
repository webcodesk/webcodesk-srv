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
import Slide from '@material-ui/core/Slide';
import ToolbarButton from '../commons/ToolbarButton';
import { CommonToolbar, FullScreenDialog } from '../commons/Commons.parts';

function Transition (props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topPane: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '39px',
    right: 0
  },
  contentPane: {
    position: 'absolute',
    top: '39px',
    left: 0,
    bottom: 0,
    right: 0,
    padding: '1em',
    overflow: 'auto',
  },
  logPane: {
    color: '#1e1e1e',
    fontWeight: 'bold',
  },
});

class SyslogDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    sysLog: PropTypes.array,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    sysLog: [],
    onClose: () => {
      console.info('SyslogDialog.onClose is not set');
    },
  };

  handleClose = () => {
    this.props.onClose(false);
  };

  render () {
    const { classes, isOpen, sysLog } = this.props;
    return (
      <FullScreenDialog
        fullScreen={true}
        open={isOpen}
        onClose={this.handleClose}
        TransitionComponent={Transition}
      >
        <div className={classes.root}>
          <div className={classes.topPane}>
            <CommonToolbar disableGutters={true} dense="true">
              <ToolbarButton
                iconType="Close"
                onClick={this.handleClose}
                title="Close"
                tooltip="Close system log"
              />
            </CommonToolbar>
          </div>
          <div className={classes.contentPane}>
            {sysLog && sysLog.length > 0
              ? (
                <pre><code>{sysLog.join('\n\n')}</code></pre>
              )
              : (
                <pre><code>System log is empty</code></pre>
              )
            }
          </div>
        </div>
      </FullScreenDialog>
    );
  }
}

export default withStyles(styles)(SyslogDialog);
