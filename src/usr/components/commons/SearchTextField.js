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
import Close from '@material-ui/icons/Close';
import Search from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

const SearchIconButton = withStyles(theme => ({
  root: {
    padding: '4px',
    fontWeight: 'normal',
  }
}))(IconButton);

const CloseIcon = withStyles(theme => ({
  root: {
    fontSize: '16px',
  }
}))(Close);

const SearchIcon = withStyles(theme => ({
  root: {
    fontSize: '16px',
  }
}))(Search);

const SearchInputAdornment = withStyles(theme => ({
  positionStart: {
    marginRight: 0,
  },
  positionEnd: {
    marginLeft: 0,
  }
}))(InputAdornment);

const styles = theme => ({
  root: {
    height: '30px',
    width: '100%',
    fontSize: '0.8125rem',
  }
});

class SearchTextField extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    text: '',
    onCancel: () => {
      console.info('SearchTextField.onCancel is not set');
    },
    onSubmit: () => {
      console.info('SearchTextField.onSubmit is not set');
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      inputText: this.props.text,
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { text } = this.props;
    if (text !== prevProps.text) {
      this.setState({
        inputText: text,
      });
    }
  }

  handleOnChange = () => {
    this.setState({
      inputText: this.input.value,
    })
  };

  handleOnCancel = () => {
    this.setState({
      inputText: '',
    });
    this.input.focus();
    this.props.onCancel();
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
    const {classes} = this.props;
    const {inputText} = this.state;
    return (
      <InputBase
        inputRef={me => this.input = me}
        className={classes.root}
        type="text"
        value={inputText}
        placeholder="Type a word & hit the enter to search"
        onChange={this.handleOnChange}
        onKeyDown={this.handleOnKeyDown}
        startAdornment={
          <SearchInputAdornment position="start">
            <SearchIconButton onClick={this.handleOnSubmit}>
              <SearchIcon color="primary" />
            </SearchIconButton>
          </SearchInputAdornment>
        }
        endAdornment={inputText && inputText.length > 0 &&
            <SearchInputAdornment position="end">
              <SearchIconButton onClick={this.handleOnCancel}>
                <CloseIcon color="disabled" />
              </SearchIconButton>
            </SearchInputAdornment>
            }
      />
    );
  }
}

export default withStyles(styles)(SearchTextField);
