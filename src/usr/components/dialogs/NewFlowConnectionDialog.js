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

class NewFlowConnectionDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    onClose: () => {
      console.info('NewFlowConnectionDialog.onClose is not set');
    },
    onSubmit: (options) => {
      console.info('NewFlowConnectionDialog.onSubmit is not set: ', options);
    },
  };

  constructor (props) {
    super(props);
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const {isOpen} = this.props;
    return isOpen !== nextProps.isOpen;
  }

  handleClose = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onClose(false);
  };

  handleSubmit = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  render () {
    const { isOpen } = this.props;
    if (!isOpen) {
      return null;
    }
    return (
      <Dialog
        aria-labelledby="NewFlowConnectionDialog-dialog-title"
        onClose={this.handleClose}
        open={isOpen}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogContent>
          <div style={{ height: '150px', width: '100%', overflow: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridGap: '1em' }}>
              <div>
                <h3>Possible connection variants</h3>
              </div>
              <div>
                <h3>Outputs in the variant</h3>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" onClick={this.handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default NewFlowConnectionDialog;
