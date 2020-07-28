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

const styles = theme => ({
  root: {
    padding: 0,
  },
  icon: {
    fontSize: '18px',
    padding: '3px 3px 3px 0'
  },
  checked: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3px',
    borderRadius: '4px',
    color: '#fff',
    backgroundColor: '#cfd8dc',
    fontSize: '12px',
    marginRight: '3px',
    marginBottom: '3px'
  },
  unchecked: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3px',
    borderRadius: '4px',
    border: '1px solid #cfd8dc',
    backgroundColor: theme.palette.background.paper,
    fontSize: '12px',
    marginRight: '3px',
    marginBottom: '3px'
  }
});

class PropertyToggle extends React.Component {
  static propTypes = {
    value: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: false,
    name: null,
    onChange: () => {
      console.info('PropertyToggle.onChange is not set');
    },
  };

  constructor (props) {
    super(props);
    const {value} = this.props;
    this.state = {
      inputValue: typeof value === 'undefined' ? false : value,
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { inputValue } = this.state;
    return inputValue !== nextProps.value || inputValue !== nextState.inputValue;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { value } = this.props;
    if (value !== prevProps.value) {
      this.setState({
        inputValue: typeof value === 'undefined' ? false : value,
      });
    }
  }

  handleOnChange = (e) => {
    const inputValue = !this.state.inputValue;
    this.setState({
      inputValue
    });
    this.props.onChange(inputValue);
  };

  render () {
    const {classes, name} = this.props;
    const {inputValue} = this.state;
    if (inputValue) {
      return (
        <div
          onClick={this.handleOnChange}
          className={classes.checked}
        >
          <span>{name}</span>
        </div>
      );
    }
    return (
      <div
        onClick={this.handleOnChange}
        className={classes.unchecked}
      >
        <span>{name}</span>
      </div>
    );
  }
}

export default withStyles(styles)(PropertyToggle);
