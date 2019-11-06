import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardGiftcard from '@material-ui/icons/CardGiftcard';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import ResourceIcon from '../commons/ResourceIcon';
import constants from '../../../commons/constants';

const styles = theme => ({
  codeText: {
    color: '#1e1e1e',
    fontWeight: 'normal',
    padding: '5px',
    backgroundColor: '#f5f5f5'
  },
  errorText: {
    color: '#D50000'
  },
});

class InstallPackageDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    data: PropTypes.object,
    onOpenMarket: PropTypes.func,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    isLoading: false,
    error: '',
    data: {},
    onOpenMarket: () => {
      console.info('InstallPackageDialog.onOpenMarket is not set');
    },
    onClose: () => {
      console.info('InstallPackageDialog.onClose is not set');
    },
    onSubmit: (options) => {
      console.info('InstallPackageDialog.onSubmit is not set: ', options);
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      directoryNameText: '',
      directoryNameError: false,
      projectModelError: false,
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const {isOpen, data, isLoading, error} = this.props;
    const { directoryNameText, directoryNameError, projectModelError  } = this.state;
    return isOpen !== nextProps.isOpen
      || data !== nextProps.data
      || isLoading !== nextProps.isLoading
      || error !== nextProps.error
      || projectModelError !== nextState.projectModelError
      || directoryNameText !== nextState.directoryNameText
      || directoryNameError !== nextState.directoryNameError;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { isOpen } = this.props;
    if (!prevProps.isOpen && isOpen) {
      this.setState({
        projectModelError: false,
        directoryNameText: '',
        directoryNameError: false
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
    const { onSubmit, data } = this.props;
    const { directoryNameText } = this.state;
    const { directoryNameError } = this.validateTexts({
      directoryNameText,
    });
    const projectModelError = !data.projectModel;
    if (!directoryNameError && !projectModelError) {
      onSubmit({
        directoryName: directoryNameText,
        projectModel: data.projectModel,
      });
    } else {
      this.setState({
        directoryNameError,
        projectModelError,
      });
    }
  };

  validateTexts = ({directoryNameText}) => {
    const directoryNameMatches = constants.FILE_PATH_VALID_REGEXP.exec(directoryNameText);
    return {
      directoryNameError: !directoryNameText || !directoryNameMatches,
    };
  };

  handleDirectoryNameChange = (e) => {
    const directoryNameText = e.target.value;
    const newState = {
      directoryNameText,
      ...this.validateTexts({directoryNameText})
    };
    this.setState(newState);
  };

  handleOpenMarket = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onOpenMarket();
  };

  render () {
    const { classes, isOpen, data, isLoading, error } = this.props;
    if (!isOpen) {
      return null;
    }
    const { directoryNameText, directoryNameError, projectModelError } = this.state;
    return (
      <Dialog
        aria-labelledby="InstallPackageDialog-dialog-title"
        onClose={this.handleClose}
        open={isOpen}
        maxWidth="sm"
        fullWidth={true}
      >
        <form onSubmit={this.handleSubmit}>
          <DialogTitle
            id="InstallPackageDialog-dialog-title"
            disableTypography={true}
          >
            Install New Package
          </DialogTitle>
          <DialogContent>
            <div>
              {error && !isLoading && error && (
                <Typography
                  variant="subtitle2"
                  gutterBottom={true}
                  className={classes.errorText}
                >
                  {error}
                </Typography>
              )}
              {isLoading && (
                <LinearProgress/>
              )}
            </div>
            <TextField
              margin="normal"
              id="packageModelName"
              label="Package name"
              type="text"
              fullWidth={true}
              required={true}
              value={data && data.projectModel ? data.projectModel.projectName : ''}
              error={projectModelError}
              disabled={isLoading}
              onClick={this.handleOpenMarket}
              inputProps={{
                disabled: true,
                style: {
                  cursor: 'pointer'
                }
              }}
              InputProps={{
                startAdornment:
                  <InputAdornment position="start">
                    <CardGiftcard fontSize="small" />
                  </InputAdornment>,
              }}
              helperText="Click to look for the package on the market."
            />
            <TextField
              margin="normal"
              id="packageDestinationDirectory"
              label="Destination Directory"
              type="text"
              fullWidth={true}
              required={true}
              value={directoryNameText}
              error={directoryNameError}
              disabled={isLoading}
              onChange={this.handleDirectoryNameChange}
              InputProps={{
                startAdornment:
                  <InputAdornment position="start">
                    <ResourceIcon resourceType={constants.GRAPH_MODEL_DIR_TYPE} isMuted={true}/>
                  </InputAdornment>,
              }}
              helperText="Enter the directory path inside the 'src/usr' directory. Use '/' as a separator of the nested directories."
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              color="secondary"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={this.handleSubmit}
              color="primary"
              disabled={isLoading}
            >
              Install
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

export default withStyles(styles)(InstallPackageDialog);
