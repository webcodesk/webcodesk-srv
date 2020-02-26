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
import CircularProgress from '@material-ui/core/CircularProgress';
import Save from '@material-ui/icons/Save';
import { CommonToolbarButton } from './Commons.parts';

const styles = theme => ({
  buttonIcon: {
    fontSize: '16px',
  },
});

class ToolbarButton extends React.Component {
  static propTypes = {
    iconType: PropTypes.string,
    title: PropTypes.string,
    switchedOn: PropTypes.bool,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    onClick: PropTypes.func,
    seconds: PropTypes.number,
    updateCounter: PropTypes.number,
    tooltip: PropTypes.string,
  };

  static defaultProps = {
    iconType: '',
    title: '',
    switchedOn: false,
    primary: false,
    secondary: false,
    seconds: 0,
    updateCounter: 0,
    tooltip: '',
    onClick: () => {
      console.info('ToolbarButton.onClick is not set');
    },
    onFireTimer: () => {
      console.info('ToolbarButton.onFireTimer is not set');
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      progress: 0,
      tickDelay: (this.props.seconds * 1000) / 100
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.updateCounter !== prevProps.updateCounter) {
      this.resetTimer(this.props.updateCounter);
    }
  }

  componentDidMount () {
    this.resetTimer(this.props.updateCounter);
  }

  componentWillUnmount () {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }

  resetTimer = (updateCounter) => {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }
    this.setState({
      progress: 0,
    });
    if (updateCounter > 0) {
      this.runTimer();
    }
  };

  runTimer = () => {
    const { tickDelay } = this.state;
    if (tickDelay > 0 && !this.timerId) {
      this.timerId = setTimeout(() => {
        this.timerId = undefined;
        this.setState((state, props) => {
          const newState = {};
          const { progress } = state;
          if (progress < 100) {
            newState.progress = progress + 1;
            this.runTimer();
          } else {
            newState.progress = 0;
            this.fireTimer();
          }
          return newState;
        });
      }, tickDelay);
    }
  };

  fireTimer = () => {
    this.props.onFireTimer();
  };

  render () {
    const { switchedOn, primary, secondary, title, classes, onClick, tooltip } = this.props;
    const { progress } = this.state;
    let variant = 'text';
    let color = 'default';
    if (switchedOn) {
      variant = 'outlined';
      color = 'primary';
    } else if (primary) {
      variant = 'contained';
      color = 'default';
    } else if (secondary) {
      variant = 'contained';
      color = 'default';
    }
    return (
      <CommonToolbarButton
        size="small"
        color={color}
        variant={variant}
        onClick={onClick}
        title={tooltip}
      >
        {progress > 0
          ? (<CircularProgress value={progress} variant="static" size={14} thickness={7}/>)
          : (<Save className={classes.buttonIcon}/>)
        }

        {title && <span style={{ marginLeft: '3px' }}>{title}</span>}
      </CommonToolbarButton>
    );
  }
}

export default withStyles(styles)(ToolbarButton);
