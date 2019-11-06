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
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import ResourceIcon from '../commons/ResourceIcon';
import constants from '../../../commons/constants';
import { cutFilePath, cutText } from '../commons/utils';

const styles = theme => ({
  pathHeader: {
    fontWeight: 'bold',
  },
  fileNamePane: {
    display: 'flex',
    alignItems: 'center',
  },
  fileNameExtension: {
    marginLeft: '8px',
  },
  variantsPane: {
    marginTop: '16px',
    // height: '200px',
    overflow: 'auto',
    padding: '5px',
  },
  variantCell: {
    width: '100%',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  thumbnailImage: {
    width: '70%'
  }
});

class ComponentScaffoldDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    dirPath: PropTypes.string,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    onOpenMarket: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    dirPath: '',
    onClose: () => {
      console.info('ComponentScaffoldDialog.onClose is not set');
    },
    onSubmit: (options) => {
      console.info('ComponentScaffoldDialog.onSubmit is not set: ', options);
    },
    onOpenMarket: (options) => {
      console.info('ComponentScaffoldDialog.onOpenMarket is not set: ', options);
    },
  };

  constructor (props) {
    super(props);
    const { dirPath } = this.props;
    this.state = {
      fileExtension: constants.JS_FILE_EXTENSION,
      nameText: '',
      nameError: false,
      directoryNameText: dirPath,
      directoryNameError: false,
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { isOpen, dirPath } = this.props;
    const { nameText, nameError, directoryNameText, directoryNameError, fileExtension } = this.state;
    return isOpen !== nextProps.isOpen
      || dirPath !== nextProps.dirPath
      || nameText !== nextState.nameText
      || nameError !== nextState.nameError
      || directoryNameText !== nextState.directoryNameText
      || directoryNameError !== nextState.directoryNameError
      || fileExtension !== nextState.fileExtension;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
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

  handleSubmit = (componentScaffold) => (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { nameText, directoryNameText, fileExtension } = this.state;
    const { nameError, directoryNameError } = this.validateTexts({
      directoryNameText,
      nameText
    });
    if (!nameError && !directoryNameError) {
      const { onSubmit } = this.props;
      onSubmit({
        name: nameText,
        directoryName: directoryNameText,
        fileExtension,
        componentScaffold,
      });
    } else {
      this.setState({
        nameError,
        directoryNameError
      });
    }
  };

  handleOpenMarket = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onOpenMarket();
    this.handleClose(e);
  };

  validateTexts = ({ nameText, directoryNameText }) => {
    const nameMatches = constants.COMPONENT_NAME_VALID_REGEXP.exec(nameText);
    const directoryNameMatches = constants.FILE_PATH_VALID_REGEXP.exec(directoryNameText);
    return {
      nameError: !nameText || !nameMatches,
      directoryNameError: !!(directoryNameText && !directoryNameMatches),
    };
  };

  handleNameChange = (e) => {
    const nameText = e.target.value;
    const newState = {
      nameText,
      ...this.validateTexts({ nameText, directoryNameText: this.state.directoryNameText })
    };
    this.setState(newState);
  };

  handleDirectoryNameChange = (e) => {
    const directoryNameText = e.target.value;
    const newState = {
      directoryNameText,
      ...this.validateTexts({ nameText: this.state.nameText, directoryNameText })
    };
    this.setState(newState);
  };

  handleToggleFileExtension = (e) => {
    this.setState({
      fileExtension: this.state.fileExtension === constants.JS_FILE_EXTENSION
        ? constants.TSX_FILE_EXTENSION
        : constants.JS_FILE_EXTENSION
    });
  };

  render () {
    const { classes, isOpen } = this.props;
    if (!isOpen) {
      return null;
    }
    const { nameText, nameError, directoryNameText, directoryNameError, fileExtension } = this.state;
    return (
      <Dialog
        aria-labelledby="ComponentScaffoldDialog-dialog-title"
        onClose={this.handleClose}
        open={isOpen}
        maxWidth="sm"
        scroll="body"
        fullWidth={true}
      >
        <form onSubmit={this.handleSubmit}>
          <DialogTitle
          id="ComponentScaffoldDialog-dialog-title"
          disableTypography={true}
          >
          Component Scaffold
          </DialogTitle>
          <DialogContent>
            {nameText && nameText.length > 0
              ? (
                <pre>
                  <span className={classes.pathHeader}>Path:&nbsp;</span>
                  {directoryNameText && directoryNameText.length > 0
                    ? (
                      <span>{cutText(cutFilePath(`src/usr/${directoryNameText}/${nameText}${fileExtension}`, 50, 3), 60)}</span>
                    )
                    : (
                      <span>{cutText(`src/usr/${nameText}${fileExtension}`, 60)}</span>
                    )
                  }
                </pre>
              )
              : (
                <pre>
                  <span>File path is empty</span>
                </pre>
              )
            }
            <div className={classes.fileNamePane}>
              <TextField
                autoFocus={true}
                margin="dense"
                id="componentName"
                label="Component Name"
                type="text"
                fullWidth={true}
                required={true}
                value={nameText}
                error={nameError}
                onChange={this.handleNameChange}
                InputProps={{
                  startAdornment:
                    <InputAdornment position="start">
                      <ResourceIcon resourceType={constants.GRAPH_MODEL_COMPONENT_TYPE}/>
                    </InputAdornment>,
                }}
                helperText="Enter the name of the new component. Use alphanumeric characters."
              />
              <div className={classes.fileNameExtension}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={fileExtension === constants.TSX_FILE_EXTENSION}
                      onChange={this.handleToggleFileExtension}
                      color="default"
                    />
                  }
                  label="TypeScript"
                />
              </div>
            </div>
            <TextField
              margin="dense"
              id="directory"
              label="Directory (optional)"
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
              helperText="Enter the directory path. Use '/' as a separator of the nested directories."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" onClick={this.handleSubmit('general')} color="primary">
              Generate
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ComponentScaffoldDialog);
