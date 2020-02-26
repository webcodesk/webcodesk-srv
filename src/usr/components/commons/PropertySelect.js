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
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';

const PropertySelectInput = withStyles(theme => ({
  input: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    fontSize: '0.8125rem',
    borderRadius: '4px',
    padding: '3px 3px 3px 3px',
  },
}))(InputBase);

const PropertySelectElement = withStyles(theme => ({
  select: {
    height: 'auto',
    '&:focus': {
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px'
    },
  },
}))(NativeSelect);

const styles = theme => ({
  root: {
    width: '100%',
    fontSize: '0.8125rem',
  },
  optionsHeader: {
    fontSize: '1pt',
    backgroundColor: '#000000',
  }
});

class PropertySelect extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    text: '',
    onChange: () => {
      console.info('PropertySelect.onChange is not set');
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      inputValue: this.props.value,
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { values } = this.props;
    const { inputValue } = this.state;
    return inputValue !== nextState.inputValue || values !== nextProps.values;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { value } = this.props;
    if (value !== prevProps.value) {
      this.setState({
        inputValue: value,
      });
    }
  }

  handleOnChange = (e) => {
    const inputValue = e.target.value && e.target.value.length > 0 ? e.target.value : undefined;
    this.setState({
      inputValue,
    });
    this.props.onChange(inputValue);
  };

  render () {
    const {classes, values} = this.props;
    const {inputValue} = this.state;
    const optionsList = [];
    if (values && values.length > 0) {
      values.forEach((valueItem, valueIdx) => {
        if (valueItem && valueItem.length > 0) {
          optionsList.push(
            <option key={'' + valueIdx} value={valueItem}>{valueItem}</option>
          );
        } else {
          optionsList.push(
            <option key={'' + valueIdx} value="" style={{color: '#dddddd'}}>undefined</option>
          );
        }
      });
    }
    return (
      <FormControl className={classes.root}>
        <PropertySelectElement
          value={typeof inputValue === 'undefined' ? '' : inputValue}
          onChange={this.handleOnChange}
          input={<PropertySelectInput />}
        >
          {/*<option className={classes.optionsHeader} disabled={true}>*/}
          {/*  &#9472;&#9472;&#9472;*/}
          {/*</option>*/}
          {optionsList}
        </PropertySelectElement>
      </FormControl>
    );
  }
}

export default withStyles(styles)(PropertySelect);
