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
