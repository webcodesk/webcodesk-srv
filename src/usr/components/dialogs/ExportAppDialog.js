import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import { cutFilePath } from '../commons/utils';
import Folder from '@material-ui/icons/Folder';
import Warning from '@material-ui/icons/Warning';
import IconButton from '@material-ui/core/IconButton';
import { WarningText } from '../commons/Commons.parts';

class ExportAppDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    helpers: PropTypes.object,
    directoryData: PropTypes.object,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    onBrowseDirectory: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    helpers: null,
    directoryData: {
      directoryPath: null,
      error: null,
    },
    onClose: () => {
      console.info('ExportAppDialog.onClose is not set');
    },
    onSubmit: () => {
      console.info('ExportAppDialog.onSubmit is not set ');
    },
    onBrowseDirectory: () => {
      console.info('ExportAppDialog.onBrowseDirectory is not set ');
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      directoryError: false,
      publicUrl: '',
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { isOpen, directoryData } = this.props;
    const { directoryError, publicUrl } = this.state;
    return isOpen !== nextProps.isOpen
      || directoryData !== nextProps.directoryData
      || directoryError !== nextState.directoryError
      || publicUrl !== nextState.publicUrl;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { directoryData } = this.props;
    if (prevState.directoryError
      && prevProps.directoryData !== directoryData
      && directoryData
      && directoryData.directoryPath) {
      this.setState({
        directoryError: false,
      });
    }
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
    const { onSubmit, helpers, directoryData } = this.props;
    const { publicUrl } = this.state;
    if (directoryData.directoryPath) {
      onSubmit({
        directoryName: directoryData.directoryPath,
        helpers: { ...helpers, ...{ publicUrl: publicUrl ? publicUrl.trim() : '' } }
      });
    } else {
      this.setState({
        directoryError: true,
      });
    }
  };

  handleBrowseDirectory = () => {
    this.props.onBrowseDirectory();
  };

  handleChangePublicUrl = (e) => {
    const newState = {
      publicUrl: e.target.value,
    };
    this.setState(newState);
  };

  render () {
    const { isOpen, directoryData } = this.props;
    if (!isOpen) {
      return null;
    }
    const { directoryError, publicUrl } = this.state;
    return (
      <Dialog
        aria-labelledby="ExportAppDialog-dialog-title"
        onClose={this.handleClose}
        open={isOpen}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle
          id="ExportAppDialog-dialog-title"
          disableTypography={true}
        >
          Export The Project's Source Code
        </DialogTitle>
        <DialogContent>
          {directoryData.warning && (
            <WarningText variant="subtitle2" gutterBottom={true}>
              <span><Warning/></span>
              <span>&nbsp;&nbsp;</span>
              <span>{directoryData.warning}</span>
            </WarningText>
          )}
          <TextField
            margin="dense"
            id="directory"
            label={!directoryData.directoryPath ? 'Directory' : ''}
            type="text"
            fullWidth={true}
            required={true}
            value={directoryData.directoryPath ? cutFilePath(directoryData.directoryPath) : ''}
            error={directoryError}
            disabled={true}
            InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  <IconButton onClick={this.handleBrowseDirectory}>
                    <Folder fontSize="small"/>
                  </IconButton>
                </InputAdornment>,
            }}
            helperText="Choose the directory for the source code exporting"
          />
          <TextField
            margin="normal"
            id="publicUrl"
            label="Public Url"
            type="text"
            fullWidth={true}
            required={false}
            value={publicUrl}
            onChange={this.handleChangePublicUrl}
            helperText="Enter the value for PUBLIC_URL environment variable.
            Specify it only if the exported application
            will be deployed under another URL than '/' (root)"
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" onClick={this.handleSubmit} color="primary">
            Export
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ExportAppDialog;
