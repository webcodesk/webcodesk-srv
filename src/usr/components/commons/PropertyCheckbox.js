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
