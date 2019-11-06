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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import JsonEditor from '../commons/JsonEditor';

const styles = theme => ({
  dialogContent: {
    position: 'relative',
    width: '100%',
    height: '300px',
    border: '1px solid #dddddd',
  },
  editorWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sampleWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  errorText: {
    color: '#D50000',
  },
});

class EditJsonDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    script: PropTypes.string,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    script: '',
    isOpen: false,
    onClose: () => {
      console.info('EditJsonDialog.onClose is not set');
    },
    onSubmit: (options) => {
      console.info('EditJsonDialog.onSubmit is not set: ', options);
    },
  };

  constructor (props) {
    super(props);
    const { script } = this.props;
    this.state = {
      scriptLocal: script,
      hasErrors: false,
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { script } = this.props;
    if (script !== prevProps.script) {
      this.setState({
        scriptLocal: script,
        hasErrors: false,
      });
    }
  }

  handleClose = () => {
    this.props.onClose(false);
  };

  handleSubmit = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { scriptLocal, hasErrors } = this.state;
    if (!hasErrors) {
      this.props.onSubmit({
        script: scriptLocal
      });
    }
  };

  handleChangeScript = ({ script, hasErrors }) => {
    const newState = { ...this.state, scriptLocal: script, hasErrors } ;
    this.setState(newState);
  };

  render () {
    const { isOpen, classes, title } = this.props;
    if (!isOpen) {
      return null;
    }
    const {
      scriptLocal,
      hasErrors,
    } = this.state;
    return (
      <Dialog
        aria-labelledby="EditJsonDialog-dialog-title"
        onClose={this.handleClose}
        open={isOpen}
        maxWidth="md"
        fullWidth={true}
        scroll="body"
      >
        <form onSubmit={this.handleSubmit}>
          <DialogTitle id="EditJsonDialog-dialog-title" disableTypography={true}>
            {title
              ? title
              : 'Edit Json'
            }
          </DialogTitle>
          <DialogContent>
            {hasErrors && (
              <Typography variant="caption" gutterBottom={true}>
                <span className={classes.errorText}>
                  JSON has errors
                </span>
              </Typography>
            )}
            <div className={classes.dialogContent}>
              <JsonEditor
                data={{script: scriptLocal}}
                isVisible={true}
                onChange={this.handleChangeScript}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" onClick={this.handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

export default withStyles(styles)(EditJsonDialog);
