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
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import SplitPane from '../splitPane';

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
  leftPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '30px',
    bottom: 0,
    overflow: 'hidden',
  },
  centralPanel: {
    position: 'absolute',
    top: 0,
    left: '30px',
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  }
});

class ProjectLayout extends React.Component {
  static propTypes = {
    notification: PropTypes.object,
    leftPanel: PropTypes.element,
    leftMicroPanel: PropTypes.element,
    centralPanel: PropTypes.element,
    showLeftPanel: PropTypes.bool,
    onMounted: PropTypes.func,
    onUnmount: PropTypes.func,
  };

  static defaultProps = {
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
    const { notification, showLeftPanel } = this.props;
    const { showCentralPanelCover } = this.state;
    return notification !== nextProps.notification
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
    const { leftPanel, leftMicroPanel, showLeftPanel, centralPanel, classes } = this.props;
    const { showCentralPanelCover } = this.state;
    return (
      <div className={classes.root}>
        {showLeftPanel
          ? (
            <SplitPane
              split="vertical"
              minSize={100}
              defaultSize={300}
              onDragStarted={this.handleSplitterOnDragStarted}
              onDragFinished={this.handleSplitterOnDragFinished}
            >
              <div className={classes.left}>
                {leftPanel}
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

          )
          : (
            <>
              <div className={classes.leftPanel}>
                {leftMicroPanel}
              </div>
              <div className={classes.centralPanel}>
                {centralPanel}
              </div>
            </>
          )
        }
        {this.props.children}
      </div>
    );
  }
}

export default withSnackbar(withStyles(styles)(ProjectLayout));
