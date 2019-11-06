import React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';

class DeleteFlowDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    resourceName: PropTypes.string,
    resource: PropTypes.object,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    resourceName: '',
    resource: null,
    onClose: () => {
      console.info('DeleteFlowDialog.onClose is not set');
    },
    onSubmit: () => {
      console.info('DeleteFlowDialog.onSubmit is not set');
    },
  };

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { isOpen, resource } = this.props;
    return isOpen !== nextProps.isOpen || resource !== nextProps.resource;
  }

  handleClose = () => {
    this.props.onClose(false);
  };

  handleSubmit = () => {
    const { onSubmit, resource } = this.props;
    onSubmit(resource);
  };

  render () {
    const { isOpen, resource, resourceName } = this.props;
    if (!isOpen) {
      return null;
    }
    return (
      <Dialog
        aria-labelledby="DeleteFlowDialog-dialog-title"
        onClose={this.handleClose}
        open={isOpen}
        maxWidth="xs"
        fullWidth={true}
      >
        <DialogTitle id="DeleteFlowDialog-dialog-title">Delete "{resourceName || resource.displayName}"</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The selected flow is going to be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" onClick={this.handleSubmit} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DeleteFlowDialog;
