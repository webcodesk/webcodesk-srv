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
});

class ProjectLayout extends React.Component {
  static propTypes = {
    notification: PropTypes.object,
    leftPanel: PropTypes.element,
    centralPanel: PropTypes.element,
    onMounted: PropTypes.func,
    onUnmount: PropTypes.func,
  };

  static defaultProps = {
    notification: null,
    leftPanel: null,
    centralPanel: null,
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
    const {notification} = this.props;
    const {showCentralPanelCover} = this.state;
    return notification !== nextProps.notification
      || showCentralPanelCover !== nextState.showCentralPanelCover;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { notification, enqueueSnackbar } = this.props;
    if (notification && notification !== prevProps.notification) {
      const {message, options} = notification;
      enqueueSnackbar(message, options || {variant: 'info'});
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
    const {leftPanel, centralPanel, classes} = this.props;
    const {showCentralPanelCover} = this.state;
    return (
      <div className={classes.root}>
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
              <div className={classes.central} style={{zIndex: 10}} />
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
