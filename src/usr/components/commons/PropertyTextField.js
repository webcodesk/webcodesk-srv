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

import debounce from 'lodash/debounce';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Close from '@material-ui/icons/Close';
import InputBase from '@material-ui/core/InputBase';

const PropertyTextInput = withStyles(theme => ({
  root: {
    width: '100%'
  },
  input: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    fontSize: '0.8125rem',
    borderRadius: '4px',
    padding: '3px',
  },
}))(InputBase);

const PropertyTextIconButton = withStyles(theme => ({
  root: {
    padding: '4px',
    fontWeight: 'normal',
  }
}))(IconButton);

const CloseIcon = withStyles(theme => ({
  root: {
    fontSize: '12px',
    padding: '3px'
  }
}))(Close);

const PropertyTextInputAdornment = withStyles(theme => ({
  positionStart: {
    marginRight: 0,
  },
  positionEnd: {
    marginLeft: 0,
  }
}))(InputAdornment);

const styles = theme => ({
  root: {
    width: '100%',
    fontSize: '0.8125rem',
  }
});

class PropertyTextField extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    text: '',
    onChange: () => {
      console.info('PropertyTextField.onChange is not set');
    },
    onSubmit: () => {
      console.info('PropertyTextField.onSubmit is not set');
    },
  };

  constructor (props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      inputText: this.props.text || '',
    };
  }

  componentWillUnmount () {
    this.debounceOnChange.cancel();
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { inputText } = this.state;
    return inputText !== nextProps.text || inputText !== nextState.inputText;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { text } = this.props;
    if (text !== prevProps.text) {
      this.setState({
        inputText: text,
      });
    }
  }

  debounceOnChange = debounce((newInputText) => {
    this.props.onChange(newInputText);
  }, 500);

  handleOnChange = () => {
    const inputText = this.input.current.value && this.input.current.value.length > 0
      ? this.input.current.value
      : undefined;
    this.setState({
      inputText,
    });
    this.debounceOnChange(inputText);
  };

  handleOnCancel = () => {
    this.setState({
      inputText: undefined,
    });
    this.input.current.focus();
    this.props.onChange();
  };

  handleOnSubmit = () => {
    this.props.onSubmit(this.state.inputText);
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

  render () {
    const {inputText} = this.state;
    return (
      <PropertyTextInput
        inputRef={this.input}
        type="text"
        value={inputText || ''}
        placeholder="String"
        onChange={this.handleOnChange}
        onKeyDown={this.handleOnKeyDown}
        endAdornment={inputText && inputText.length > 0 && (
          <PropertyTextInputAdornment position="end">
            <PropertyTextIconButton onClick={this.handleOnCancel}>
              <CloseIcon color="disabled"/>
            </PropertyTextIconButton>
          </PropertyTextInputAdornment>
        )}
      />
    );
  }
}

export default withStyles(styles)(PropertyTextField);
