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
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import SplitPane from '../splitPane';
import LoadingPopover from "../commons/LoadingPopover";

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  left: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  central: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  hidden: {
    display: 'none',
  }
});

class ProjectLayout extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    notification: PropTypes.object,
    leftPanel: PropTypes.element,
    leftMicroPanel: PropTypes.element,
    centralPanel: PropTypes.element,
    showLeftPanel: PropTypes.bool,
    onMounted: PropTypes.func,
    onUnmount: PropTypes.func,
  };

  static defaultProps = {
    isLoading: false,
    notification: null,
    leftPanel: null,
    leftMicroPanel: null,
    centralPanel: null,
    showLeftPanel: true,
    onMounted: () => {
      console.info('ProjectLayout.onMounted is not set');
    },
    onUnmount: () => {
      console.info('ProjectLayout.onUnmount is not set');
    },
  };

  constructor (props) {
    super(props);
    this.state = {
      showCentralPanelCover: false,
    };
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { isLoading, notification, showLeftPanel } = this.props;
    const { showCentralPanelCover } = this.state;
    return isLoading !== nextProps.isLoading
      || notification !== nextProps.notification
      || showLeftPanel !== nextProps.showLeftPanel
      || showCentralPanelCover !== nextState.showCentralPanelCover;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { notification, enqueueSnackbar } = this.props;
    if (notification && notification !== prevProps.notification) {
      const { message, options } = notification;
      enqueueSnackbar(message, options || { variant: 'info' });
    }
  }

  componentDidMount () {
    this.props.onMounted();
  }

  componentWillUnmount () {
    this.props.onUnmount();
  }

  handleSplitterOnDragStarted = () => {
    this.setState({
      showCentralPanelCover: true,
    });
  };

  handleSplitterOnDragFinished = () => {
    this.setState({
      showCentralPanelCover: false,
    });
  };

  render () {
    const { isLoading, leftPanel, leftMicroPanel, showLeftPanel, centralPanel, classes } = this.props;
    const { showCentralPanelCover } = this.state;
    const pane1Style = showLeftPanel ? {} : {width: '30px'};
    return (
      <div className={classes.root}>
        {isLoading && <LoadingPopover />}
        <SplitPane
          split="vertical"
          minSize={showLeftPanel ? 100 : 30}
          defaultSize={showLeftPanel ? 300 : 30}
          allowResize={showLeftPanel}
          pane1Style={pane1Style}
          onDragStarted={this.handleSplitterOnDragStarted}
          onDragFinished={this.handleSplitterOnDragFinished}
        >
          <div className={classes.left}>
            <div className={showLeftPanel ? classes.hidden : ''}>
              {leftMicroPanel}
            </div>
            <div className={showLeftPanel ? '' : classes.hidden}>
              {leftPanel}
            </div>
          </div>
          <div className={classes.central}>
            {showCentralPanelCover &&
            (
              <div className={classes.central} style={{ zIndex: 10 }}/>
            )
            }
            {centralPanel}
          </div>
        </SplitPane>
        {this.props.children}
      </div>
    );
  }
}

export default withSnackbar(withStyles(styles)(ProjectLayout));
