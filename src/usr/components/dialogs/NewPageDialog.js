import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import ResourceIcon from '../commons/ResourceIcon';
import constants from '../../../commons/constants';

class NewPageDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    dirPath: PropTypes.string,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    dirPath: '',
    onClose: () => {
      console.info('NewPageDialog.onClose is not set');
    },
    onSubmit: (options) => {
      console.info('NewPageDialog.onSubmit is not set: ', options);
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      pageNameText: '',
      pageNameError: false,
      directoryNameText: this.props.dirPath,
      directoryNameError: false,
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const {isOpen, dirPath} = this.props;
    const { pageNameText, pageNameError, directoryNameText, directoryNameError } = this.state;
    return isOpen !== nextProps.isOpen
      || dirPath !== nextProps.dirPath
      || pageNameText !== nextState.pageNameText
      || pageNameError !== nextState.pageNameError
      || directoryNameText !== nextState.directoryNameText
      || directoryNameError !== nextState.directoryNameError;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { dirPath, isOpen } = this.props;
    if (dirPath !== prevProps.dirPath || isOpen !== prevProps.isOpen) {
      this.setState({
        directoryNameText: dirPath,
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
    const { pageNameText, directoryNameText } = this.state;
    const {pageNameError, directoryNameError} = this.validateTexts({
      directoryNameText,
      pageNameText
    });
    if (!pageNameError && !directoryNameError) {
      const { onSubmit } = this.props;
      onSubmit({
        pageName: pageNameText,
        directoryName: directoryNameText,
      });
    } else {
      this.setState({
        pageNameError,
        directoryNameError
      });
    }
  };

  validateTexts = ({pageNameText, directoryNameText}) => {
    const pageNameMatches = constants.FILE_NAME_VALID_REGEXP.exec(pageNameText);
    const directoryNameMatches = constants.FILE_PATH_VALID_REGEXP.exec(directoryNameText);
    return {
      pageNameError: !pageNameText || !pageNameMatches,
      directoryNameError: !!(directoryNameText && !directoryNameMatches),
    };
  };

  handlePageNameChange = (e) => {
    const pageNameText = e.target.value;
    const newState = {
      pageNameText,
      ...this.validateTexts({pageNameText, directoryNameText: this.state.directoryNameText})
    };
    this.setState(newState);
  };

  handleDirectoryNameChange = (e) => {
    const directoryNameText = e.target.value;
    const newState = {
      directoryNameText,
      ...this.validateTexts({pageNameText: this.state.pageNameText, directoryNameText})
    };
    this.setState(newState);
  };

  render () {
    const { isOpen } = this.props;
    if (!isOpen) {
      return null;
    }
    const { pageNameText, pageNameError, directoryNameText, directoryNameError } = this.state;
    return (
      <Dialog
        aria-labelledby="NewPageDialog-dialog-title"
        onClose={this.handleClose}
        open={isOpen}
        maxWidth="sm"
        fullWidth={true}
      >
        <form onSubmit={this.handleSubmit}>
          <DialogTitle
            id="NewPageDialog-dialog-title"
            disableTypography={true}
          >
            Create New Page
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus={true}
              margin="dense"
              id="pageName"
              label="Page Name"
              type="text"
              fullWidth={true}
              required={true}
              value={pageNameText}
              error={pageNameError}
              onChange={this.handlePageNameChange}
              InputProps={{
                startAdornment:
                  <InputAdornment position="start">
                    <ResourceIcon resourceType={constants.GRAPH_MODEL_PAGE_TYPE} />
                  </InputAdornment>,
              }}
              helperText="Enter the name on the new page. Use alphanumeric characters and '_' character."
            />
            <TextField
              margin="dense"
              id="directory"
              label="Path (optional)"
              type="text"
              fullWidth={true}
              required={false}
              value={directoryNameText}
              error={directoryNameError}
              onChange={this.handleDirectoryNameChange}
              InputProps={{
                startAdornment:
                  <InputAdornment position="start">
                    <ResourceIcon resourceType={constants.GRAPH_MODEL_DIR_TYPE} isMuted={true}/>
                  </InputAdornment>,
              }}
              helperText="Enter the path. Use '/' as a separator of the nested directories."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" onClick={this.handleSubmit} color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

export default NewPageDialog;
