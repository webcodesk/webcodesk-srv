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

  componentDidMount () {
    this.debounceOnChange = debounce((newInputText) => {
      this.props.onChange(newInputText);
    }, 500);
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
        inputText: text || '',
      });
    }
  }

  handleOnChange = () => {
    this.setState({
      inputText: this.input.current.value,
    });
    this.debounceOnChange(this.input.current.value);
  };

  handleOnCancel = () => {
    this.setState({
      inputText: '',
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
        value={inputText}
        placeholder="Enter string"
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
