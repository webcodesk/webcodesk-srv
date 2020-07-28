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
import startCase from 'lodash/startCase';
import Tooltip from '@material-ui/core/Tooltip';
import MarkdownView from './MarkdownView';
import Typography from '@material-ui/core/Typography';

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
    border: '1px solid #cfd8dc',
    fontSize: '12px',
    marginRight: '3px',
    marginBottom: '3px',
    cursor: 'pointer',
    '&:hover': {
      color: '#455a64',
      borderColor: '#455a64',
    },
  },
  unchecked: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3px',
    borderRadius: '4px',
    color: '#b7c0c4',
    border: '1px solid #cfd8dc',
    backgroundColor: theme.palette.background.paper,
    fontSize: '12px',
    marginRight: '3px',
    marginBottom: '3px',
    cursor: 'pointer',
    '&:hover': {
      color: '#455a64',
      borderColor: '#455a64',
    },
  },
  htmlPopper: {
    opacity: 1,
  },
  htmlTooltip: {
    backgroundColor: '#fff9c4',
    border: '1px solid #dddddd',
    maxWidth: '100%',
    width: '500px'
  },
});

class PropertyToggle extends React.Component {
  static propTypes = {
    value: PropTypes.bool,
    name: PropTypes.string,
    comment: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: false,
    name: null,
    comment: null,
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
    const {name, comment} = this.props;
    const { inputValue } = this.state;
    return inputValue !== nextProps.value
      || inputValue !== nextState.inputValue
      || name !== nextProps.name
      || comment !== nextProps.comment;
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
    const {classes, name, comment} = this.props;
    const {inputValue} = this.state;
    if (inputValue) {
      return (
        <Tooltip
          enterDelay={800}
          classes={{
            popper: classes.htmlPopper,
            tooltip: classes.htmlTooltip,
          }}
          title=
            {comment
              ? (
                <MarkdownView tiny={true} markdownContent={comment} />
              )
              : (
                <React.Fragment>
                  <Typography variant="caption">There is no comment for this property.</Typography>
                </React.Fragment>
              )
            }
        >
          <div
            onClick={this.handleOnChange}
            className={classes.checked}
          >
            <span>{startCase(name)}</span>
          </div>
        </Tooltip>
      );
    }
    return (
      <Tooltip
        enterDelay={800}
        classes={{
          popper: classes.htmlPopper,
          tooltip: classes.htmlTooltip,
        }}
        title=
          {comment
            ? (
              <MarkdownView tiny={true} markdownContent={comment} />
            )
            : (
              <React.Fragment>
                <Typography variant="caption">There is no comment for this property.</Typography>
              </React.Fragment>
            )
          }
      >
        <div
          onClick={this.handleOnChange}
          className={classes.unchecked}
        >
          <span>{startCase(name)}</span>
        </div>
      </Tooltip>
    );
  }
}

export default withStyles(styles)(PropertyToggle);
