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
import Tooltip from '@material-ui/core/Tooltip';
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
    cursor: 'pointer'
  },
  htmlPopper: {
    opacity: 1,
  },
  htmlTooltip: {
    backgroundColor: '#fff9c4',
    border: '1px solid #dddddd',
  },
  htmlTooltipCode: {
    backgroundColor: '#fff9c4',
    border: 0,
  },
});

class EditJsonDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    objectToEdit: PropTypes.any,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    objectToEdit: undefined,
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
    this.state = {
      hasErrors: false,
      errorText: '',
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { objectToEdit, isOpen } = this.props;
    if (objectToEdit !== prevProps.objectToEdit || (isOpen && !prevProps.isOpen)) {
      this.setState({
        hasErrors: false,
        errorText: '',
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
    const { objectToEditLocal, hasErrors } = this.state;
    if (!hasErrors) {
      this.props.onSubmit({
        objectAfterEdit: objectToEditLocal
      });
    }
  };

  handleChangeScript = ({ object, hasErrors, errorText }) => {
    const newState = { ...this.state, objectToEditLocal: object, hasErrors, errorText } ;
    this.setState(newState);
  };

  render () {
    const { isOpen, classes, title, objectToEdit } = this.props;
    if (!isOpen) {
      return null;
    }
    const {
      hasErrors,
      errorText
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
              : 'Edit JS object'
            }
          </DialogTitle>
          <DialogContent>
            {hasErrors
              ? (
              <Typography variant="caption" gutterBottom={true}>
                <span>
                  {'Use JavaScript syntax to describe object. The script text is evaluated as "const s = <script text>" and has errors:'}&nbsp;
                </span>
                <Tooltip
                  classes={{
                    popper: classes.htmlPopper,
                    tooltip: classes.htmlTooltip,
                  }}
                  title={<pre className={classes.htmlTooltipCode}><code>{errorText}</code></pre>}
                >
                  <span className={classes.errorText}>[show error text]</span>
                </Tooltip>
              </Typography>
            )
            : (
                <Typography variant="caption" gutterBottom={true}>
                <span>
                  {'Use JavaScript syntax to describe object. The script text is evaluated as "const s = <script text>"'}
                </span>
                </Typography>
              )
            }
            <div className={classes.dialogContent}>
              <JsonEditor
                data={objectToEdit}
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
