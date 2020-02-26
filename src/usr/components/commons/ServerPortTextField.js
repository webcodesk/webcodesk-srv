/*
 *     Webcodesk
 *     Copyright (C) 2019  Oleksandr (Alex) Pustovalov
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Save from '@material-ui/icons/Save';
import Error from '@material-ui/icons/Error';
import InputBase from '@material-ui/core/InputBase';
import constants from '../../../commons/constants';

const ServerPortIconButton = withStyles(theme => ({
  root: {
    padding: '4px',
    fontWeight: 'normal',
  }
}))(IconButton);

const SaveIcon = withStyles(theme => ({
  root: {
    fontSize: '16px',
  }
}))(Save);

const ErrorIcon = withStyles(theme => ({
  root: {
    fontSize: '16px',
  }
}))(Error);

const ServerPortInputAdornment = withStyles(theme => ({
  positionStart: {
    marginRight: 0,
  },
  positionEnd: {
    marginLeft: 0,
  }
}))(InputAdornment);

const ServerPortInputBase = withStyles(theme => ({
  root: {
    height: '30px',
    fontSize: '0.8125rem',
  },
  input: {
    backgroundColor: theme.palette.action.hover,
    paddingBottom: '5px',
    textAlign: 'center',
  }
}))(InputBase);

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '12px',
  },
  prefixTitle: {
    marginRight: '6px',
    whiteSpace: 'nowrap',
  },

});

class ServerPortTextField extends React.Component {
  static propTypes = {
    port: PropTypes.string,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    port: '3000',
    disabled: false,
    onSubmit: () => {
      console.info('ServerPortTextField.onSubmit is not set');
    },
  };

  constructor (props) {
    super(props);
    const {port} = this.props;
    this.state = {
      inputText: port,
      error: this.validateTexts(port)
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { port } = this.props;
    if (port !== prevProps.port) {
      this.setState({
        inputText: port,
        error: this.validateTexts(port)
      });
    }
  }

  handleOnChange = () => {
    this.setState({
      error: this.validateTexts(this.input.value),
      inputText: this.input.value,
    });
  };

  handleOnCancel = () => {
    this.setState({
      inputText: '',
      error: true,
    });
    this.input.focus();
  };

  handleOnSubmit = () => {
    const {inputText} = this.state;
    if (!this.validateTexts(inputText)) {
      this.props.onSubmit(inputText);
    }
  };

  handleOnKeyDown = (e) => {
    if (e) {
      if (e.which === 13) {
        // Enter
        this.handleOnSubmit();
      } else if (e.which === 27) {
        // Cancel
        this.handleOnCancel();
      }
    }
  };

  validateTexts = (portValue) => {
    const nameMatches = constants.SERVER_PORT_VALID_REGEXP.exec(portValue);
    return !nameMatches
  };

  render () {
    const { classes, disabled } = this.props;
    const { inputText, error } = this.state;
    return (
      <div className={classes.root}>
        <ServerPortInputBase
          inputRef={me => this.input = me}
          type="text"
          value={inputText}
          error={error}
          placeholder="NNNN"
          onChange={this.handleOnChange}
          onKeyDown={this.handleOnKeyDown}
          disabled={disabled}
          startAdornment={
            <ServerPortInputAdornment position="start">
              <span className={classes.prefixTitle}>Server Port:</span>
            </ServerPortInputAdornment>
          }
          endAdornment={
            <ServerPortInputAdornment position="end">
              {error
                ? (
                  <ServerPortIconButton
                    title="Port value should be only 4 digits"
                    onClick={this.handleOnCancel}
                  >
                    <ErrorIcon color="secondary" />
                  </ServerPortIconButton>
                ) : (
                  <ServerPortIconButton
                    disabled={disabled}
                    onClick={this.handleOnSubmit}
                    title="Save port value and restart the development server"
                  >
                    <SaveIcon />
                  </ServerPortIconButton>
                )
              }
            </ServerPortInputAdornment>
          }
        />
      </div>
    );
  }
}

export default withStyles(styles)(ServerPortTextField);
