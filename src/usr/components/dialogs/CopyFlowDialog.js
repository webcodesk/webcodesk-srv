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
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import ResourceIcon from '../commons/ResourceIcon';
import constants from '../../../commons/constants';

class CopyFlowDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    dirPath: PropTypes.string,
    flowResource: PropTypes.object,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    isOpen: false,
    dirPath: '',
    flowResource: null,
    onClose: () => {
      console.info('CopyFlowDialog.onClose is not set');
    },
    onSubmit: (options) => {
      console.info('CopyFlowDialog.onSubmit is not set: ', options);
    },
  };

  constructor (props) {
    super(props);
    const {dirPath, flowResource} = this.props;
    this.state = {
      nameText: flowResource ? flowResource.displayName : dirPath,
      nameError: false,
      directoryNameText: dirPath,
      directoryNameError: false,
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const {isOpen, dirPath, flowResource} = this.props;
    const { nameText, nameError, directoryNameText, directoryNameError } = this.state;
    return isOpen !== nextProps.isOpen
      || dirPath !== nextProps.dirPath
      || flowResource !== nextProps.flowResource
      || nameText !== nextState.nameText
      || nameError !== nextState.nameError
      || directoryNameText !== nextState.directoryNameText
      || directoryNameError !== nextState.directoryNameError;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {dirPath, isOpen, flowResource} = this.props;
    if (dirPath !== prevProps.dirPath  || isOpen !== prevProps.isOpen) {
      this.setState({
        directoryNameText: dirPath,
      });
    }
    if (flowResource && flowResource !== prevProps.flowResource) {
      this.setState({
        nameText: flowResource.displayName,
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
    const { nameText, directoryNameText } = this.state;
    const { nameError, directoryNameError } = this.validateTexts({
      directoryNameText,
      nameText
    });
    if (!nameError && !directoryNameError) {
      const { onSubmit, flowResource } = this.props;
      onSubmit({
        name: nameText,
        directoryName: directoryNameText,
        resource: flowResource
      });
    } else {
      this.setState({
        nameError,
        directoryNameError
      });
    }
  };

  validateTexts = ({nameText, directoryNameText}) => {
    const nameMatches = constants.FILE_NAME_VALID_REGEXP.exec(nameText);
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
      ...this.validateTexts({nameText, directoryNameText: this.state.directoryNameText})
    };
    this.setState(newState);
  };

  handleDirectoryNameChange = (e) => {
    const directoryNameText = e.target.value;
    const newState = {
      directoryNameText,
      ...this.validateTexts({nameText: this.state.nameText, directoryNameText})
    };
    this.setState(newState);
  };

  render () {
    const { isOpen, flowResource } = this.props;
    if (!isOpen) {
      return null;
    }
    const { nameText, nameError, directoryNameText, directoryNameError } = this.state;
    return (
      <Dialog
        aria-labelledby="CopyFlowDialog-dialog-title"
        onClose={this.handleClose}
        open={isOpen}
        maxWidth="sm"
        fullWidth={true}
      >
        <form onSubmit={this.handleSubmit}>
          <DialogTitle
            id="CopyFlowDialog-dialog-title"
            disableTypography={true}
          >
            {flowResource ? `Copy "${flowResource.displayName}" Flow` : 'Copy Flow'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus={true}
              margin="dense"
              id="flowName"
              label="Flow Name"
              type="text"
              fullWidth={true}
              required={true}
              value={nameText}
              error={nameError}
              onChange={this.handleNameChange}
              InputProps={{
                startAdornment:
                  <InputAdornment position="start">
                    <ResourceIcon resourceType={constants.GRAPH_MODEL_FLOW_TYPE} />
                  </InputAdornment>,
              }}
              helperText="Enter the name of the new flow. Use alphanumeric characters and '_' character."
            />
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
            <Button type="submit" onClick={this.handleSubmit} color="primary">
              Copy
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

export default CopyFlowDialog;
