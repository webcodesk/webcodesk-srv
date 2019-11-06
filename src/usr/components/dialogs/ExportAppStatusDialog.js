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
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

class ExportAppStatusDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    status: PropTypes.object,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    status: {
      exportIsRunning: true,
      text: 'Starting...'
    },
    onClose: () => {
      console.info('ExportAppStatusDialog.onClose is not set');
    },
  };

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { isOpen, status } = this.props;
    return isOpen !== nextProps.isOpen
      || status !== nextProps.status;
  }

  handleClose = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onClose(false);
  };

  render () {
    const { isOpen, status } = this.props;
    if (!isOpen) {
      return null;
    }
    return (
      <Dialog
        aria-labelledby="ExportAppStatusDialog-dialog-title"
        onClose={this.handleClose}
        open={isOpen}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle
          id="ExportAppStatusDialog-dialog-title"
          disableTypography={true}
        >
          Export The Project's Source Code
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            wrap="nowrap"
            spacing={16}
          >
            <Grid item={true}>
              <CircularProgress
                size={20}
                thickness={5}
                variant={status.exportIsRunning ? 'indeterminate' : 'determinate'}
                value={status.exportIsRunning ? 0 : 100}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <Typography variant="subtitle2">{status.text}</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleClose}
            color="primary"
            disabled={status.exportIsRunning}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ExportAppStatusDialog;
