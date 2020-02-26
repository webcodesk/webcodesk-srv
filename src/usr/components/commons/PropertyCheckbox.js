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
import Checkbox from '@material-ui/core/Checkbox';
import CheckBox from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';

const styles = theme => ({
  root: {
    padding: 0,
  },
  icon: {
    fontSize: '18px',
    padding: '3px 3px 3px 0'
  }
});

class PropertyCheckbox extends React.Component {
  static propTypes = {
    value: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: false,
    onChange: () => {
      console.info('PropertyCheckbox.onChange is not set');
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
    this.setState({
      inputValue: e.target.checked,
    });
    this.props.onChange(e.target.checked);
  };

  render () {
    const {classes} = this.props;
    const {inputValue} = this.state;
    return (
      <Checkbox
        className={classes.root}
        checkedIcon={<CheckBox className={classes.icon} />}
        icon={<CheckBoxOutlineBlank className={classes.icon} />}
        checked={!!inputValue}
        color="default"
        onChange={this.handleOnChange}
      />
    );
  }
}

export default withStyles(styles)(PropertyCheckbox);
