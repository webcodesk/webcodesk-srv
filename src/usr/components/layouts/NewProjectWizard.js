import React from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CloudDownload from '@material-ui/icons/CloudDownload';
import logoImage from '../../../icons/logo_color_150x150.png';
import * as constants from '../../../commons/constants';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '4em',
    paddingBottom: '4em',
    overflow: 'auto',
  },
  logPaneContainer: {
    width: '600px',
    maxHeight: '450px',
    overflow: 'auto'
  },
  logPane: {
    color: '#1e1e1e',
    fontWeight: 'bold',
  }
});

class NewProjectWizard extends React.Component {
  static propTypes = {
    notification: PropTypes.object,
    data: PropTypes.object,
    creatingError: PropTypes.string,
    installerFeedback: PropTypes.object,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    onOpenMarket: PropTypes.func,
  };

  static defaultProps = {
    notification: null,
    data: {},
    creatingError: null,
    installerFeedback: {},
    onClose: () => {
      console.info('NewProjectWizard.onClose is not set');
    },
    onSubmit: () => {
      console.info('NewProjectWizard.onSubmit is not set');
    },
    onOpenMarket: () => {
      console.info('NewProjectWizard.onOpenMarket is not set');
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      newProjectModelError: false,
      showCreatingLog: false,
      installerFeedbackLog: [],
      errorFeedback: null,
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { data, installerFeedback, notification, enqueueSnackbar, creatingError } = this.props;
    if (notification && notification !== prevProps.notification) {
      const { message, options } = notification;
      enqueueSnackbar(message, options || { variant: 'info' });
    }
    if (installerFeedback !== prevProps.installerFeedback) {
      const installerFeedbackLog = [installerFeedback, ...this.state.installerFeedbackLog];
      this.setState({
        installerFeedbackLog
      });
    } else if (creatingError !== prevProps.creatingError) {
      this.setState({
        errorFeedback: creatingError,
      });
    } else if (data.newProjectModel !== prevProps.data.newProjectModel) {
      this.setState({
        newProjectModelError: !data.newProjectModel
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
    const { data, onSubmit } = this.props;
    const newProjectModelError = !data.newProjectModel;
    if (!newProjectModelError) {
      this.setState({
        showCreatingLog: true,
      });
      onSubmit({
        newProjectModel: data.newProjectModel,
      });
    } else {
      this.setState({
        newProjectModelError,
      });
    }
  };

  handleOpenMarket = () => {
    this.props.onOpenMarket();
  };

  render () {
    const {classes, data} = this.props;
    const {
      newProjectModelError,
      showCreatingLog,
      installerFeedbackLog,
      errorFeedback
    } = this.state;
    const projectModel = data && data.newProjectModel;
    if (showCreatingLog && projectModel) {
      return (
        <div className={classes.root}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{marginBottom: '2em', display: 'flex', alignItems: 'flex-start'}}>
              <div style={{flexGrow: 1, marginRight: '1em'}}>
                <img style={{width: '95px', height: '95px'}} src={logoImage} alt="logo"/>
              </div>
              <div style={{flexGrow: 2, display: 'flex', flexDirection: 'column'}}>
                <div>
                  <Typography variant="h2">
                    WEBCODESK
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" align="right">
                    Copyright&nbsp;&copy;&nbsp;{constants.DATE_COPYRIGHT},&nbsp;{constants.AUTHOR_COPYRIGHT}
                  </Typography>
                  <Typography variant="caption" align="right">
                    Version:&nbsp;{constants.CURRENT_APPLICATION_VERSION}
                  </Typography>
                </div>
              </div>
            </div>
            <div style={{marginBottom: '2em'}}>
              <Typography align="center" variant="body1" gutterBottom={true}>
                Cloning "{projectModel.projectName}" Project
              </Typography>
              {errorFeedback
                ? (
                  <Typography color="error" align="center" variant="body2" gutterBottom={true}>
                    {errorFeedback}
                  </Typography>
                )
                : (
                  <Typography align="center" variant="body2" gutterBottom={true}>
                    Please wait...
                  </Typography>
                )
              }
            </div>
            <div>
              <div className={classes.logPaneContainer}>
                  <pre><code className={classes.logPane}>
                    {installerFeedbackLog.map(feedbackItem => {
                      return `${feedbackItem.message}\n\n`;
                    })}
                  </code></pre>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={classes.root}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{marginBottom: '2em', display: 'flex', alignItems: 'flex-start'}}>
            <div style={{flexGrow: 1, marginRight: '1em'}}>
              <img style={{width: '95px', height: '95px'}} src={logoImage} alt="logo"/>
            </div>
            <div style={{flexGrow: 2, display: 'flex', flexDirection: 'column'}}>
              <div>
                <Typography variant="h2">
                  WEBCODESK
                </Typography>
              </div>
              <div>
                <Typography variant="caption" align="right">
                  Copyright&nbsp;&copy;&nbsp;{constants.DATE_COPYRIGHT},&nbsp;{constants.AUTHOR_COPYRIGHT}
                </Typography>
                <Typography variant="caption" align="right">
                  Version:&nbsp;{constants.CURRENT_APPLICATION_VERSION}
                </Typography>
              </div>
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
            <div style={{marginBottom: '2em', width: '100%'}}>
              <Typography align="center" variant="body1">
                New Project
              </Typography>
            </div>
            <div style={{marginBottom: '3em', width: '100%'}}>
              <TextField
                margin="dense"
                id="seedProject"
                // label="Seed Project Name"
                placeholder="Click to select a seed project"
                type="text"
                fullWidth={true}
                required={true}
                value={projectModel ? projectModel.projectName : ''}
                error={newProjectModelError}
                onClick={this.handleOpenMarket}
                inputProps={{
                  disabled: true,
                  style: {
                    cursor: 'pointer'
                  }
                }}
                InputProps={{
                  endAdornment:
                    <InputAdornment position="end">
                      <IconButton onClick={this.handleOpenMarket}>
                        <CloudDownload fontSize="small" />
                      </IconButton>
                    </InputAdornment>,
                }}
                helperText="The source code of the seed project will be cloned into the current directory."
              />
            </div>
            <div>
              <Button
                type="submit"
                variant="contained"
                onClick={this.handleSubmit}
                color="primary"
              >
                Create Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default  withSnackbar(withStyles(styles)(NewProjectWizard));
